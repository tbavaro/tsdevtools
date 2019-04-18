"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
function npm(command, args) {
    args = args || [];
    childProcess.execFileSync("npm", [command, ...args], {
        stdio: "inherit"
    });
}
exports.npm = npm;
function run(script, args) {
    args = args || [];
    npm("run", [script, ...args]);
}
exports.run = run;
function runBuild(args) {
    run("build", args);
}
exports.runBuild = runBuild;
function install(args) {
    npm("install", args);
}
exports.install = install;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnBtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL25wbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUE4QztBQUU5QyxTQUFnQixHQUFHLENBQUMsT0FBZSxFQUFFLElBQWU7SUFDbEQsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbEIsWUFBWSxDQUFDLFlBQVksQ0FDdkIsS0FBSyxFQUNMLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQ2xCO1FBQ0UsS0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQVRELGtCQVNDO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxJQUFlO0lBQ2pELElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFIRCxrQkFHQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUFlO0lBQ3RDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLElBQWU7SUFDckMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBRkQsMEJBRUMifQ==