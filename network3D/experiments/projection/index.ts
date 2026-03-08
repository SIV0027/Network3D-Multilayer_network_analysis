import * as Network3D from "../../src";

import {
    Projection
} from "./projection";

import {
    WeightedDegree
} from "./weightedDegree";

import {
    BipartiteVisualization
} from "./bipartiteVisualization";

import {
    BipartiteDegree
} from "./bipartiteDegree";

import {
    dataset
} from "./dataset";

declare const G6: any;

const sourceActors: Set<Network3D.Core.ActorId> = new Set();
const targetActors: Set<Network3D.Core.ActorId> = new Set();
const links: Array<{ sourceActorId: Network3D.Core.ActorId, targetActorId: Network3D.Core.ActorId }> = new Array();
for(const row of dataset.trim().split("\n"))
{
    const [source, target] = row.trim().split(" ");

    sourceActors.add(source);
    targetActors.add(target);
    links.push({
        sourceActorId: source,
        targetActorId: target
    });
}

const network = new Network3D.Core.BipartiteNetwork({
    data: {
        actors: {
            source: Array.from(sourceActors),
            target: Array.from(targetActors)
        },
        links
    }
});


//const womenNetwork = Projection.run({ network, partition: "source" });
//const eventNetwork = Projection.run({ network, partition: "target" });

const maxSize = 100;
const minSize = 15;

//const weightedDegreeNodes = WeightedDegree.compute({ network: eventNetwork });
//const degreeNodes = Network3D.Algorithm.SingleLayerNetwork.degree({ network: eventNetwork }).nodes;
//const maxDegree = Math.max(...weightedDegreeNodes.values());
const bipartiteDegree = BipartiteDegree.run({ network, partition: "target" });

/*
const visualization = Network3D.Visualization.SingleLayerNetwork.create({
    network: eventNetwork,
    init: Network3D.Visualization.SingleLayerNetwork.init({
        container: "container",
        attrs: {
            node: {
                type: "circle",
                style: {
                    size: (node: any) => (weightedDegreeNodes.get(node.id)! / maxDegree) * (maxSize - minSize) + minSize,
                    fill: "#96a5fa",
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
                type: "concentric",
                preventOverlap: true,
                kr: 100
            }
        }
    })
});
visualization.render();*/

/*const visualization = BipartiteVisualization.create({
    network,
    init: Network3D.Visualization.SingleLayerNetwork.init({
        container: "container",
        attrs: {
            node: {
                type: "circle",
                style: {
                    size: 80,
                    fill: (node: any) => node.group == "source" ? "#fa9696" : "#96a5fa",
                    stroke: "#000000",
                    lineWidth: 2,

                    labelText: (node: any) => `${node.label}`,
                    labelPlacement: "center",
                    labelFontSize: 35,
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
                type: "dagre",
                rankdir: 'LR',
                nodesep: 10,
                ranksep: 800,
            }
        }
    })
});
visualization.render();*/

let res = "";
for(let i = 1; i <= 14; i++)
{
    res += `${bipartiteDegree.get(i.toString())} & `;
}

console.log(res);