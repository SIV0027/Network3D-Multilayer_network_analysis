import { expect, describe, it } from "vitest";

import {
    BipartiteNetwork,
    BipartiteAlreadyExistingLinkError,
    BipartiteAlreadyExistingActorError,
    BipartiteNonExistingActorError,
    BipartiteNonExistingLinkError
} from "@/core";

import {
    createActorsTestBipartiteNetwork,
    createFullTestBipartiteNetwork,
    createSchemaTestBipartiteNetwork,
    testBipartiteNetwork
} from "../testNetwork";
import {
    invalidIds
} from "../testNetwork/invalidId";
import { InvalidIdError } from "@/utilities/id/idErrors";

describe("BipartiteNetwork", () => {

    describe("isWeighted", () => {

        it("ok", () => {
            const network = createSchemaTestBipartiteNetwork(testBipartiteNetwork);

            expect(network.isWeighted()).toBe(testBipartiteNetwork.schema.weighted);
        });
    });

    describe("addSourceActor", () => {

        it("ok", () => {
            const network = createSchemaTestBipartiteNetwork(testBipartiteNetwork);

            for(const actorId of testBipartiteNetwork.data!.actors!.source!)
            {
                expect(() => network.addSourceActor({ actorId })).not.toThrow();
            }
        });

        it("error, when actor already exists", () => {
            const network = createActorsTestBipartiteNetwork(testBipartiteNetwork);

            for(const actorId of testBipartiteNetwork.data!.actors!.source!)
            {
                expect(() => network.addSourceActor({ actorId }))
                    .toThrow(BipartiteAlreadyExistingActorError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = new BipartiteNetwork();

            for(const invalidId of invalidIds)
            {
                expect(() => network.addSourceActor({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("addTargetActor", () => {

        it("ok", () => {
            const network = new BipartiteNetwork();

            for(const actorId of testBipartiteNetwork.data!.actors!.source!)
            {
                expect(() => network.addTargetActor({ actorId })).not.toThrow();
            }
        });

        it("error, when actor already exists", () => {
            const network = createActorsTestBipartiteNetwork(testBipartiteNetwork);

            for(const actorId of testBipartiteNetwork.data!.actors!.target!)
            {
                expect(() => network.addTargetActor({ actorId }))
                    .toThrow(BipartiteAlreadyExistingActorError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = new BipartiteNetwork();

            for(const invalidId of invalidIds)
            {
                expect(() => network.addTargetActor({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("addLink", () => {

        it("ok", () => {
            const network = createActorsTestBipartiteNetwork(testBipartiteNetwork);

            for(const { sourceActorId, targetActorId, weight } of testBipartiteNetwork.data!.links!)
            {
                expect(() => network.addLink({ sourceActorId, targetActorId, weight })).not.toThrow();
            }
        });

        it("error, when link already exists", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
                    
            for(const { sourceActorId, targetActorId, weight } of testBipartiteNetwork.data!.links!)
            {
                expect(() => network.addLink({ sourceActorId, targetActorId, weight }))
                    .toThrow(BipartiteAlreadyExistingLinkError);
            }
        });

        it("error, when (source || target) actor does not exist", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            const { sourceActorId, targetActorId } = testBipartiteNetwork.not!.links![0];
            for(const sourceActorId of testBipartiteNetwork.not!.actors!.source!)
            {
                expect(() => network.addLink({ sourceActorId, targetActorId }))
                            .toThrow(BipartiteNonExistingActorError);
            }

            for(const targetActorId of testBipartiteNetwork.not!.actors!.target!)
            {
                expect(() => network.addLink({ sourceActorId, targetActorId }))
                            .toThrow(BipartiteNonExistingActorError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);

            const { sourceActorId, targetActorId } = testBipartiteNetwork.data!.links![0];
            for(const invalidId of invalidIds)
            {
                expect(() => network.addLink({ sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.addLink({ sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getSourceActorsCount", () => {
        
        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            expect(network.getSourceActorsCount()).toBe(testBipartiteNetwork.data!.actors!.source!.length);
        });
        
        it("ok - empty", () => {
            const network = new BipartiteNetwork();
        
            expect(network.getSourceActorsCount()).toBe(0);
        });
    });

    describe("getTargetActorsCount", () => {
        
        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            expect(network.getTargetActorsCount()).toBe(testBipartiteNetwork.data!.actors!.target!.length);
        });
        
        it("ok - empty", () => {
            const network = new BipartiteNetwork();
        
            expect(network.getTargetActorsCount()).toBe(0);
        });
    });

    describe("getLinksCount", () => {

        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
            
            expect(network.getLinksCount()).toBe(testBipartiteNetwork.data!.links!.length);
        });

        it("ok - empty", () => {
            const network = new BipartiteNetwork();
        
            expect(network.getLinksCount()).toBe(0);
        });
    });

    describe("isSourceActorExists", () => {

        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            for(const actorId of testBipartiteNetwork.data!.actors!.source!)
            {
                expect(network.isSourceActorExists({ actorId })).toBe(true);
            }
        });

        it("not found", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            for(const actorId of testBipartiteNetwork.not!.actors!.source!)
            {
                expect(network.isSourceActorExists({ actorId })).toBe(false);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
            
            for(const invalidId of invalidIds)
            {
                expect(() => network.isSourceActorExists({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isTargetActorExists", () => {

        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            for(const actorId of testBipartiteNetwork.data!.actors!.target!)
            {
                expect(network.isTargetActorExists({ actorId })).toBe(true);
            }
        });

        it("not found", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            for(const actorId of testBipartiteNetwork.not!.actors!.target!)
            {
                expect(network.isTargetActorExists({ actorId })).toBe(false);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
            
            for(const invalidId of invalidIds)
            {
                expect(() => network.isTargetActorExists({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isLinkExists", () => {

        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
                    
            for(const { sourceActorId, targetActorId } of testBipartiteNetwork.data!.links!)
            {
                expect(network.isLinkExists({ sourceActorId, targetActorId })).toBe(true);
            }
        });

        it("not found", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
                    
            for(const { sourceActorId, targetActorId } of testBipartiteNetwork.not!.links!)
            {
                expect(network.isLinkExists({ sourceActorId, targetActorId })).toBe(false);
            }
        });
        
        it("error, when source actor does not exist", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            const targetActorId = testBipartiteNetwork.data!.actors!.target![0];
            for(const sourceActorId of testBipartiteNetwork.not!.actors!.source!)
            {                                    
                expect(() => network.isLinkExists({ sourceActorId, targetActorId }))
                    .toThrow(BipartiteNonExistingActorError);
            }
        });
      
        it("error, when target actor does not exist", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);

            const sourceActorId = testBipartiteNetwork.data!.actors!.source![0];
            for(const targetActorId of testBipartiteNetwork.not!.actors!.target!)
            {                                    
                expect(() => network.isLinkExists({ sourceActorId, targetActorId }))
                    .toThrow(BipartiteNonExistingActorError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);

            const { sourceActorId, targetActorId } = testBipartiteNetwork.data!.links![0];
            for(const invalidId of invalidIds)
            {
                expect(() => network.isLinkExists({ sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isLinkExists({ sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getLinkWeight", () => {
            
        it("ok", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
    
            for(const { sourceActorId, targetActorId, weight } of testBipartiteNetwork.data!.links!)
            {
                expect(network.getLinkWeight({ sourceActorId, targetActorId })).toBe(weight);
            }
        });
    
        it("error, when (source || target) actor does not exist", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
    
            const existingSourceActorId = testBipartiteNetwork.data!.actors!.source![0];
            for(const nonExistingTargetActorId of testBipartiteNetwork.not!.actors!.target!)
            {
                expect(() => network.getLinkWeight({ sourceActorId: existingSourceActorId, targetActorId: nonExistingTargetActorId }))
                    .toThrow(BipartiteNonExistingActorError);
            }

            const existingTargetActorId = testBipartiteNetwork.data!.actors!.target![0];
            for(const nonExistingSourceActorId of testBipartiteNetwork.not!.actors!.source!)
            {
                expect(() => network.getLinkWeight({ sourceActorId: nonExistingSourceActorId, targetActorId: existingTargetActorId }))
                    .toThrow(BipartiteNonExistingActorError);
            }
        });

        it("error, when link does not exist", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
        
            for(const { sourceActorId, targetActorId } of testBipartiteNetwork.not!.links!)
            {
                expect(() => network.getLinkWeight({ sourceActorId, targetActorId }))
                    .toThrow(BipartiteNonExistingLinkError);
            }
        });
    
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestBipartiteNetwork(testBipartiteNetwork);
    
            const { sourceActorId, targetActorId } = testBipartiteNetwork.data!.links![0];
            for(const invalidId of invalidIds)
            {
                expect(() => network.getLinkWeight({ sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.getLinkWeight({ sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("iterate", () => {

        it("check actors", () => {
            class TestBipartite extends BipartiteNetwork
            {
                public static iterate(): void
                {
                    const network: TestBipartite = createActorsTestBipartiteNetwork(testBipartiteNetwork);

                    network.iterate({
                        callback: ({ actors }) => {
                            for(const actorId of testBipartiteNetwork.data!.actors!.source!)
                            {
                                expect(actors.source.has(actorId)).toBe(true);
                            }
                            expect(actors.source.size).toBe(testBipartiteNetwork.data!.actors!.source!.length);

                            for(const actorId of testBipartiteNetwork.data!.actors!.target!)
                            {
                                expect(actors.target.has(actorId)).toBe(true);
                            }
                            expect(actors.target.size).toBe(testBipartiteNetwork.data!.actors!.target!.length);
                        }
                    });
                }
            };

            TestBipartite.iterate();
        });

        it("check links", () => {
            class TestBipartiteNetwork extends BipartiteNetwork
            {
                public static iterate(): void
                {
                    const network: TestBipartiteNetwork = createFullTestBipartiteNetwork(testBipartiteNetwork);

                    network.iterate({
                        callback: ({ links }) => {
                            for(const { sourceActorId, targetActorId } of testBipartiteNetwork.data!.links!)
                            {
                                expect(links.source.get(sourceActorId)!.has(targetActorId)).toBe(true);
                            }

                            let linksCount = 0;
                            for(const [_, neighbours] of links.source)
                            {
                                linksCount += neighbours.size;
                            }
                            expect(linksCount).toBe(testBipartiteNetwork.data!.links!.length);
                        }
                    });
                }
            };

            TestBipartiteNetwork.iterate();
        });

        it("weights", () => {
            class TestBipartiteNetwork extends BipartiteNetwork
            {
                public static iterate(): void
                {
                    const network: TestBipartiteNetwork = createFullTestBipartiteNetwork(testBipartiteNetwork);

                    network.iterate({
                        callback: ({ weights }) => {
                            for(const { sourceActorId, targetActorId, weight } of testBipartiteNetwork.data!.links!)
                            {
                                expect(weights.get(sourceActorId)!.get(targetActorId)).toBe(weight);
                            }
                        }
                    });
                }
            };

            TestBipartiteNetwork.iterate();
        });

        it("check validators", () => {
            class TestBipartiteNetwork extends BipartiteNetwork
            {
                public static iterate(): void
                {
                    const network: TestBipartiteNetwork = createFullTestBipartiteNetwork(testBipartiteNetwork);

                    network.iterate({
                        callback: ({ validators }) => {
                            // validateActorIfExists & validateActorIfNotExists
                            // source
                            for(const actorId of testBipartiteNetwork.data!.actors!.source!)
                            {
                                expect(() => validators.validateActorIfExists({ actorId })).not.toThrow();
                                expect(() => validators.validateActorIfNotExists({ actorId }))
                                    .toThrow(BipartiteAlreadyExistingActorError);
                            }
                            // target
                            for(const actorId of testBipartiteNetwork.data!.actors!.target!)
                            {
                                expect(() => validators.validateActorIfExists({ partition: "target", actorId })).not.toThrow();
                                expect(() => validators.validateActorIfNotExists({ partition: "target", actorId }))
                                    .toThrow(BipartiteAlreadyExistingActorError);
                            }
                            // source         
                            for(const actorId of testBipartiteNetwork.not!.actors!.source!)
                            {
                                expect(() => validators.validateActorIfNotExists({ actorId })).not.toThrow();
                                expect(() => validators.validateActorIfExists({ actorId }))
                                    .toThrow(BipartiteNonExistingActorError);
                            }
                            // target         
                            for(const actorId of testBipartiteNetwork.not!.actors!.target!)
                            {
                                expect(() => validators.validateActorIfNotExists({ partition: "target", actorId })).not.toThrow();
                                expect(() => validators.validateActorIfExists({ partition: "target", actorId }))
                                    .toThrow(BipartiteNonExistingActorError);
                            }
                            
                            // validateLinkIfExists & validateLinkIfNotExists
                            for(const link of testBipartiteNetwork.data!.links!)
                            {
                                expect(() => validators.validateLinkIfExists({ ...link })).not.toThrow();
                                expect(() => validators.validateLinkIfNotExists({ ...link }))
                                    .toThrow(BipartiteAlreadyExistingLinkError);
                            }
                                    
                            for(const link of testBipartiteNetwork.not!.links!)
                            {
                                expect(() => validators.validateLinkIfNotExists({ ...link })).not.toThrow();
                                expect(() => validators.validateLinkIfExists({ ...link }))
                                    .toThrow(BipartiteNonExistingLinkError);
                            }
                        }
                    });
                }
            };

            TestBipartiteNetwork.iterate();
        });
    });

    describe("constructor", () => {
        
        it("ok", () => {
            let network: BipartiteNetwork;
            expect(() => network = new BipartiteNetwork(testBipartiteNetwork)).not.toThrow();
        
            expect(network!.getSourceActorsCount()).toBe(testBipartiteNetwork.data!.actors!.source!.length);
            expect(network!.getTargetActorsCount()).toBe(testBipartiteNetwork.data!.actors!.target!.length);
            expect(network!.getLinksCount()).toBe(testBipartiteNetwork.data!.links!.length);
        });
        
        it("ok - schema only", () => {
            let network: BipartiteNetwork;
            expect(() => network = new BipartiteNetwork({ schema: testBipartiteNetwork.schema })).not.toThrow();
        
            expect(network!.getSourceActorsCount()).toBe(0);
            expect(network!.getTargetActorsCount()).toBe(0);
            expect(network!.getLinksCount()).toBe(0);
        });
        
        it("ok - actors only", () => {
            let network: BipartiteNetwork;
            expect(() => network = new BipartiteNetwork({
                data: {
                    actors: testBipartiteNetwork.data!.actors
                }
            })).not.toThrow();
        
            expect(network!.getSourceActorsCount()).toBe(testBipartiteNetwork.data!.actors!.source!.length);
            expect(network!.getTargetActorsCount()).toBe(testBipartiteNetwork.data!.actors!.target!.length);
            expect(network!.getLinksCount()).toBe(0);
        });
        
        it("ok - empty JSON", () => {
            let network: BipartiteNetwork;
            expect(() => network = new BipartiteNetwork({ })).not.toThrow();

            expect(network!.getSourceActorsCount()).toBe(0);
            expect(network!.getTargetActorsCount()).toBe(0);
            expect(network!.getLinksCount()).toBe(0);
        });
        
        it("error, when (source || target) actor does not exist", () => {
            const sourceActorId = testBipartiteNetwork.data!.actors!.source![0];
            const targetActorId = testBipartiteNetwork.data!.actors!.target![0];
            for(const sourceActorId of testBipartiteNetwork.not!.actors!.source!)
            {
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: testBipartiteNetwork.data!.actors,
                        links: [{ sourceActorId, targetActorId }]
                    }
                })).toThrow(BipartiteNonExistingActorError);
            }

            for(const targetActorId of testBipartiteNetwork.not!.actors!.target!)
            {
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: testBipartiteNetwork.data!.actors,
                        links: [{ sourceActorId, targetActorId }]
                    }
                })).toThrow(BipartiteNonExistingActorError);
            }
        });

        it("error, when actor already exists", () => {
            for(const sourceActorId of testBipartiteNetwork.not!.actors!.source!)
            {
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: {
                            source: [sourceActorId, sourceActorId]
                        }
                    }
                })).toThrow(BipartiteAlreadyExistingActorError);
            }

            for(const targetActorId of testBipartiteNetwork.not!.actors!.target!)
            {
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: {
                            target: [targetActorId, targetActorId]
                        }
                    }
                })).toThrow(BipartiteAlreadyExistingActorError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            for(const invalidId of invalidIds)
            {
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: {
                            source: [invalidId]
                        }
                    }
                })).toThrow(InvalidIdError);

                expect(() => new BipartiteNetwork({
                    data: {
                        actors: {
                            target: [invalidId]
                        }
                    }
                })).toThrow(InvalidIdError);
                    
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: testBipartiteNetwork.data!.actors,
                        links: [{
                            sourceActorId: invalidId,
                            targetActorId: testBipartiteNetwork.data!.actors!.target![0]
                        }]
                    }
                })).toThrow(InvalidIdError);
                    
                expect(() => new BipartiteNetwork({
                    data: {
                        actors: testBipartiteNetwork.data!.actors,
                        links: [{
                            sourceActorId: testBipartiteNetwork.data!.actors!.target![0],
                            targetActorId: invalidId
                        }]
                    }
                })).toThrow(InvalidIdError);
            }
        });
    });
});