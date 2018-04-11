import * as fs from "fs";
import * as semver from "semver";

const FILENAME = "package.json";

export function exists() {
  return fs.existsSync(FILENAME);
}

type PackageConfig = {
  version?: string
};

let cached: PackageConfig | null = null;
let lastReadHadNewlineAtEOF: boolean = false;

// TODO could get fancy and use autogents-validator here
function read(): PackageConfig {
  if (cached === null) {
    const data = fs.readFileSync(FILENAME, { encoding: "utf8" });
    cached = JSON.parse(data) as PackageConfig;
    lastReadHadNewlineAtEOF = data.endsWith("\n");
  }
  return cached;
}

function write(config: PackageConfig) {
  let data = JSON.stringify(config, null, 2);
  if (lastReadHadNewlineAtEOF) {
    data += "\n";
  }
  fs.writeFileSync(FILENAME, data, { encoding: "utf8" });
  invalidateCache();
}

function update(func: (data: PackageConfig) => void) {
  const data = read();
  func(data);
  write(data);
}

function invalidateCache() {
  cached = null;
}

export function getVersion(): semver.SemVer {
  const data = read();
  if (typeof data.version !== "string") {
    throw new Error("no version");
  }
  const ver = semver.parse(data.version, /*loose=*/true);
  if (ver === null) {
    throw new Error(`cannot parse version: ${data.version}`);
  }
  return ver;
}

export function setVersion(ver: semver.SemVer | string) {
  update(data => { data.version = ver.toString(); });
}
