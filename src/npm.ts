import * as childProcess from "child_process";

export function npm(command: string, args?: string[]): void {
  args = args || [];
  childProcess.execFileSync(
    "npm",
    [command, ...args],
    {
      stdio: "inherit"
    }
  );
}

export function run(script: string, args?: string[]) {
  args = args || [];
  npm("run", [script, ...args]);
}

export function runBuild(args?: string[]) {
  run("build", args);
}

export function install(args?: string[]) {
  npm("install", args);
}
