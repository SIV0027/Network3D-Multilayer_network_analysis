import { Core } from "../core/multiplex/multiplexNetwork.js";
import { MultiplexNetworkConstructor_ARGS } from "./multiplexNetworkArgsTypes.js";
import { Layout_ARGS } from "./singleLayerNetworkArgsTypes.js";
import G6 from "../../node_modules/@antv/g6/lib/index.d.js";
import { LayerId_ARGS } from "../core/multiplex/components/node/multiplexNodeArgsTypes.js";

interface G
{
    updateLayout(args: Object): void;
}

export namespace Visualization
{
    export class MultiplexNetwork<NODE_ID_TYPE extends Object,
                                  NODE_VALUE_TYPE,
                                  LAYER_ID_TYPE extends Object>
            extends Core.MultiplexNetwork<NODE_ID_TYPE,
                                            NODE_VALUE_TYPE,
                                            LAYER_ID_TYPE>
    {

        protected container: HTMLDivElement;
        protected graph;
        protected layout: String;

        constructor(args: MultiplexNetworkConstructor_ARGS)
        {
            super();

            const {
                canvasId
            } = args;

            this.container = document.querySelector(canvasId) as HTMLDivElement;
            this.container.innerHTML = "";
            this.layout = "random";
            this.graph = new G6.Graph({
                container: "renderCanvas",
                width: 800,
                height: 500,
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
                  },
                layout: { 
                    type: 'random',
                    preventOverlap: true,
                    nodeSize: 100
                  }
            });
        }

        public addLayerRender<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const {
                layerId
            } = args;

            for(const [_, node] of this.nodes)
            {
                        node.iterateLinks({
                            layerId: layerId,
                            algorithm: (args) =>
                            {
                                const {
                                    link
                                } = args;
        
                                if(link.getSource() == node)
                                {
                                    this.graph.addItem("edge", {
                                        source: link.getSource().getId().toString(),
                                        target: link.getTarget().getId().toString(),
                                        layer: layerId
                                    });
                                }
                            }
                        });
            }
        }

        public render
        (): void
        {
            const nodes = [];              
            for(const [nodeId, _] of this.nodes)
            {
                nodes.push({ 
                    id: nodeId.toString(),
                    label: nodeId.toString(),
                    size: 20
                });
            }

            const edges: Array<{ source: string, target: string, layer: LAYER_ID_TYPE }> = new Array();
            for(const layerId of this.layers)
            {
                for(const [_, node] of this.nodes)
                {
                        node.iterateLinks({
                            layerId: layerId,
                            algorithm: (args) =>
                            {
                                const {
                                    link
                                } = args;
        
                                if(link.getSource() == node)
                                {
                                    edges.push({
                                        source: link.getSource().getId().toString(),
                                        target: link.getTarget().getId().toString(),
                                        layer: layerId
                                    });
                                }
                            }
                        });
                }
            }

            this.graph.data({ 
                nodes: nodes,
                edges: edges
            });
            this.graph.render();
        }

        public switchLayer<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const {
                layerId
            } = args;

            const edges = this.graph.getEdges();
            edges.forEach((edge: any) =>
            {
                if (edge.getModel().layer === layerId)
                {
                    this.graph.showItem(edge);
                } 
                else
                {
                    this.graph.hideItem(edge);
                }
            });
        }

        public changeLayout<ARGS extends Layout_ARGS>
        (args: ARGS): void
        {
            const {
                layout
            } = args;

            ((this.graph as unknown) as G).updateLayout({
                type: layout,
                preventOverlap: true,
                nodeSize: 100
            });
        }
    };
};