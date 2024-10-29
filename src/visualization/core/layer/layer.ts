import {
    TT,
    TU
} from "../../../core/hin/hin_types.js";

import {
    Link
} from "../../../core/index.js";

import {
    IterateCallback,
    MultilayerNetwork
} from "../../../interface/index.js";

import {
    ARGS_Layer_Constructor,
    Edges,
    Nodes
} from "./layer_types.js";

export declare namespace G6
{
    export class Graph
    {
        constructor(options: any);

        public data(...args: any): any;
        public render(...args: any): any;
        public updateLayout(...args: any): any;
    }
}

export class Layer<T extends TT, U extends TU<T>>
{
    private layerId: keyof U;
    private core: MultilayerNetwork<T, U>;
    private graph: G6.Graph;

    constructor(args: ARGS_Layer_Constructor<T, U>)
    {
        const {
            layerId,
            core,
            container
        } = args;

        this.layerId = layerId;
        this.core = core;
        this.graph = new (G6.Graph as new (options: any) => G6.Graph)({
            container: container,
            width: 800,
            height: 500
        });
        this.loadData();
    }

    private loadNodes
    (): Nodes
    {
        const nodesRes: Nodes = new Array();

        const callback: IterateCallback<T, U> = (args) =>
        {
            const {
                linkLayers,
                hin
            } = args;
    
            const linkLayerNodeTypes = hin.getSourceTarget({
                layerId: this.layerId
            });

            for(const nodes of linkLayers[this.layerId])
            {
                for(const [nodeId, _] of nodes)
                {
                    nodesRes.push({
                        id: nodeId,
                        label: nodeId, // Zde by bylo fajn nechat klineta si nastavit label (přes nějaký callback (+ mít defaultní))
                        size: 20
                    });
                }
    
                if(linkLayerNodeTypes.source == linkLayerNodeTypes.target)
                {
                    break;
                }
            }
        };
    
        this.core.iterate({
            callback: callback
        });

        return nodesRes;
    }

    private loadEdges
    (): Edges
    {
        let edges: Edges = new Array();

        const callback: IterateCallback<T, U> = (args) =>
        {
            const {
                linkLayers
            } = args;
            
            const filteredLinks = new Map<string, Set<string>>();
            for(const [nodeId, node] of linkLayers[this.layerId][0])
            {
                for(const [neighbourId, _] of ((node.getLinks() as { [key: string]: any })[this.layerId as string]) as Map<string, Link<keyof U, T, U>>)
                {
                    if(filteredLinks.get(neighbourId) == undefined || !filteredLinks.get(neighbourId)?.has(nodeId))
                    {
                        if(!filteredLinks.has(nodeId))
                        {
                            filteredLinks.set(nodeId, new Set<string>());
                        }

                        filteredLinks.get(nodeId)?.add(neighbourId);

                        edges.push({
                            source: nodeId,
                            target: neighbourId
                        });
                    }
                }
            }
        }

        this.core.iterate({
            callback: callback
        });

        return edges;
    }

    private loadData
    (): void
    {
        const hin = this.core.getHIN();
        const linkLayerNodeTypes = hin.getSourceTarget({
            layerId: this.layerId
        });
        const isLinkLayerDirected = hin.getOrientationMulti({
            layerId: this.layerId
        }).orientation == "Directed";

        let edges: Edges = new Array();
        // U linků je podstatné rozlišovat, zda se jedná o interlinky nebo intralinky a zda je to síť orientovaná či neorientovaná
        // a zda se jedná o multilnky (tento případ bych ignoroval (alespoň prozatím))
        // možná rozdělit na podfunkce podle daného případu
        if(linkLayerNodeTypes.source == linkLayerNodeTypes.target && !isLinkLayerDirected)
        {
            edges = this.loadEdges();
        }
        // else if directed -> edges = ....
        // else if bipartite -> edges = ....
        // ....

        const data = {
            nodes: this.loadNodes(),
            edges: edges
        };
        console.log(data);
        this.graph.data(data);
        this.graph.updateLayout({                // Object, layout configuration. random by default
            type: "force",         // Force layout
            preventOverlap: true  // The size of nodes for collide detection. Since we have assigned sizes for each node to their data in last chapter, the nodeSize here is not required any more.
          });
    }

    public render
    (): void
    {
        this.graph.render();
    }
};