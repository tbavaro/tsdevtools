import * as fs from "fs";

import { AppError } from "./AppError";
import * as git from "./git";
import * as npm from "./npm";
import * as packagejson from "./packagejson";
import * as VersionUtils from "./VersionUtils";

const EXPECTED_CURRENT_BRANCH = "master";
const REMOTE_NAME = "origin";
const GIT_IGNORE_FILENAME = ".gitignore";
const GIT_IGNORE_DEPLOY_EXTRAS_FILENAME = ".gitignore-deploy-extras";
const ENCODING = "utf8";

export const VersionBumpOptions = VersionUtils.VersionBumpOptions;

export type DeployCommandAttrs = {
  branch: string;
  repo: string;
  subtreeDir?: string;
  versionBump: VersionUtils.VersionBumpOptions;
};

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
  appAssert(!git.localBranchExists(attrs.branch), `local branch ${attrs.branch} already exists`);

  // gather data
  const newVersion = VersionUtils.bumpVersion(packagejson.getVersion(), attrs.versionBump);
  const originalRemoteURL = git.remote.getURL(REMOTE_NAME);

  // switch to build branch
  console.log(`Switching to build branch (${attrs.branch})...`);
  git.checkout(["-b", attrs.branch]);

  console.log(`Building ${newVersion}...`);
  packagejson.setVersion(newVersion);
  npm.runBuild();

  console.log(`Pushing to ${REMOTE_NAME}/${attrs.branch}...`);
  applyGitIgnoreDeployExtras();
  git.remote.setURL(REMOTE_NAME, originalRemoteURL);
  git.fetch({
    depth: 100000, // unshallow: true, <-- doesn't work if depth is actually just 1
    branch: attrs.branch,
    repo: REMOTE_NAME,
    allowUnknownBranch: true
  });
  git.add.all();
  git.commit({ message: `deploy v${newVersion}` });

  if (attrs.subtreeDir) {
    // delete the branch first since we can't --force it
    try {
      git.push({
        repo: REMOTE_NAME,
        fromBranch: "",
        toBranch: attrs.branch
      });
    } catch (e) {
      // ok
    }
    git.subtree.push({
      prefix: attrs.subtreeDir,
      repository: REMOTE_NAME,
      ref: attrs.branch
    });
  } else {
    git.push({
      force: true,
      repo: REMOTE_NAME,
      fromBranch: "HEAD",
      toBranch: attrs.branch
    });
  }

  console.log(`Switching back to original branch (${EXPECTED_CURRENT_BRANCH})...`);
  git.checkout([EXPECTED_CURRENT_BRANCH]);

  console.log("Tagging successful build...");
  if (attrs.versionBump !== VersionUtils.VersionBumpOptions.none) {
    packagejson.setVersion(newVersion);
    git.add(["package.json"]);
    git.commit({ message: `v${newVersion}` });
  }
  git.tag(`v${newVersion}`, { force: true });

  console.log("Cleaning up...");
  git.branch.forceDelete(attrs.branch);

  console.log(`Successfully pushed ${newVersion}!`);
}
