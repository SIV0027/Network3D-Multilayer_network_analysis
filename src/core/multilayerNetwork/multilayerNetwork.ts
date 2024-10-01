import {
    HIN
} from "../hin/hin.js";

import {
    TT,
    TU,
    MultilayerNetwork_Nodes,
    Node_Links,
    Multi_Data_Type
} from "../hin/hin_types.js";

import {
    Node
} from "../node/node.js";

import {
    Link
} from "../link/link.js";

import { 
    ARGS_LayerId,
    ARGS_Link,
    ARGS_Node,
    ARGS_NodeId,
    ARGS_SourceNodeId,
    ARGS_TargetNodeId
} from "../../args_items.js";

import {
    ARGS_MultilayerNetwork_Constructor
} from "./multilayerNetwork_types.js";

import {
    MultilayerNetworkErrors
} from "./multilayerNetwork_errors.js";

// Class represents Multilayer network
// It gets (generics) types (layers) of nodes and types (layers) of links
export class MultilayerNetwork<T extends TT, U extends TU<T>>
{
    // Reference to HIN (structure) of network
    protected hin: HIN<T, U>;
    // Reference to node layer structure (with stored nodes of current multilayer network)
    protected nodes: MultilayerNetwork_Nodes<T, U>;

    // Node is initialized by reference to HIN
    constructor(args: ARGS_MultilayerNetwork_Constructor<T, U>)
    {
        const {
            hin
        } = args;

        this.hin = hin;

        // Initialization of node layers structure
        this.nodes = this.hin.generateMultilayerNodes();
    }

    // Returns its HIN object
    public getHIN
    (): HIN<T, U>
    {
        return this.hin;
    }

    // Returns all node layers (with all nodes)
    public getNodes
    (): MultilayerNetwork_Nodes<T, U>
    {
        return this.nodes;
    }

    // Adds node to given node layer of current network
    public addNode<L extends keyof T, ARGS extends ARGS_LayerId<L> &
                                                   ARGS_Node<Node<L, T, U>>>
    (args: ARGS): void
    {
        const {
            layerId,
            node
        } = args;

        // Get node layer by given layer ID
        const layer: Map<string, Node<L, T, U>> = this.nodes[layerId];
        const nodeId: string = node.getId();

        // Check if node with ID of node being added does not already exists
        if(layer.has(nodeId))
        {
            throw MultilayerNetworkErrors.alreadyExistsNode({
                layerId: layerId.toString(),
                nodeId: nodeId
            });
        }
        
        // Add node to node layer
        layer.set(nodeId, node);
    }

    // Getter of node in specific node layer
    public getNode<L extends keyof T, ARGS extends ARGS_LayerId<L> &
                                                   ARGS_NodeId<string>>
    (args: ARGS): Node<L, T, U>
    {
        const {
            layerId,
            nodeId
        } = args;

        const layer: Map<string, Node<L, T, U>> = this.nodes[layerId];
        // Check if node with given ID exists
        if(!layer.has(nodeId))
        {
            throw MultilayerNetworkErrors.nonExistingNode({
                layerId: layerId.toString(),
                nodeId: nodeId
            });
        }

        // Getting node from node layer
        const node: Node<L, T, U> = layer.get(nodeId) as Node<L, T, U>;
        return node;
    }

    // Add link to specific link layer (to source and target nodes)
    public addLink<L extends keyof U & keyof Node_Links<U[L]["source"], T, U> & keyof Node_Links<U[L]["target"], T, U>, ARGS extends ARGS_LayerId<L> &
                                                                                                                                     ARGS_Link<Link<L, T, U>>>
    (args: ARGS): void
    {
        const {
            layerId,
            link
        } = args;

        // Getting source node type
        const sourceNodeLayerId: U[L]["source"] = link.getSource().getLayerId();
        const sourceNodeId: string = link.getSource().getId();

        // Getting target node type
        const targetNodeLayerId: U[L]["target"] = link.getTarget().getLayerId();
        const targetNodeId: string = link.getTarget().getId();

        // Getting source node
        const sourceNode: Node<U[L]["source"], T, U> = this.getNode({
            layerId: sourceNodeLayerId,
            nodeId: sourceNodeId
        });
        // Getting target node
        const targetNode: Node<U[L]["target"], T, U> = this.getNode({
            layerId: targetNodeLayerId,
            nodeId: targetNodeId
        });

        // Adding link to source node
        sourceNode.addLink({
            layerId: layerId,
            link: link,
            neighbourId: targetNodeId
        });
        // Adding link to target node
        targetNode.addLink({
            layerId: layerId,
            link: link,
            neighbourId: sourceNodeId
        });
    }
    
    // Getter of single link (or array of links if multilinks is allowed)
    public getLink<L extends keyof U & keyof Node_Links<U[L]["source"], T, U> & keyof Node_Links<U[L]["target"], T, U>, ARGS extends ARGS_LayerId<L> &
                                                                                                                                     ARGS_SourceNodeId<string> &
                                                                                                                                     ARGS_TargetNodeId<string>>
    (args: ARGS): Multi_Data_Type<L, T, U>
    {
        const {
            layerId,
            sourceNodeId,
            targetNodeId
        } = args;

        // Get information about source and target types
        const sourceTargetTypes = this.hin.getSourceTarget({
            layerId: layerId
        });

        // Get source node
        const sourceNode: Node<U[L]["source"], T, U> = this.getNode({
            layerId: sourceTargetTypes.source,
            nodeId: sourceNodeId
        });
        // Get target node
        const targetNode: Node<U[L]["target"], T, U> = this.getNode({
            layerId: sourceTargetTypes.target,
            nodeId: targetNodeId
        });

        // Get link
        const link: Multi_Data_Type<L, T, U> = sourceNode.getLink({
            layerId: layerId,
            targetNeighbourId: targetNode.getId()
        });

        return link;
    }

    /* 
    public abstract removeNode
    (args: ARGS_): any;

    public abstract removeLink
    (args: ARGS_): void; */
};