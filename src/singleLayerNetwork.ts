import Network from "./network/network.js";
import { Id, SourceTargetNodesIds, Value } from "./network/networkArgsTypes.js";

import Node from "./node.js";
import UnorientedNode from "./unorientedNode.js";

  

export default class SingleLayerNetwork<NODE_ID_TYPE extends Object, //extends Object => because of error message is necessary to have toString() method
                                        NODE_VALUE_TYPE,
                                        LINK_VALUE_TYPE>
               extends Network
{
    /* Single layer network has just one layer => one map -> Theta(1) operations */
    protected nodes: Map<NODE_ID_TYPE,
                         Node<NODE_ID_TYPE,
                              NODE_VALUE_TYPE,
                              LINK_VALUE_TYPE>>;

    constructor()
    {
        super();

        this.nodes = new Map();
    }

    //--------------------------------------------------------------------------------
    //-----------------------------HELP-------------------------------
    protected override validateNodeId<ARGS extends Id<NODE_ID_TYPE>>
    (args: ARGS): Node<NODE_ID_TYPE,
                       NODE_VALUE_TYPE,
                       LINK_VALUE_TYPE>
    {
        const { id } = args;

        const possibleNode: undefined |
                            Node<NODE_ID_TYPE,
                                 NODE_VALUE_TYPE,
                                 LINK_VALUE_TYPE> = this.nodes.get(id);

        //if "possibleNode" == undefined => node with id: "id" does not exists -> throw exception
        if(possibleNode == undefined)
        {
            const idString: string = id.toString();
            const errorMsg: string = SingleLayerNetwork.nonExistingNodeErrorMsg({
                id: idString
            });
            throw new Error(errorMsg);
        }

        //exception was not throwed => node does exists => it can be returned
        return possibleNode;
    }

    //--------------------------------------------------------------------------------
    //-----------------------------ADDERS-----------------------------
    public override addNode<ARGS extends Id<NODE_ID_TYPE> &
                             Value<NODE_VALUE_TYPE>>
    (args: ARGS): void
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
            this.validateNodeId({
                id: id
            });

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
            const idString: string = id.toString();
            const errorMsg = SingleLayerNetwork.alreadyExistingNodeErrorMsg({
                id: idString
            });
            throw new Error(errorMsg);
        }
    }

    public override addLink<ARGS extends SourceTargetNodesIds<NODE_ID_TYPE>>
    (args: ARGS): void
    {
        args;
        throw new Error("not implement method");

        //DODĚLAT!!!
        /* const { sourceNodeId, targetNodeId } = args;

         const sourceNode: Node<NODE_ID_TYPE,
                               NODE_VALUE_TYPE,
                               LINK_VALUE_TYPE> = this.validateNodeId({
                                    id: sourceNodeId
                                });
        const targetNode: Node<NODE_ID_TYPE,
                               NODE_VALUE_TYPE,
                               LINK_VALUE_TYPE> = this.validateNodeId({
                                    id: targetNodeId
                                }); */                
    }

    //--------------------------------------------------------------------------------
    //-----------------------------GETTERS-----------------------------
    public override getNode<ARGS extends Id<NODE_ID_TYPE>>
    (args: ARGS): NODE_VALUE_TYPE
    {
        const { id } = args;

        const node: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE,
                         LINK_VALUE_TYPE> = this.validateNodeId({
                            id: id
                         });

        return node.getValue();
    }

    public override getLink(args: {
        sourceNodeId: NODE_ID_TYPE;
        targetNodeId: NODE_ID_TYPE;
    }): LINK_VALUE_TYPE
    {
        throw new Error("Method not implemented.");
    }

    public override getNodesCount(): number
    {
        return this.nodes.size;
    }

    public override getLinksCount(): number
    {
        throw new Error("Method not implemented.");
    }    
};