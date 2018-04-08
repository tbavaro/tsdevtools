export enum VersionBumpOptions {
  none,
  patch,
  minor,
  major
}

export type DeployCommandAttrs = {
  branch: string;
  dryRun: boolean;
  repo: string;
  versionBump: VersionBumpOptions;
};

export function run(attrs: DeployCommandAttrs) {
  console.log("running deploy with attrs", JSON.stringify(attrs, null, 2));
}
