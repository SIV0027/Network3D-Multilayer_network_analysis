import * as Network3D from "../../src";

import {
    GoldenColorGenerator
} from "./goldenColorGenerator";

import {
    ErdosRenyi
} from "./erdosRenyi";

import {
    BarabasiAlbert
} from "./barabasiAlbert";

import {
    DuplexBarabasiAlbert
} from "./duplexBarabasiAlbert";

const run = (network: Network3D.Core.SingleLayerNetwork) => {

    const maxSize = 100;
    const minSize = 45;

    const degreeNodes = Network3D.Algorithm.SingleLayerNetwork.degree({ network }).nodes;
    const maxDegree = Math.max(...degreeNodes.values());

    const communities = Network3D.Algorithm.SingleLayerNetwork.labelPropagation({ network });
    const communitiesColors: Map<string, ReturnType<GoldenColorGenerator["next"]>> = new Map();
    const colorGenerator = new GoldenColorGenerator();
    for(const communityId of communities.values())
    {
        communitiesColors.set(communityId, colorGenerator.next({ lightness: 50, saturation: 50 }));
    }

    const visualization = Network3D.Visualization.SingleLayerNetwork.create({
        network,
        init: Network3D.Visualization.SingleLayerNetwork.init({
            container: "container",
            attrs: {
                node: {
                    type: "circle",
                    style: {
                        size: /*45,*/ (node: any) => (degreeNodes.get(node.id)! / maxDegree) * (maxSize - minSize) + minSize,
                        fill: "#9d96fa", // (node: any) => { const color = communitiesColors.get(communities.get(node.id)!)!; return `hsl(${color.hue.toFixed(1)}, 50%, 50%)`; },
                        stroke: "#000000",
                        lineWidth: 2,

                        labelText: (node: any) => `${node.id}`,
                        labelPlacement: "center",
                        labelFontSize: 15,
                        labelFill: "#000000"
                    }
                },
                edge: {
                    type: "line",
                    style: {
                        stroke: "#000000",
                        lineWidth: 1
                    }                            
                },
                layout: {
                    type: "force-atlas2",
                    preventOverlap: true,
                    kr: 100
                }
            }
        })
    });
    visualization.render();

    console.log("N", Network3D.Algorithm.SingleLayerNetwork.N({ network }));
    console.log("components", Network3D.Algorithm.SingleLayerNetwork.components({ network }).length);
    console.log("avg. degree", Network3D.Algorithm.SingleLayerNetwork.degree({ network }).average);
    console.log("M", Network3D.Algorithm.SingleLayerNetwork.M({ network }));
    console.log("k_max", Math.max(...Network3D.Algorithm.SingleLayerNetwork.degree({ network }).nodes.values()));
};

const runMultiplex = () => {
    const degreesFirst: Map<Network3D.Core.ActorId, number> = new Map();
    const degreesSecond: Map<Network3D.Core.ActorId, number> = new Map();
    for(let i = 0; i < 1e3; i++)
    {
        const network = DuplexBarabasiAlbert.generate({
            c11: 0.5,
            c12: 0.5,
            c21: 0.5,
            c22: 0.5,
            n: 50,
            nm: 4,
            networkInitSchema: ["first", "second"],
            networkInitData: {
                actors: ["1", "2", "3", "4", "5"],
                links: {
                    first: [
                        { sourceActorId: "1", targetActorId: "2" },                    
                        { sourceActorId: "2", targetActorId: "3" },
                        { sourceActorId: "3", targetActorId: "4" },
                        { sourceActorId: "4", targetActorId: "5" }
                    ],
                    second: [
                        { sourceActorId: "1", targetActorId: "2" },                   
                        { sourceActorId: "2", targetActorId: "3" },
                        { sourceActorId: "3", targetActorId: "4" },
                        { sourceActorId: "4", targetActorId: "5" }
                    ]
                }
            }
        });

        for(const [actorId, degree] of Network3D.Algorithm.MultiplexNetwork.degree({ layerId: "first", network }).nodes)
        {
            degreesFirst.set(actorId, (degreesFirst.get(actorId) ?? 0) + degree);
        }

        for(const [actorId, degree] of Network3D.Algorithm.MultiplexNetwork.degree({ layerId: "second", network }).nodes)
        {
            degreesSecond.set(actorId, (degreesSecond.get(actorId) ?? 0) + degree);
        }
    }

    for(const [actorId, degreeFirst] of degreesFirst)
    {
        console.log(actorId, degreeFirst / 1e3, degreesSecond.get(actorId)! / 1e3);
    }
};


run(ErdosRenyi.generate({ n: 30, p: 1 /* 0.05; 0.2; 0.5; 1 */ }));
run(BarabasiAlbert.generate({
    n: 80,
    nm: 3,
    networkInit: {
        data: {
            actors: ["1", "2", "3"],
            links: [
                { sourceActorId: "1", targetActorId: "2" },
                { sourceActorId: "2", targetActorId: "3" },
                { sourceActorId: "1", targetActorId: "3" }
            ]
        }
    }
}));
runMultiplex();