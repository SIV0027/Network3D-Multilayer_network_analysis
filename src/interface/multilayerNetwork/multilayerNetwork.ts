import { 
    ARGS_Callback,
    ARGS_LayerId,
    ARGS_NodeId,
    ARGS_SourceNodeId,
    ARGS_TargetNodeId,
    ARGS_Value
} from "../../args_items.js";

import {
    HIN,
    MultilayerNetwork as Core,
    Node,
    Link,
    TT,
    TU,
    Node_Links,
    Multi_Data_Type
} from "../../core/index.js";

import {
    Multi_Data_Type_Value,
    IterateCallback,
    ARGS_MultilayerNetwork_Constructor
} from "./multilayerNetwork_types.js";

import {
    Layer as LayerVisualization
} from "../../visualization/index.js";

import {
    Layer as LayerMetrics
} from "../../metrics/index.js";

import {
    Config
} from "../../visualization/layer/layer_types.js";

// This class represents Multilayer network to user
// It gets (generics) layers (types) of nodes and layers (types) of links
export class MultilayerNetwork<T extends TT, U extends TU<T>>
{
    // Data structure which enable access to the structure of the network
    protected core: Core<T, U>;

    // Multilayer network is initialized by describing of structure of network (TU_META<T, U>)
    constructor(args: ARGS_MultilayerNetwork_Constructor<T, U>)
    {
        const {
            tuMeta
        } = args;

        /* super(); */

        const hin = new HIN<T, U>({
            tuMeta: tuMeta
        });

        this.core = new Core<T, U>({
            hin: hin
        });
    }

    // Getter of HIN
    public getHIN
    (): HIN<T, U>
    {
        return this.core.getHIN();
    }
    
    /* public getNodesLayers
    (): Array<string>
    {

    }

    public getLinksLayers
    (): Array<string>
    {

    } */

    public getNodesIds
    (args: {
        layerId: keyof T
    }): Array<string>
    {
        const {
            layerId
        } = args;

        const nodesIds = new Array<string>();

        const nodesOfLayer = this.core.getNodes()[layerId];
        for(const [nodeId, _] of nodesOfLayer)
        {
            nodesIds.push(nodeId);
        }

        return nodesIds;
    }

    // Get all links Ids (Ids of source and target nodes) of given link layer - ZATÍM POUZE PRO NEORIENTOVANÉ SINGLELINKS SÍTĚ!!!
    public getLinksIds
    (args: {
        layerId: keyof U
    }): Array<{ source: string, target: string }>
    {
        const {
            layerId
        } = args;

        const hin = this.getHIN();
        const { source/* , target */ } = hin.getSourceTarget({
            layerId
        });
        /* const { orientation } = hin.getOrientationMulti({
            layerId
        }); */

        const nodes = this.core.getNodes();
        
        // BEGIN: Undirected singlelinks layer
        const already: Set<string> = new Set(); // For undirected layers -> links are added twice
        const linksIds: Array<{ source: string, target: string }> = new Array();
        for(const [nodeId, node] of nodes[source])
        {
            for(const [neighbourId, _] of (node.getLinks()[layerId as Extract<keyof Node_Links<U[keyof U]["source"], T, U>, string>] as Map<string, Link<typeof layerId, T, U>>))
            {
                if(!already.has(neighbourId + nodeId))
                {
                    linksIds.push({
                        source: nodeId,
                        target: neighbourId
                    });

                    already.add(nodeId + neighbourId);
                }
            }
        }
        // END: Undirected singlelinks layer 

        return linksIds;
    }

    // Adds node to given node layer of network
    public addNode<L extends keyof T, ARGS extends ARGS_LayerId<L> &
                                                   ARGS_NodeId<string> &
                                                   ARGS_Value<T[L]["value"]>>
    (args: ARGS): void
    {
        const {
            layerId,
            nodeId,
            value
        } = args;

        // Get info about network structure
        const hin: HIN<T, U> = this.core.getHIN();

        // Create instance of node
        const node: Node<L, T, U> = new Node({
            hin: hin,
            layerId: layerId,
            nodeId: nodeId,
            value: value
        });

        // Add node to structure of network
        this.core.addNode<L, {
            layerId: L,
            node: Node<L, T, U>
        }>({
            layerId: layerId,
            node: node
        });
    }

    // Getter of node (its value) by its ID
    public getNode<L extends keyof T>
    (args: {
        layerId: L,
        nodeId: string
    }): T[L]["value"]
    {
        const {
            layerId,
            nodeId
        } = args;

        // Get node by ID from network structure
        const node: Node<L, T, U> = this.core.getNode({
            layerId: layerId,
            nodeId: nodeId
        });

        // Return value of node
        return node.getValue();
    }

