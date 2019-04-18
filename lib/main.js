#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const AppError_1 = require("./AppError");
const DeployCommand = require("./DeployCommand");
const EnumOptionHelper_1 = require("./EnumOptionHelper");
const versionBumpOptionsEnumHelper = new EnumOptionHelper_1.default(DeployCommand.VersionBumpOptions);
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
    })));
})).argv;
const command = argv._[0];
try {
    switch (command) {
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
            throw new AppError_1.AppError("unrecognized command: " + command);
    }
}
catch (e) {
    if (e instanceof AppError_1.AppError) {
        process.stderr.write(`ERROR: ${e.message}\n`);
        process.exit(1);
    }
    else {
        throw e;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtCQUErQjtBQUUvQix5Q0FBc0M7QUFDdEMsaURBQWlEO0FBQ2pELHlEQUFrRDtBQUVsRCxNQUFNLDRCQUE0QixHQUFHLElBQUksMEJBQWdCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFHNUYsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLO0tBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDZCxhQUFhLEVBQUU7S0FDZixNQUFNLEVBQUU7S0FDUixPQUFPLENBQUMsUUFBUSxFQUFFLHVDQUF1QyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDcEUsT0FBTyxDQUFDLEtBQUs7U0FDVixNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsV0FBVyxFQUFFLG1CQUFtQjtRQUNoQyxNQUFNLEVBQUUsSUFBSTtLQUNiLENBQUM7U0FDRCxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2QsT0FBTyxFQUFFLFFBQVE7UUFDakIsV0FBVyxFQUFFLGlCQUFpQjtRQUM5QixNQUFNLEVBQUUsSUFBSTtLQUNiLENBQUM7U0FDRCxNQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BCLFdBQVcsRUFBRSwyREFBMkQ7UUFDeEUsTUFBTSxFQUFFLElBQUk7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLGNBQWMsRUFBRSw0QkFBNEIsQ0FBQyxXQUFXLENBQUM7UUFDL0QsT0FBTyxFQUFFLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO1FBQy9DLFdBQVcsRUFBRSxtQkFBbUI7S0FDakMsQ0FBQyxDQUFDLENBQ0osQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUNILENBQUMsSUFBSSxDQUFDO0FBR1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUxQixJQUFJO0lBQ0YsUUFBTyxPQUFPLEVBQUU7UUFDZCxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQ2IsYUFBYSxDQUFDLEdBQUcsQ0FBQztnQkFDaEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUMzQixXQUFXLEVBQUUsNEJBQTRCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUM5RSxDQUFDLENBQUM7WUFDSCxNQUFNO1NBQ1A7UUFFRDtZQUNFLE1BQU0sSUFBSSxtQkFBUSxDQUFDLHdCQUF3QixHQUFHLE9BQU8sQ0FBQyxDQUFDO0tBQzFEO0NBQ0Y7QUFBQyxPQUFPLENBQUMsRUFBRTtJQUNWLElBQUksQ0FBQyxZQUFZLG1CQUFRLEVBQUU7UUFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztRQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO1NBQU07UUFDTCxNQUFNLENBQUMsQ0FBQztLQUNUO0NBQ0YifQ==