import Network from "../network/network.js";
import { Id_ARGS, SourceTargetNodesIds_ARGS, Value_ARGS } from "../network/networkArgsTypes.js";
import Link from "../singlelayer/components/link/link.js";
import MultiplexNode from "./components/node/multiplexNode.js";
import { LayerId_ARGS } from "./components/node/multiplexNodeArgsTypes.js";

export namespace Core
{
    export class MultiplexNetwork<NODE_ID_TYPE extends Object,
                                  NODE_VALUE_TYPE,
                                  LAYER_ID_TYPE extends Object>
    extends Network
    {
        //----------------------------------------------------------------
        //----------------------------STATIC------------------------------
        //----------------------------------------------------------------
        protected static alreadyExistingLayerErrorMsg<ARGS extends LayerId_ARGS<string>>
        (args: ARGS): string
        {
            const { 
                layerId
            } = args;

            return `Layer with given ID: ${layerId} already exists.`;
        }

        //----------------------------------------------------------------
        //---------------------------INSTANCE-----------------------------
        //----------------------------------------------------------------

        protected nodes: Map<NODE_ID_TYPE,
                             MultiplexNode<NODE_ID_TYPE,
                                           NODE_VALUE_TYPE,
                                           undefined,
                                           LAYER_ID_TYPE>>;

        protected layers: Array<LAYER_ID_TYPE>;

        constructor()
        {
            super();

            this.nodes = new Map<NODE_ID_TYPE,
                                 MultiplexNode<NODE_ID_TYPE,
                                               NODE_VALUE_TYPE,
                                               undefined,
                                               LAYER_ID_TYPE>>();
            this.layers = new Array<LAYER_ID_TYPE>();
        }

        //----------------------------------------------------------------
        //-----------------------------HELP-------------------------------
        protected validateNodeId<ARGS extends Id_ARGS<NODE_ID_TYPE>>
        (args: ARGS): MultiplexNode<NODE_ID_TYPE,
                                    NODE_VALUE_TYPE,
                                    undefined,
                                    LAYER_ID_TYPE>
        {
            const { id } = args;

            const possibleNode: undefined |
                                MultiplexNode<NODE_ID_TYPE,
                                NODE_VALUE_TYPE,
                                undefined,
                                LAYER_ID_TYPE> = this.nodes.get(id);

            // if "possibleNode" == undefined => lnik with id: "id" does not exists -> throw exception
            if(possibleNode == undefined)
            {
                const idString: string = id.toString();
                const errorMsg: string = MultiplexNetwork.nonExistingNodeErrorMsg({
                    id: idString
                });
                throw new Error(errorMsg);
            }

            // exception was not throwed => node does exists => it can be returned
            return possibleNode;
        }

        protected validateLayerId<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const {
                layerId
            } = args;

            if(this.layers.includes(layerId))
            {
                const layerIdString: string = layerId.toString();
                const errorMsg: string = MultiplexNetwork.alreadyExistingLayerErrorMsg({
                    layerId: layerIdString
                });
                throw new Error(errorMsg);
            }
        }

        //----------------------------------------------------------------
        //----------------------------ADDERS------------------------------

        //----------------------------------------------------------------
        public addLayer<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const { 
                layerId
            } = args;

            this.validateLayerId({
                layerId: layerId
            });

            this.layers.push(layerId);

            for(const [_, node] of this.nodes)
            {
                node.addLayer({
                    layerId: layerId
                });
            }
        }

        //----------------------------------------------------------------
        public override addNode<ARGS extends Id_ARGS<NODE_ID_TYPE> &
                                             Value_ARGS<NODE_VALUE_TYPE>>
        (args: ARGS): void
        {
            const { 
                id,
                value
            } = args;

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
                const node: MultiplexNode<NODE_ID_TYPE,
                                          NODE_VALUE_TYPE,
                                          undefined,
                                          LAYER_ID_TYPE> = new MultiplexNode<NODE_ID_TYPE,
                                                                            NODE_VALUE_TYPE,
                                                                            undefined,
                                                                            LAYER_ID_TYPE>({
                                                                                id: id,
                                                                                value: value
                                                                            });

                for(const layerId of this.layers)
                {
                    node.addLayer({
                        layerId: layerId
                    });
                }

                this.nodes.set(id, node);
            }

            // __errorThrowing__
            if(sameIdNodeFound == true)
            {
                const idString: string = id.toString();
                const errorMsg = MultiplexNetwork.alreadyExistingNodeErrorMsg({
                    id: idString
                });
                throw new Error(errorMsg);
            }
        }

        //----------------------------------------------------------------
        public override addLink<ARGS extends SourceTargetNodesIds_ARGS<NODE_ID_TYPE> &
                                             Value_ARGS<any> &
                                             LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const { 
                sourceNodeId,
                targetNodeId,
                value,
                layerId
            } = args;

            // validate if nodes with given IDs exists
            const sourceNode: MultiplexNode<NODE_ID_TYPE,
                                            NODE_VALUE_TYPE,
                                            undefined,
                                            LAYER_ID_TYPE> = this.validateNodeId({
                                                                id: sourceNodeId
                                                            });

            const targetNode: MultiplexNode<NODE_ID_TYPE,
                                            NODE_VALUE_TYPE,
                                            undefined,
                                            LAYER_ID_TYPE> = this.validateNodeId({
                                                                id: targetNodeId
                                                            });
            
            // if nodes with given IDs exists -> create link                                                      
            const link: Link<any,
                             NODE_ID_TYPE,
                             NODE_VALUE_TYPE> = new Link({
                                                            source: sourceNode,
                                                            target: targetNode,
                                                            value: value                             
                                                        });

            // try to add created link between nodes with given IDs -> it can exists already => try-catch block
            try
            {
                sourceNode.addLink({
                    layerId: layerId,
                    link: link,
                    neighborNodeId: targetNode.getId()
                });

                targetNode.addLink({
                    layerId: layerId,
                    link: link,
                    neighborNodeId: sourceNode.getId()
                });

                //this.linksCount++;
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
        public getLayersList
        (): Array<LAYER_ID_TYPE>
        {
            return this.layers;
        }

        public override getNode
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        public override getLink
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        public override getNodesCount
        (): number
        {
            return this.nodes.size;
        }

        //----------------------------------------------------------------
        public override getLinksCount
        (args: Object)
        {
            throw new Error("Method not implemented.");
        }

        //----------------------------------------------------------------
        //----------------------------OTHERS------------------------------

    };
};