"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
var VersionBumpOptions;
(function (VersionBumpOptions) {
    VersionBumpOptions[VersionBumpOptions["none"] = 0] = "none";
    VersionBumpOptions[VersionBumpOptions["beta"] = 1] = "beta";
    VersionBumpOptions[VersionBumpOptions["patch"] = 2] = "patch";
    VersionBumpOptions[VersionBumpOptions["minor"] = 3] = "minor";
    VersionBumpOptions[VersionBumpOptions["major"] = 4] = "major";
})(VersionBumpOptions = exports.VersionBumpOptions || (exports.VersionBumpOptions = {}));
function bumpVersion(versionString, mode) {
    const ver = parse(versionString);
    return bumpSemVer(ver, mode).toString();
}
exports.bumpVersion = bumpVersion;
function bumpSemVer(ver, mode) {
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
function parse(versionString) {
    const ver = semver.parse(versionString, true);
    if (ver === null) {
        throw new Error(`cannot parse version: ${versionString}`);
    }
    return ver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVyc2lvblV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1ZlcnNpb25VdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUVqQyxJQUFZLGtCQU1YO0FBTkQsV0FBWSxrQkFBa0I7SUFDNUIsMkRBQUksQ0FBQTtJQUNKLDJEQUFJLENBQUE7SUFDSiw2REFBSyxDQUFBO0lBQ0wsNkRBQUssQ0FBQTtJQUNMLDZEQUFLLENBQUE7QUFDUCxDQUFDLEVBTlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFNN0I7QUFFRCxTQUFnQixXQUFXLENBQUMsYUFBcUIsRUFBRSxJQUF3QjtJQUN6RSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakMsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFDLENBQUM7QUFIRCxrQ0FHQztBQUVELFNBQVMsVUFBVSxDQUFDLEdBQWtCLEVBQUUsSUFBd0I7SUFDOUQsUUFBUSxJQUFJLEVBQUU7UUFDWixLQUFLLGtCQUFrQixDQUFDLElBQUk7WUFDMUIsT0FBTyxHQUFHLENBQUM7UUFFYixLQUFLLGtCQUFrQixDQUFDLElBQUk7WUFDMUIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2QyxLQUFLLGtCQUFrQixDQUFDLEtBQUs7WUFDM0IsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFCLEtBQUssa0JBQWtCLENBQUMsS0FBSztZQUMzQixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUIsS0FBSyxrQkFBa0IsQ0FBQyxLQUFLO1lBQzNCLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQjtZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLElBQUksRUFBRSxDQUFDLENBQUM7S0FDaEQ7QUFDSCxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsYUFBcUI7SUFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQVksSUFBSSxDQUFDLENBQUM7SUFDeEQsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLGFBQWEsRUFBRSxDQUFDLENBQUM7S0FDM0Q7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMifQ==