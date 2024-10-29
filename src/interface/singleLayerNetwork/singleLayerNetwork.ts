import {
    ARGS_Callback,
    ARGS_NodeId,
    ARGS_SourceNodeId,
    ARGS_TargetNodeId,
    ARGS_Value
} from "../../args_items.js";

import {
    TU_Meta,
    Orientation,
    Multi,
    HIN
} from "../../core/index.js";

import {
    Network
} from "../network/network.js";

import {
    MultilayerNetwork
} from "../multilayerNetwork/multilayerNetwork.js";

import {
    Node_Types,
    Link_Types
} from "./singleLayerNetwork_types.js";

import {
    IterateCallback
} from "../multilayerNetwork/multilayerNetwork_types.js";

import {
    SingleLayerNetworkMetrics
} from "./singleLayerNetwork_metrics.js";

import {
    SingleLayerNetwork as SingleLayerNetworkVisualization
} from "../../visualization/index.js";

import {
    ARGS_SingleLayerNetwork_Constructor
} from "./singleLayerNetwork_types.js";


// Represents single layer network
// It receives (generics) type of node, type of link, type of orerientation (Directed or Undirected) and Multi type (Singlelinks or Multilinks)
export class SingleLayerNetwork<T, U, V extends keyof Orientation, W extends keyof Multi>
extends Network<Node_Types<T>, Link_Types<U, V, W>>
{
    // MultilayerNetwork already implements all method
    protected core: MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>;
    // Access to metrics calculate methods
    protected metrics: SingleLayerNetworkMetrics<T, U, V, W>;
    // Enable visualization of network
    protected visualization: SingleLayerNetworkVisualization<Node_Types<T>, Link_Types<U, V, W>>;

    // SingleLayerNetwork is initialized by its Orientation and Mulit info
    constructor(args: ARGS_SingleLayerNetwork_Constructor<V, W>)
    {
        const {
            orientation,
            multi
        } = args;

        super();

        // Create TU_Meta of single layer network (it always contains just one layer)
        const tuMeta: TU_Meta<Node_Types<T>, Link_Types<U, V, W>> = {
            nodes: {
                default: null
            },
            links: {
                default: {
                    source: "default",
                    target: "default",
                    orientation: orientation,
                    multi: multi
                }
            }
        };

        this.core = new MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>({
            tuMeta: tuMeta
        });

        this.metrics = new SingleLayerNetworkMetrics({
            network: this.core
        });
        
        this.visualization = new SingleLayerNetworkVisualization({
            core: this.core
        });
    }

    // Override addNode method
    public override addNode<ARGS extends ARGS_NodeId<string> &
                                         ARGS_Value<T>>
    (args: ARGS): void
    {
        const {
            nodeId,
            value
        } = args;

        // Just add node to that one node layer
        this.core.addNode({
            layerId: "default",
            nodeId: nodeId,
            value: value
        });
    }

    // Override getNode method
    public override getNode
    (args: {
        nodeId: string
    }): T
    {
        const {
            nodeId
        } = args;

        const node = this.core.getNode({
            layerId: "default",
            nodeId: nodeId
        });

        return node;
    }

    // Override addLink method
    public override addLink<ARGS extends ARGS_SourceNodeId<string> &
                                         ARGS_TargetNodeId<string> &
                                         ARGS_Value<U>>
    (args: ARGS): void
    {
        const {
            sourceNodeId,
            targetNodeId,
            value
        } = args;

        // Just add link to that one link layer
        this.core.addLink({
            layerId: "default",
            sourceNodeId: sourceNodeId,
            targetNodeId: targetNodeId,
            value: value
        });
    }

    // Override getLink method
    public override getLink<ARGS extends ARGS_SourceNodeId<string> &
                                         ARGS_TargetNodeId<string>>
    (args: ARGS): W extends "Singlelinks" ? U : Array<U>
    {
        const {
            sourceNodeId,
            targetNodeId
        } = args;

        const link = this.core.getLink({
            layerId: "default",
            sourceNodeId: sourceNodeId,
            targetNodeId: targetNodeId
        });

        return link;
    }

    // Override getHIN method
    public override getHIN
    (): HIN<Node_Types<T>, Link_Types<U, V, W>>
    {
        return this.core.getHIN();
    }

    // Override getMetrics method
    public override getMetrics
    (): SingleLayerNetworkMetrics<T, U, V, W>
    {
        return this.metrics;
    }

    // Override getVisualization method
    public override getVisualization
    (): SingleLayerNetworkVisualization<Node_Types<T>, Link_Types<U, V, W>>
    {
        return this.visualization;
    }

    // Override iterate method
    public override iterate<ARGS extends ARGS_Callback<IterateCallback<Node_Types<T>, Link_Types<U, V, W>>>>
    (args: ARGS): void
    {
        const {
            callback
        } = args;

        this.core.iterate({
            callback: callback
        });
    }
};