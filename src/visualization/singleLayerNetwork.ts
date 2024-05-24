import { Core } from "../core/singlelayer/singleLayerNetwork.js";
import { Layout_ARGS, SingleLayerNetworkConstructor_ARGS } from "./singleLayerNetworkArgsTypes.js";
import { SingleLayerNetworkConstructor_ARGS as SuperConstructor_ARGS } from "../core/singlelayer/singleLayerNetworkTypes.js";
import G6 from "../../node_modules/@antv/g6/lib/index.js";

interface Constructor_ARGS<NODE_ID_TYPE extends Object,
                      NODE_VALUE_TYPE,
                      LINK_VALUE_TYPE>
extends SingleLayerNetworkConstructor_ARGS, SuperConstructor_ARGS<NODE_ID_TYPE,
                                                                         NODE_VALUE_TYPE,
                                                                         LINK_VALUE_TYPE>
{ };

interface G
{
    updateLayout(args: Object): void;
}

export namespace Visualization
{
    export class SingleLayerNetwork<NODE_ID_TYPE extends Object,
                                 NODE_VALUE_TYPE,
                                 LINK_VALUE_TYPE>
               extends Core.SingleLayerNetwork<NODE_ID_TYPE,
                                               NODE_VALUE_TYPE,
                                               LINK_VALUE_TYPE>
    {

        protected container: HTMLDivElement;
        protected graph;

        constructor(args: Constructor_ARGS<NODE_ID_TYPE,
                                           NODE_VALUE_TYPE,
                                           LINK_VALUE_TYPE>)
        {
            super({
                direction: args.direction
            });

            const { 
                canvasId
            } = args;

            this.container = document.querySelector(canvasId) as HTMLDivElement;
            this.container.innerHTML = "";
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

            const edges = this.direction.getAllLinks({
                nodes: this.nodes
            });

            this.graph.data({ 
                nodes: nodes,
                edges: edges.map((link) =>
                    { 
                        return { 
                            source: link.getSource().getId().toString(),
                            target: link.getTarget().getId().toString()
                        } 
                    })
            });
            this.graph.render();
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