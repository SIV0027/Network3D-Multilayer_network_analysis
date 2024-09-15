import { 
    TT,
    TU
} from "../hin/hin_types.js";

import { 
    Node
} from "./../node/node.js";

import {
    ARGS_Link_Constructor
} from "./link_types.js";

// This class represents link between two nodes
// It gets (generics) link layer where belongs to, types (layers) of nodes (because of nodes which connected is to) and types (layers) of links
export class Link<L extends keyof U, T extends TT, U extends TU<T>>
{
    // Reference to source node
    private source: Node<U[L]["source"], T, U>;
    // Reference to target node
    private target: Node<U[L]["target"], T, U>;
    // value ("weight") of link
    private value: U[L]["value"];

    // Link is initialized by reference to source node, reference to target node and its value ("weight")
    constructor(args: ARGS_Link_Constructor<U[L]["source"], U[L]["target"], T, U, U[L]["value"]>)
    {
        const {
            source,
            target,
            value
        } = args;

        this.source = source;
        this.target = target;
        this.value = value;
    }

    // Getter of source node
    public getSource
    (): Node<U[L]["source"], T, U>
    {
        return this.source;
    }

    // Getter of target node
    public getTarget
    (): Node<U[L]["target"], T, U>
    {
        return this.target;
    }

    // Getter of value ("weight")
    public getValue
    (): U[L]["value"]
    {
        return this.value;
    }
};