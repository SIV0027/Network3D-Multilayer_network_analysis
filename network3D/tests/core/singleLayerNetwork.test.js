import { expect, describe, it } from "vitest";
import { SingleLayerAlreadyExistingActorError, SingleLayerAlreadyExistingLinkError, SingleLayerNetwork, SingleLayerNonExistingActorError, SingleLayerNonExistingLinkError, SingleLayerNonWeightedLayerError, SingleLayerWeightedLayerError } from "@/core";
import { testSingleLayerNetwork, createActorsTestSingleLayerNetwork, createSchemaTestSingleLayerNetwork, createFullTestSingleLayerNetwork } from "../testNetwork";
import { invalidIds } from "../testNetwork/invalidId";
import { InvalidIdError } from "@/utilities/id/idErrors";
describe("SingleLayerNetwork", () => {
    describe("getSchema", () => {
        it("ok", () => {
            const network = createSchemaTestSingleLayerNetwork(testSingleLayerNetwork);
            expect(network.getSchema()).toStrictEqual(testSingleLayerNetwork.schema);
        });
    });
    describe("addActor", () => {
        it("ok", () => {
            const network = createSchemaTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const actorId of testSingleLayerNetwork.data.actors) {
                expect(() => network.addActor({ actorId })).not.toThrow();
            }
        });
        it("error, when actor already exists", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const actorId of testSingleLayerNetwork.data.actors) {
                expect(() => network.addActor({ actorId }))
                    .toThrow(SingleLayerAlreadyExistingActorError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createSchemaTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const invalidId of invalidIds) {
                expect(() => network.addActor({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("addLink", () => {
        it("ok", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId, weight } of testSingleLayerNetwork.data.links) {
                expect(() => network.addLink({ sourceActorId, targetActorId, weight })).not.toThrow();
            }
        });
        it("error, when link already exists", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId, weight } of testSingleLayerNetwork.data.links) {
                expect(() => network.addLink({ sourceActorId, targetActorId, weight }))
                    .toThrow(SingleLayerAlreadyExistingLinkError);
            }
        });
        it("error, when (source || target) actor does not exist", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            const actorId = testSingleLayerNetwork.data.actors[0];
            for (const nonExistingActorId of testSingleLayerNetwork.not.actors) {
                expect(() => network.addLink({ sourceActorId: nonExistingActorId, targetActorId: actorId }))
                    .toThrow(SingleLayerNonExistingActorError);
                expect(() => network.addLink({ sourceActorId: actorId, targetActorId: nonExistingActorId }))
                    .toThrow(SingleLayerNonExistingActorError);
            }
        });
        it("error, when weight is not given to weighted network & et vica versa", () => {
            const weigtedNetwork = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            const nonWeigtedNetwork = createActorsTestSingleLayerNetwork({ schema: { directed: true, weighted: false }, data: testSingleLayerNetwork.data });
            for (const { sourceActorId, targetActorId, weight } of testSingleLayerNetwork.data.links) {
                expect(() => weigtedNetwork.addLink({ sourceActorId, targetActorId }))
                    .toThrow(SingleLayerWeightedLayerError);
                expect(() => nonWeigtedNetwork.addLink({ sourceActorId, targetActorId, weight }))
                    .toThrow(SingleLayerNonWeightedLayerError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            const { sourceActorId, targetActorId, weight } = testSingleLayerNetwork.data.links[0];
            for (const invalidId of invalidIds) {
                expect(() => network.addLink({ sourceActorId: invalidId, targetActorId, weight }))
                    .toThrow(InvalidIdError);
                expect(() => network.addLink({ sourceActorId, targetActorId: invalidId, weight }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("getActorsCount", () => {
        it("ok", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            expect(network.getActorsCount()).toBe(testSingleLayerNetwork.data.actors.length);
        });
        it("ok - empty", () => {
            const network = createSchemaTestSingleLayerNetwork(testSingleLayerNetwork);
            expect(network.getActorsCount()).toBe(0);
        });
    });
    describe("getLinksCount", () => {
        it("ok", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            expect(network.getLinksCount()).toBe(testSingleLayerNetwork.data.links.length);
        });
        it("ok - empty", () => {
            const network = createSchemaTestSingleLayerNetwork(testSingleLayerNetwork);
            expect(network.getLinksCount()).toBe(0);
        });
    });
    describe("isActorExists", () => {
        it("ok", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const actorId of testSingleLayerNetwork.data.actors) {
                expect(network.isActorExists({ actorId })).toBe(true);
            }
        });
        it("not found", () => {
            const network = createActorsTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const actorId of testSingleLayerNetwork.not.actors) {
                expect(network.isActorExists({ actorId })).toBe(false);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const invalidId of invalidIds) {
                expect(() => network.isActorExists({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("isLinkExists", () => {
        it("ok", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId } of testSingleLayerNetwork.data.links) {
                expect(network.isLinkExists({ sourceActorId, targetActorId })).toBe(true);
            }
        });
        it("not found", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId } of testSingleLayerNetwork.not.links) {
                expect(network.isLinkExists({ sourceActorId, targetActorId })).toBe(false);
            }
        });
        it("error, when (source || target) actor does not exist", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            const existsActor = testSingleLayerNetwork.data.actors[0];
            for (const nonExistsActor of testSingleLayerNetwork.not.actors) {
                expect(() => network.isLinkExists({ sourceActorId: existsActor, targetActorId: nonExistsActor }))
                    .toThrow(SingleLayerNonExistingActorError);
                expect(() => network.isLinkExists({ sourceActorId: nonExistsActor, targetActorId: existsActor }))
                    .toThrow(SingleLayerNonExistingActorError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            const { sourceActorId, targetActorId } = testSingleLayerNetwork.data.links[0];
            for (const invalidId of invalidIds) {
                expect(() => network.isLinkExists({ sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isLinkExists({ sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("getLinkWeight", () => {
        it("ok", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId, weight } of testSingleLayerNetwork.data.links) {
                expect(network.getLinkWeight({ sourceActorId, targetActorId })).toBe(weight);
            }
        });
        it("error, when (source || target) actor does not exist", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            const existingActorId = testSingleLayerNetwork.data.actors[0];
            for (const nonExistingActorId of testSingleLayerNetwork.not.actors) {
                expect(() => network.getLinkWeight({ sourceActorId: existingActorId, targetActorId: nonExistingActorId }))
                    .toThrow(SingleLayerNonExistingActorError);
                expect(() => network.getLinkWeight({ sourceActorId: nonExistingActorId, targetActorId: existingActorId }))
                    .toThrow(SingleLayerNonExistingActorError);
            }
        });
        it("error, when link does not exist", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId } of testSingleLayerNetwork.not.links) {
                expect(() => network.getLinkWeight({ sourceActorId, targetActorId }))
                    .toThrow(SingleLayerNonExistingLinkError);
            }
        });
        it("error, when link does not exist - complement to undirected network", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            for (const { sourceActorId, targetActorId } of testSingleLayerNetwork.data.links) {
                expect(() => network.getLinkWeight({ sourceActorId: targetActorId, targetActorId: sourceActorId }))
                    .toThrow(SingleLayerNonExistingLinkError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
            const { sourceActorId, targetActorId } = testSingleLayerNetwork.data.links[0];
            for (const invalidId of invalidIds) {
                expect(() => network.getLinkWeight({ sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.getLinkWeight({ sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });
    describe("iterate", () => {
        it("check actors", () => {
            class TestSingleLayerNetwork extends SingleLayerNetwork {
                static iterate() {
                    const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
                    network.iterate({
                        callback: ({ actors }) => {
                            for (const actorId of testSingleLayerNetwork.data.actors) {
                                expect(actors.has(actorId)).toBe(true);
                            }
                            expect(actors.size).toBe(testSingleLayerNetwork.data.actors.length);
                        }
                    });
                }
            }
            ;
            TestSingleLayerNetwork.iterate();
        });
        it("check links", () => {
            class TestSingleLayerNetwork extends SingleLayerNetwork {
                static iterate() {
                    const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
                    network.iterate({
                        callback: ({ links }) => {
                            for (const { sourceActorId, targetActorId } of testSingleLayerNetwork.data.links) {
                                expect(links.out.get(sourceActorId).has(targetActorId)).toBe(true);
                            }
                            let linksCount = 0;
                            for (const [_, neighbours] of links.out) {
                                linksCount += neighbours.size;
                            }
                            expect(linksCount).toBe(testSingleLayerNetwork.data.links.length);
                        }
                    });
                }
            }
            ;
            TestSingleLayerNetwork.iterate();
        });
        it("weights", () => {
            class TestSingleLayerNetwork extends SingleLayerNetwork {
                static iterate() {
                    const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
                    network.iterate({
                        callback: ({ weights }) => {
                            for (const { sourceActorId, targetActorId, weight } of testSingleLayerNetwork.data.links) {
                                expect(weights.get(sourceActorId).get(targetActorId)).toBe(weight);
                            }
                        }
                    });
                }
            }
            ;
            TestSingleLayerNetwork.iterate();
        });
        it("validators", () => {
            class TestSingleLayerNetwork extends SingleLayerNetwork {
                static iterate() {
                    const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);
                    network.iterate({
                        callback: ({ validators }) => {
                            // validateActorIfExists & validateActorIfNotExists
                            for (const actorId of testSingleLayerNetwork.data.actors) {
                                expect(() => validators.validateActorIfExists({ actorId })).not.toThrow();
                                expect(() => validators.validateActorIfNotExists({ actorId }))
                                    .toThrow(SingleLayerAlreadyExistingActorError);
                            }
                            for (const actorId of testSingleLayerNetwork.not.actors) {
                                expect(() => validators.validateActorIfNotExists({ actorId })).not.toThrow();
                                expect(() => validators.validateActorIfExists({ actorId }))
                                    .toThrow(SingleLayerNonExistingActorError);
                            }
                            // validateLinkIfExists & validateLinkIfNotExists
                            for (const link of testSingleLayerNetwork.data.links) {
                                expect(() => validators.validateLinkIfExists({ ...link })).not.toThrow();
                                expect(() => validators.validateLinkIfNotExists({ ...link }))
                                    .toThrow(SingleLayerAlreadyExistingLinkError);
                            }
                            for (const link of testSingleLayerNetwork.not.links) {
                                expect(() => validators.validateLinkIfNotExists({ ...link })).not.toThrow();
                                expect(() => validators.validateLinkIfExists({ ...link }))
                                    .toThrow(SingleLayerNonExistingLinkError);
                            }
                        }
                    });
                }
            }
            ;
            TestSingleLayerNetwork.iterate();
        });
    });
    describe("constructor", () => {
        it("ok", () => {
            let network;
            expect(() => network = new SingleLayerNetwork(testSingleLayerNetwork)).not.toThrow();
            expect(network.getActorsCount()).toBe(testSingleLayerNetwork.data.actors.length);
            expect(network.getLinksCount()).toBe(testSingleLayerNetwork.data.links.length);
        });
        it("ok - schema only", () => {
            let network;
            expect(() => network = new SingleLayerNetwork({ schema: testSingleLayerNetwork.schema })).not.toThrow();
            expect(network.getActorsCount()).toBe(0);
            expect(network.getLinksCount()).toBe(0);
        });
        it("ok - actors only", () => {
            let network;
            expect(() => network = new SingleLayerNetwork({
                schema: testSingleLayerNetwork.schema,
                data: {
                    actors: testSingleLayerNetwork.data.actors
                }
            })).not.toThrow();
            expect(network.getActorsCount()).toBe(testSingleLayerNetwork.data.actors.length);
            expect(network.getLinksCount()).toBe(0);
        });
        it("ok - empty JSON", () => {
            let network;
            expect(() => network = new SingleLayerNetwork({})).not.toThrow();
            expect(network.getActorsCount()).toBe(0);
            expect(network.getLinksCount()).toBe(0);
        });
        it("error, when (source || target) actor does not exist", () => {
            const existingActorId = testSingleLayerNetwork.data.actors[0];
            for (const nonExistingActorId of testSingleLayerNetwork.not.actors) {
                expect(() => new SingleLayerNetwork({
                    data: {
                        actors: testSingleLayerNetwork.data.actors,
                        links: [{
                                sourceActorId: nonExistingActorId,
                                targetActorId: existingActorId
                            }]
                    }
                })).toThrow(SingleLayerNonExistingActorError);
                expect(() => new SingleLayerNetwork({
                    data: {
                        actors: testSingleLayerNetwork.data.actors,
                        links: [{
                                sourceActorId: existingActorId,
                                targetActorId: nonExistingActorId
                            }]
                    }
                })).toThrow(SingleLayerNonExistingActorError);
            }
        });
        it("error, when actor already exists", () => {
            for (const actorId of testSingleLayerNetwork.data.actors) {
                expect(() => new SingleLayerNetwork({
                    data: {
                        actors: [actorId, actorId]
                    }
                })).toThrow(SingleLayerAlreadyExistingActorError);
            }
        });
        it("error, when invalid IDs are passed", () => {
            for (const invalidId of invalidIds) {
                expect(() => new SingleLayerNetwork({
                    data: {
                        actors: [invalidId]
                    }
                })).toThrow(InvalidIdError);
                expect(() => new SingleLayerNetwork({
                    data: {
                        actors: testSingleLayerNetwork.data.actors,
                        links: [{
                                sourceActorId: invalidId,
                                targetActorId: testSingleLayerNetwork.data.actors[0]
                            }]
                    }
                })).toThrow(InvalidIdError);
                expect(() => new SingleLayerNetwork({
                    data: {
                        actors: testSingleLayerNetwork.data.actors,
                        links: [{
                                sourceActorId: testSingleLayerNetwork.data.actors[0],
                                targetActorId: invalidId
                            }]
                    }
                })).toThrow(InvalidIdError);
            }
        });
    });
});
