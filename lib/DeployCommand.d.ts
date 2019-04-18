import * as VersionUtils from "./VersionUtils";
export declare const VersionBumpOptions: typeof VersionUtils.VersionBumpOptions;
export declare type DeployCommandAttrs = {
    branch: string;
    repo: string;
    subtreeDir?: string;
    versionBump: VersionUtils.VersionBumpOptions;
};
export declare function run(attrs: DeployCommandAttrs): void;
