/*import {
    expect,
    describe,
    it
} from "vitest";*/

import {
  genericSingle
} from "../testNetwork/";

import * as Visualization from "@/visualization";
import * as Core from "@/core";

/*describe("Core", () => {

    describe("Graph", () => {

        it("ok", () => {
          
        });
    });
});*/

const networkData = genericSingle.oneUndirectedGenericTestNetwork;

const network = new Core.SingleLayerNetwork({
    schema: networkData.schema,
    data: {
        actors: networkData.data.nodes,
        links: networkData.data.links.map((val) => { return { sourceActorId: val.source, targetActorId: val.target, weight: val.weight } })
    }
});

const networkVisualization = Visualization.SingleLayerNetwork.create({
    container: "container",
    network
});

networkVisualization.render();