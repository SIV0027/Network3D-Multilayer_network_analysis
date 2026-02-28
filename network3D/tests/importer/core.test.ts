import {
    expect,
    describe,
    it
} from "vitest";

import {
    DFA,
    CSVDFA
} from "@/importer/core";

import {
    realSingle
} from "../testNetwork/static/real/index";

describe("Core", () => {

    describe("DFA", () => {

        it("ok", () => {
            const res: {
                rows: Array<Array<string>>,
                row: Array<string>,
                field: string
            } = {
                rows: [],
                row: [],
                field: ""
            };

            const pushCol = () => {
                res.row.push(res.field);
                res.field = "";
            };

            const pushRow = () => {
                res.rows.push(res.row);
                res.row = [];
            };

            const csvDfa = new DFA({
                transitionTable: {
                    "S| ":  { next: "S", callback: pushCol },
                    "S|\n": { next: "S", callback: () => { pushCol(); pushRow(); } },
                    "S|*":  { next: "S", callback: (ch) => res.field += ch },
                },
                startState: "S"
            });

            csvDfa.parse({ input: "1 2 3\n4 5 6" });

            // EOF flush
            if(res.field.length > 0 || res.row.length > 0)
            {
                res.row.push(res.field);
                res.rows.push(res.row);
            }

            console.log(res.rows);
        });
    });

    describe("CsvDfa", () => {

        it("ok", () => {
            const csvDfa = new CSVDFA();
            console.log(csvDfa.parse({ input: realSingle.bioCECX }));
            console.log(csvDfa.parse({ input: "1 2 3\n4 5 6" }));
        });
    });
});