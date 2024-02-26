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
    /* Single layer network has just one layer => one map -> O(1) operations */
    protected nodes: Map<NODE_ID_TYPE,
                         Node<NODE_ID_TYPE,
                              NODE_VALUE_TYPE,
                              LINK_VALUE_TYPE>>;

    constructor()
    {
        this.nodes = new Map();
    }
    


    //PŘIDAT PRIVÁTNÍ METODU PRO VALIDACI EXISTENCE UZLU A ZKUSIT PŘEPSAT ROZHRANÍ Network NA
    //ABSTRAKTNÍ TŘÍDU




    addNode(args: {
        id: NODE_ID_TYPE;
        value: NODE_VALUE_TYPE;
    }): void
    {
        const { id, value } = args;

        /* check if node with given ID already exists (by getNode(...) method)
           if do not, getNode(...) method throw Error and in catch is new node 
           (with given ID) is created and added, if already exists, Error is thrown */

        /* __errorThrowing__:
           Error throwing (of no existing node) must be out of try block */
        let sameIdNodeFound: Boolean = false;
        try
        {
            this.getNode({ id: id });

            //__errorThrowing__
            sameIdNodeFound = true;
        } 
        catch(error)
        {
            const node: Node<NODE_ID_TYPE,
                             NODE_VALUE_TYPE,
                             LINK_VALUE_TYPE> = new UnorientedNode({ 
                                                                        id: id,
                                                                        value: value
                                                                    });

            this.nodes.set(id, node);
        }

        //__errorThrowing__
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

        return node.getValue();
    }

    getLink(args: {
        sourceNodeId: NODE_ID_TYPE;
        targetNodeId: NODE_ID_TYPE;
    }): LINK_VALUE_TYPE
    {
        throw new Error("Method not implemented.");
    }

    getNodesCount(): number
    {
        return this.nodes.size;
    }

    getLinksCount(): number
    {
        throw new Error("Method not implemented.");
    }    
};