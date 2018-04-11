import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as process from "process";
import * as rimraf from "rimraf";
import { SemVer } from "semver";

import { AppError } from "./AppError";
import * as git from "./git";
import * as npm from "./npm";
import * as packagejson from "./packagejson";

// TODO add versioning stuff

const EXPECTED_CURRENT_BRANCH = "master";
const REMOTE_NAME = "origin";

// TODO replace this with a set of "unignore" items instead?
const GIT_IGNORE_DIST_FILENAME = ".gitignore-dist";

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

function bumpVersion(ver: SemVer, mode: VersionBumpOptions) {
  switch (mode) {
    case VersionBumpOptions.none:
      return ver;

    case VersionBumpOptions.patch:
      return ver.inc("patch");

    case VersionBumpOptions.minor:
      return ver.inc("minor");

    case VersionBumpOptions.major:
      return ver.inc("major");

    default:
      throw new Error(`unsupported mode: ${mode}`);
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

  if (!fs.existsSync(GIT_IGNORE_DIST_FILENAME)) {
    throw new AppError(`no ${GIT_IGNORE_DIST_FILENAME} file`);
  }

  if (!packagejson.exists()) {
    throw new AppError("no package.json");
  }

  const newVersion = bumpVersion(packagejson.getVersion(), attrs.versionBump);

  packagejson.setVersion(newVersion);
  throw new Error(`xcxc: [${newVersion}]`);

  const repoName = inferRepoName();

  const originalRepoDir = process.cwd();
  const originalRemoteURL = git.remote.getURL(REMOTE_NAME);

  const buildDir = createTempDir(`${repoName}.build`);
  runInDir(buildDir, () => {
    console.log(`Cloning into temp build dir (${buildDir})...`);
    git.cloneLocalRepo({
      localRepoPath: originalRepoDir,
      branch: EXPECTED_CURRENT_BRANCH,
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

    console.log(`Pushing to ${REMOTE_NAME}/${attrs.branch}...`);
    fs.copyFileSync(GIT_IGNORE_DIST_FILENAME, ".gitignore");
    git.remote.setURL(REMOTE_NAME, originalRemoteURL);
    git.fetch({
      unshallow: true,
      branch: attrs.branch,
      repo: REMOTE_NAME,
      allowUnknownBranch: true
    });
    git.addAll();
    git.commit({ message: "push" });
    git.push({
      force: true,
      repo: REMOTE_NAME,
      fromBranch: "HEAD",
      toBranch: attrs.branch
    });

    throw new Error("quitting early");
  });


  // console.log("running...", repoName, buildDir);

  console.log("Cleaning up...");
  cleanUpTempDirs();
}
