import {
    expect,
    describe,
    it
} from "vitest";

import {
    type MultiplexLayerSchema,
    type ReadonlyAdjacency,

    MultiplexAlreadyExistingActorError,
    MultiplexAlreadyExistingLayerError,
    MultiplexAlreadyExistingLinkError,
    MultiplexNetwork,
    MultiplexNonExistingActorError,
    MultiplexNonExistingLayerError,
    MultiplexNonExistingLinkError,
    MultiplexNonWeightedLayerError,
    MultiplexWeightedLayerError
} from "@/core";

import {
    createSchemaTestMultiplexNetwork,
    createActorsTestMultiplexNetwork,
    createFullTestMultiplexNetwork,
    testMultiplexNetwork
} from "../testNetwork";
import {
    invalidIds
} from "../testNetwork/invalidId";
import { InvalidIdError } from "@/utilities/id/idErrors";

describe("MultiplexNetwork", () => {

    describe("addLayer", () => {

        it("ok", () => {
            const network = new MultiplexNetwork();

            for(const layerId in testMultiplexNetwork!.schema)
            {
                expect(() => {
                    if(!(testMultiplexNetwork?.schema instanceof Array) && testMultiplexNetwork?.schema !== undefined)
                    {
                        network.addLayer({ layerId, ...testMultiplexNetwork!.schema![layerId] });
                    }
                }).not.toThrow();
            }
        });

        it("error, when layer (it's ID) already exists", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);

            if(!(testMultiplexNetwork?.schema instanceof Array) && testMultiplexNetwork?.schema !== undefined)
            {
                for(const layerId in testMultiplexNetwork!.schema)
                {
                    expect(() => network.addLayer({ layerId }))
                        .toThrow(MultiplexAlreadyExistingLayerError);
                }
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = new MultiplexNetwork();

            for(const invalidId of invalidIds)
            {
                expect(() => network.addLayer({ layerId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("addActor", () => {

        it("ok", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);

            for(const actorId of testMultiplexNetwork.data!.actors)
            {
                expect(() => network.addActor({ actorId })).not.toThrow();
            }
        });

        it("error, when actor already exists", () => {
            const network = createActorsTestMultiplexNetwork(testMultiplexNetwork);

            for(const actorId of testMultiplexNetwork.data!.actors)
            {
                expect(() => network.addActor({ actorId }))
                    .toThrow(MultiplexAlreadyExistingActorError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = new MultiplexNetwork();

            for(const invalidId of invalidIds)
            {
                expect(() => network.addActor({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("addLink", () => {

        it("ok", () => {
            const network = createActorsTestMultiplexNetwork(testMultiplexNetwork);

            for(const layerId in testMultiplexNetwork.data!.links)
            {
                for(const { sourceActorId, targetActorId, weight } of testMultiplexNetwork.data!.links[layerId])
                {
                    expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight })).not.toThrow();
                }
            }
        });

        it("error, when link already exists", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
                    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                for(const { sourceActorId, targetActorId, weight } of testMultiplexNetwork.data!.links[layerId])
                {
                    expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight }))
                        .toThrow(MultiplexAlreadyExistingLinkError);
                }
            }
        });
        
        it("error, when layer does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            const sourceActorId = testMultiplexNetwork.data!.actors[0];
            const targetActorId = testMultiplexNetwork.data!.actors[1];
            for(const layerId in testMultiplexNetwork.not!.schema!)
            {
                expect(() => network.addLink({ layerId, sourceActorId, targetActorId }))
                    .toThrow(MultiplexNonExistingLayerError);
            }
        });
                
        it("error, when (source || target) actor does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];
            const actorId = testMultiplexNetwork.data!.actors[0];
            for(const nonExistingActorId of testMultiplexNetwork.not!.data!.actors)
            {
                expect(() => network.addLink({ layerId, sourceActorId: nonExistingActorId, targetActorId: actorId }))
                    .toThrow(MultiplexNonExistingActorError);
                expect(() => network.addLink({ layerId, sourceActorId: actorId, targetActorId: nonExistingActorId }))
                    .toThrow(MultiplexNonExistingActorError);
            }
        });

        it("error, when layer is not weighted", () => {
            const network = createActorsTestMultiplexNetwork(testMultiplexNetwork);

            for(const layerId in testMultiplexNetwork.data!.links)
            {
                const { weighted } = network.getLayerSchema({ layerId });
                if(!weighted)
                {
                    let i = -5;
                    for(const { sourceActorId, targetActorId } of testMultiplexNetwork.data!.links[layerId])
                    {
                        expect(() => network.addLink({ layerId, sourceActorId, targetActorId, weight: i++ }))
                            .toThrow(MultiplexNonWeightedLayerError);
                    } 
                }
            }
        });

        it("error, when layer is weighted", () => {
            const network = createActorsTestMultiplexNetwork(testMultiplexNetwork);

            for(const layerId in testMultiplexNetwork.data!.links)
            {
                const { weighted } = network.getLayerSchema({ layerId });
                if(weighted)
                {
                    for(const { sourceActorId, targetActorId } of testMultiplexNetwork.data!.links[layerId])
                    {
                        expect(() => network.addLink({ layerId, sourceActorId, targetActorId }))
                            .toThrow(MultiplexWeightedLayerError);
                    } 
                }
            }
        });
        
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
                    
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];
            const { sourceActorId, targetActorId } = testMultiplexNetwork.data!.links[layerId][0];
            for(const invalidId of invalidIds)
            {
                expect(() => network.addLink({ layerId: invalidId, sourceActorId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.addLink({ layerId, sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.addLink({ layerId, sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getActorsCount", () => {

        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            expect(network.getActorsCount()).toBe(testMultiplexNetwork.data!.actors.length);
        });
        
        it("ok - empty", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);
        
            expect(network.getActorsCount()).toBe(0);
        });
    });

    describe("getLayersCount", () => {

        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            expect(network.getLayersCount()).toBe(Object.keys(testMultiplexNetwork.schema!).length);
        });
        
        it("ok - empty", () => {
            const network = new MultiplexNetwork();
        
            expect(network.getLayersCount()).toBe(0);
        });
    });

    describe("getLayerSchema", () => {

        it("ok", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);

            for(const layerId in testMultiplexNetwork.schema)
            {
                const schema = (testMultiplexNetwork.schema as any)[layerId] as MultiplexLayerSchema;
                expect(network.getLayerSchema({ layerId })).toStrictEqual({ directed: schema.directed ?? false, weighted: schema.weighted ?? false });
            }
        });

        it("error, when layer does not exist", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);

            for(const layerId in testMultiplexNetwork.not!.schema)
            {
                expect(() => network.getLayerSchema({ layerId }))
                    .toThrow(MultiplexNonExistingLayerError);
            }
        });

        it("error, when invalid IDs are passed", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);

            for(const invalid of invalidIds)
            {
                expect(() => network.getLayerSchema({ layerId: invalid }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getLayersList", () => {

        it("ok", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);

            expect(network.getLayersList()).toStrictEqual(Object.keys(testMultiplexNetwork.schema!));
        });
        
        it("ok - empty", () => {
            const network = new MultiplexNetwork();
        
            expect(network.getLayersList()).toStrictEqual([]);
        });
    });

    describe("getLinksCount", () => {

        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                expect(network.getLinksCount({ layerId })).toBe(testMultiplexNetwork.data!.links[layerId].length);
            }
        });
                
        it("ok - empty", () => {
            const network = createSchemaTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                expect(network.getLinksCount({ layerId })).toBe(0);
            }
        });
        
        it("error, when layer does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const layerId in testMultiplexNetwork.not!.schema!)
            {
                expect(() => network.getLinksCount({ layerId }))
                    .toThrow(MultiplexNonExistingLayerError);
            }
        });
        
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const invalidId of invalidIds)
            {
                expect(() => network.getLinksCount({ layerId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("getLinkWeight", () => {
    
        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                const { weighted } = network.getLayerSchema({ layerId });
                if(weighted)
                {
                    for(const { sourceActorId, targetActorId, weight } of testMultiplexNetwork.data!.links[layerId])
                    {
                        expect(network.getLinkWeight({ layerId, sourceActorId, targetActorId })).toBe(weight);
                    }
                }
            }
        });
    
        it("error, when layer is not weighted", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                const { weighted } = network.getLayerSchema({ layerId });
                if(!weighted)
                {
                    for(const { sourceActorId, targetActorId } of testMultiplexNetwork.data!.links[layerId])
                    {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                            .toThrow(MultiplexNonWeightedLayerError);
                    }
                }
            }
        });
    
        it("error, when link is not exists", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                const { weighted, directed } = network.getLayerSchema({ layerId });
                if(weighted)
                {
                    for(const { sourceActorId, targetActorId } of testMultiplexNetwork.not!.data!.links[layerId])
                    {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                            .toThrow(MultiplexNonExistingLinkError);
                    }

                    // complement to undirected network (symmetric closure)
                    if(directed)
                    {
                        for(const { sourceActorId: targetActorId, targetActorId: sourceActorId } of testMultiplexNetwork.data!.links[layerId])
                        {
                            expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                                .toThrow(MultiplexNonExistingLinkError);
                        }
                    }
                }
            }
        });
    
        it("error, when one of link actors does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                const { weighted } = network.getLayerSchema({ layerId });
                const existingActorId = testMultiplexNetwork.data!.actors[0];
                if(weighted)
                {
                    for(const nonExistingActorId of testMultiplexNetwork.not!.data!.actors)
                    {
                        expect(() => network.getLinkWeight({ layerId, sourceActorId: existingActorId, targetActorId: nonExistingActorId }))
                            .toThrow(MultiplexNonExistingActorError);
                        expect(() => network.getLinkWeight({ layerId, sourceActorId: nonExistingActorId, targetActorId: existingActorId }))
                            .toThrow(MultiplexNonExistingActorError);
                    }
                }
            }
        });
    
        it("error, when layer does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
    
            const sourceActorId = testMultiplexNetwork.data!.actors[0];
            const targetActorId = testMultiplexNetwork.data!.actors[1];
            for(const layerId in testMultiplexNetwork.not!.schema!)
            {
                expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId }))
                    .toThrow(MultiplexNonExistingLayerError);
            }
        });
    
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
    
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];
            const sourceActorId = testMultiplexNetwork.data!.actors[0];
            const targetActorId = testMultiplexNetwork.data!.actors[1];
            for(const invalidId of invalidIds)
            {
                expect(() => network.getLinkWeight({ layerId: invalidId, sourceActorId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.getLinkWeight({ layerId, sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.getLinkWeight({ layerId, sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isActorExists", () => {

        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const actorId of testMultiplexNetwork.data!.actors)
            {
                expect(network.isActorExists({ actorId })).toBe(true);
            }
        });

        it("not found", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const actorId of testMultiplexNetwork.not!.data!.actors)
            {
                expect(network.isActorExists({ actorId })).toBe(false);
            }
        });
        
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
            
            for(const invalidId of invalidIds)
            {
                expect(() => network.isActorExists({ actorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isLayerExists", () => {

        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const layerId in testMultiplexNetwork.schema!)
            {
                expect(network.isLayerExists({ layerId })).toBe(true);
            }
        });
                
        it("not found", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const layerId in testMultiplexNetwork.not!.schema!)
            {
                expect(network.isLayerExists({ layerId })).toBe(false);
            }
        });
        
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            for(const invalidId of invalidIds)
            {
                expect(() => network.isLayerExists({ layerId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("isLinkExists", () => {

        it("ok", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
                    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                for(const { sourceActorId, targetActorId } of testMultiplexNetwork.data!.links[layerId])
                {
                    expect(network.isLinkExists({ layerId, sourceActorId, targetActorId })).toBe(true);
                }
            }
        });
        
        it("not found", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
                    
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                for(const { sourceActorId, targetActorId } of testMultiplexNetwork.not!.data!.links[layerId])
                {
                    expect(network.isLinkExists({ layerId, sourceActorId, targetActorId })).toBe(false);
                }
            }
        });
                
        it("error, when layer does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            const sourceActorId = testMultiplexNetwork.data!.actors[0];
            const targetActorId = testMultiplexNetwork.data!.actors[1];
            for(const layerId in testMultiplexNetwork.not!.schema!)
            {
                expect(() => network.isLinkExists({ layerId, sourceActorId, targetActorId }))
                    .toThrow(MultiplexNonExistingLayerError);
            }
        });
        
        it("error, when (source || target) actor does not exist", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
        
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];
            const existingActorId = testMultiplexNetwork.data!.actors[0];
            for(const nonExistingActorId of testMultiplexNetwork.not!.data!.actors)
            {                                    
                expect(() => network.isLinkExists({ layerId, sourceActorId: existingActorId, targetActorId: nonExistingActorId }))
                    .toThrow(MultiplexNonExistingActorError);
                expect(() => network.isLinkExists({ layerId, sourceActorId: nonExistingActorId, targetActorId: existingActorId }))
                    .toThrow(MultiplexNonExistingActorError);
            }
        });
        
        it("error, when invalid IDs are passed", () => {
            const network = createFullTestMultiplexNetwork(testMultiplexNetwork);
                    
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];
            const { sourceActorId, targetActorId } = testMultiplexNetwork.data!.links[layerId][0];
            for(const invalidId of invalidIds)
            {
                expect(() => network.isLinkExists({ layerId: invalidId, sourceActorId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isLinkExists({ layerId, sourceActorId: invalidId, targetActorId }))
                    .toThrow(InvalidIdError);
                expect(() => network.isLinkExists({ layerId, sourceActorId, targetActorId: invalidId }))
                    .toThrow(InvalidIdError);
            }
        });
    });

    describe("iterate", () => {

        it("check actors", () => {
            class TestMultiplexNetwork extends MultiplexNetwork
            {
                public static iterate(): void
                {
                    const network: TestMultiplexNetwork = createActorsTestMultiplexNetwork(testMultiplexNetwork);

                    network.iterate({
                        callback: ({ actors }) => {
                            for(const actorId of testMultiplexNetwork.data!.actors)
                            {
                                expect(actors.has(actorId)).toBe(true);
                            }

                            expect(actors.size).toBe(testMultiplexNetwork.data!.actors.length);
                        }
                    });
                }
            };

            TestMultiplexNetwork.iterate();
        });

        it("check links", () => {
            class TestMultiplexNetwork extends MultiplexNetwork
            {
                public static iterate(): void
                {
                    const network: TestMultiplexNetwork = createFullTestMultiplexNetwork(testMultiplexNetwork);

                    network.iterate({
                        callback: ({ links }) => {
                            for(const layerId in testMultiplexNetwork.data!.links)
                            {
                                const nonSpecificLayer = links.get(layerId);
                                const layer = (nonSpecificLayer instanceof Map
                                            ? links.get(layerId)
                                            : (
                                                ((nonSpecificLayer as any).in !== undefined)
                                                ? (nonSpecificLayer as any).out
                                                : (nonSpecificLayer as any).source
                                              )) as ReadonlyAdjacency;
                                
                                let linksCount = 0;
                                for(const { sourceActorId, targetActorId } of testMultiplexNetwork.data!.links[layerId])
                                {
                                    expect(layer.get(sourceActorId)!.has(targetActorId)).toBe(true);
                                }

                                for(const [_, neighbours] of layer)
                                {
                                        linksCount += neighbours.size;
                                }
                                
                                if(nonSpecificLayer instanceof Map)
                                {
                                    linksCount /= 2;
                                }

                                expect(linksCount).toBe(testMultiplexNetwork.data!.links[layerId].length);
                            }

                            expect(links.size).toBe(Object.keys(testMultiplexNetwork.data!.links).length);
                        }
                    });
                }
            };

            TestMultiplexNetwork.iterate();
        });

        it("weights", () => {
            class TestMultiplexNetwork extends MultiplexNetwork
            {
                public static iterate(): void
                {
                    const network: TestMultiplexNetwork = createFullTestMultiplexNetwork(testMultiplexNetwork);

                    network.iterate({
                        callback: ({ weights }) => {
                            for(const layerId in testMultiplexNetwork.data!.links!)
                            {
                                for(const { sourceActorId, targetActorId, weight } of testMultiplexNetwork.data!.links![layerId])
                                {
                                    if((testMultiplexNetwork.schema! as any)[layerId].weighted)
                                    {
                                        expect(weights.get(layerId)!.get(sourceActorId)!.get(targetActorId)).toBe(weight);
                                    }
                                }
                            }
                        }
                    });
                }
            };

            TestMultiplexNetwork.iterate();
        });

        it("getAdjacency", () => {
            class TestMultiplexNetwork extends MultiplexNetwork
            {
                public static iterate(): void
                {
                    const network: TestMultiplexNetwork = createFullTestMultiplexNetwork(testMultiplexNetwork);

                    network.iterate({
                        callback: ({ getAdjacency }) => {
                            for(const layerId in testMultiplexNetwork.data!.links)
                            {
                                expect(() => getAdjacency({ layerId })).not.toThrow();
                            }
                        }
                    });
                }
            };

            TestMultiplexNetwork.iterate();
        });

        it("validators", () => {
            class TestMultiplexNetwork extends MultiplexNetwork
            {
                public static iterate(): void
                {
                    const network: TestMultiplexNetwork = createFullTestMultiplexNetwork(testMultiplexNetwork);

                    network.iterate({
                        callback: ({ validators }) => {
                            // validateLayerIfExists & validateLayerIfNotExists & validateLayerIfWeighted & validateLayerIfNotWeighted
                            for(const layerId in testMultiplexNetwork.schema)
                            {
                                expect(() => validators.schema.validateLayerIfExists({ layerId })).not.toThrow();
                                expect(() => validators.schema.validateLayerIfNotExists({ layerId }))
                                    .toThrow(MultiplexAlreadyExistingLayerError);

                                const { weighted } = (testMultiplexNetwork.schema as any)[layerId];
                                if(weighted)
                                {
                                    expect(() => validators.schema.validateLayerIfWeighted({ layerId })).not.toThrow();
                                    expect(() => validators.schema.validateLayerIfNotWeighted({ layerId }))
                                        .toThrow(MultiplexWeightedLayerError);
                                }
                                else
                                {
                                    expect(() => validators.schema.validateLayerIfNotWeighted({ layerId })).not.toThrow();
                                    expect(() => validators.schema.validateLayerIfWeighted({ layerId }))
                                        .toThrow(MultiplexNonWeightedLayerError);
                                }
                            }

                            for(const layerId in testMultiplexNetwork.not!.schema)
                            {
                                expect(() => validators.schema.validateLayerIfNotExists({ layerId })).not.toThrow();
                                expect(() => validators.schema.validateLayerIfExists({ layerId }))
                                    .toThrow(MultiplexNonExistingLayerError);
                            }

                            // validateActorIfExists & validateActorIfNotExists
                            for(const actorId of testMultiplexNetwork.data!.actors)
                            {
                                expect(() => validators.data.validateActorIfExists({ actorId })).not.toThrow();
                                expect(() => validators.data.validateActorIfNotExists({ actorId }))
                                    .toThrow(MultiplexAlreadyExistingActorError);
                            }

                            for(const actorId of testMultiplexNetwork.not!.data!.actors)
                            {
                                expect(() => validators.data.validateActorIfNotExists({ actorId })).not.toThrow();
                                expect(() => validators.data.validateActorIfExists({ actorId }))
                                    .toThrow(MultiplexNonExistingActorError);
                            }

                            // validateLinkIfExists & validateLinkIfNotExists
                            for(const layerId in testMultiplexNetwork.data!.links)
                            {
                                for(const link of testMultiplexNetwork.data!.links[layerId])
                                {
                                    expect(() => validators.data.validateLinkIfExists({ layerId, ...link })).not.toThrow();
                                    expect(() => validators.data.validateLinkIfNotExists({ layerId, ...link }))
                                        .toThrow(MultiplexAlreadyExistingLinkError);
                                }

                                for(const link of testMultiplexNetwork.not!.data!.links[layerId])
                                {
                                    expect(() => validators.data.validateLinkIfNotExists({ layerId, ...link })).not.toThrow();
                                    expect(() => validators.data.validateLinkIfExists({ layerId, ...link }))
                                        .toThrow(MultiplexNonExistingLinkError);
                                }
                            }
                        }
                    });
                }
            };

            TestMultiplexNetwork.iterate();
        });
    });

    describe("constructor", () => {
        
        it("ok", () => {
            let network: MultiplexNetwork;
            expect(() => network = new MultiplexNetwork(testMultiplexNetwork)).not.toThrow();
        
            expect(network!.getActorsCount()).toBe(testMultiplexNetwork.data!.actors.length);
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                expect(network!.getLinksCount({ layerId })).toBe(testMultiplexNetwork.data!.links[layerId].length);
            }
        });
        
        it("ok - schema only", () => {
            let network: MultiplexNetwork;
            expect(() => network = new MultiplexNetwork({ schema: testMultiplexNetwork.schema })).not.toThrow();
        
            expect(network!.getLayersCount()).toBe(Object.keys(testMultiplexNetwork.schema!).length);
            expect(network!.getActorsCount()).toBe(0);
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                expect(network!.getLinksCount({ layerId })).toBe(0);
            }
        });
            
        it("ok - actors only", () => {
            let network: MultiplexNetwork;
            expect(() => network = new MultiplexNetwork({
                schema: testMultiplexNetwork.schema,
                data: {
                    actors: testMultiplexNetwork.data!.actors
                }
            })).not.toThrow();
        
            expect(network!.getActorsCount()).toBe(testMultiplexNetwork.data!.actors.length);
            for(const layerId in testMultiplexNetwork.data!.links)
            {
                expect(network!.getLinksCount({ layerId })).toBe(0);
            }
        });
        
        it("ok - empty JSON", () => {
            let network: MultiplexNetwork;
            expect(() => network = new MultiplexNetwork({
                schema: { },
                data: { }
            })).not.toThrow();
        
            expect(network!.getLayersCount()).toBe(0);
            expect(network!.getActorsCount()).toBe(0);

            expect(() => network = new MultiplexNetwork({
                data: { }
            })).not.toThrow();
        
            expect(network!.getLayersCount()).toBe(0);
            expect(network!.getActorsCount()).toBe(0);

            expect(() => network = new MultiplexNetwork({ })).not.toThrow();
        
            expect(network!.getLayersCount()).toBe(0);
            expect(network!.getActorsCount()).toBe(0);
        });
        
        it("error, when (source || target) actor does not exist", () => {
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];

            expect(() => new MultiplexNetwork({
                schema: testMultiplexNetwork.schema,
                data: {
                    actors: testMultiplexNetwork.data!.actors,
                    links: {
                        [layerId]: [{
                            sourceActorId: testMultiplexNetwork.not!.data!.actors[0],
                            targetActorId: testMultiplexNetwork.data!.actors[0]
                        }]
                    }
                }
            })).toThrow(MultiplexNonExistingActorError);

            expect(() => new MultiplexNetwork({
                schema: testMultiplexNetwork.schema,
                data: {
                    actors: testMultiplexNetwork.data!.actors,
                    links: {
                        [layerId]: [{
                            sourceActorId: testMultiplexNetwork.data!.actors[0],
                            targetActorId: testMultiplexNetwork.not!.data!.actors[0]
                        }]
                    }
                }
            })).toThrow(MultiplexNonExistingActorError);
        });
                
        it("error, when actor already exists", () => {
            expect(() => new MultiplexNetwork({
                schema: testMultiplexNetwork.schema,
                data: {
                    actors: ["1", "1"]
                }
            })).toThrow(MultiplexAlreadyExistingActorError);
        });

        it("error, when link already exists", () => {
            expect(() => new MultiplexNetwork({
                schema: ["1"],
                data: {
                    actors: ["1", "2"],
                    links: {
                        "1": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "2"
                        }]
                    }
                }
            })).toThrow(MultiplexAlreadyExistingLinkError);
        });
                
        it("error, when invalid IDs are passed", () => {
            const layerId = Object.keys(testMultiplexNetwork.schema!)[0];
            const { sourceActorId, targetActorId } = testMultiplexNetwork.data!.links[layerId][0];

            for(const invalidId of invalidIds)
            {
                expect(() => new MultiplexNetwork({
                    schema: [invalidId]
                })).toThrow(InvalidIdError);

                expect(() => new MultiplexNetwork({
                    schema: testMultiplexNetwork.schema,
                    data: {
                        actors: [invalidId]
                    }
                })).toThrow(InvalidIdError);
                
                expect(() => new MultiplexNetwork({
                    schema: testMultiplexNetwork.schema,
                    data: {
                        actors: testMultiplexNetwork.data!.actors,
                        links: {
                            [invalidId]: [{
                                sourceActorId,
                                targetActorId
                            }]
                        }
                    }
                })).toThrow(InvalidIdError);
                    
                expect(() => new MultiplexNetwork({
                    schema: testMultiplexNetwork.schema,
                    data: {
                        actors: testMultiplexNetwork.data!.actors,
                        links: {
                            [layerId]: [{
                                sourceActorId: invalidId,
                                targetActorId
                            }]
                        }
                    }
                })).toThrow(InvalidIdError);

                expect(() => new MultiplexNetwork({
                    schema: testMultiplexNetwork.schema,
                    data: {
                        actors: testMultiplexNetwork.data!.actors,
                        links: {
                            [layerId]: [{
                                sourceActorId,
                                targetActorId: invalidId
                            }]
                        }
                    }
                })).toThrow(InvalidIdError);
            }
        });
    });
});