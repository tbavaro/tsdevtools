import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as process from "process";
import * as rimraf from "rimraf";

import { AppError } from "./AppError";
import * as git from "./git";
import * as npm from "./npm";

const EXPECTED_CURRENT_BRANCH = "master";

export enum VersionBumpOptions {
  none,
  patch,
  minor,
  major
}

export type DeployCommandAttrs = {
  allowUnclean: boolean;
  branch: string;
  dryRun: boolean;
  freshInstall: boolean;
  repo: string;
  versionBump: VersionBumpOptions;
};

const tempDirs: string[] = [];

function createTempDir(baseName: string, useSystemTempDir?: boolean): string {
  const parentDir = useSystemTempDir ? os.tmpdir() : "/tmp";
  const basePath = `${parentDir}${path.sep}${baseName}.`;
  const fullPath = fs.mkdtempSync(basePath);
  tempDirs.push(fullPath);
  return fullPath;
}

function cleanUpTempDirs() {
  tempDirs.forEach(dir => rimraf.sync(dir));
  tempDirs.splice(0, tempDirs.length);
}

function inferRepoName(): string {
  const pathParts = process.cwd().split(path.sep);
  return pathParts[pathParts.length - 1];
}

function runInDir<T>(dir: string, func: () => T): T {
  const originalDir = process.cwd();
  process.chdir(dir);
  try {
    return func();
  } finally {
    process.chdir(originalDir);
  }
}

export function run(attrs: DeployCommandAttrs) {
  // console.log("running deploy with attrs", JSON.stringify(attrs, null, 2));
  // throw new Error("xcxc");
  // // console.log("diff", JSON.stringify(git.diff()));

  console.log("Verifying branch readiness...");

  if (!git.isCwdAGitRepo()) {
    throw new AppError("this is not a git repo");
  }

  if (git.currentBranchName() !== EXPECTED_CURRENT_BRANCH) {
    throw new AppError(`not on expected branch (${EXPECTED_CURRENT_BRANCH})`);
  }

  if (!attrs.allowUnclean) {
    if (git.thereAreUncommittedChanges()) {
      throw new AppError("there are uncommitted changes");
    }

    if (git.thereAreUntrackedFiles()) {
      throw new AppError("there are untracked files");
    }
  }

  const repoName = inferRepoName();

  const originalRepoDir = process.cwd();

  const buildDir = createTempDir(`${repoName}.build`);
  runInDir(buildDir, () => {
    console.log(`Cloning into temp build dir (${buildDir})...`);
    git.cloneLocalRepo({
      localRepoPath: originalRepoDir,
      branch: EXPECTED_CURRENT_BRANCH,
      depth: 1,
      targetPath: "."
    });

    if (attrs.freshInstall) {
      console.log("Installing dependencies...");
      npm.install();
    } else {
      console.log("Symlinking dependencies...");
      fs.symlinkSync(path.resolve(originalRepoDir, "node_modules"), "node_modules");
    }

    console.log("Building...");
    npm.runBuild();

    throw new Error("x");
  });


  // console.log("running...", repoName, buildDir);

  console.log("Cleaning up...");
  cleanUpTempDirs();
}
