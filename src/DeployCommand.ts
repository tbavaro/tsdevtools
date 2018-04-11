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

const EXPECTED_CURRENT_BRANCH = "master";
const REMOTE_NAME = "origin";
const GIT_IGNORE_FILENAME = ".gitignore";
const GIT_IGNORE_DEPLOY_EXTRAS_FILENAME = ".gitignore-deploy-extras";
const ENCODING = "utf8";

export enum VersionBumpOptions {
  none,
  patch,
  minor,
  major
}

export type DeployCommandAttrs = {
  branch: string;
  dryRun: boolean;
  freshInstall: boolean;
  repo: string;
  versionBump: VersionBumpOptions;
};

const tempDirs: string[] = [];

function createTempDir(baseName: string, useSystemTempDir?: boolean): string {
  const parentDir = useSystemTempDir ? os.tmpdir() : "/tmp";
  const basePath = `${parentDir}${path.sep}${baseName}`;
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

function applyGitIgnoreDeployExtras() {
  const extrasData = [
    "",
    "",
    "# deploy only:",
    fs.readFileSync(
      GIT_IGNORE_DEPLOY_EXTRAS_FILENAME,
      { encoding: ENCODING }
    )
  ].join("\n");
  fs.appendFileSync(GIT_IGNORE_FILENAME, extrasData, { encoding: ENCODING });
}

function appAssert(condition: boolean, message: string): condition is true {
  if (!condition) {
    throw new AppError(message);
  }
  return true;
}

export function run(attrs: DeployCommandAttrs) {
  console.log("Verifying branch readiness...");

  appAssert(git.isCwdAGitRepo(), "this is not a git repo");
  appAssert(
    git.currentBranchName() === EXPECTED_CURRENT_BRANCH,
    `not on expected branch (${EXPECTED_CURRENT_BRANCH})`
  );
  appAssert(!git.thereAreUncommittedChanges(), "there are uncommitted changes");
  appAssert(!git.thereAreUntrackedFiles(), "there are untracked files");
  appAssert(
    fs.existsSync(GIT_IGNORE_DEPLOY_EXTRAS_FILENAME),
    `no ${GIT_IGNORE_DEPLOY_EXTRAS_FILENAME} file`
  );
  appAssert(packagejson.exists(), "no package.json");

  // gather data
  const newVersion = bumpVersion(packagejson.getVersion(), attrs.versionBump).toString();
  const repoName = inferRepoName();
  const originalRepoDir = process.cwd();
  const originalRemoteURL = git.remote.getURL(REMOTE_NAME);

  // build
  const buildDir = createTempDir(`build-${repoName}-${newVersion}-`);
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
    applyGitIgnoreDeployExtras();
    git.remote.setURL(REMOTE_NAME, originalRemoteURL);
    git.fetch({
      unshallow: true,
      branch: attrs.branch,
      repo: REMOTE_NAME,
      allowUnknownBranch: true
    });
    packagejson.setVersion(newVersion);
    git.add.all();
    git.commit({ message: `deploy v${newVersion}` });
    git.push({
      force: true,
      repo: REMOTE_NAME,
      fromBranch: "HEAD",
      toBranch: attrs.branch
    });
  });

  console.log("Tagging successful build...");
  if (attrs.versionBump !== VersionBumpOptions.none) {
    packagejson.setVersion(newVersion);
    git.add(["package.json"]);
    git.commit({ message: `v${newVersion}` });
  }
  git.tag(`v${newVersion}`, { force: true });

  console.log("Cleaning up...");
  cleanUpTempDirs();

  console.log(`Successfully pushed ${newVersion}!`);
}
