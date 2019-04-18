export declare type GitOptions = {
    suppressStderr?: boolean;
};
export declare type AddOptions = {
    all?: boolean;
};
declare function doAdd(files: string[], options?: AddOptions): string;
export declare const add: typeof doAdd & Readonly<{
    all(): void;
}>;
declare function doBranch(args?: string[]): string;
export declare const branch: typeof doBranch & Readonly<{
    forceDelete(branchName: string): void;
}>;
export declare function checkout(args?: string[]): string;
export declare function commit(attrs: {
    amend?: boolean;
    dateNow?: boolean;
    message: string;
}): string;
export declare function diff(): string;
export declare function fetch(attrs?: {
    branch?: string;
    depth?: number;
    unshallow?: boolean;
    repo?: string;
    allowUnknownBranch?: boolean;
}): string;
export declare function push(attrs?: {
    force?: boolean;
    repo?: string;
    fromBranch?: string;
    toBranch?: string;
}): string;
declare function doRemote(args?: string[]): string;
export declare const remote: typeof doRemote & Readonly<{
    add(name: string, url: string): string;
    getURL(name: string): string;
    remove(name: string): string;
    setURL(name: string, url: string): string;
}>;
export declare type SubtreePushOptions = {
    message?: string;
    prefix: string;
    repository: string;
    ref: string;
};
declare function doSubtree(command: string, args?: string[]): string;
export declare const subtree: typeof doSubtree & Readonly<{
    push(options: SubtreePushOptions): string;
}>;
export declare type TagOptions = {
    force?: boolean;
};
export declare function tag(name: string, options?: TagOptions): string;
export declare function isCwdAGitRepo(): boolean;
export declare function thereAreUncommittedChanges(): boolean;
export declare function thereAreUntrackedFiles(): boolean;
export declare function currentBranchName(): string;
export declare function cloneLocalRepo(attrs: {
    localRepoPath: string;
    branch: string;
    depth?: number;
    targetPath: string;
}): void;
export declare function localBranchExists(name: string): boolean;
export {};
