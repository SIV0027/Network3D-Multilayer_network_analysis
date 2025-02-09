/* import {
    ARGS_NodeId,
    ARGS_SourceNodeId,
    ARGS_TargetNodeId,
    ARGS_Value
} from "../../args_items.js";

import {
    Orientation,
    Multi,
    HIN
} from "../../core/index.js";

import {
    Network
} from "../network/network.js";

import {
    MultilayerNetwork
} from "../core/index.js";

import {
    Node_Types,
    Link_Types,
    SingleLayerNetwork_TU_Meta
} from "./singleLayerNetwork_types.js";

import {
    SingleLayerNetwork as SingleLayerNetworkMetrics
} from "../../metrics/index.js";

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
    public static createSTDNetwork<T, U, V extends keyof Orientation, W extends keyof Multi>
    (args: {
        orientation: V,
        multi: W
    }): SingleLayerNetwork<T, U, V, W>
    {
        const {
            orientation,
            multi
        } = args;

        // Create SingleLayerNetwork_TU_Meta of single layer network
        const tuMeta: SingleLayerNetwork_TU_Meta<T, U, V, W> = {
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

        const core = new MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>({
            tuMeta: tuMeta
        });

        const metrics = new SingleLayerNetworkMetrics<T, U, V, W>({
            iterate: core.iterate.bind(core)
        });

        const visualization = new SingleLayerNetworkVisualization<T, U, V, W>({
            iterate: core.iterate.bind(core)
        });

        const network = new SingleLayerNetwork<T, U, V, W>({
            core: core,
            metrics: metrics,
            visualization: visualization
        });
        return network;
    }

    // Core class for interface 
    protected core: MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>;
    // Access to metrics calculate methods
    protected metrics: SingleLayerNetworkMetrics<T, U, V, W>; // Zde by měl být typ "any" (uživatel by si mohl sám určit, jaký typ metriky chce použít - to samé i pro visualization)
    // Enable visualization of network
    protected visualization: SingleLayerNetworkVisualization<T, U, V, W>;

    // SingleLayerNetwork is initialized by its Orientation and Mulit info
    constructor(args: ARGS_SingleLayerNetwork_Constructor<T, U, V, W>)
    {
        const {
            core,
            metrics,
            visualization
        } = args;

        super();

        // Vyzkoušet a zjistit, zda pokud Core (který má dostat "SingleLayerNetwork_TU_Meta") dostane obecnou strukturu ("TU_Meta"), typový systém
        // vyhodí chybu (má ji vyhodit)

        this.core = core;
        this.metrics = metrics;
        this.visualization = visualization;
    }

    public override getNodesIds
    (): Array<string>
    {
        return this.core.getNodesIds({
            layerId: "default"
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
    (): SingleLayerNetworkVisualization<T, U, V, W>
    {
        return this.visualization;
    }
}; */