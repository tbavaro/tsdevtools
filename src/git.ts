import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import { isUndefined } from "util";

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

export type AddOptions = {
  all?: boolean
};

function doAdd(files: string[], options?: AddOptions) {
  options = options || {};

  if (options.all) {
    if (files.length > 0) {
      throw new Error("doesn't make sense to have filenames and --all");
    }
  } else {
    if (files.length === 0) {
      throw new Error("must specify filenames or --all");
    }
  }

  const args: string[] = [];
  if (options.all) {
    args.push("--all");
  }

  return git("add", [...args, "--", ...files]);
}

export const add = makeFancyFunction(doAdd, {
  all() { doAdd([], { all: true }); }
});

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
  unshallow?: boolean,
  repo?: string,
  allowUnknownBranch?: boolean
}) {
  attrs = attrs || {};
  const args: string[] = [];
  if (attrs.depth !== undefined) {
    args.push(`--depth=${attrs.depth}`);
  }
  if (attrs.unshallow) {
    args.push("--unshallow");
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

function doRemote(args?: string[]): string {
  return git("remote", args);
}

export const remote = makeFancyFunction(doRemote, {
  add(name: string, url: string) {
    return doRemote(["add", name, url]);
  },

  getURL(name: string) {
    return doRemote(["get-url", name]);
  },

  remove(name: string) {
    return doRemote(["remove", name]);
  },

  setURL(name: string, url: string) {
    return doRemote(["set-url", name, url]);
  }
});

export type SubtreePushOptions = {
  message?: string;
  prefix: string;
  repository: string;
  ref: string;
};

function doSubtree(command: string, args?: string[]) {
  args = args || [];
  return git("subtree", [command, ...args]);
}

export const subtree = makeFancyFunction(doSubtree, {
  push(options: SubtreePushOptions) {
    const args: string[] = [];

    args.push("--prefix");
    args.push(options.prefix);

    if (!isUndefined(options.message)) {
      args.push("--message");
      args.push(options.message);
    }

    args.push(options.repository);
    args.push(options.ref);

    return doSubtree("push", args);
  }
});

export type TagOptions = {
  force?: boolean;
};

export function tag(name: string, options?: TagOptions) {
  options = options || {};

  const args: string[] = [];

  if (options.force) {
    args.push("--force");
  }

  args.push(name);

  return git("tag", args);
}

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
