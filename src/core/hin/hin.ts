import {
    ARGS_Orientation,
    ARGS_Multi,
    ARGS_LayerId,
    ARGS_Source,
    ARGS_Target
} from "../../args_items.js";

import { 
    Link
} from "../link/link.js";

import { 
    Multi,
    MultilayerNetwork_Nodes,
    Node_Links,
    Orientation,
    TT,
    TU,
    TU_Meta,
    Layer_Orientation_Multi,
    ARGS_HIN_Constructor,
    Source_Target
} from "./hin_types.js";

// HIN class describes structure of networks layers
// It gets (generics) types (layers) of nodes and types (layers) of links
export class HIN<T extends TT, U extends TU<T>>
{
    // Describes structure of layer of network
    private tuMeta: TU_Meta<T, U>;
    // Generator for creating structure of links layers for current node
    private multiGenerator = {
        Singlelinks: <L extends keyof U, T extends TT, U extends TU<TT>>() => new Map<string, Link<L, T, U>>(),
        Multilinks: <L extends keyof U, T extends TT, U extends TU<TT>>() => new Map<string, Array<Link<L, T, U>>>()
    };
    // Generator for creating structure of links layers for current node (calls multiGenerator)
    private orientationGenerator = {
        Undirected: (multiGeneratorKey: keyof Multi, _: keyof T, __: keyof T) => { return this.multiGenerator[multiGeneratorKey]() },
        Directed: (multiGeneratorKey: keyof Multi, sourceType: keyof T, targetType: keyof T) => { return ((sourceType == targetType) ? { in: this.multiGenerator[multiGeneratorKey](), out: this.multiGenerator[multiGeneratorKey]() } : this.multiGenerator[multiGeneratorKey]()) }
    };

    // HIN is initialized by structure of layer of network (TU_Meta)
    constructor(args: ARGS_HIN_Constructor<TU_Meta<T, U>>)
    {
        const {
            tuMeta
        } = args;

        this.tuMeta = tuMeta;
    }
    
    // Generate and returns structure for single link layer of node by orientation of link layer, 
    // if in link layer is allowed multilinks or not and by types of source and taret nodes (calls orientationGenerator) 
    private getLinkLayerInit<O extends keyof Orientation, M extends keyof Multi, ARGS extends ARGS_Orientation<O> &
                                                                                              ARGS_Multi<M> &
                                                                                              ARGS_Source<keyof T> &
                                                                                              ARGS_Target<keyof T>>
    (args: ARGS)
    {
        const {
            orientation,
            multi,
            source,
            target
        } = args;
    
        return this.orientationGenerator[orientation](multi, source, target);
    }

    // Returns types of source and target nodes by network structure (tuMeta) of given link layer 
    public getSourceTarget<L extends keyof U, ARGS extends ARGS_LayerId<L>>
    (args: ARGS): Source_Target<U[L]["source"], U[L]["target"]>
    {
        const {
            layerId
        } = args;

        return {
            source: this.tuMeta.links[layerId].source,
            target: this.tuMeta.links[layerId].target 
        };
    }

    // Returns information about direction and multilinks of given link layer by network structure (tuMeta)
    public getDirectionMulti<L extends keyof U, ARGS extends ARGS_LayerId<L>>
    (args: ARGS): Layer_Orientation_Multi<T, U, L>
    {
        const {
            layerId
        } = args;

        return {
            orientation: this.tuMeta.links[layerId]["orientation"],
            multi: this.tuMeta.links[layerId]["multi"]
        };
    }

    // Generates and returns structure of node layers for multilayer network by network structure (tuMeta)
    public generateMultilayerNodes
    (): MultilayerNetwork_Nodes<T, U>
    {
        // The structure is JSON, wehere key is ID of node layer and value is map with appropriate type of node
        const multilayerNodes: MultilayerNetwork_Nodes<T, U> | { [layerId: string]: any } = { };
        // Through the each node layer (by tuMeta.nodes)
        for(const layerId in this.tuMeta.nodes)
        {
            // For each node layer the map is created
            multilayerNodes[layerId] = new Map();
        }

        return (multilayerNodes as MultilayerNetwork_Nodes<T, U>);
    }

    // Generates and returns a structure of link layers to which the given node type (node layer) belongs 
    public generateNodeLinks<L extends keyof T, ARGS extends ARGS_LayerId<L>>
    (args: ARGS): Node_Links<typeof layerId, T, U>
    {
        const {
            layerId
        } = args;

        // The structure is JSON, where key is ID of link layer where given type of node is source or target
        // of this link layer
        const nodeLinks: Node_Links<typeof layerId, T, U> | { [layerId: string]: any } = { };
        // Through the each link layer (by tuMeta.links)
        for(const linkLayerId in this.tuMeta.links)
        {
            // Link layer is add to structure only and only if given type of node (node layer) is source or target type of current link layer (calls getLinkLayerInit)
            if(this.tuMeta.links[(linkLayerId as keyof U)].source == (layerId as L) || this.tuMeta.links[(linkLayerId as keyof U)].target == (layerId as L))
            {
                nodeLinks[linkLayerId] = this.getLinkLayerInit({
                    multi: this.tuMeta.links[(linkLayerId as keyof U)].multi,
                    orientation: this.tuMeta.links[(linkLayerId as keyof U)].orientation,
                    source: this.tuMeta.links[(linkLayerId as keyof U)].source,
                    target: this.tuMeta.links[(linkLayerId as keyof U)].target
                });
            }
        }

        return (nodeLinks as Node_Links<typeof layerId, T, U>);
    }
};