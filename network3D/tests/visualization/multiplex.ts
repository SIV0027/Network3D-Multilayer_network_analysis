import * as Network3D from "@/index";

const network = new Network3D.Core.MultiplexNetwork({
    schema: ["first", "second"],
    data: {
        actors: ["1", "2", "3"],
        links: {
            "first": [{
                    sourceActorId: "1",
                    targetActorId: "2"
                }, {
                    sourceActorId: "2",
                    targetActorId: "3"
                }
            ],
            "second": [{
                    sourceActorId: "1",
                    targetActorId: "2"
                }, {
                    sourceActorId: "2",
                    targetActorId: "3"
                }, {
                    sourceActorId: "1",
                    targetActorId: "3"
                }
            ]
        }
    }
});

const minSize = 15;
const maxSize = 30;

const visualization = Network3D.Visualization.MultiplexNetwork.create({
    network,
    layerId: "first",
    init: Network3D.Visualization.MultiplexNetwork.init({
        container: "container",
        attrs: {
           node: {
                type: "circle",
                style: {
                    size: maxSize,
                    fill: "#10B981",
                    stroke: "#065F46",
                    lineWidth: 2
                }
            },
            layout: {
                type: "d3-force",
                collide: {
                    radius: maxSize * 1.5,
                    strength: 1
                }
            }
        }
    })
});

visualization.render();

setTimeout(() => {
    visualization.modify((graph) => {
        graph.setNode({
            type: "circle",
                style: {
                    size: 150,
                    fill: "#10B981",
                    stroke: "#065F46",
                    lineWidth: 2,
                    labelText: (node: any) => `${node.id}`,
                    labelPlacement: "center",
                    labelFontSize: 225 / 5,
                    labelFill: "#ffffff"
                }
        });

        graph.setLayout({
            type: "d3-force",
                collide: {
                    radius: 225,
                    strength: 1
                }
        });
        visualization.render();
    });
}, 5000);
