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

    //toCSV,
    genericSingle,
    realSingle,

    testSingleLayerNetwork
} from "../../testNetwork";
import {
    createActors,
    createFullTestSingleLayerNetwork,
    createLinks
} from "tests/testNetwork";
import { DegreeEmptyLayerError } from "@/algorithm/core/degree/degreeErrors";
import { AlgorithmMinimumActorsLayerError } from "@/algorithm/utitlities";

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

    /*describe("N", () => {

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
                    result: 1,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                    ]
                },                
                {
                    result: 3,
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "3" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "4" }
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

                expect(Algorithm.SingleLayerNetwork.M({ network })).toBe(linksInit.result);
            }
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

        /*it("ok - directed", () => {
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

        /*it("ok - directed", () => {
            const network = new Core.SingleLayerNetwork(testSingleLayerNetwork);

            const { actors, links } = testSingleLayerNetwork.data!;
            expect(Algorithm.SingleLayerNetwork.density({ network })).toBe(links.length / (actors.length * (actors.length - 1)));
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

        /*it("error, when layer (network) is empty (no actors) - directed", () => {
            const network = new Core.SingleLayerNetwork({
                schema: testSingleLayerNetwork.schema
            });

            expect(() => Algorithm.SingleLayerNetwork.density({ network }))
                .toThrow(DensityMinimumActorsLayerError);
        });

        it("error, when layer (network) is empty (no actors) - undirected", () => {
            const network = new Core.SingleLayerNetwork();

            expect(() => Algorithm.SingleLayerNetwork.density({ network }))
                .toThrow(AlgorithmMinimumActorsLayerError);
        });

        it("generic test networks", () =>
        {
            testTestNetwork(genericSingle, "density");
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "density", (_, res, val) => { expect(val.toFixed(3)).toBe(res.toString()); });
        });
    });

    describe("degree", () => {

        /*it("ok - directed", () => {
            const network = new Core.SingleLayerNetwork(testSingleLayerNetwork);
            const degree = Algorithm.SingleLayerNetwork.degree({ network });

            for(const actorId of testSingleLayerNetwork.data!.actors)
            {
                expect((degree as Map<string, { out: number }>).get(actorId)!.out).toBe(Number(actorId));
                expect((degree as Map<string, { in: number }>).get(actorId)!.in).toBe(19 - Number(actorId));
            }
        });

        it("ok - undirected", () => {
            const AT = createActors(20, (i) => i.toString());
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: AT,
                    links: createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)) } })
                }
            });
            const degree = Algorithm.SingleLayerNetwork.degree({ network });

            for(const actorId of testSingleLayerNetwork.data!.actors)
            {
                expect((degree as Map<string, number>).get(actorId)!).toBe(19);
            }
        });

        it("ok - empty", () => {
            const network = new Core.SingleLayerNetwork();

            expect(Algorithm.SingleLayerNetwork.degree({ network }).size).toBe(0);
        });

        it("ok - selfloops - ignore", () => {
            const networkInitsLinks = [
                {
                    result: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                    ]
                },
                {
                    result: new Map([["1", 1], ["2", 0], ["3", 1], ["4", 0]]),
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "2", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "3" },
                        { sourceActorId: "4", targetActorId: "4" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                    ]
                },                
                {
                    result: new Map([["1", 1], ["2", 1], ["3", 3], ["4", 1]]),
                    links: [                        
                        { sourceActorId: "1", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "3" },
                        
                        { sourceActorId: "3", targetActorId: "1" },
                        { sourceActorId: "3", targetActorId: "2" },
                        { sourceActorId: "3", targetActorId: "4" }
                    ]
                },
                {
                    result: new Map([["1", 3], ["2", 3], ["3", 3], ["4", 3]]),
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

                expect(Algorithm.SingleLayerNetwork.degree({ network })).toStrictEqual(linksInit.result);
            }
        });

        it("generic test networks", () =>
        {
            testTestNetwork(genericSingle, "degree", (exp, res) => { exp.toStrictEqual(res); });
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "degree", (exp, res) => { exp.toStrictEqual(res); });
        });
    });

    describe("average degree", () => {

        /*it("ok - directed", () => {
            const network = new Core.SingleLayerNetwork(testSingleLayerNetwork);

            expect(Algorithm.SingleLayerNetwork.averageDegree({ network })).toBe(9.5);
        });

        it("ok - undirected", () => {
            const AT = createActors(20, (i) => i.toString());
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: AT,
                    links: createLinks(AT, AT, (s, t) => { return { add: (Number(s) > Number(t)) } })
                }
            });

            expect(Algorithm.SingleLayerNetwork.averageDegree({ network })).toBe(19);
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

                expect(Algorithm.SingleLayerNetwork.averageDegree({ network })).toBe(linksInit.result);
            }
        });

        /*it("error, when layer (network) is empty (no actors) - directed", () => {
            const network = new Core.SingleLayerNetwork({
                schema: testSingleLayerNetwork.schema
            });

            expect(() => Algorithm.SingleLayerNetwork.averageDegree({ network }))
                .toThrow(DegreeEmptyLayerError);
        });

        it("error, when layer (network) is empty (no actors) - undirected", () => {
            const network = new Core.SingleLayerNetwork();

            expect(() => Algorithm.SingleLayerNetwork.averageDegree({ network }))
                .toThrow(DegreeEmptyLayerError);
        });

        it("generic test networks", () =>
        {
            testTestNetwork(genericSingle, "averageDegree");
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "averageDegree", (_, res, val) => { expect(val.toFixed(3)).toBe(res.toString()); });
        });
    });

    describe("degree distribution", () => {

        /*it("ok - directed", () => {
            const network = new Core.SingleLayerNetwork(testSingleLayerNetwork);

            const length = testSingleLayerNetwork.data!.actors.length;
            expect(Algorithm.SingleLayerNetwork.degreeDistribution({ network }))
                .toStrictEqual({
                    out: Array.from({ length }, () => 0.05),
                    in: Array.from({ length }, () => 0.05)
                });
        });

        it("ok - undirected", () => {
            const network = new Core.SingleLayerNetwork({
                schema: { weighted: true },
                data: testSingleLayerNetwork.data
            });
            
            expect(Algorithm.SingleLayerNetwork.degreeDistribution({ network }))
                .toStrictEqual(Array.from({ length: testSingleLayerNetwork.data!.actors.length }, (_, i) => (i < 19 ? 0 : 1)));
        });

        /*it("ok - directed empty", () => {
            const network = new Core.SingleLayerNetwork({ schema: { directed: true } });

            expect(Algorithm.SingleLayerNetwork.degreeDistribution({ network }))
                .toStrictEqual({
                    out: new Array(),
                    in: new Array()
                });
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

                expect(Algorithm.SingleLayerNetwork.degreeDistribution({ network })).toStrictEqual(linksInit.result);
            }
        });

        it("error, when network is empty", () => {
            const network = new Core.SingleLayerNetwork();

            expect(() => Algorithm.SingleLayerNetwork.degreeDistribution({ network })).toThrow(DegreeEmptyLayerError);
        });

        it("generic test networks", () =>
        {
            testTestNetwork(genericSingle, "degreeDistribution", (exp, res) => { exp.toStrictEqual(res); });
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "degreeDistribution", (exp, res) => { exp.toStrictEqual(res); });
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
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }))
                .toStrictEqual(new Map([["1", 2/3], ["2", 1], ["3", 2/3], ["4", 1]]));
        });

        it("ok - empty network", () => {
            const network = new Core.SingleLayerNetwork({ });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }))
                .toStrictEqual(new Map([]));
        });

        it("ok - NaN - one actor", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1"]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }))
                .toStrictEqual(new Map([["1", NaN]]));
        });

        it("ok - NaN - two actors", () => {
            const network = new Core.SingleLayerNetwork({
                data: {
                    actors: ["1", "2"]
                }
            });
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }))
                .toStrictEqual(new Map([["1", NaN], ["2", NaN]]));
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
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }))
                .toStrictEqual(new Map([["1", NaN], ["2", NaN]]));
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
            
            expect(Algorithm.SingleLayerNetwork.clusteringCoefficient({ network }))
                .toStrictEqual(new Map([["1", 1], ["2", 1], ["3", 1]]));
        });

        /*it("generic test networks", () =>
        {
            testTestNetwork(genericSingle, "degreeDistribution", (exp, res) => { exp.toStrictEqual(res); });
        });

        it("real test networks", () =>
        {            
            testTestNetwork(realSingle, "degreeDistribution", (exp, res) => { exp.toStrictEqual(res); });
        });
    });*/
});