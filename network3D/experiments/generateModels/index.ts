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

//const network = ErdosRenyi.generate({ n: 30, p: 1 /* 0.05; 0.2; 0.5; 1 */ });
const network = BarabasiAlbert.generate({
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
});

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