import Node from "./node.js";
import Link from "./link.js";

export default class UnorientedNode<ID_TYPE,
                                    VALUE_TYPE,
                                    LINK_VALUE_TYPE> 
               extends Node<ID_TYPE,
                            VALUE_TYPE,
                            LINK_VALUE_TYPE>
{
    protected links: Map<ID_TYPE,
                         Link<ID_TYPE,
                              LINK_VALUE_TYPE>>;

    constructor(args: { 
        id: ID_TYPE,
        value: VALUE_TYPE
    })
    {
        super(args);
        this.links = new Map();
    }

    public addLink(args:{
        linkValue: LINK_VALUE_TYPE,
        neighborNodeId: ID_TYPE
    }): void
    {
        throw new Error("Method not implemented.");
    }

    public getLink(args: {
        neighborNodeId: ID_TYPE
    }): LINK_VALUE_TYPE
    {
        throw new Error("Method not implemented.");
    }

    public removeLink(args: {
        neighborNodeId: ID_TYPE
    }): void
    {
        throw new Error("Method not implemented.");
    }
};