    // Adds link to given link layer of network
    public addLink<L extends keyof U & keyof Node_Links<U[L]["source"], T, U> & keyof Node_Links<U[L]["target"], T, U>, ARGS extends ARGS_LayerId<L> &
                                                                                                                                     ARGS_SourceNodeId<string> &
                                                                                                                                     ARGS_TargetNodeId<string> &
                                                                                                                                     ARGS_Value<U[L]["value"]>>
    (args: ARGS): void
    {
        const {
            layerId,
            sourceNodeId,
            targetNodeId,
            value
        } = args;

        // Get info about source node type and target node type of given link layer
        const sourceTargetNodeLayerId = this.core.getHIN().getSourceTarget({
            layerId: layerId
        });

        // Get source node by given source node ID
        const sourceNode = this.core.getNode({
            layerId: sourceTargetNodeLayerId.source,
            nodeId: sourceNodeId
        });
        
        // Get target node by given target node ID
        const targetNode = this.core.getNode({
            layerId: sourceTargetNodeLayerId.target,
            nodeId: targetNodeId
        });

        // Create new link instance
        const link: Link<L, T, U> = new Link({
            source: sourceNode,
            target: targetNode,
            value: value
        });

        // Add link to network structure
        this.core.addLink<L, {
            layerId: L,
            link: Link<L, T, U>
        }>({
            layerId: layerId,
            link: link
        });
    }

    // Getter of value of single link (or array of values if Multilinks is allowed)
    public getLink<L extends keyof U & keyof Node_Links<U[L]["source"], T, U> & keyof Node_Links<U[L]["target"], T, U>, ARGS extends ARGS_LayerId<L> &
                                                                                                                                     ARGS_SourceNodeId<string> &
                                                                                                                                     ARGS_TargetNodeId<string>>
    (args: ARGS): Multi_Data_Type_Value<T, U, L>
    {
        const {
            layerId,
            sourceNodeId,
            targetNodeId
        } = args;

        // Get link or multilink from data structure of network
        const link: Multi_Data_Type<L, T, U> = this.core.getLink({
            layerId: layerId,
            sourceNodeId: sourceNodeId,
            targetNodeId: targetNodeId
        });

        // Prepare a return variable
        let ret: Multi_Data_Type_Value<T, U, L>;
        // If "link" is instance of array (is multilink)
        if(Array.isArray(link))
        {
            // Get every value of link of multilink and push it to return variable
            ret = new Array<U[L]["value"]>();
            for(const singleLink of link)
            {
                ret.push(singleLink.getValue());
            }
        }
        else
        {
            // Store value of link to return variable
            ret = link.getValue();
        }

        return ret;
    }

    // Enable passage through the whole network
    public iterate<ARGS extends ARGS_Callback<IterateCallback<T, U>>>
    (args: ARGS): void
    {
        const {
            callback
        } = args;

        // Link layers structure (dict of tuples (maps of all nodes of source type and maps of all nodes of target type => if intra link layer -> same maps in one link layer tuple))
        const linkLayers: {
            [K in keyof U]: [Map<string, Node<U[K]["source"], T, U>>, Map<string, Node<U[K]["target"], T, U>>]
        } | { [key: string]: any } = { };

        // Through the all link layers
        for(const linkLayerId of this.core.getHIN().getLinkLayersList())
        {
            // Get source and target types information of current link layer
            const sourceTargetTypes = this.core.getHIN().getSourceTarget({
                layerId: linkLayerId
            });

            // Create tuple of current link layer (source nodes, target nodes)
            (linkLayers as{ [K in keyof U]: [Map<string, Node<U[K]["source"], T, U>>, Map<string, Node<U[K]["target"], T, U>>] })[linkLayerId] = [
                this.core.getNodes()[sourceTargetTypes.source],
                this.core.getNodes()[sourceTargetTypes.target]
            ];
        }

        // Callback receives structure of node layers, structure of link layers, info about network structure (by HIN form)
        // and getNode and getLink metods
        callback({
            nodeLayers: this.core.getNodes(),
            linkLayers: linkLayers as { [K in keyof U]: [Map<string, Node<U[K]["source"], T, U>>, Map<string, Node<U[K]["target"], T, U>>] },
            hin: this.core.getHIN(),
            getNode: (args) => this.core.getNode(args),
            getLink: (args) => this.core.getLink(args)
        });
    }

    // Create and return visualization of given (link) layer
    public createVisualization
    (args: {
        layerId: keyof U,
        config: Config
    }): LayerVisualization<T, U>
    {
        const {
            layerId,
            config
        } = args;

        const layerVisualization = new LayerVisualization<T, U>({
            layerId,
            iterate: this.iterate.bind(this),
            config
        });

        return layerVisualization;
    }

    // Create and return metrics of given (link) layer
    public createMetrics
    (args: {
        layerId: keyof U
    }): LayerMetrics<T, U>
    {
        const {
            layerId
        } = args;

        const layerMetrics: LayerMetrics<T, U> = new LayerMetrics({
            layerId,
            iterate: this.iterate.bind(this)
        });

        return layerMetrics;
    }
};