import {
    expect,
    describe,
    it
} from "vitest";

import {
    MultiplexNetwork
} from "@/importer";

import {
    realMultiplex
} from "../testNetwork/static/real/index";

describe("MultiplexNetwork", () => {

    describe("CSV", () => {

        it("ok - AUCS", () => {
            const network = MultiplexNetwork.fromCSV({ csvInput: realMultiplex.aucs });
            expect(network.getLayersCount()).toBe(5);
            expect(network.getActorsCount()).toBe(61);
        });
    });
});