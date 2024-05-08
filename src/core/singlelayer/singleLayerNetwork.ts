import Network from "../network/network.js";
import { Id_ARGS, SourceTargetNodesIds_ARGS, Value_ARGS } from "../network/networkArgsTypes.js";

import Direction from "./direction/direction.js";

import Node from "./components/node/node.js";
import Link from "./components/link/link.js";
import { SingleLayerNetworkConstructor_ARGS } from "./singleLayerNetworkTypes.js";

export namespace Core
{
    export class SingleLayerNetwork<NODE_ID_TYPE extends Object, //extends Object => because of error message is necessary to have toString() method
                                    NODE_VALUE_TYPE,
                                    LINK_VALUE_TYPE>
    extends Network
    {
        //----------------------------------------------------------------
        //----------------------------STATIC------------------------------
        //----------------------------------------------------------------

        //----------------------------------------------------------------
        //---------------------------INSTANCE-----------------------------
        //----------------------------------------------------------------

        /* Network could (must) be undirected or directed */
        protected direction: Direction<NODE_ID_TYPE,
                                       NODE_VALUE_TYPE,
                                       LINK_VALUE_TYPE>;
        /* Single layer network has just one layer => one map -> Theta(1) operations */
        protected nodes: Map<NODE_ID_TYPE,
                             Node<NODE_ID_TYPE,
                                  NODE_VALUE_TYPE,
                                  LINK_VALUE_TYPE>>;

        protected linksCount: number;

        constructor(args: SingleLayerNetworkConstructor_ARGS<NODE_ID_TYPE,
                                                             NODE_VALUE_TYPE,
                                                             LINK_VALUE_TYPE>)
        {
            super();

            const { direction } = args;

            this.direction = direction;
            this.nodes = new Map();

            this.linksCount = 0;
        }

        //----------------------------------------------------------------
        //-----------------------------HELP-------------------------------

        //----------------------------------------------------------------
        // validateNodeId() - check if node does exists in network, if does
        // -> return this node, if not -> throw non-existing node error
        protected validateNodeId<ARGS extends Id_ARGS<NODE_ID_TYPE>>
        (args: ARGS): Node<NODE_ID_TYPE,
                        NODE_VALUE_TYPE,
                        LINK_VALUE_TYPE>
        {
            const { id } = args;

            const possibleNode: undefined |
                                Node<NODE_ID_TYPE,
                                    NODE_VALUE_TYPE,
                                    LINK_VALUE_TYPE> = this.nodes.get(id);

            // if "possibleNode" == undefined => lnik with id: "id" does not exists -> throw exception
            if(possibleNode == undefined)
            {
                const idString: string = id.toString();
                const errorMsg: string = SingleLayerNetwork.nonExistingNodeErrorMsg({
                    id: idString
                });
                throw new Error(errorMsg);
            }

            // exception was not throwed => node does exists => it can be returned
            return possibleNode;
        }

        //----------------------------------------------------------------
        //----------------------------ADDERS------------------------------

        //----------------------------------------------------------------
        // addNode() - add new node to network, if node (with given ID) is
        // already exists -> throw already exists node error
        public override addNode<ARGS extends Id_ARGS<NODE_ID_TYPE> &
                                            Value_ARGS<NODE_VALUE_TYPE>>
        (args: ARGS): void
        {
            const { id, value } = args;

            /* check if node with given ID already exists (by validateNodeId(...) method)
            if do not, validateNodeId(...) method throw Error and in catch block is
            new node (with given ID) created and added, if node already exists, Error
            is thrown */

            /* __errorThrowing__:
            Error throwing (of already existing node) must be out of try block */
            let sameIdNodeFound: Boolean = false;
            try
            {
                this.validateNodeId({
                    id: id
                });

                // __errorThrowing__
                sameIdNodeFound = true;
            } 
            catch(error)
            {
                const node: Node<NODE_ID_TYPE,
                                NODE_VALUE_TYPE,
                                LINK_VALUE_TYPE> = this.direction.createNode({
                                    id: id,
                                    value: value
                                });

                this.nodes.set(id, node);
            }

            // __errorThrowing__
            if(sameIdNodeFound == true)
            {
                const idString: string = id.toString();
                const errorMsg = SingleLayerNetwork.alreadyExistingNodeErrorMsg({
                    id: idString
                });
                throw new Error(errorMsg);
            }
        }

        //----------------------------------------------------------------
        // addLink() - add link with given value between nodes with given
        // IDs, if one of nodes (or both) does not exists -> throw
        // non-existing node error, if link already exists -> throw already
        // existing link error
        public override addLink<ARGS extends SourceTargetNodesIds_ARGS<NODE_ID_TYPE> &
                                            Value_ARGS<LINK_VALUE_TYPE>>
        (args: ARGS): void
        {
            const { sourceNodeId, targetNodeId, value } = args;

            // validate if nodes with given IDs exists
            const sourceNode: Node<NODE_ID_TYPE,
                                NODE_VALUE_TYPE,
                                LINK_VALUE_TYPE> = this.validateNodeId({
                                                        id: sourceNodeId
                                                    });

            const targetNode: Node<NODE_ID_TYPE,
                                NODE_VALUE_TYPE,
                                LINK_VALUE_TYPE> = this.validateNodeId({
                                                        id: targetNodeId
                                                    });
            
            // if nodes with given IDs exists -> create link                                                      
            const link: Link<LINK_VALUE_TYPE,
                            NODE_ID_TYPE,
                            NODE_VALUE_TYPE> = new Link({
                                                        source: sourceNode,
                                                        target: targetNode,
                                                        value: value                             
                                                        });

            // try to add created link between nodes with given IDs -> it can exists already => try-catch block
            try
            {
                this.direction.addLinkBetweenNodes({
                    sourceNode: sourceNode,
                    targetNode: targetNode,
                    link: link
                });

                this.linksCount++;
            }
            catch(error)
            {
                // delete link in both nodes -> prevent of adding link to one node and not to another
                // (theoretically not possible) -> prevent to have consistent state

                //VYMAZAT PŘÍSLUŠNOU VAZBU U OBOU UZLŮ

                if(typeof error === "string")
                {
                    throw new Error(error);
                }
                else if(error instanceof Error)
                {
                    throw error;
                }
            }
        }

        //----------------------------------------------------------------
        //----------------------------GETTERS-----------------------------

        //----------------------------------------------------------------
        // getNode() - return node value by given ID, if node (with given
        // ID) does not exists -> throw non-existing node error
        public override getNode<ARGS extends Id_ARGS<NODE_ID_TYPE>>
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

        //----------------------------------------------------------------
        // getLink() - return link value by IDs of nodes, which it connect
        // them, if one of node (or both) does not exists -> throw
        // non-existing node error, if link does not exists -> throw
        // non-existing link
        public override getLink<ARGS extends SourceTargetNodesIds_ARGS<NODE_ID_TYPE>>
        (args: ARGS): LINK_VALUE_TYPE
        {
            const { sourceNodeId, targetNodeId } = args;

            // validate if nodes with given IDs exists
            const sourceNode: Node<NODE_ID_TYPE,
                                            NODE_VALUE_TYPE,
                                            LINK_VALUE_TYPE> = this.validateNodeId({
                                                        id: sourceNodeId
                                                    });

            const targetNode: Node<NODE_ID_TYPE,
                                            NODE_VALUE_TYPE,
                                            LINK_VALUE_TYPE> = this.validateNodeId({
                                                        id: targetNodeId
                                                    });


            const sourceNodeNeighborId: NODE_ID_TYPE = targetNode.getId();
            const link: Link<LINK_VALUE_TYPE,
                            NODE_ID_TYPE,
                            NODE_VALUE_TYPE> = sourceNode.getLink({
                                neighborNodeId: sourceNodeNeighborId,
                            });

            const linkValue: LINK_VALUE_TYPE = link.getValue();

            return linkValue;
        }

        //----------------------------------------------------------------
        // getNodesCount() - return number of nodes in network
        public override getNodesCount(): number
        {
            return this.nodes.size;
        }

        //----------------------------------------------------------------
        // getLinksCount() - return number of links in network
        public override getLinksCount(): number
        {
            return this.linksCount;
        }

        //----------------------------------------------------------------
        //----------------------------OTHERS------------------------------
    };
};