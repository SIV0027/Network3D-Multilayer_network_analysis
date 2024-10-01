import { ARGS_LayerId } from "../../args_items.js";
import {
    Node_Links,
    TT,
    TU
} from "../../core/index.js";

import {
    Metrics
} from "../network/metrics.js";

import {
    GetLinksCount,
    GetNodesCount
} from "../network/metrics_types.js";

import {
    MultilayerNetwork
} from "./multilayerNetwork.js";

import {
    IterateCallback
} from "./multilayerNetwork_types.js";

// This class implements algorithms for metrics of Multilayer network
// It gets (generics) types of nodes and types of links
export class MultilayerNetworkMetrics<T extends TT, U extends TU<T>>
extends Metrics<T, U, MultilayerNetwork<T, U>>
implements GetNodesCount, GetLinksCount
{
    // Returns count of nodes of given node layer
    public getNodesCount<K extends keyof T, ARGS extends ARGS_LayerId<K>>
    (args: ARGS): number
    {
        const {
            layerId
        } = args;

        // Return variable
        let nodesCount: number = 0;

        // Callback for network
        const callback: IterateCallback<T, U> = (args) =>
        {
            const {
                nodeLayers
            } = args;
            
            // Set return variable to value of size of given layer
            nodesCount = nodeLayers[layerId].size;
        };
            
        // Let callback iterate through network
        this.network.iterate({
            callback: callback
        });

        return nodesCount;
    }

    // Returns count of links of given link layer
    public getLinksCount<K extends keyof U, ARGS extends ARGS_LayerId<K>>
    (args: ARGS): number
    {
        const {
            layerId
        } = args;
        
        // Return variable
        let linkCount = 0;

        const callback: IterateCallback<T, U> = (args) =>
        {
            const {
                hin,
                linkLayers
            } = args;

            // Through the nodes of link layers (just source nodes - every link count once)
            for(const [_, node] of linkLayers[layerId][0])
            {
                // Get given link layer from data structure of current node
                const nodeLinkLayer = node.getLinks()[layerId as unknown as keyof Node_Links<U[K]["source"], T, U>];
                // Add number of degree of current node (in given link layer) to sum
                linkCount += (nodeLinkLayer instanceof Map) ? nodeLinkLayer.size : nodeLinkLayer.out.size;
            }

            // Get information about given link layer
            const layerSourceTargetTypes = hin.getSourceTarget({ 
                layerId: layerId
            });
            const layerOrientationMulti = hin.getOrientationMulti({
                layerId: layerId
            });

            // If given link layer is interlayer (source type == target layer), everey link is count twice => linkCount /= 2
            if(layerOrientationMulti.orientation == "Undirected" && layerSourceTargetTypes.source == layerSourceTargetTypes.target)
            {
                linkCount /= 2;
            }
        };

        // Let callback iterate through network
        this.network.iterate({
            callback: callback
        });

        return linkCount;
    }
};