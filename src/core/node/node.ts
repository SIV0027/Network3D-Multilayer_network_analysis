import {
    ARGS_LayerId,
    ARGS_Link,
    ARGS_NeighbourId,
    ARGS_TargetNeighbourId
} from "../../args_items.js";

import { 
    HIN
} from "../hin/hin.js";

import {
    Link
} from "../link/link.js";

import {
    TT,
    TU,
    Node_Links,
    Layer_Orientation_Multi,
    Multi_Gen,
    Multi_Data_Type
} from "./../hin/hin_types.js";

import {
    ARGS_Node_Constructor
} from "./node_types.js";

import {
    NodeErrors
} from "./node_errors.js"; 

// Class represents Node in network
// It gets (generics) node layer where belongs to, types (layers) of nodes and types (layers) of links
export class Node<L extends keyof T, T extends TT, U extends TU<T>>
{
    // Reference to HIN (structure) of network
    private hin: HIN<T, U>
    // ID of current node
    private id: string;
    // Value of current node
    private value: T[L]["value"];
    // ID of node layer where current node belongs to (because of runtime)
    private layerId: L;
    // Reference to link structure (with stored links) of current node
    private links: Node_Links<L, T, U>;

    // Node is initialized by reference to HIN, value, (its node) layer ID and its node ID
    constructor(args: ARGS_Node_Constructor<T[L]["value"], L, HIN<T, U>>)
    {
        const {
            nodeId,
            value,
            layerId,
            hin
        } = args;
        
        this.hin = hin;
        this.id = nodeId;
        this.value = value;
        this.layerId = layerId;

        // Initialization of link layers structure
        this.links = this.hin.generateNodeLinks({
            layerId: this.layerId
        });
    }

    // Getter of node ID
    public getId
    (): string
    {
        return this.id;
    }

    // Getter of value
    public getValue
    (): T[L]["value"]
    {
        return this.value;
    }

    // Getter of node layer ID
    public getLayerId
    (): L
    {
        return this.layerId;
    }

    // Getter of reference to link structure
    public getLinks
    (): Node_Links<L, T, U>
    {
        return this.links;
    }

    // Getter of single link (or array of links if multilinks is allowed)
    public getLink<K extends keyof U & keyof Node_Links<L, T, U>, ARGS extends ARGS_LayerId<K> &
                                                                               ARGS_TargetNeighbourId<string>>
    (args: ARGS): Multi_Data_Type<K, T, U>
    {
        const {
            layerId,
            targetNeighbourId
        } = args;

        // Obtain information about direction and mutlilinks information of given link layer
        const layerOrientationMulti: Layer_Orientation_Multi<T, U, K> = this.hin.getOrientationMulti({
            layerId: layerId
        });
        // Obtain information about source and target nodes types of given link layer
        const layerSourceTarget = this.hin.getSourceTarget({
            layerId: layerId
        });

        // Data structure of given layer
        let layer: Map<string, Link<K, T, U>> | Map<string, Array<Link<K, T, U>>>;
        // Determining if current link layer is directed and source and target types are equal => structure has "in" and "out" parts
        if(layerOrientationMulti.orientation == "Directed" && layerSourceTarget.source == layerSourceTarget.target)
        {
            layer = (this.links[layerId] as { in: Multi_Gen<K, T, U>[typeof layerOrientationMulti.multi], out: Multi_Gen<K, T, U>[typeof layerOrientationMulti.multi] }).out;
        }
        else
        {
            layer = (this.links[layerId] as (Map<string, Link<K, T, U>> | Map<string, Array<Link<K, T, U>>>));
        }

        // Check if link exists
        if(!layer.has(targetNeighbourId))
        {
            throw NodeErrors.nonExistingLink({
                layerId: layerId.toString(),
                sourceNodeId: this.getId(),
                targetNodeId: targetNeighbourId
            });
        }

        // Getting of link from link layer
        const link: Multi_Data_Type<K, T, U> = layer.get(targetNeighbourId) as (Multi_Data_Type<K, T, U>);
        return link;
    }

    // Adds link to given link layer of current node
    public addLink<K extends keyof U & keyof Node_Links<L, T, U>, ARGS extends ARGS_LayerId<K> &
                                                                               ARGS_NeighbourId<string> &
                                                                               ARGS_Link<Link<K, T, U>>>
    (args: ARGS): void
    {
        const {
            layerId,
            link,
            neighbourId
        } = args;

        // Check if given link is incident with current node
        if(!((link.getSource() as unknown as Node<L, T, U>) == this || (link.getTarget() as unknown as Node<L, T, U>) == this))
        {
            throw NodeErrors.nonIncident({
                layerId: layerId.toString(),
                nodeId: this.getId(),
                sourceNodeId: link.getSource().getId(),
                targetNodeId: link.getTarget().getId()
            });
        }
        
        // Obtain information about direction and mutlilinks information of given link layer
        const layerOrientationMulti: Layer_Orientation_Multi<T, U, K> = this.hin.getOrientationMulti({
            layerId: layerId
        });
        // Obtain information about source and target nodes types of given link layer
        const layerSourceTarget = this.hin.getSourceTarget({
            layerId: layerId
        });

        // Data structure of given layer
        let layer: any;
        // Determining if current link layer is directed and source and target types are equal => structure has "in" and "out" parts
        if(layerOrientationMulti.orientation == "Directed" && layerSourceTarget.source == layerSourceTarget.target)
        {
            layer = (this.links[layerId] as { in: Multi_Gen<K, T, U>[typeof layerOrientationMulti.multi], out: Multi_Gen<K, T, U>[typeof layerOrientationMulti.multi] });
            // Determining if current node is source or target
            if((link.getSource() as unknown as Node<L, T, U>) == this)
            {
                layer = layer.out;
            }
            else if((link.getTarget() as unknown as Node<L, T, U>) == this)
            {
                layer = layer.in;
            }
        }
        else
        {
            layer = this.links[layerId];
        }

        // Determinig if given layer has enable multilinks
        if(layerOrientationMulti.multi == "Singlelinks")
        {
            // Check if given link does not already exists            
            if((layer as Multi_Gen<K, T, U>["Singlelinks"]).has(neighbourId))
            {
                const sourceThis: boolean = (link.getSource() as unknown as Node<L, T, U>) == this;
                const sourceNodeId: string = (sourceThis) ? this.getId() : neighbourId;
                const targetNodeId: string = (sourceThis) ? neighbourId : this.getId();

                throw NodeErrors.alreadyExistLink({
                    layerId: layerId.toString(),
                    sourceNodeId: sourceNodeId,
                    targetNodeId: targetNodeId
                });
            }

            // Add link to link layer
            (layer as Multi_Gen<K, T, U>["Singlelinks"]).set(neighbourId, link);
        }
        else
        {
            // Check if there is connection between current node and neighbour node
            if(!(layer as Multi_Gen<K, T, U>["Multilinks"]).get(neighbourId))
            {
                (layer as Multi_Gen<K, T, U>["Multilinks"]).set(neighbourId, new Array());
            }

            // Add link to link layer
            (layer as Multi_Gen<K, T, U>["Multilinks"]).get(neighbourId)!.push(link);
        }
    }

    /* public removeLink<ARGS extends ARGS_LayerId &
                                   ARGS_NeighbourId<T>>
    (args: ARGS): boolean
    {
        const {
            layerId,
            neighbourId
        } = args;

        const existed: boolean = this.links[layerId].delete(neighbourId);
        return existed;
    } */
};