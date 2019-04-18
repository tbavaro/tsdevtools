import * as yargs from "yargs";
export declare type EnumType = any;
export default class EnumOptionHelper<ENUM_VALUE extends number> {
    private enumType;
    constructor(enumType: EnumType);
    private getEnumStrings;
    private enumValueToString;
    stringToEnumValue(str: string): ENUM_VALUE;
    wrapOptions(options: yargs.Options & {
        default: ENUM_VALUE;
        choices?: ENUM_VALUE[];
    }): {
        string: boolean;
        default: string;
        choices: string[];
        alias?: string | string[] | undefined;
        array?: boolean | undefined;
        boolean?: boolean | undefined;
        coerce?: ((arg: any) => any) | undefined;
        config?: boolean | undefined;
        configParser?: ((configPath: string) => object) | undefined;
        conflicts?: string | string[] | {
            [key: string]: string | string[];
        } | undefined;
        count?: boolean | undefined;
        defaultDescription?: string | undefined;
        demand?: string | boolean | undefined;
        demandOption?: string | boolean | undefined;
        desc?: string | undefined;
        describe?: string | undefined;
        description?: string | undefined;
        global?: boolean | undefined;
        group?: string | undefined;
        hidden?: boolean | undefined;
        implies?: string | string[] | {
            [key: string]: string | string[];
        } | undefined;
        nargs?: number | undefined;
        normalize?: boolean | undefined;
        number?: boolean | undefined;
        require?: string | boolean | undefined;
        required?: string | boolean | undefined;
        requiresArg?: boolean | undefined;
        skipValidation?: boolean | undefined;
        type?: "string" | "number" | "boolean" | "array" | "count" | undefined;
    };
}
