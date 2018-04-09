import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

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

export function diff(): string {
  return git("diff");
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
