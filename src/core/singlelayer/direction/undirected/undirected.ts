import Direction from "../direction.js"; "./direction.js";
import UndirectedNode from "../../components/underictedNode/undirectedNode.js";
import Node from "../../components/node/node.js";
import { Id_ARGS, Value_ARGS } from "../../../network/networkArgsTypes.js";
import Link from "../../components/link/link.js";
import { SourceTargetNodes_ARGS, Link_ARGS } from "../directionArgsTypes.js";

export default class Undirected<NODE_ID_TYPE extends Object,
                                NODE_VALUE_TYPE,
                                LINK_VALUE_TYPE>
               extends Direction<NODE_ID_TYPE,
                                 NODE_VALUE_TYPE,
                                 LINK_VALUE_TYPE>
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------

    //----------------------------------------------------------------
    //----------------------------ADDERS------------------------------

    //----------------------------------------------------------------
    // addLinkBetweenNodes() - add given link between given nodes
    public override addLinkBetweenNodes<ARGS extends SourceTargetNodes_ARGS<Node<NODE_ID_TYPE, 
                                                                                 NODE_VALUE_TYPE,
                                                                                 LINK_VALUE_TYPE>> & 
                                                                            Link_ARGS<Link<LINK_VALUE_TYPE,
                                                                                           NODE_ID_TYPE,
                                                                                           NODE_VALUE_TYPE>>>
    (args: ARGS): void
    {

        const { 
            sourceNode,
            targetNode,
            link
        } = args;

            const sourceNodeNeighborId: NODE_ID_TYPE = targetNode.getId();
            (sourceNode as UndirectedNode<NODE_ID_TYPE, 
                                          NODE_VALUE_TYPE,
                                          LINK_VALUE_TYPE>).addLink({
                                                link: link,
                                                neighborNodeId: sourceNodeNeighborId
                                            });

            const targetNodeNeighborId: NODE_ID_TYPE = sourceNode.getId();
            (targetNode as UndirectedNode<NODE_ID_TYPE, 
                                          NODE_VALUE_TYPE,
                                          LINK_VALUE_TYPE>).addLink({
                                                link: link,
                                                neighborNodeId: targetNodeNeighborId
                                            });
    } 

    //----------------------------------------------------------------
    //----------------------------GETTERS-----------------------------
    public override getAllLinks(args: {
        nodes: Map<NODE_ID_TYPE,
                   Node<NODE_ID_TYPE,
                        NODE_VALUE_TYPE,
                        LINK_VALUE_TYPE>> 
    }): Array<Link<LINK_VALUE_TYPE,
                   NODE_ID_TYPE,
                   NODE_VALUE_TYPE>>
    {
        const {
            nodes
        } = args;

        const links: Array<Link<LINK_VALUE_TYPE,
                                NODE_ID_TYPE,
                                NODE_VALUE_TYPE>> = new Array<Link<LINK_VALUE_TYPE,
                                                                   NODE_ID_TYPE,
                                                                   NODE_VALUE_TYPE>>();

        for(const [_, node] of nodes)
        {
            (node as UndirectedNode<NODE_ID_TYPE,
                                     NODE_VALUE_TYPE,
                                     LINK_VALUE_TYPE>).iterateLinks({
                                        algorithm: (args: {
                                            neighbourId: NODE_ID_TYPE
                                            link: Link<LINK_VALUE_TYPE,
                                                       NODE_ID_TYPE,
                                                       NODE_VALUE_TYPE>
                                        }) =>
                                        {
                                            const {
                                                link
                                            } = args;

                                            links.push(link);
                                        }
                                     });
        }

        return links;
    }

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------ 

    //----------------------------------------------------------------
    // createNode() - create undirected node and return its 
    // abstract supertype (Node)
    public override createNode<ARGS extends Id_ARGS<NODE_ID_TYPE> & 
                                            Value_ARGS<NODE_VALUE_TYPE>>
    (args: ARGS): Node<NODE_ID_TYPE,
                       NODE_VALUE_TYPE,
                       LINK_VALUE_TYPE>
    {
        const { 
            id,
            value
        } = args;

        const createdNode: UndirectedNode<NODE_ID_TYPE,
                                          NODE_VALUE_TYPE,
                                          LINK_VALUE_TYPE> = new UndirectedNode({
            id: id,
            value: value
        });
        
        return createdNode;
    }

    
};