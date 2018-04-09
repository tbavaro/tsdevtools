#!/usr/bin/env node

import * as yargs from "yargs";

import { AppError } from "./AppError";
import * as DeployCommand from "./DeployCommand";
import EnumOptionHelper from "./EnumOptionHelper";

const versionBumpOptionsEnumHelper = new EnumOptionHelper(DeployCommand.VersionBumpOptions);

/* tslint:disable:no-shadowed-variable */
const argv = (yargs
  .version(false)
  .demandCommand()
  .command("deploy", "Deploy built artifacts to remote repo", (yargs) => {
    return (yargs
      .option("branch", {
        default: "dist",
        description: "Branch to push to",
        string: true
      })
      .option("repo", {
        default: "origin",
        description: "Repo to push to",
        string: true
      })
      .option("version-bump", versionBumpOptionsEnumHelper.wrapOptions({
        default: DeployCommand.VersionBumpOptions.patch,
        description: "Version bump type"
      }))
      .option("allow-unclean", {
        boolean: true,
        default: false,
        description: "Allow pushes from unclean git branches"
      })
      .option("dry-run", {
        boolean: true,
        description: "Don't actually push anything"
      })
      .option("[no-]fresh-install", {
        boolean: true,
        default: false,
        description: "Run `npm install` from scratch to get dependencies"
      })
    );
  })
).argv;
/* tslint:enable */

const command = argv._[0];

try {
  switch(command) {
    case "deploy": {
      DeployCommand.run({
        allowUnclean: argv.allowUnclean === true,
        branch: argv.branch,
        dryRun: argv.dryRun,
        freshInstall: argv.freshInstall === true,
        repo: argv.repo,
        versionBump: versionBumpOptionsEnumHelper.stringToEnumValue(argv.versionBump)
      });
      break;
    }

    default:
      throw new AppError("unrecognized command: " + command);
  }
} catch (e) {
  if (e instanceof AppError) {
    process.stderr.write(`ERROR: ${e.message}\n`);
    process.exit(1);
  } else {
    throw e;
  }
}
