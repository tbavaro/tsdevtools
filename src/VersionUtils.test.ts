import * as VersionUtils from "./VersionUtils";

function createVersionBumpTest(attrs: {
  name?: string,
  startVersion: string,
  mode: VersionUtils.VersionBumpOptions,
  expectedVersion: string
}) {
  const name = "versionBumpTest: " + (attrs.name ? attrs.name : `${attrs.startVersion} ${attrs.mode}`);
  it(name, () => {
    const result = VersionUtils.bumpVersion(attrs.startVersion, attrs.mode);
    expect(result).toBe(attrs.expectedVersion);
  });
}

createVersionBumpTest({
  startVersion: "1.0.0",
  mode: VersionUtils.VersionBumpOptions.none,
  expectedVersion: "1.0.0"
});

createVersionBumpTest({
  startVersion: "1.0.0",
  mode: VersionUtils.VersionBumpOptions.major,
  expectedVersion: "2.0.0"
});

createVersionBumpTest({
  startVersion: "1.0.0",
  mode: VersionUtils.VersionBumpOptions.minor,
  expectedVersion: "1.1.0"
});

createVersionBumpTest({
  startVersion: "1.0.0",
  mode: VersionUtils.VersionBumpOptions.patch,
  expectedVersion: "1.0.1"
});

createVersionBumpTest({
  startVersion: "1.0.1-beta.0",
  mode: VersionUtils.VersionBumpOptions.patch,
  expectedVersion: "1.0.1"
});

createVersionBumpTest({
  startVersion: "1.0.1-beta.0",
  mode: VersionUtils.VersionBumpOptions.minor,
  expectedVersion: "1.1.0"
});

// beta

createVersionBumpTest({
  startVersion: "1.0.0",
  mode: VersionUtils.VersionBumpOptions.beta,
  expectedVersion: "1.0.1-beta.0"
});

createVersionBumpTest({
  startVersion: "1.0.0-beta.0",
  mode: VersionUtils.VersionBumpOptions.beta,
  expectedVersion: "1.0.0-beta.1"
});
