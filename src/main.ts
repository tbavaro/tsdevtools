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
      .option("subtreeDir", {
        description: "If specified, will use git-subtree instead of normal push",
        string: true
      })
      .option("version-bump", versionBumpOptionsEnumHelper.wrapOptions({
        default: DeployCommand.VersionBumpOptions.minor,
        description: "Version bump type"
      }))
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
        repo: argv.repo,
        subtreeDir: argv.subtreeDir,
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
