import {
    expect,
    describe,
    it
} from "vitest";

import * as ohm from "ohm-js";

import {
    SingleLayerNetwork
} from "@/importer";

describe("SingleLayerNetwork", () => {

    (globalThis as any).ohm = ohm;

    describe("Ohm", () => {

        it("ok", () => {
            const network = SingleLayerNetwork.parse({
                parserSource: SingleLayerNetwork.CSV({
                    delimiters: {
                        col: ",",
                        row: ";"
                    }
                }),
                input: `1,2;
                6,56;
                6,2;42,56;
                lettersId
      ,          6`
            });

            expect(network.getActorsCount()).toBe(6);
            expect(network.getLinksCount()).toBe(5);
            for(const actorId of ["1", "2", "6", "42", "56", "lettersId"])
            {
                expect(network.isActorExists({ actorId })).toBe(true);
            }
            for(const [sourceActorId, targetActorId] of [["1", "2"], ["6", "56"], ["6", "2"], ["42", "56"], ["lettersId", "6"]])
            {
                expect(network.isLinkExists({ sourceActorId, targetActorId })).toBe(true);
            }
        });
    });
});