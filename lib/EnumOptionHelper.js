"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnumOptionHelper {
    constructor(enumType) {
        this.enumType = enumType;
    }
    getEnumStrings(values) {
        return Object.keys(this.enumType).filter(key => {
            const mapsTo = this.enumType[key];
            return (typeof mapsTo === "number") && (!values || values.includes(mapsTo));
        });
    }
    enumValueToString(value) {
        const result = this.enumType[value];
        if (result === undefined || (typeof result) !== "string") {
            throw new Error("invalid enum value");
        }
        return result;
    }
    stringToEnumValue(str) {
        const result = this.enumType[str];
        if (result === undefined || (typeof result) !== "number") {
            throw new Error("invalid enum string");
        }
        return result;
    }
    wrapOptions(options) {
        return Object.assign({}, options, { string: true, default: this.enumValueToString(options.default), choices: this.getEnumStrings(options.choices) });
    }
}
exports.default = EnumOptionHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW51bU9wdGlvbkhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9FbnVtT3B0aW9uSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsTUFBcUIsZ0JBQWdCO0lBR25DLFlBQW1CLFFBQWtCO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFTyxjQUFjLENBQUMsTUFBcUI7UUFDMUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDN0MsTUFBTSxNQUFNLEdBQUksSUFBSSxDQUFDLFFBQWdCLENBQUMsR0FBRyxDQUFlLENBQUM7WUFDekQsT0FBTyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGlCQUFpQixDQUFDLEtBQWlCO1FBQ3pDLE1BQU0sTUFBTSxHQUFJLElBQUksQ0FBQyxRQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxHQUFXO1FBQ2xDLE1BQU0sTUFBTSxHQUFJLElBQUksQ0FBQyxRQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxXQUFXLENBQUMsT0FBd0U7UUFDekYseUJBQ0ssT0FBTyxJQUNWLE1BQU0sRUFBRSxJQUFJLEVBQ1osT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQ2hELE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFDN0M7SUFDSixDQUFDO0NBQ0Y7QUF0Q0QsbUNBc0NDIn0=