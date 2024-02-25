import Network from "./network.js";

import Node from "./node.js";
import UnorientedNode from "./unorientedNode.js";

export default class SingleLayerNetwork<NODE_ID_TYPE,
                                        NODE_VALUE_TYPE,
                                        LINK_VALUE_TYPE>
               implements Network<NODE_ID_TYPE,
                                  NODE_VALUE_TYPE,
                                  LINK_VALUE_TYPE>
{
    protected nodes: Map<NODE_ID_TYPE,
                         Node<NODE_ID_TYPE,
                              NODE_VALUE_TYPE,
                              LINK_VALUE_TYPE>>;

    protected oriented: Boolean;

    constructor(args: {
        oriented: Boolean
    })
    {
        this.nodes = new Map();

        this.oriented = args.oriented;
    }
    
    addNode(args: {
        id: NODE_ID_TYPE;
        value: NODE_VALUE_TYPE; }): void
    {
        const { id, value } = args;

        let sameIdNodeFound: Boolean = false;
        try
        {
            this.getNode({ id: id });

            sameIdNodeFound = true;
        } 
        catch(error)
        {
            const node: Node<NODE_ID_TYPE,
                             NODE_VALUE_TYPE,
                             LINK_VALUE_TYPE> = new UnorientedNode<NODE_ID_TYPE,
                                                                   NODE_VALUE_TYPE,
                                                                   LINK_VALUE_TYPE>({ 
                                                                                        id: id,
                                                                                        value: value
                                                                                     });

            this.nodes.set(id, node);
        }

        if(sameIdNodeFound == true)
        {
            throw new Error(`Node with given ID: ${id} already exists.`);
        }
    }

    addLink(args: {
        sourceNodeId: NODE_ID_TYPE;
        targetNodeId: NODE_ID_TYPE;
        value?: LINK_VALUE_TYPE | undefined;
    }): void
    {
        throw new Error("Method not implemented.");
    }

    getNode(args: {
        id: NODE_ID_TYPE;
    }): NODE_VALUE_TYPE
    {
        const { id } = args;

        const node: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE,
                         LINK_VALUE_TYPE> | undefined = this.nodes.get(id);

        if(node == undefined)
        {
            throw new Error(`Node with given ID: ${id} does not exists.`);
        }

        const value: NODE_VALUE_TYPE = node.getValue();
        return value;
    }

    getLink(args: {
        sourceNodeId: NODE_ID_TYPE;
        targetNodeId: NODE_ID_TYPE;
    }): LINK_VALUE_TYPE
    {
        throw new Error("Method not implemented.");
    }

    getNodesCount(): Number
    {
        throw new Error("Method not implemented.");
    }

    getLinksCount(): Number
    {
        throw new Error("Method not implemented.");
    }    
};