#!/usr/bin/env node

import * as yargs from "yargs";
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
      .option("dry-run", {
        boolean: true,
        description: "Don't actually push anything"
      })
    );
  })
).argv;
/* tslint:enable */

const command = argv._[0];
switch(command) {
  case "deploy": {
    DeployCommand.run({
      branch: argv.branch,
      dryRun: argv.dryRun,
      repo: argv.repo,
      versionBump: versionBumpOptionsEnumHelper.stringToEnumValue(argv.versionBump)
    });
    break;
  }

  default:
    throw new Error("unrecognized command: " + command);
}
