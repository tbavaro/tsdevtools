import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

function makeFancyFunction<
  FUNC extends (...args: any[]) => any,
  OTHERS
>(func: FUNC, others: OTHERS): FUNC & Readonly<OTHERS> {
  Object.assign(func, others);
  return func as any;
}

function git(command: string, args?: string[]): string {
  args = args || [];
  return childProcess.execFileSync(
    "git",
    [command, ...args],
    {
      encoding: "utf8"
    }
  ).trimRight();
}

/**
 * Direct git functions
 */

export function addAll() {
  return git("add", ["--all"]);
}

export function commit(attrs: {
  amend?: boolean,
  dateNow?: boolean,
  message: string
}) {
  const args: string[] = [];

  if (attrs.amend) {
    args.push("--amend");
  }

  if (attrs.dateNow) {
    args.push("--date=now");
  }

  args.push("-m");
  args.push(attrs.message);

  return git("commit", args);
}

export function diff(): string {
  return git("diff");
}

export function fetch(attrs?: {
  branch?: string,
  depth?: number,
  repo?: string,
  allowUnknownBranch?: boolean
}) {
  attrs = attrs || {};
  const args: string[] = [];
  if (attrs.depth !== undefined) {
    args.push(`--depth=${attrs.depth}`);
  }
  if (attrs.repo !== undefined) {
    args.push(attrs.repo);
  }
  if (attrs.branch !== undefined) {
    if (attrs.repo === undefined) {
      throw new Error("can't specify branch without repo");
    }
    args.push(attrs.branch);
  }

  try {
    return git("fetch", args);
  } catch (e) {
    if (attrs.allowUnknownBranch &&
      e instanceof Error &&
      e.message.match(/Couldn.t find remote ref/)) {
      return "";
    }
    throw e;
  }
}

export function push(attrs?: {
  force?: boolean,
  repo?: string,
  fromBranch?: string,
  toBranch?: string
}) {
  attrs = attrs || {};

  const args: string[] = [];

  if (attrs.force) {
    args.push("--force");
  }

  if (attrs.repo) {
    args.push(attrs.repo);
  }

  if (attrs.fromBranch || attrs.toBranch) {
    if (attrs.fromBranch === undefined ||
      attrs.toBranch === undefined ||
      attrs.repo === undefined) {
      throw new Error("if from/to branch is defined, both must be, as well as the repo");
    }

    args.push(`${attrs.fromBranch}:${attrs.toBranch}`);
  }

  return git("push", args);
}

function callRemote(args?: string[]): string {
  return git("remote", args);
}

export const remote = makeFancyFunction(callRemote, {
  add(name: string, url: string) {
    return callRemote(["add", name, url]);
  },

  getURL(name: string) {
    return callRemote(["get-url", name]);
  },

  remove(name: string) {
    return callRemote(["remove", name]);
  },

  setURL(name: string, url: string) {
    return callRemote(["set-url", name, url]);
  }
});

/**
 * Semantic git operations / queries
 */

export function isCwdAGitRepo(): boolean {
  return fs.existsSync(".git") && fs.statSync(".git").isDirectory();
}

export function thereAreUncommittedChanges(): boolean {
  return diff() !== "";
}

export function thereAreUntrackedFiles(): boolean {
  return git("ls-files", ["-o", "--directory", "--exclude-standard"]) !== "";
}

export function currentBranchName(): string {
  return git("rev-parse", ["--abbrev-ref", "HEAD"]);
}

function filterOutUndefined<T>(input: Array<T | undefined>): T[] {
  return input.filter(v => v !== undefined) as T[];
}

export function cloneLocalRepo(attrs: {
  localRepoPath: string,
  branch: string,
  depth?: number,
  targetPath: string
}) {
  const localRepoPath = path.resolve(attrs.localRepoPath);

  const args: string[] = filterOutUndefined([
    "file://" + encodeURIComponent(localRepoPath),
    "--branch", attrs.branch,
    attrs.depth === undefined ? undefined : `--depth=${attrs.depth}`,
    attrs.targetPath
  ]);

  git("clone", args);
}
