import * as yargs from "yargs";

// TODO ideally this would be "an enum whose specific values are of type ENUM_VALUE"
export type EnumType = any;

export default class EnumOptionHelper<ENUM_VALUE extends number> {
  private enumType: EnumType;

  public constructor(enumType: EnumType) {
    this.enumType = enumType;
  }

  private getEnumStrings(values?: ENUM_VALUE[]): string[] {
    return Object.keys(this.enumType).filter(key => {
      const mapsTo = (this.enumType as any)[key] as ENUM_VALUE;
      return (typeof mapsTo === "number") && (!values || values.includes(mapsTo));
    });
  }

  private enumValueToString(value: ENUM_VALUE): string {
    const result = (this.enumType as any)[value];
    if (result === undefined || (typeof result) !== "string") {
      throw new Error("invalid enum value");
    }
    return result;
  }

  public stringToEnumValue(str: string): ENUM_VALUE {
    const result = (this.enumType as any)[str];
    if (result === undefined || (typeof result) !== "number") {
      throw new Error("invalid enum string");
    }
    return result;
  }

  public wrapOptions(options: yargs.Options & { default: ENUM_VALUE, choices?: ENUM_VALUE[] }) {
    return {
      ...options,
      string: true,
      default: this.enumValueToString(options.default),
      choices: this.getEnumStrings(options.choices)
    };
  }
}
