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
  .strict()
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
        default: DeployCommand.VersionBumpOptions.minor,
        description: "Version bump type"
      }))
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
        branch: argv.branch,
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
