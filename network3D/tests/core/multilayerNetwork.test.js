import { expect, describe, it } from "vitest";
import { AlreadyExistingActorError, AlreadyExistingLinkError, NonExistingActorError, NonExistingLinkError, NonExistingPartitionError, NonExistingLayerError, NonWeightedLayerError, WeightedLayerError, MultilayerNetwork, AlreadyExistingLayerError, AlreadyExistingPartitionError } from "@/core";
import { testMultilayerNetwork, createSchemaTestMultilayerNetwork, createFullTestMultilayerNetwork, invalidIds, createActorsTestMultilayerNetwork } from "../testNetwork";
import { InvalidIdError } from "@/utilities/id/idErrors";
describe("MultilayerNetwork", () => {
    describe("addPartition", () => {
        it("ok", () => {
            const network = new MultilayerNetwork();
            for (const partitionId of testMultilayerNetwork.schema.partitions) {
                expect(() => network.addPartition({ partitionId })).not.toThrow();
            }
        });
    });
    describe("addLayer", () => {
        it("ok", () => {
            const network = new MultilayerNetwork();
            for (const partitionId of testMultilayerNetwork.schema.partitions) {
                network.addPartition({ partitionId });
            }
            for (const layerId in testMultilayerNetwork.schema.layers) {
                expect(() => network.addLayer({ layerId, ...testMultilayerNetwork.schema.layers[layerId] })).not.toThrow();
            }
        });
    });
    describe("addActor", () => {
        it("ok", () => {
            const network = createSchemaTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.data.actors) {
                for (const actorId of testMultilayerNetwork.data.actors[partitionId]) {
                    expect(() => network.addActor({ partitionId, actorId })).not.toThrow();
                }
            }
        });
        it("error, when partition does not exist", () => {
            const network = createSchemaTestMultilayerNetwork(testMultilayerNetwork);
            const existingPartitionId = testMultilayerNetwork.schema.partitions[0];
            const actorId = testMultilayerNetwork.data.actors[existingPartitionId][0];
            for (const partitionId of testMultilayerNetwork.not.schema.partitions) {
                expect(() => network.addActor({ partitionId, actorId }))
                    .toThrow(NonExistingPartitionError);
            }
        });
        it("error, when actor (with same ID) already exists within same partition", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.data.actors) {
                for (const actorId of testMultilayerNetwork.data.actors[partitionId]) {
                    expect(() => network.addActor({ partitionId, actorId }))
                        .toThrow(AlreadyExistingActorError);
                }
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            const partitionId = testMultilayerNetwork.schema.partitions[0];
            const actorId = testMultilayerNetwork.data.actors[partitionId][0];
            for (const invalidId of invalidIds) {
                expect(() => network.addActor({ partitionId: invalidId, actorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.addActor({ partitionId, actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("isActorExists", () => {
        it("ok", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.data.actors) {
                for (const actorId of testMultilayerNetwork.data.actors[partitionId]) {
                    expect(network.isActorExists({ partitionId, actorId })).toBe(true);
                }
            }
        });
        it("not found", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.not.data.actors) {
                for (const actorId of testMultilayerNetwork.not.data.actors[partitionId]) {
                    expect(network.isActorExists({ partitionId, actorId })).toBe(false);
                }
            }
        });
        it("error, when partition does not exist", () => {
            const network = createSchemaTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId of testMultilayerNetwork.not.schema.partitions) {
                expect(() => network.isActorExists({ partitionId, actorId: "someId" }))
                    .toThrow(NonExistingPartitionError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createSchemaTestMultilayerNetwork(testMultilayerNetwork);
            const partitionId = testMultilayerNetwork.schema.partitions[0];
            const actorId = testMultilayerNetwork.data.actors[partitionId][0];
            for (const invalidId of invalidIds) {
                expect(() => network.isActorExists({ partitionId: invalidId, actorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isActorExists({ partitionId, actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("getActorsCount", () => {
        it("ok", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(testMultilayerNetwork.data.actors[partitionId].length);
            }
        });
        it("ok - empty", () => {
            const network = createSchemaTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(0);
            }
        });
        it("error, when partition does not exist", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.not.schema.partitions) {
                expect(() => network.getActorsCount({ partitionId }))
                    .toThrow(NonExistingPartitionError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const invalidId of invalidIds) {
                expect(() => network.getActorsCount({ partitionId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("addLink", () => {
        it("ok", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                for (const { sourceActorId, targetActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                    expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight })).not.toThrow();
                }
            }
        });
        it("ok - complement of directed layers to undirected", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { directed } = network.getLayerSchema({ layerId });
                if (directed) {
                    for (const { sourceActorId: targetActorId, targetActorId: sourceActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                        expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight })).not.toThrow();
                    }
                }
            }
        });
        it("error, when link already exists", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                for (const { sourceActorId, targetActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                    expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight }))
                        .toThrow(AlreadyExistingLinkError);
                }
            }
        });
        it("error, when link already exists - complement to undirected of undirected layers", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { partitionIds, directed } = network.getLayerSchema({ layerId });
                if (!directed && partitionIds.source == partitionIds.target) {
                    for (const { sourceActorId: targetActorId, targetActorId: sourceActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                        expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight }))
                            .toThrow(AlreadyExistingLinkError);
                    }
                }
            }
        });
        it("error, when layer does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.not.schema.layers) {
                const sourceActorId = testMultilayerNetwork.data.actors[testMultilayerNetwork.schema.partitions[0]][0];
                const targetActorId = testMultilayerNetwork.data.actors[testMultilayerNetwork.schema.partitions[0]][1];
                expect(() => network.addLink({ layerId, sourceActorId, targetActorId }))
                    .toThrow(NonExistingLayerError);
            }
        });
        it("error, when layer is not weighted", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { weighted } = network.getLayerSchema({ layerId });
                if (!weighted) {
                    let i = -5;
                    for (const { sourceActorId, targetActorId } of testMultilayerNetwork.data.links[layerId]) {
                        expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight: i++ }))
                            .toThrow(NonWeightedLayerError);
                    }
                }
            }
        });
        it("error, when layer is weighted", () => {
            const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { weighted } = network.getLayerSchema({ layerId });
                if (weighted) {
                    for (const { sourceActorId, targetActorId } of testMultilayerNetwork.data.links[layerId]) {
                        expect(() => network.addLink({ layerId, sourceActorId, targetActorId }))
                            .toThrow(WeightedLayerError);
                    }
                }
            }
        });
        it("error, when one of link actors does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.not.data.actors) {
                const layerId = network.getLayersOfPartition({ partitionId })[0];
                const existingActorId = testMultilayerNetwork.not.data.actors[partitionId][0];
                for (const nonExistingActorId of testMultilayerNetwork.not.data.actors[partitionId]) {
                    expect(() => network.addLink({ layerId, sourceActorId: nonExistingActorId, targetActorId: existingActorId, weight: 1 }))
                        .toThrow(NonExistingActorError);
                    expect(() => network.addLink({ layerId, sourceActorId: existingActorId, targetActorId: nonExistingActorId }))
                        .toThrow(NonExistingActorError);
                }
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            const layerId = Object.keys(testMultilayerNetwork.schema.layers)[0];
            const { sourceActorId, targetActorId } = testMultilayerNetwork.not.data.links[layerId][0];
            for (const invalidId of invalidIds) {
                expect(() => network.addLink({ layerId: invalidId, sourceActorId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.addLink({ layerId, sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.addLink({ layerId, sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("isLinkExists", () => {
        it("ok", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                for (const { sourceActorId, targetActorId } of testMultilayerNetwork.data.links[layerId]) {
                    expect(network.isLinkExists({ layerId, sourceActorId, targetActorId })).toBe(true);
                }
            }
        });
        it("ok - undirected → both direction", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { partitionIds, directed } = network.getLayerSchema({ layerId });
                if (!directed && partitionIds.source == partitionIds.target) {
                    for (const { sourceActorId: targetActorId, targetActorId: sourceActorId } of testMultilayerNetwork.data.links[layerId]) {
                        expect(network.isLinkExists({ layerId, sourceActorId, targetActorId })).toBe(true);
                    }
                }
            }
        });
        it("not found", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                for (const { sourceActorId, targetActorId } of testMultilayerNetwork.not.data.links[layerId]) {
                    expect(network.isLinkExists({ layerId, sourceActorId, targetActorId })).toBe(false);
                }
            }
        });
        it("not found - directed & bipartite → one direction (redundant)", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { partitionIds, directed } = network.getLayerSchema({ layerId });
                if (directed || partitionIds.source != partitionIds.target) {
                    for (const { sourceActorId: targetActorId, targetActorId: sourceActorId } of testMultilayerNetwork.data.links[layerId]) {
                        expect(network.isLinkExists({ layerId, sourceActorId, targetActorId })).toBe(false);
                    }
                }
            }
        });
        it("error, when layer does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            const { sourceActorId, targetActorId } = testMultilayerNetwork.data.links[Object.keys(testMultilayerNetwork.schema.layers)[0]][0];
            for (const layerId in testMultilayerNetwork.not.schema.layers) {
                expect(() => network.isLinkExists({ layerId, sourceActorId, targetActorId }))
                    .toThrow(NonExistingLayerError);
            }
        });
        it("error, when source actor does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.not.data.actors) {
                const layerId = network.getLayersOfPartition({ partitionId })[0];
                const existingActorId = testMultilayerNetwork.data.actors[partitionId][0];
                for (const nonExistingActorId of testMultilayerNetwork.not.data.actors[partitionId]) {
                    expect(() => network.isLinkExists({ layerId, sourceActorId: existingActorId, targetActorId: nonExistingActorId }))
                        .toThrow(NonExistingActorError);
                    expect(() => network.isLinkExists({ layerId, sourceActorId: nonExistingActorId, targetActorId: existingActorId }))
                        .toThrow(NonExistingActorError);
                }
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            const layerId = Object.keys(testMultilayerNetwork.schema.layers)[0];
            const { sourceActorId, targetActorId } = testMultilayerNetwork.data.links[layerId][0];
            for (const invalidId of invalidIds) {
                expect(() => network.isLinkExists({ layerId: invalidId, sourceActorId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isLinkExists({ layerId, sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isLinkExists({ layerId, sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("getLinksCount", () => {
        it("ok", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(testMultilayerNetwork.data.links[layerId].length);
            }
        });
        it("ok - empty", () => {
            const network = createSchemaTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(0);
            }
        });
        it("ok - network is created by layers", () => {
            const network = new MultilayerNetwork();
            const partitionIds = ["AT1", "AT2"];
            for (const partitionId of partitionIds) {
                network.addPartition({ partitionId });
            }
            const layers = {
                "L1": { partitionsIds: "AT1" },
                "L2": { partitionsIds: "AT2" }
            };
            for (const layerId in layers) {
                network.addLayer({ layerId, ...layers[layerId] });
            }
            network.addActor({ actorId: "1", partitionId: "AT1" });
            network.addActor({ actorId: "2", partitionId: "AT1" });
            network.addLink({ layerId: "L1", sourceActorId: "1", targetActorId: "2" });
            expect(network.getLinksCount({ layerId: "L1" })).toBe(1);
            network.addActor({ actorId: "1", partitionId: "AT2" });
            network.addActor({ actorId: "2", partitionId: "AT2" });
            network.addLink({ layerId: "L2", sourceActorId: "1", targetActorId: "2" });
            expect(network.getLinksCount({ layerId: "L1" })).toBe(1);
        });
        it("error, when layer does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.not.schema.layers) {
                expect(() => network.getLinksCount({ layerId }))
                    .toThrow(NonExistingLayerError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const invalidId of invalidIds) {
                expect(() => network.getLinksCount({ layerId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("getLinkWeight", () => {
        it("ok", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { directed, partitionIds, weighted } = network.getLayerSchema({ layerId });
                if (weighted) {
                    for (const { sourceActorId, targetActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                        expect(network.getLinkWeight({ layerId, sourceActorId, targetActorId })).toBe(weight);
                    }
                }
                if (weighted && partitionIds.source == partitionIds.target && !directed) {
                    for (const { sourceActorId: targetActorId, targetActorId: sourceActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                        expect(network.getLinkWeight({ layerId, sourceActorId, targetActorId })).toBe(weight);
                    }
                }
            }
        });
        it("error, when layer is not weighted", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { weighted } = network.getLayerSchema({ layerId });
                if (!weighted) {
                    for (const { sourceActorId, targetActorId } of testMultilayerNetwork.data.links[layerId]) {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                            .toThrow(NonWeightedLayerError);
                    }
                }
            }
        });
        it("error, when link is not exists", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { weighted } = network.getLayerSchema({ layerId });
                if (weighted) {
                    for (const { sourceActorId, targetActorId } of testMultilayerNetwork.not.data.links[layerId]) {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                            .toThrow(NonExistingLinkError);
                    }
                }
            }
        });
        it("error, when one of link actors does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const layerId in testMultilayerNetwork.data.links) {
                const { partitionIds, weighted } = network.getLayerSchema({ layerId });
                const sourceActorId = testMultilayerNetwork.data.actors[partitionIds.source][0];
                const targetActorId = testMultilayerNetwork.data.actors[partitionIds.target][0];
                if (weighted) {
                    for (const sourceActorId of testMultilayerNetwork.not.data.actors[partitionIds.source]) {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                            .toThrow(NonExistingActorError);
                    }
                    for (const targetActorId of testMultilayerNetwork.not.data.actors[partitionIds.target]) {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                            .toThrow(NonExistingActorError);
                    }
                }
            }
        });
        it("error, when layer does not exist", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            const partitionId = testMultilayerNetwork.schema.partitions[0];
            const sourceActorId = testMultilayerNetwork.data.actors[partitionId][0];
            const targetActorId = testMultilayerNetwork.data.actors[partitionId][0];
            for (const layerId in testMultilayerNetwork.not.schema.layers) {
                expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                    .toThrow(NonExistingLayerError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            const layerId = Object.keys(testMultilayerNetwork.schema.layers)[0];
            const partitionId = testMultilayerNetwork.schema.partitions[0];
            const sourceActorId = testMultilayerNetwork.data.actors[partitionId][0];
            const targetActorId = testMultilayerNetwork.data.actors[partitionId][0];
            for (const invalidId of invalidIds) {
                expect(() => network.getLinkWeight({ layerId: invalidId, sourceActorId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.getLinkWeight({ layerId, sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("constructor", () => {
        it("ok", () => {
            let network;
            expect(() => network = new MultilayerNetwork({
                schema: testMultilayerNetwork.schema,
                data: testMultilayerNetwork.data
            })).not.toThrow();
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(testMultilayerNetwork.data.actors[partitionId].length);
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(testMultilayerNetwork.data.links[layerId].length);
            }
        });
        it("ok - schema only", () => {
            let network;
            expect(() => network = new MultilayerNetwork({
                schema: testMultilayerNetwork.schema
            })).not.toThrow();
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(0);
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(0);
            }
        });
        it("ok - actors only", () => {
            let network;
            expect(() => network = new MultilayerNetwork({
                schema: testMultilayerNetwork.schema,
                data: {
                    actors: testMultilayerNetwork.data.actors
                }
            })).not.toThrow();
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(testMultilayerNetwork.data.actors[partitionId].length);
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(0);
            }
        });
        it("ok - empty JSON", () => {
            let network;
            expect(() => network = new MultilayerNetwork({
                schema: testMultilayerNetwork.schema,
                data: {}
            })).not.toThrow();
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(0);
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(0);
            }
        });
        it("error, when one of link actors does not exist", () => {
            expect(() => new MultilayerNetwork({
                schema: testMultilayerNetwork.schema,
                data: {
                    actors: testMultilayerNetwork.data.actors,
                    links: {
                        "L1:AT1->AT1": [{
                                sourceActorId: "21",
                                targetActorId: "20"
                            }]
                    }
                }
            })).toThrow(NonExistingActorError);
            expect(() => new MultilayerNetwork({
                schema: testMultilayerNetwork.schema,
                data: {
                    actors: testMultilayerNetwork.data.actors,
                    links: {
                        "L1:AT1->AT1": [{
                                sourceActorId: "20",
                                targetActorId: "21"
                            }]
                    }
                }
            })).toThrow(NonExistingActorError);
        });
        it("error, when actor already exists", () => {
            expect(() => new MultilayerNetwork({
                schema: testMultilayerNetwork.schema,
                data: {
                    actors: {
                        "AT1": ["1", "1"]
                    }
                }
            })).toThrow(AlreadyExistingActorError);
        });
        it("error, when invalid IDs are passed", () => {
            const layerId = Object.keys(testMultilayerNetwork.schema.layers)[0];
            const { sourceActorId, targetActorId } = testMultilayerNetwork.data.links[layerId][0];
            for (const invalidId of invalidIds) {
                expect(() => new MultilayerNetwork({
                    schema: testMultilayerNetwork.schema,
                    data: {
                        actors: {
                            "AT1": [invalidId]
                        }
                    }
                })).toThrow(InvalidIdError);
                expect(() => new MultilayerNetwork({
                    schema: testMultilayerNetwork.schema,
                    data: {
                        actors: testMultilayerNetwork.data.actors,
                        links: {
                            [invalidId]: [{
                                    sourceActorId,
                                    targetActorId
                                }]
                        }
                    }
                })).toThrow(InvalidIdError);
                expect(() => new MultilayerNetwork({
                    schema: testMultilayerNetwork.schema,
                    data: {
                        actors: testMultilayerNetwork.data.actors,
                        links: {
                            "L1:AT1->AT1": [{
                                    sourceActorId: invalidId,
                                    targetActorId
                                }]
                        }
                    }
                })).toThrow(InvalidIdError);
                expect(() => new MultilayerNetwork({
                    schema: testMultilayerNetwork.schema,
                    data: {
                        actors: testMultilayerNetwork.data.actors,
                        links: {
                            "L1:AT1->AT1": [{
                                    sourceActorId,
                                    targetActorId: invalidId
                                }]
                        }
                    }
                })).toThrow(InvalidIdError);
            }
        });
    });
    describe("iterate", () => {
        it("check actors", () => {
            class TestMultilayerNetwork extends MultilayerNetwork {
                static iterate() {
                    const network = createActorsTestMultilayerNetwork(testMultilayerNetwork);
                    network.iterate({
                        callback: ({ actors }) => {
                            for (const partitionId in testMultilayerNetwork.data.actors) {
                                for (const actorId of testMultilayerNetwork.data.actors[partitionId]) {
                                    expect(actors.get(partitionId).has(actorId)).toBe(true);
                                }
                                for (const actorId of testMultilayerNetwork.not.data.actors[partitionId]) {
                                    expect(actors.get(partitionId).has(actorId)).toBe(false);
                                }
                                expect(actors.get(partitionId).size).toBe(testMultilayerNetwork.data.actors[partitionId].length);
                            }
                        }
                    });
                }
            }
            ;
            TestMultilayerNetwork.iterate();
        });
        it("check links", () => {
            class TestMultilayerNetwork extends MultilayerNetwork {
                static iterate() {
                    const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
                    network.iterate({
                        callback: ({ links }) => {
                            for (const layerId in testMultilayerNetwork.data.links) {
                                const { partitionIds, directed } = network.getLayerSchema({ layerId });
                                const layer = ((partitionIds.source == partitionIds.target && !directed) ?
                                    links.get(layerId)
                                    : (directed) ?
                                        links.get(layerId).out
                                        :
                                            links.get(layerId).source);
                                let linksCount = 0;
                                for (const { sourceActorId, targetActorId } of testMultilayerNetwork.data.links[layerId]) {
                                    expect(layer.get(sourceActorId).has(targetActorId)).toBe(true);
                                }
                                for (const [_, neighbours] of layer) {
                                    linksCount += neighbours.size;
                                }
                                if (partitionIds.source == partitionIds.target && !directed) {
                                    linksCount /= 2;
                                }
                                expect(linksCount).toBe(testMultilayerNetwork.data.links[layerId].length);
                            }
                            expect(links.size).toBe(Object.keys(testMultilayerNetwork.data.links).length);
                        }
                    });
                }
            }
            ;
            TestMultilayerNetwork.iterate();
        });
        it("getAdjacency", () => {
            class TestMultilayerNetwork extends MultilayerNetwork {
                static iterate() {
                    const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
                    network.iterate({
                        callback: ({ getAdjacency }) => {
                            for (const layerId in testMultilayerNetwork.data.links) {
                                expect(() => getAdjacency({ layerId })).not.toThrow();
                            }
                        }
                    });
                }
            }
            ;
            TestMultilayerNetwork.iterate();
        });
        it("weights", () => {
            class TestMultilayerNetwork extends MultilayerNetwork {
                static iterate() {
                    const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
                    network.iterate({
                        callback: ({ weights }) => {
                            for (const layerId in testMultilayerNetwork.data.links) {
                                for (const { sourceActorId, targetActorId, weight } of testMultilayerNetwork.data.links[layerId]) {
                                    if (testMultilayerNetwork.schema.layers[layerId].weighted) {
                                        expect(weights.get(layerId).get(sourceActorId).get(targetActorId)).toBe(weight);
                                    }
                                }
                            }
                        }
                    });
                }
            }
            ;
            TestMultilayerNetwork.iterate();
        });
        it("validators", () => {
            class TestMultilayerNetwork extends MultilayerNetwork {
                static iterate() {
                    const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
                    network.iterate({
                        callback: ({ validators }) => {
                            // validatePartitionIfExists & validatePartitionIfNotExists
                            for (const partitionId of testMultilayerNetwork.schema.partitions) {
                                expect(() => validators.schema.validatePartitionIfExists({ partitionId })).not.toThrow();
                                expect(() => validators.schema.validatePartitionIfNotExists({ partitionId }))
                                    .toThrow(AlreadyExistingPartitionError);
                            }
                            for (const partitionId of testMultilayerNetwork.not.schema.partitions) {
                                expect(() => validators.schema.validatePartitionIfNotExists({ partitionId })).not.toThrow();
                                expect(() => validators.schema.validatePartitionIfExists({ partitionId }))
                                    .toThrow(NonExistingPartitionError);
                            }
                            // validateLayerIfExists & validateLayerIfNotExists & validateLayerIfWeighted & validateLayerIfNotWeighted
                            for (const layerId in testMultilayerNetwork.schema.layers) {
                                expect(() => validators.schema.validateLayerIfExists({ layerId })).not.toThrow();
                                expect(() => validators.schema.validateLayerIfNotExists({ layerId }))
                                    .toThrow(AlreadyExistingLayerError);
                                const { weighted } = testMultilayerNetwork.schema.layers[layerId];
                                if (weighted) {
                                    expect(() => validators.schema.validateLayerIfWeighted({ layerId })).not.toThrow();
                                    expect(() => validators.schema.validateLayerIfNotWeighted({ layerId }))
                                        .toThrow(WeightedLayerError);
                                }
                                else {
                                    expect(() => validators.schema.validateLayerIfNotWeighted({ layerId })).not.toThrow();
                                    expect(() => validators.schema.validateLayerIfWeighted({ layerId }))
                                        .toThrow(NonWeightedLayerError);
                                }
                            }
                            for (const layerId in testMultilayerNetwork.not.schema) {
                                expect(() => validators.schema.validateLayerIfNotExists({ layerId })).not.toThrow();
                                expect(() => validators.schema.validateLayerIfExists({ layerId }))
                                    .toThrow(NonExistingLayerError);
                            }
                            // validateActorIfExists & validateActorIfNotExists
                            for (const partitionId in testMultilayerNetwork.data.actors) {
                                for (const actorId of testMultilayerNetwork.data.actors[partitionId]) {
                                    expect(() => validators.data.validateActorIfExists({ partitionId, actorId })).not.toThrow();
                                    expect(() => validators.data.validateActorIfNotExists({ partitionId, actorId }))
                                        .toThrow(AlreadyExistingActorError);
                                }
                            }
                            for (const partitionId in testMultilayerNetwork.data.actors) {
                                for (const actorId of testMultilayerNetwork.not.data.actors[partitionId]) {
                                    expect(() => validators.data.validateActorIfNotExists({ partitionId, actorId })).not.toThrow();
                                    expect(() => validators.data.validateActorIfExists({ partitionId, actorId }))
                                        .toThrow(NonExistingActorError);
                                }
                            }
                            // validateLinkIfExists & validateLinkIfNotExists
                            for (const layerId in testMultilayerNetwork.data.links) {
                                for (const link of testMultilayerNetwork.data.links[layerId]) {
                                    expect(() => validators.data.validateLinkIfExists({ layerId, ...link })).not.toThrow();
                                    expect(() => validators.data.validateLinkIfNotExists({ layerId, ...link }))
                                        .toThrow(AlreadyExistingLinkError);
                                }
                                for (const link of testMultilayerNetwork.not.data.links[layerId]) {
                                    expect(() => validators.data.validateLinkIfNotExists({ layerId, ...link })).not.toThrow();
                                    expect(() => validators.data.validateLinkIfExists({ layerId, ...link }))
                                        .toThrow(NonExistingLinkError);
                                }
                            }
                        }
                    });
                }
            }
            ;
            TestMultilayerNetwork.iterate();
        });
    });
    describe("more complex cases", () => {
        it("dynamically added actors and links", () => {
            const network = createFullTestMultilayerNetwork(testMultilayerNetwork);
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(testMultilayerNetwork.data.actors[partitionId].length);
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(testMultilayerNetwork.data.links[layerId].length);
            }
            network.addActor({ partitionId: "AT1", actorId: "21" });
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(testMultilayerNetwork.data.actors[partitionId].length + Number(partitionId == "AT1"));
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(testMultilayerNetwork.data.links[layerId].length);
            }
            for (const actorId of testMultilayerNetwork.data.actors["AT1"]) {
                network.addLink({ layerId: "L1:AT1->AT1", sourceActorId: "21", targetActorId: actorId, weight: 1 });
            }
            for (const partitionId in testMultilayerNetwork.data.actors) {
                expect(network.getActorsCount({ partitionId })).toBe(testMultilayerNetwork.data.actors[partitionId].length + Number(partitionId == "AT1"));
            }
            for (const layerId in testMultilayerNetwork.data.links) {
                expect(network.getLinksCount({ layerId })).toBe(testMultilayerNetwork.data.links[layerId].length + (layerId == "L1:AT1->AT1" ? 20 : 0));
            }
        });
    });
});
