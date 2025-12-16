import { ID } from "@/utilities/id/id";
import { InvalidIdError } from "@/utilities/id/idErrors";
import { expect, describe, it } from "vitest";

describe("ID", () => {
    it.each([
        "first",
        "second",
        "1",
        "2",
        "  fdslkjf  ",
        "first_1",
        " some spaces in ID    "
    ])("validateID → ok for valid ID: '%s'", (id) => {
        expect(() => ID.validateID({ id })).not.toThrow(InvalidIdError);
    });

    it.each([
        "",
        " ",
        "\t",
        "\n",
        "  ",
        "         ",
        `   
            `,
        "\t\t\t",
        "  \t",
        " \t\n\t "
    ])("validateID → error, when ID is invalid (consisting only of white space and line terminator characters): '%s'", (id) => {
        expect(() => ID.validateID({ id })).toThrow(InvalidIdError);
    });
});