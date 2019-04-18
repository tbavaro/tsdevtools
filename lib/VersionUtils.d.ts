export declare enum VersionBumpOptions {
    none = 0,
    beta = 1,
    patch = 2,
    minor = 3,
    major = 4
}
export declare function bumpVersion(versionString: string, mode: VersionBumpOptions): string;
