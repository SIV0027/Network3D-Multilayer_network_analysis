import {
    expect,
    describe,
    it
} from "vitest";

import * as ohm from "ohm-js";

import {
    Parser
} from "@/importer/core";

describe("Core", () => {

    (globalThis as any).ohm = ohm;

    describe("Ohm", () => {

        it("ok", () => {
            const parser = new Parser({
                source: `
                    Arithmetic {
                        Exp = AddExp

                        AddExp = AddExp "+" MulExp  -- plus
                            | AddExp "-" MulExp  -- minus
                            | MulExp

                        MulExp = MulExp "*" number  -- times
                            | MulExp "/" number  -- div
                            | number

                        number = digit+
                    }
                `
            });
            parser.addSemantic({ name: "expression" });
            parser.addOperation({ semanticName: "expression", name: "eval", actionDictionary: {
                    AddExp_plus(a: any, _: any, b: any) {
                            return a.eval() + b.eval();    
                    },
                    AddExp_minus(a: any, _: any, b: any) {
                        return a.eval() - b.eval();
                    },
                    MulExp_times(a: any, _: any, b: any) {
                        return a.eval() * b.eval();
                    },
                    MulExp_div(a: any, _: any, b: any) {
                        return a.eval() / b.eval();
                    },
                    number(digits: any) {
                        return parseInt(digits.sourceString)
                    }
                }
            });

            console.log(parser.match({ input: "100 + 1 * 2" }));
            expect(parser.parse({ input: "100 + 1 * 2", semanticName: "expression" }).eval()).toBe(102);
            expect(parser.parse({ input: "1 + 2 - 3 + 4", semanticName: "expression" }).eval()).toBe(4);
            expect(parser.parse({ input: "12345", semanticName: "expression" }).eval()).toBe(12345);
        });
    });
});