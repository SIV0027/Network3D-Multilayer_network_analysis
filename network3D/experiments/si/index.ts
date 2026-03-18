import * as Network3D from "../../src";
import {
    realSingle
} from "../../tests/testNetwork/static/real/index";

import {
    Eccentricity
} from "./eccentricity";

import {
    SI
} from "./si";

const {
    nodes,
    links
} = realSingle.karateKlubRealTestNetwork.data;

const network = new Network3D.Core.SingleLayerNetwork({
    data: {
        actors: nodes,
        links: links.map(({ source, target }) => { return { sourceActorId: source, targetActorId: target }; })
    }
 });

const app = document.querySelector("#app") as HTMLElement;
let infectiousArray = new Array();
infectiousArray = new Array();
SI.run({
    network,
    infectionRate: 0.5,
    startInfectious: new Array("11", "5"),
    callback({ infectious, timeSlot }) {
        infectiousArray.push(new Set(infectious));
    }
});

const eccentricitiy = () => {
    const eccentricities = Eccentricity.run({ network });
    for(const [actorId, eccentricity] of eccentricities)
    {
        let timeSlotAccum = 0;
        for(let i = 0; i < 1e3; i++)
        {        
            let timeSlotG = 0;
            SI.run({
                network,
                infectionRate: 0.1,
                startInfectious: [actorId],
                callback({ timeSlot }) {
                    timeSlotG = timeSlot;
                }
            });
            timeSlotAccum += timeSlotG;
        }

        document.body.innerHTML += (timeSlotAccum / 1e3) + " " + eccentricity + "<br>";
    }
    console.log(eccentricities);
};

const degrees = () => {
    const degreeNodes = Network3D.Algorithm.SingleLayerNetwork.degree({ network }).nodes;
    for(const [actorId, degree] of degreeNodes)
    {
        let timeSlotAccum = 0;
        for(let i = 0; i < 1e3; i++)
        {        
            let timeSlotG = 0;
            SI.run({
                network,
                infectionRate: 0.1,
                startInfectious: [actorId],
                callback({ timeSlot }) {
                    timeSlotG = timeSlot;
                }
            });
            timeSlotAccum += timeSlotG;
        }

        document.body.innerHTML += (timeSlotAccum / 1e3) + " " + degree + "<br>";
    }
}

const visualize = (infectiousArray: Array<any>) => {
    const maxSize = 100;
    const minSize = 45;

    const degreeNodes = Network3D.Algorithm.SingleLayerNetwork.degree({ network }).nodes;
    const maxDegree = Math.max(...degreeNodes.values());

    const attrs = {
        node: {
            type: "circle",
            style: {
                size: (node: any) => (degreeNodes.get(node.id)! / maxDegree) * (maxSize - minSize) + minSize,
                fill: "#96C8FA",
                stroke: "#000000",
                lineWidth: 2,

                labelText: (node: any) => `${node.id}`,
                labelPlacement: "center",
                labelFontSize: 20,
                labelFill: "#000000"
            },
            state: {
                infected: {
                    fill: "#FA9696"
                }
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
            kr: 50
        }
    };

    const visualization = Network3D.Visualization.SingleLayerNetwork.create({
        network,
        init: Network3D.Visualization.SingleLayerNetwork.init({
            container: "container",
            attrs
        })
    });

    visualization.render();
    visualization.modify((graph) => {
        graph.on("afterlayout", () => {
            for(const infectious of infectiousArray)
            {
                const container = document.createElement("div");
                const hr = document.createElement("hr");
                app.append(container);
                app.append(hr);
                const visualization_ = Network3D.Visualization.SingleLayerNetwork.create({
                    network,
                    init: Network3D.Visualization.SingleLayerNetwork.init({
                    container,
                    attrs
                    })
                });
                visualization_.render();

                const nodesData = new Array();
                for(const nodeId of nodes)
                {                    
                    const pos = graph.getElementPosition(nodeId);
                    const attr: Record<string, any> = {
                        id: nodeId,
                        style: {
                            x: pos[0],
                            y: pos[1]
                        }
                    };
                    nodesData.push(attr);
                }

                visualization_.modify((graph_) => {
                    graph_.updateNodeData(nodesData);
                    for(const nodeId of infectious)
                    {
                        graph_.setElementState(nodeId, "infected");
                    }
                    graph_.render();
                });
            }
        });
    });
};

const simulate = () => {

    const simulateResults: Map<string, number> = new Map();
    for(const p of [0.1, 0.5])
    {
        for(const startInfectious of [["11", "5"], ["1", "34"], ["25", "17"], ["5"], ["1"], ["25"]])
        {
            const results: Array<number> = new Array();
            for(let _ = 0; _ < 1e3; _++)
            {
                let lastTimeSlot: number;            
                SI.run({
                    network,
                    infectionRate: p,
                    startInfectious,
                    callback({ timeSlot }) {
                        lastTimeSlot = timeSlot;
                    }
                });
                results.push(lastTimeSlot!);
            }
            let avg = 0;
            for(const item of results)
            {
                avg += item;
            }
            avg /= 1e3;

            simulateResults.set(String(p) + " - " + startInfectious.toLocaleString(), avg);
        }
    }

    return simulateResults;
};

console.log(simulate());
visualize(infectiousArray);
eccentricitiy();
degrees();