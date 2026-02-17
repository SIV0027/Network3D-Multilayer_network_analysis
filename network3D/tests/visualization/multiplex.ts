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

const visualization = Network3D.Visualization.MultiplexNetwork.create({
    network,
    layerId: "first",
    init: Network3D.Visualization.MultiplexNetwork.init({
        container: "container",
        attrs: {
            /*
                        node: {
              type: "rect",
              style: {
                width: 220,
                height: 80,
                radius: 16,
                fill: "rgba(30,41,59,0.8)",
                stroke: "rgba(148,163,184,0.3)",
                backdropFilter: "blur(6px)",
              },
              labelStyle: {
                fill: "#f1f5f9",
                fontSize: 14,
                fontWeight: 500,
              },
              state: {
                hover: {
                  stroke: "#38bdf8",
                  lineWidth: 2,
                },
              },
            }, */
        }
    })
});

visualization.render();

/*visualization.modify((graph) => {
    graph.setNode({
        style: {
            type: 'circle',
            style: { size: 20, fill: '#7FFFD4', stroke: '#5CACEE', lineWidth: 2 },
        },
    });
    visualization.render();
});*/
