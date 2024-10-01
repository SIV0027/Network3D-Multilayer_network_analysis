import {
    ARGS_NodeId
} from "../../args_items.js";

import {
    Orientation,
    Multi,
    Orientation_In_Out,
    Orientation_Out
} from "../../core/index.js";

import {
    MultilayerNetwork
} from "../multilayerNetwork/multilayerNetwork.js";

import {
    MultilayerNetworkMetrics
} from "../multilayerNetwork/multilayerNetwork_metrics.js";

import {
    IterateCallback
} from "../multilayerNetwork/multilayerNetwork_types.js";

import {
    Metrics
} from "../network/metrics.js";

import {
    GetLinksCount,
    GetNodesCount,
    Degree
} from "../network/metrics_types.js";

import {
    Node_Types,
    Link_Types
} from "./singleLayerNetwork_types.js";

// Metrics for single layer network
// It receives (generics) type of node, type of link, type of orerientation (Directed or Undirected) and Multi type (Singlelinks or Multilinks)
export class SingleLayerNetworkMetrics<T, U, V extends keyof Orientation, W extends keyof Multi>
extends Metrics<Node_Types<T>, Link_Types<U, V, W>, MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>>
implements GetNodesCount, GetLinksCount, Degree
{
    // MutlilayerNetworkMetrics already implements metrics algorithms 
    private core: MultilayerNetworkMetrics<Node_Types<T>, Link_Types<U, V, W>>;

    // SingleLayerNetwork is initialized by its network
    constructor(args: {
        network: MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>
    })
    {
        const {
            network
        } = args;

        super({
            network: network 
        });

        this.core = network.getMetrics();
    }

    // Nodes count
    getNodesCount
    (): number
    {
        return this.core.getNodesCount({
            layerId: "default"
        });
    }

    // Links count
    getLinksCount
    (): number
    {
        return this.core.getLinksCount({
            layerId: "default"
        });
    }

    // Degree of given node
    degree<ARGS extends ARGS_NodeId<string>>
    (args: ARGS): Orientation_In_Out<V, number>
    {
        const {
            nodeId
        } = args;

        // Return variable
        let degree: Orientation_In_Out<V, number> = 0 as Orientation_In_Out<V, number>;

        // Callback for iterate the network
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                getNode
            } = args;

            // Get node by given node ID
            const node = getNode({
                layerId: "default",
                nodeId: nodeId
            });

            // Get all link of node
            const links = node.getLinks()["default"];
            // Is unoriented?
            if(links instanceof Map)
            {
                degree = links.size as Orientation_In_Out<V, number>;
            }
            else
            {
                degree = {
                    in: links.in.size,
                    out: links.out.size
                } as Orientation_In_Out<V, number>;
            }
        };

        // Iterate the network
        this.network.iterate({
            callback: callback
        });

        return degree;
    }

    // Degree sequence
    public degreeSequence
    (): Orientation_In_Out<V, Array<number>>
    {
        // Bool value which determines if network is undirected
        const isNetworkUndirected = this.network.getHIN().getOrientationMulti({
            layerId: "default"
        }).orientation == "Undirected";

        // Return variable
        const degreeSequence: Orientation_In_Out<V, Array<number>> = ((isNetworkUndirected) ? new Array<number>() : { in: new Array<number>(), out: new Array<number>() }) as Orientation_In_Out<V, Array<number>>;

        // Callback to iterate the network
        const callback: IterateCallback<Node_Types<T>, Link_Types<U, V, W>> = (args) =>
        {
            const {
                nodeLayers
            } = args;

            // Through the all nodes of network (it has just one layer)
            for(const [_, node] of nodeLayers["default"])
            {
                // Get all links of current node
                const links = node.getLinks()["default"];
                // Is network udnirected?
                if(links instanceof Map)
                {
                    (degreeSequence as Array<number>).push(links.size);
                }
                else
                {
                    (degreeSequence as Orientation_Out<Array<number>>).in.push(links.in.size);
                    (degreeSequence as Orientation_Out<Array<number>>).out.push(links.out.size);
                }
            }
        };

        // Iterate the network
        this.network.iterate({
            callback: callback
        });

        // Sort the sequence(s)
        if(isNetworkUndirected)
        {
            (degreeSequence as Array<number>).sort();
        }
        else
        {
            (degreeSequence as Orientation_Out<Array<number>>).in.sort();
            (degreeSequence as Orientation_Out<Array<number>>).out.sort();
        }

        return degreeSequence;
    }

    // Average degree
    public averageDegree
    (): number
    {
        // Bool value which determines if network is undirected
        const isNetworkUndirected = this.network.getHIN().getOrientationMulti({
            layerId: "default"
        }).orientation == "Undirected";

        // Get count of nodes
        const N: number = this.getNodesCount();
        // Get count of links (if network is undirected, then 2 * number of links)
        const M: number = (isNetworkUndirected ? 2 : 1) * this.getLinksCount();

        return (M / N);
    }
};