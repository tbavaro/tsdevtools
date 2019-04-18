"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VersionUtils = require("./VersionUtils");
function createVersionBumpTest(attrs) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVyc2lvblV0aWxzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVmVyc2lvblV0aWxzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBK0M7QUFFL0MsU0FBUyxxQkFBcUIsQ0FBQyxLQUs5QjtJQUNDLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ1osTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxxQkFBcUIsQ0FBQztJQUNwQixZQUFZLEVBQUUsT0FBTztJQUNyQixJQUFJLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixDQUFDLElBQUk7SUFDMUMsZUFBZSxFQUFFLE9BQU87Q0FDekIsQ0FBQyxDQUFDO0FBRUgscUJBQXFCLENBQUM7SUFDcEIsWUFBWSxFQUFFLE9BQU87SUFDckIsSUFBSSxFQUFFLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO0lBQzNDLGVBQWUsRUFBRSxPQUFPO0NBQ3pCLENBQUMsQ0FBQztBQUVILHFCQUFxQixDQUFDO0lBQ3BCLFlBQVksRUFBRSxPQUFPO0lBQ3JCLElBQUksRUFBRSxZQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSztJQUMzQyxlQUFlLEVBQUUsT0FBTztDQUN6QixDQUFDLENBQUM7QUFFSCxxQkFBcUIsQ0FBQztJQUNwQixZQUFZLEVBQUUsT0FBTztJQUNyQixJQUFJLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEtBQUs7SUFDM0MsZUFBZSxFQUFFLE9BQU87Q0FDekIsQ0FBQyxDQUFDO0FBRUgscUJBQXFCLENBQUM7SUFDcEIsWUFBWSxFQUFFLGNBQWM7SUFDNUIsSUFBSSxFQUFFLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO0lBQzNDLGVBQWUsRUFBRSxPQUFPO0NBQ3pCLENBQUMsQ0FBQztBQUVILHFCQUFxQixDQUFDO0lBQ3BCLFlBQVksRUFBRSxjQUFjO0lBQzVCLElBQUksRUFBRSxZQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSztJQUMzQyxlQUFlLEVBQUUsT0FBTztDQUN6QixDQUFDLENBQUM7QUFJSCxxQkFBcUIsQ0FBQztJQUNwQixZQUFZLEVBQUUsT0FBTztJQUNyQixJQUFJLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixDQUFDLElBQUk7SUFDMUMsZUFBZSxFQUFFLGNBQWM7Q0FDaEMsQ0FBQyxDQUFDO0FBRUgscUJBQXFCLENBQUM7SUFDcEIsWUFBWSxFQUFFLGNBQWM7SUFDNUIsSUFBSSxFQUFFLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO0lBQzFDLGVBQWUsRUFBRSxjQUFjO0NBQ2hDLENBQUMsQ0FBQyJ9