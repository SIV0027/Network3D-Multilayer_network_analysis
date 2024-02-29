import Network from "./network/network.js";
import { Id, SourceTargetNodesIds, Value } from "./network/networkArgsTypes.js";

import Node from "./node.js";
import UnorientedNode from "./unorientedNode.js";

type Impossible<K extends keyof any> = {
    [P in K]: never;
  };
  
  // The secret sauce! Provide it the type that contains only the properties you want,
  // and then a type that extends that type, based on what the caller provided
  // using generics.
  type NoExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>;
  

export default class SingleLayerNetwork<NODE_ID_TYPE extends Object, //extends Object => because of error message is necessary to have toString() method
                                        NODE_VALUE_TYPE,
                                        LINK_VALUE_TYPE>
               extends Network
{
    /* Single layer network has just one layer => one map -> O(1) operations */
    protected nodes: Map<NODE_ID_TYPE,
                         Node<NODE_ID_TYPE,
                              NODE_VALUE_TYPE,
                              LINK_VALUE_TYPE>>;

    constructor()
    {
        super();

        this.nodes = new Map();
    }



    addNode<ARG_TYPE extends Id<NODE_ID_TYPE> &
                             Value<NODE_VALUE_TYPE>>
    (args: NoExtraProperties<Id<NODE_ID_TYPE> & Value<NODE_VALUE_TYPE>, ARG_TYPE>): void //???
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

    addLink<ARG_TYPE extends SourceTargetNodesIds<NODE_ID_TYPE> & Impossible<Exclude<keyof ARG_TYPE, keyof SourceTargetNodesIds<NODE_ID_TYPE>>>>
    (args: ARG_TYPE): void
    {
        const num = 5 + 3;
        num;
        //throw new Error("Method not implemented.");
    }

    getNode<ARG_TYPE extends Id<NODE_ID_TYPE>>
    (args: ARG_TYPE): NODE_VALUE_TYPE
    {
        const { id } = args;

        const node: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE,
                         LINK_VALUE_TYPE> | undefined = this.nodes.get(id);

        if(node == undefined)
        {
            throw new Error(Network.nonExistingNodeErrorMsg(id.toString()));
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