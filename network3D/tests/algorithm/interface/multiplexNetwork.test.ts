import {
    expect,
    describe,
    it
} from "vitest";

import * as Core from "@/core";
import * as Algorithm from "@/algorithm";

import * as TestNetworks from "../../testNetwork/static/generic/index";
import * as RealTestNetworks from "../../testNetwork/static/real/single/";
import {
    type TestNetwork,

    toCSV
} from "tests/testNetwork";

describe("MultiplexNetwork", () => {

    describe("L", () => {

        it("ok", () => {            
            for(let i = 0; i <= 10; i++)
            {
                const network = new Core.MultiplexNetwork();
                const layers: Record<string, { }> = { };
                for(let ii = 0; ii < i; ii++)
                {
                    network.addLayer({
                        layerId: ii.toString()
                    });
                    layers[ii.toString()] = { };
                }
                expect(Algorithm.MultiplexNetwork.L({ network })).toBe(i);
                expect(Algorithm.MultiplexNetwork.L({ network: new Core.MultiplexNetwork({
                    schema: layers
                }) })).toBe(i);
            }
        });
    });

    describe("N", () => {

        it("ok", () => {            
            for(let i = 0; i <= 100; i++)
            {
                const network = new Core.MultiplexNetwork();
                const actors: Array<Core.ActorId> = new Array();
                for(let ii = 0; ii < i; ii++)
                {
                    network.addActor({ actorId: ii.toString() });
                    actors.push(ii.toString());
                }
                expect(Algorithm.MultiplexNetwork.N({ network })).toBe(i);
                expect(Algorithm.MultiplexNetwork.N({ network: new Core.MultiplexNetwork({
                    data: {
                        actors
                    }
                }) })).toBe(i);
            }
        });
    });

    describe("M", () => {

        it("ok", () => {
            const network = new Core.MultiplexNetwork({
                schema: {
                    "first": { },
                    "second": { },
                    "third": { }
                },
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "first": [],
                        "second": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }],
                        "third": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "4"
                        }]
                    }
                }
            });
            
            for(const [layerId, M] of ([["first", 0], ["second", 3], ["third", 5]] as Array<[string, number]>))
            {
                expect(Algorithm.MultiplexNetwork.M({ network, layerId })).toBe(M);
                network.addLink({
                    layerId,
                    sourceActorId: "3",
                    targetActorId: "4"
                });
                expect(Algorithm.MultiplexNetwork.M({ network, layerId })).toBe(M + 1);                
            }
        });
    });

    describe("density", () => {

        it("ok - none", () => {
            const network = new Core.MultiplexNetwork({
                schema: {
                    "none": { }
                },
                data: {
                    actors: ["1", "2", "3", "4"]
                }
            });

            expect(Algorithm.MultiplexNetwork.density({ layerId: "none", network })).toBe(0);
        });

        it("ok - full", () => {
            const network = new Core.MultiplexNetwork({
                schema: {
                    "full": { }
                },
                data: {
                    actors: ["1", "2", "3"],
                    links: {
                        "full": [{
                            sourceActorId: "1", targetActorId: "2"
                        }, {
                            sourceActorId: "1", targetActorId: "3"
                        }, {
                            sourceActorId: "2", targetActorId: "3"
                        }]
                    }
                }
            });

            expect(Algorithm.MultiplexNetwork.density({ layerId: "full", network })).toBe(1);
        });

        it("ok - half", () => {
            const network = new Core.MultiplexNetwork({
                schema: {
                    "half": { }
                },
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "half": [{
                            sourceActorId: "1", targetActorId: "2"
                        }, {
                            sourceActorId: "1", targetActorId: "3"
                        }, {
                            sourceActorId: "2", targetActorId: "3"
                        }]
                    }
                }
            });

            expect(Algorithm.MultiplexNetwork.density({ layerId: "half", network })).toBe(0.5);
        });

        it("error - non existing layer ID", () => {
            
            const network = new Core.MultiplexNetwork({
                schema: {
                    "none": { }
                },
                data: {
                    actors: ["1", "2", "3", "4"]
                }
            });

            expect(() => Algorithm.MultiplexNetwork.density({ layerId: "half", network })).toThrow();
        });

        it("error - undefined actors/nodes count", () => {
            
            const network = new Core.MultiplexNetwork({
                schema: {
                    "none": { }
                }
            });

            expect(() => Algorithm.MultiplexNetwork.density({ layerId: "none", network })).toThrow();

            network.addActor({ actorId: "1" });

            expect(() => Algorithm.MultiplexNetwork.density({ layerId: "none", network })).toThrow();

            network.addActor({ actorId: "2" });
            
            expect(Algorithm.MultiplexNetwork.density({ layerId: "none", network })).toBe(0);

        });
    });

    describe("components", () => {

        it("ok - 0", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["zero"]
            });

            expect(Algorithm.MultiplexNetwork.components({ network, layerId: "zero" })).toStrictEqual([]);
        });

        it("ok - 1", () => {
            const network = new Core.MultiplexNetwork({
                schema: {
                    "one": { }
                },
                data: {
                    actors: ["1", "2", "3"],
                    links: {
                        "one": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "3"
                        }]
                    }
                }
            });

            expect(Algorithm.MultiplexNetwork.components({ network, layerId: "one" })).toStrictEqual([["1", "2", "3"]]);
        });

        it("ok - 2", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["two"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "two": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "3",
                            targetActorId: "4"
                        }]
                    }
                }
            });

            expect(Algorithm.MultiplexNetwork.components({ network, layerId: "two" })).toStrictEqual([["1", "2"], ["3", "4"]]);
        });

        it("ok - 3", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["three"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "three": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }]
                    }
                }
            });

            expect(Algorithm.MultiplexNetwork.components({ network, layerId: "three" })).toStrictEqual([["1", "2"], ["3"], ["4"]]);
        });

        it("error - non existing layer ID", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["exists"]
            });

            expect(() => Algorithm.MultiplexNetwork.components({ network, layerId: "non-exists" })).toThrow();
        });
    });

    describe("degree", () => {

        it("ok - none links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"]
                }
            });

            const {
                nodes,
                average,
                distribution
            } = Algorithm.MultiplexNetwork.degree({ network, layerId: "default" });

            expect(nodes).toStrictEqual(new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]));
            expect(average).toBe(0);
            expect(distribution).toStrictEqual([1]);
        });

        it("ok - full links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "default": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "3",
                            targetActorId: "4"
                        }]
                    }
                }
            });

            const {
                nodes,
                average,
                distribution
            } = Algorithm.MultiplexNetwork.degree({ network, layerId: "default" });

            expect(nodes).toStrictEqual(new Map([["1", 3], ["2", 3], ["3", 3], ["4", 3]]));
            expect(average).toBe(3);
            expect(distribution).toStrictEqual([0, 0, 0, 1]);
        });

        it("ok - half links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "default": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }]
                    }
                }
            });

            const {
                nodes,
                average,
                distribution
            } = Algorithm.MultiplexNetwork.degree({ network, layerId: "default" });

            expect(nodes).toStrictEqual(new Map([["1", 3], ["2", 1], ["3", 1], ["4", 1]]));
            expect(average).toBe(6/4);
            expect(distribution).toStrictEqual([0, 3/4, 0, 1/4]);
        });

        it("error - non existing layer ID", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["exists"]
            });

            expect(() => Algorithm.MultiplexNetwork.degree({ network, layerId: "non-exists" })).toThrow();
        });
    });

    describe("clustering coefficient", () => {

        it("ok - none links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"]
                }
            });

            const {
                nodes,
                average,
                distribution
            } = Algorithm.MultiplexNetwork.clusteringCoefficient({ network, layerId: "default" });

            expect(nodes).toStrictEqual(new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]));
            expect(average).toBe(0);
            expect(distribution).toStrictEqual(new Map([[0, 1]]));
        });

        it("ok - full links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "default": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "3",
                            targetActorId: "4"
                        }]
                    }
                }
            });

            const {
                nodes,
                average,
                distribution
            } = Algorithm.MultiplexNetwork.clusteringCoefficient({ network, layerId: "default" });

            expect(nodes).toStrictEqual(new Map([["1", 1], ["2", 1], ["3", 1], ["4", 1]]));
            expect(average).toBe(1);
            expect(distribution).toStrictEqual(new Map([[1, 1]]));
        });

        it("ok - half links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "default": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }]
                    }
                }
            });

            const {
                nodes,
                average,
                distribution
            } = Algorithm.MultiplexNetwork.clusteringCoefficient({ network, layerId: "default" });

            expect(nodes).toStrictEqual(new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]));
            expect(average).toBe(0);
            expect(distribution).toStrictEqual(new Map([[0, 1]]));
        });

        it("error - non existing layer ID", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["exists"]
            });

            expect(() => Algorithm.MultiplexNetwork.clusteringCoefficient({ network, layerId: "non-exists" })).toThrow();
        });
    });

    describe("brandes", () => {

        it("ok - none links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"]
                }
            });

            const {
                closeness,
                betweenness,
                averagePathLength,
                diameter
            } = Algorithm.MultiplexNetwork.brandes({ network, layerId: "default" });

            expect(closeness).toStrictEqual({
                nodes: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
                average: 0,
                distribution: new Map([[0, 1]])
            });
            expect(betweenness).toStrictEqual({
                nodes: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
                average: 0,
                distribution: new Map([[0, 1]])
            });
            expect(diameter).toBe(0);
            expect(averagePathLength).toBe(0);
        });

        it("ok - full links", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["default"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links: {
                        "default": [{
                            sourceActorId: "1",
                            targetActorId: "2"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "1",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "3"
                        }, {
                            sourceActorId: "2",
                            targetActorId: "4"
                        }, {
                            sourceActorId: "3",
                            targetActorId: "4"
                        }]
                    }
                }
            });

            const {
                closeness,
                betweenness,
                averagePathLength,
                diameter
            } = Algorithm.MultiplexNetwork.brandes({ network, layerId: "default" });

            expect(closeness).toStrictEqual({
                nodes: new Map([["1", 1], ["2", 1], ["3", 1], ["4", 1]]),
                average: 1,
                distribution: new Map([[1, 1]])
            });
            expect(betweenness).toStrictEqual({
                nodes: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
                average: 0,
                distribution: new Map([[0, 1]])
            });
            expect(diameter).toBe(1);
            expect(averagePathLength).toBe(1);
        });

        it("error - non existing layer ID", () => {
            const network = new Core.MultiplexNetwork({
                schema: ["exists"]
            });

            expect(() => Algorithm.MultiplexNetwork.brandes({ network, layerId: "non-exist" })).toThrow();
        });
    });

    describe("flattening", () => {

        it("ok", () => {
            const links: Record<string, Array<{ sourceActorId: string, targetActorId: string }>> = {
                "first": [{ sourceActorId: "1", targetActorId: "2" }],
                "second": [{ sourceActorId: "2", targetActorId: "3" }],
                "third": [{ sourceActorId: "3", targetActorId: "4" }],
                "fourth": [{ sourceActorId: "4", targetActorId: "1" }]
            };

            const network = new Core.MultiplexNetwork({
                schema: ["first", "second", "third", "fourth"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links
                }
            });

            Algorithm.MultiplexNetwork.flattening({ layerIds: ["first", "second", "third", "fourth"], network, newLayerId: "flattened" });

            for(const layerId in links)
            {
                for(const link of links[layerId])
                {
                    const { sourceActorId, targetActorId } = link;
                    expect(network.isLinkExists({ layerId: "flattened", sourceActorId, targetActorId })).toBe(true);
                }
            }
        });

        it("ok - single", () => {
            const links: Record<string, Array<{ sourceActorId: string, targetActorId: string }>> = {
                "first": [{ sourceActorId: "1", targetActorId: "2" }],
                "second": [{ sourceActorId: "2", targetActorId: "3" }],
                "third": [{ sourceActorId: "3", targetActorId: "4" }],
                "fourth": [{ sourceActorId: "4", targetActorId: "1" }]
            };

            const network = new Core.MultiplexNetwork({
                schema: ["first", "second", "third", "fourth"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links
                }
            });

            for(const layerId in links)
            {
                const newLayerId = `flattened${layerId}`;
                Algorithm.MultiplexNetwork.flattening({ layerIds: [layerId], network, newLayerId });

                const { sourceActorId, targetActorId } = links[layerId][0];
                expect(network.isLinkExists({ layerId: newLayerId, sourceActorId, targetActorId })).toBe(true);
            }
        });

        it("ok - empty", () => {
            const links: Record<string, Array<{ sourceActorId: string, targetActorId: string }>> = {
                "first": [],
                "second": [],
                "third": [],
                "fourth": []
            };

            const network = new Core.MultiplexNetwork({
                schema: ["first", "second", "third", "fourth"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links
                }
            });

            Algorithm.MultiplexNetwork.flattening({ layerIds: ["first", "second", "third", "fourth"], network, newLayerId: "flattened" });
            
            for(let i = 1; i <= 4; i++)
            {
                for(let ii = 1; ii <= 4; ii++)
                {                    
                    expect(network.isLinkExists({ layerId: "flattened", sourceActorId: i.toString(), targetActorId: ii.toString() })).toBe(false);
                }
            }
        });


        it("error - non existing layer ID", () => {
            const links: Record<string, Array<{ sourceActorId: string, targetActorId: string }>> = {
                "first": [],
                "second": [],
                "third": [],
                "fourth": []
            };

            const network = new Core.MultiplexNetwork({
                schema: ["first", "second", "third", "fourth"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links
                }
            });

            expect(() => Algorithm.MultiplexNetwork.flattening({ layerIds: ["first", "second", "non-existing", "third", "fourth"], network, newLayerId: "flattened" }))
                .toThrow();
        });

        it("error - already existing layer ID", () => {
            const links: Record<string, Array<{ sourceActorId: string, targetActorId: string }>> = {
                "first": [],
                "second": [],
                "third": [],
                "fourth": []
            };

            const network = new Core.MultiplexNetwork({
                schema: ["first", "second", "third", "fourth"],
                data: {
                    actors: ["1", "2", "3", "4"],
                    links
                }
            });

            expect(() => Algorithm.MultiplexNetwork.flattening({ layerIds: ["first", "second", "third", "fourth"], network, newLayerId: "first" }))
                .toThrow();
        });
    });

    describe("generic networks", () => {

        const {
            emptyUndirectedGenericTestNetwork,
            fiveUndirectedGenericTestNetwork,
            fourUndirectedGenericTestNetwork,
            fullUndirectedGenericTestNetwork,
            noneUndirectedGenericTestNetwork,
            oneUndirectedGenericTestNetwork,
            threeUndirectedGenericTestNetwork,
            twoUndirectedGenericTestNetwork
        } = TestNetworks.genericSingle;

        const datasets: Record<string, any> = {
            "none": noneUndirectedGenericTestNetwork,
            "empty": emptyUndirectedGenericTestNetwork,
            "one": oneUndirectedGenericTestNetwork,
            "two": twoUndirectedGenericTestNetwork,
            "three": threeUndirectedGenericTestNetwork,
            "four": fourUndirectedGenericTestNetwork,
            "five": fiveUndirectedGenericTestNetwork,
            "full": fullUndirectedGenericTestNetwork
        };

        const links: Record<string, any> = { };

        for(const datasetID in datasets)
        {
            links[datasetID] = datasets[datasetID].data.links.map(({ source, target } : { source: any, target: any }) => { return { sourceActorId: source, targetActorId: target } });
        }

        const network = new Core.MultiplexNetwork({
            schema: {
                "none": { },
                "empty": { },
                "one": { },
                "two": { },
                "three": { },
                "four": { },
                "five": { },
                "full": { }
            },
            data: {
                actors: fullUndirectedGenericTestNetwork.data.nodes,
                links
            }
        });

        it("L", () => {
            expect(Algorithm.MultiplexNetwork.L({ network })).toBe(8);
        });

        it("N", () => {
            expect(Algorithm.MultiplexNetwork.N({ network })).toBe(fullUndirectedGenericTestNetwork.data.nodes.length);
        });

        it("M", () => {
            for(const layerId in links)
            {                
                expect(Algorithm.MultiplexNetwork.M({ network, layerId })).toBe((links[layerId] as Array<any>).length);
            }
        });

        it("density", () => {
            for(const datasetID in datasets)
            {
                if(typeof (datasets[datasetID] as TestNetwork).metrics.density == "number")
                {
                    expect(Algorithm.MultiplexNetwork.density({ network, layerId: datasetID })).toBe((datasets[datasetID] as TestNetwork).metrics.density);
                }
            }
        });

        it("components", () => {
            for(const datasetID in datasets)
            {
                const network = new Core.MultiplexNetwork({
                    schema: [datasetID],
                    data: {
                        actors: (datasets[datasetID] as TestNetwork).data.nodes, 
                        links: {
                            [datasetID]: (datasets[datasetID] as TestNetwork).data.links.map(({ source, target } : { source: any, target: any }) => { return { sourceActorId: source, targetActorId: target } })
                        }
                    }
                });
                
                const norm = (arr: Array<Array<string>>) => arr.map(inner => [...inner].sort());
                expect(norm(Algorithm.MultiplexNetwork.components({ network, layerId: datasetID }))).toStrictEqual(norm((datasets[datasetID] as TestNetwork).metrics.components));
            }
        });

        it("degree", () => {
            for(const datasetID in datasets)
            {
                const network = new Core.MultiplexNetwork({
                    schema: [datasetID],
                    data: {
                        actors: (datasets[datasetID] as TestNetwork).data.nodes, 
                        links: {
                            [datasetID]: (datasets[datasetID] as TestNetwork).data.links.map(({ source, target } : { source: any, target: any }) => { return { sourceActorId: source, targetActorId: target } })
                        }
                    }
                });
                
                
                const {
                    nodes,
                    average,
                    distribution
                } = Algorithm.MultiplexNetwork.degree({ network, layerId: datasetID });

                expect(nodes).toStrictEqual((datasets[datasetID] as TestNetwork).metrics.degree);
                expect(average).toBe((datasets[datasetID] as TestNetwork).metrics.averageDegree);
                expect(distribution).toStrictEqual((datasets[datasetID] as TestNetwork).metrics.degreeDistribution);
            }
        });

        it("clustering coefficient", () => {            
            for(const datasetID in datasets)
            {
                const network = new Core.MultiplexNetwork({
                    schema: [datasetID],
                    data: {
                        actors: (datasets[datasetID] as TestNetwork).data.nodes, 
                        links: {
                            [datasetID]: (datasets[datasetID] as TestNetwork).data.links.map(({ source, target } : { source: any, target: any }) => { return { sourceActorId: source, targetActorId: target } })
                        }
                    }
                });
                
                const {
                    nodes,
                    average,
                    distribution
                } = Algorithm.MultiplexNetwork.clusteringCoefficient({ network, layerId: datasetID });

                expect(nodes).toStrictEqual((datasets[datasetID] as TestNetwork).metrics.clusteringCoefficient);
                expect(average).toBe((datasets[datasetID] as TestNetwork).metrics.averageClusteringCoefficient);
                expect(distribution).toStrictEqual((datasets[datasetID] as TestNetwork).metrics.clusteringCoefficientDistribution);
            }
        });

        it("brandes", () => {            
            for(const datasetID in datasets)
            {
                const network = new Core.MultiplexNetwork({
                    schema: [datasetID],
                    data: {
                        actors: (datasets[datasetID] as TestNetwork).data.nodes, 
                        links: {
                            [datasetID]: (datasets[datasetID] as TestNetwork).data.links.map(({ source, target } : { source: any, target: any }) => { return { sourceActorId: source, targetActorId: target } })
                        }
                    }
                });
                
                const {
                    closeness,
                    betweenness,
                    averagePathLength,
                    diameter
                } = Algorithm.MultiplexNetwork.brandes({ network, layerId: datasetID });

                if((datasets[datasetID] as TestNetwork).metrics.closeness !== undefined)
                {                    
                    expect(closeness).toStrictEqual({
                        nodes: (datasets[datasetID] as TestNetwork).metrics.closeness,
                        average: (datasets[datasetID] as TestNetwork).metrics.averageCloseness,
                        distribution: (datasets[datasetID] as TestNetwork).metrics.closenessDistribution
                    });
                }
                expect(betweenness).toStrictEqual({
                    nodes: (datasets[datasetID] as TestNetwork).metrics.betweenness,
                    average: (datasets[datasetID] as TestNetwork).metrics.averageBetweenness,
                    distribution: (datasets[datasetID] as TestNetwork).metrics.betweennessDistribution
                });
                expect(diameter).toBe((datasets[datasetID] as TestNetwork).metrics.diameter);
                expect(averagePathLength).toBe((datasets[datasetID] as TestNetwork).metrics.averagePathLength);
            }
        });
    });
});