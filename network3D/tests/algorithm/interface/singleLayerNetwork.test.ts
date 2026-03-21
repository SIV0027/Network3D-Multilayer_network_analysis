import {
    expect,
    describe,
    it,
    type Assertion
} from "vitest";

import * as Core from "@/core";
import * as Algorithm from "@/algorithm";

import {
    type TestNetwork,

    genericSingle,
    realSingle,

    testSingleLayerNetwork
} from "../../testNetwork";
import {
    createActors,
    createFullTestSingleLayerNetwork,
    createLinks
} from "tests/testNetwork";

describe("SingleLayerNetwork", () => {

    const testTestNetwork = (set: any, methodName: string, expectMethod: (exp: Assertion<any>, res: any, val: any) => void = (exp, res) => { exp.toBe(res) }) => {
        for(const networkName in set)
        {
            const networkData: TestNetwork = (set as any)[networkName];
            const network = new Core.SingleLayerNetwork({
                schema: networkData.schema,
                data: {
                    actors: networkData.data.nodes,
                    links: networkData.data.links.map((val) => { return { sourceActorId: val.source, targetActorId: val.target, weight: val.weight } })
                }
            });

            if(networkData.metrics[methodName].prototype instanceof Error)
            {
                expect(() => (Algorithm.SingleLayerNetwork as any)[methodName]({ network }))
                    .toThrow(networkData.metrics[methodName]);
            }
            else
            {
                const val: any = (Algorithm.SingleLayerNetwork as any)[methodName]({ network });
                expectMethod(expect(val), networkData.metrics[methodName], val);
            }
        }
    };

    describe("N", () => {

        it("ok", () => {
            const network = createFullTestSingleLayerNetwork(testSingleLayerNetwork);

            expect(Algorithm.SingleLayerNetwork.N({ network })).toBe(testSingleLayerNetwork.data!.actors.length);
        });

        it("ok - empty", () => {
            const network = new Core.SingleLayerNetwork();

            expect(Algorithm.SingleLayerNetwork.N({ network })).toBe(0);
        });

        it("generic test networks", () =>
        {            
            testTestNetwork(genericSingle, "N");
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "N");
        });
    });
    
    describe("M", () => {
        it("ok", () => {
            const network = new Core.SingleLayerNetwork({
                schema: { weighted: true },
                data: testSingleLayerNetwork.data
            });

            expect(Algorithm.SingleLayerNetwork.M({ network })).toBe(testSingleLayerNetwork.data!.links.length);
        });

        it("ok - empty", () => {
            const network = new Core.SingleLayerNetwork();

            expect(Algorithm.SingleLayerNetwork.M({ network })).toBe(0);
        });

        it("generic test networks", () =>
        {
            testTestNetwork(genericSingle, "M");
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "M");
        });
    });

    describe("Component", () => {
        it("ok - undirected", () => {
            const network = new Core.SingleLayerNetwork({
                schema: { weighted: true },
                data: testSingleLayerNetwork.data
            });

            const components = Algorithm.SingleLayerNetwork.components({ network });
            expect(components.length).toBe(1);
            expect(components[0].length).toBe(testSingleLayerNetwork.data!.actors.length);
        });

        it("generic test networks", () =>
        {
            for(const networkName in genericSingle)
            {
                const networkData: TestNetwork = (genericSingle as any)[networkName];
                const network = new Core.SingleLayerNetwork({
                    schema: networkData.schema,
                    data: {
                        actors: networkData.data.nodes,
                        links: networkData.data.links.map((val) => { return { sourceActorId: val.source, targetActorId: val.target, weight: val.weight } })
                    }
                });

                const norm = (arr: Array<Array<string>>) => arr.map(inner => [...inner].sort());
                expect(norm(Algorithm.SingleLayerNetwork.components({ network }))).toStrictEqual(norm(networkData.metrics.components));
            }
        });

        it("real test networks", () =>
        {            
            for(const networkName in realSingle)
            {
                const networkData: TestNetwork = (realSingle as any)[networkName];
                const network = new Core.SingleLayerNetwork({
                    schema: networkData.schema,
                    data: {
                        actors: networkData.data.nodes,
                        links: networkData.data.links.map((val) => { return { sourceActorId: val.source, targetActorId: val.target, weight: val.weight } })
                    }
                });

                const norm = (arr: Array<Array<string>>) => arr.map(inner => [...inner].sort());
                expect(norm(Algorithm.SingleLayerNetwork.components({ network }))).toStrictEqual(norm(networkData.metrics.components));
            }
        });
    });

    describe("density", () => {
        it("ok - undirected", () => {
            const network = new Core.SingleLayerNetwork({
                schema: { weighted: true },
                data: testSingleLayerNetwork.data
            });

            const { actors, links } = testSingleLayerNetwork.data!;
            expect(Algorithm.SingleLayerNetwork.density({ network })).toBe((2 * links.length) / (actors.length * (actors.length - 1)));
        });

        it("ok - selfloops - ignore", () => {
            const networkInitsLinks = [
                {
                    result: 0,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                    ]
                },
                {
                    result: 1/6,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                    ]
                },                
                {
                    result: 1/2,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "3" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "4" }
                    ]
                },
                {
                    result: 1,
                    links: [
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                                                
                        { sourceActorId: "4", targetActorId: "1" },
                        { sourceActorId: "4", targetActorId: "2" },
                        { sourceActorId: "4", targetActorId: "3" },

                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },

                        
                        { sourceActorId: "2", targetActorId: "1" }
                    ]
                }
            ];

            for(const linksInit of networkInitsLinks)
            {
                const network = new Core.SingleLayerNetwork({
                    data: {
                        actors: ["1", "2", "3", "4"],
                        links: linksInit.links
                    }
                });

                expect(Algorithm.SingleLayerNetwork.density({ network })).toBe(linksInit.result);
            }
        });

        it("error, when layer (network) is empty (no actors) - undirected", () => {
            const network = new Core.SingleLayerNetwork();

            expect(() => Algorithm.SingleLayerNetwork.density({ network }))
                .toThrow();
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "density", (_, res, val) => { expect(val.toFixed(3)).toBe(res.toString()); });
        });
    });

    describe("degree", () => {

        it("ok - undirected", () => {
            const AT = createActors(20, (i) => i.toString());
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: AT,
                    links: createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)) } })
                }
            });
            const degree = Algorithm.SingleLayerNetwork.degree({ network }).nodes;

            for(const actorId of testSingleLayerNetwork.data!.actors)
            {
                expect((degree as Map<string, number>).get(actorId)!).toBe(19);
            }
        });

        it("ok - empty", () => {
            const network = new Core.SingleLayerNetwork();

            expect(Algorithm.SingleLayerNetwork.degree({ network }).nodes.size).toBe(0);
        });
    });

    describe("average degree", () => {

        it("ok - undirected", () => {
            const AT = createActors(20, (i) => i.toString());
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: AT,
                    links: createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)) } })
                }
            });

            expect(Algorithm.SingleLayerNetwork.degree({ network }).average).toBe(19);
        });

        it("ok - selfloops - ignore", () => {
            const networkInitsLinks = [
                {
                    result: 0/4,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                    ]
                },
                {
                    result: 2/4,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                    ]
                },                
                {
                    result: 6/4,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "3" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "4" }
                    ]
                },
                {
                    result: 12/4,
                    links: [
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                                                
                        { sourceActorId: "4", targetActorId: "1" },
                        { sourceActorId: "4", targetActorId: "2" },
                        { sourceActorId: "4", targetActorId: "3" },

                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },

                        
                        { sourceActorId: "2", targetActorId: "1" }
                    ]
                }
            ];

            for(const linksInit of networkInitsLinks)
            {
                const network = new Core.SingleLayerNetwork({
                    data: {
                        actors: ["1", "2", "3", "4"],
                        links: linksInit.links
                    }
                });

                expect(Algorithm.SingleLayerNetwork.degree({ network }).average).toBe(linksInit.result);
            }
        });
    });

    describe("degree distribution", () => {

        it("ok - undirected", () => {
            const network = new Core.SingleLayerNetwork({
                schema: { weighted: true },
                data: testSingleLayerNetwork.data
            });
            
            expect(Algorithm.SingleLayerNetwork.degree({ network }).distribution)
                .toStrictEqual(Array.from({ length: testSingleLayerNetwork.data!.actors.length }, (_, i) => (i < 19 ? 0 : 1)));
        });

        it("ok - selfloops - ignore", () => {
            const networkInitsLinks = [
                {
                    result: [4/4],
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                    ]
                },
                {
                    result: [2/4, 2/4],
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                    ]
                },                
                {
                    result: [0, 3/4, 0, 1/4],
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "3" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "4" }
                    ]
                },
                {
                    result: [0, 0, 0, 4/4],
                    links: [
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                                                
                        { sourceActorId: "4", targetActorId: "1" },
                        { sourceActorId: "4", targetActorId: "2" },
                        { sourceActorId: "4", targetActorId: "3" },

                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },

                        
                        { sourceActorId: "2", targetActorId: "1" }
                    ]
                }
            ];

            for(const linksInit of networkInitsLinks)
            {
                const network = new Core.SingleLayerNetwork({
                    data: {
                        actors: ["1", "2", "3", "4"],
                        links: linksInit.links
                    }
                });

                expect(Algorithm.SingleLayerNetwork.degree({ network }).distribution).toStrictEqual(linksInit.result);
            }
        });
    });

    describe("clustering coefficient", () => {

        it("ok - undirected", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: [
                        { sourceActorId: "1", targetActorId: "2" },
                        { sourceActorId: "2", targetActorId: "3" },
                        { sourceActorId: "3", targetActorId: "4" },
                        { sourceActorId: "4", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "1" }
                    ]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }).nodes)
                .toStrictEqual(new Map([["1", 2/3], ["2", 1], ["3", 2/3], ["4", 1]]));
        });

        it("ok - empty network", () => {
            const network = new Core.SingleLayerNetwork({ });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }).nodes)
                .toStrictEqual(new Map([]));
        });

        it("ok - NaN - one actor", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1"]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }).nodes)
                .toStrictEqual(new Map([["1", 0]]));
        });

        it("ok - NaN - two actors", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1", "2"]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }).nodes)
                .toStrictEqual(new Map([["1", 0], ["2", 0]]));
        });

        it("ok - NaN - two actors with link", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1", "2"],
                    links: [
                        { sourceActorId: "1", targetActorId: "2" }
                    ]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }).nodes)
                .toStrictEqual(new Map([["1", 0], ["2", 0]]));
        });

        it("ok - triangle", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1", "2", "3"],
                    links: [
                        { sourceActorId: "1", targetActorId: "2" },
                        { sourceActorId: "2", targetActorId: "3" },
                        { sourceActorId: "3", targetActorId: "1" }
                    ]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }).nodes)
                .toStrictEqual(new Map([["1", 1], ["2", 1], ["3", 1]]));
        });
    });
});