"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
function makeFancyFunction(func, others) {
    Object.assign(func, others);
    return func;
}
function git(command, args, options) {
    args = args || [];
    options = options || {};
    const execOptions = {
        encoding: "utf8"
    };
    if (options.suppressStderr) {
        execOptions.stdio = ["pipe", "pipe", "ignore"];
    }
    return childProcess.execFileSync("git", [command, ...args], execOptions).trimRight();
}
function doAdd(files, options) {
    options = options || {};
    if (options.all) {
        if (files.length > 0) {
            throw new Error("doesn't make sense to have filenames and --all");
        }
    }
    else {
        if (files.length === 0) {
            throw new Error("must specify filenames or --all");
        }
    }
    const args = [];
    if (options.all) {
        args.push("--all");
    }
    return git("add", [...args, "--", ...files]);
}
exports.add = makeFancyFunction(doAdd, {
    all() { doAdd([], { all: true }); }
});
function doBranch(args) {
    return git("branch", args);
}
exports.branch = makeFancyFunction(doBranch, {
    forceDelete(branchName) {
        doBranch(["-D", branchName]);
    }
});
function checkout(args) {
    return git("checkout", args);
}
exports.checkout = checkout;
function commit(attrs) {
    const args = [];
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
exports.commit = commit;
function diff() {
    return git("diff");
}
exports.diff = diff;
function fetch(attrs) {
    attrs = attrs || {};
    const args = [];
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
    }
    catch (e) {
        if (attrs.allowUnknownBranch &&
            e instanceof Error &&
            e.message.match(/Couldn.t find remote ref/)) {
            return "";
        }
        throw e;
    }
}
exports.fetch = fetch;
function push(attrs) {
    attrs = attrs || {};
    const args = [];
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
exports.push = push;
function doRemote(args) {
    return git("remote", args);
}
exports.remote = makeFancyFunction(doRemote, {
    add(name, url) {
        return doRemote(["add", name, url]);
    },
    getURL(name) {
        return doRemote(["get-url", name]);
    },
    remove(name) {
        return doRemote(["remove", name]);
    },
    setURL(name, url) {
        return doRemote(["set-url", name, url]);
    }
});
function doSubtree(command, args) {
    args = args || [];
    return git("subtree", [command, ...args]);
}
exports.subtree = makeFancyFunction(doSubtree, {
    push(options) {
        const args = [];
        args.push("--prefix");
        args.push(options.prefix);
        if (!util_1.isUndefined(options.message)) {
            args.push("--message");
            args.push(options.message);
        }
        args.push(options.repository);
        args.push(options.ref);
        return doSubtree("push", args);
    }
});
function tag(name, options) {
    options = options || {};
    const args = [];
    if (options.force) {
        args.push("--force");
    }
    args.push(name);
    return git("tag", args);
}
exports.tag = tag;
function isCwdAGitRepo() {
    return fs.existsSync(".git") && fs.statSync(".git").isDirectory();
}
exports.isCwdAGitRepo = isCwdAGitRepo;
function thereAreUncommittedChanges() {
    return diff() !== "";
}
exports.thereAreUncommittedChanges = thereAreUncommittedChanges;
function thereAreUntrackedFiles() {
    return git("ls-files", ["-o", "--directory", "--exclude-standard"]) !== "";
}
exports.thereAreUntrackedFiles = thereAreUntrackedFiles;
function currentBranchName() {
    return git("rev-parse", ["--abbrev-ref", "HEAD"]);
}
exports.currentBranchName = currentBranchName;
function filterOutUndefined(input) {
    return input.filter(v => v !== undefined);
}
function cloneLocalRepo(attrs) {
    const localRepoPath = path.resolve(attrs.localRepoPath);
    const args = filterOutUndefined([
        "file://" + encodeURIComponent(localRepoPath),
        "--branch", attrs.branch,
        attrs.depth === undefined ? undefined : `--depth=${attrs.depth}`,
        attrs.targetPath
    ]);
    git("clone", args);
}
exports.cloneLocalRepo = cloneLocalRepo;
function localBranchExists(name) {
    try {
        git("rev-parse", ["--verify", name], { suppressStderr: true });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.localBranchExists = localBranchExists;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUE4QztBQUM5Qyx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtCQUFtQztBQUVuQyxTQUFTLGlCQUFpQixDQUd4QixJQUFVLEVBQUUsTUFBYztJQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QixPQUFPLElBQVcsQ0FBQztBQUNyQixDQUFDO0FBTUQsU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLElBQWUsRUFBRSxPQUFvQjtJQUNqRSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNsQixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUV4QixNQUFNLFdBQVcsR0FBdUQ7UUFDdEUsUUFBUSxFQUFFLE1BQU07S0FDakIsQ0FBQztJQUVGLElBQUksT0FBTyxDQUFDLGNBQWMsRUFBRTtRQUMxQixXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNoRDtJQUVELE9BQU8sWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN2RixDQUFDO0FBVUQsU0FBUyxLQUFLLENBQUMsS0FBZSxFQUFFLE9BQW9CO0lBQ2xELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBRXhCLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO0tBQ0Y7U0FBTTtRQUNMLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVB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