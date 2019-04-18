import * as fs from "fs";
import { isString } from "util";

const FILENAME = "package.json";
const ENCODING = "utf8";

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
    const data = fs.readFileSync(FILENAME, { encoding: ENCODING });
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
  fs.writeFileSync(FILENAME, data, { encoding: ENCODING });
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

export function getVersion(): string {
  const data = read();
  if (!isString(data.version)) {
    throw new Error("no version");
  }
  return data.version;
}

export function setVersion(ver: string) {
  update(data => { data.version = ver; });
}
