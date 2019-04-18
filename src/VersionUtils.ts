import * as semver from "semver";

export enum VersionBumpOptions {
  none,
  beta,
  patch,
  minor,
  major
}

export function bumpVersion(versionString: string, mode: VersionBumpOptions): string {
  const ver = parse(versionString);
  return bumpSemVer(ver, mode).toString();
}

function bumpSemVer(ver: semver.SemVer, mode: VersionBumpOptions): semver.SemVer {
  switch (mode) {
    case VersionBumpOptions.none:
      return ver;

    case VersionBumpOptions.beta:
      return ver.inc("prerelease", "beta");

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

function parse(versionString: string): semver.SemVer {
  const ver = semver.parse(versionString, /*loose=*/true);
  if (ver === null) {
    throw new Error(`cannot parse version: ${versionString}`);
  }
  return ver;
}
