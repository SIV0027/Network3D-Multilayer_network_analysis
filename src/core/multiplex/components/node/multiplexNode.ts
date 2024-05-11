import { GenericFunction, Algorithm_ARGS, NeighborNodeId_ARGS } from "../../../singlelayer/components/componentsArgsTypes.js";
import Link from "../../../singlelayer/components/link/link.js";
import Node from "../../../singlelayer/components/node/node.js";
import { NodeConstructor_ARGS } from "../../../singlelayer/components/componentsArgsTypes.js";
import { LayerId_ARGS } from "./multiplexNodeArgsTypes.js";
import { SourceTargetNodesIds_ARGS } from "../../../network/networkArgsTypes.js";
import { Link_ARGS } from "../../../singlelayer/direction/directionArgsTypes.js";

export default class MultiplexNode<ID_TYPE extends Object,
                                   VALUE_TYPE,
                                   LINK_VALUE_TYPE,
                                   LAYER_ID_TYPE extends Object>
               extends Node<ID_TYPE,
                            VALUE_TYPE,
                            LINK_VALUE_TYPE>
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    protected static nonExistingLayerErrorMsg<ARGS extends LayerId_ARGS<string>>
    (args: ARGS): string
    {
        const { 
            layerId
         } = args;
        return `Layer with ID: ${layerId} does not exists.`;
    }

    //----------------------------------------------------------------
    // nonExistingLinkErrorMsg() - return error string with IDs of
    // nodes which is not connected
    protected static nonExistingLinkInLayerErrorMsg<ARGS extends SourceTargetNodesIds_ARGS<string> &
                                                                 LayerId_ARGS<string>>
    (args: ARGS): string
    {
        const { 
            sourceNodeId,
            targetNodeId,
            layerId
        } = args;
        return `Link between nodes: ${sourceNodeId} and ${targetNodeId} in layer: ${layerId} does not exists.`;
    }

    protected static alreadyExistingLayerErrorMsg<ARGS extends LayerId_ARGS<string>>
    (args: ARGS): string
    {
        const { 
            layerId
         } = args;
        return `Layer with ID: ${layerId} already exists.`;
    }


    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    protected layers: Map<LAYER_ID_TYPE,
                          Map<ID_TYPE,
                              Link<any,
                                   ID_TYPE,
                                   VALUE_TYPE>>>;

    constructor(args: NodeConstructor_ARGS<ID_TYPE,
                                           VALUE_TYPE>)
    {
        super(args);

        this.layers = new Map<LAYER_ID_TYPE,
                             Map<ID_TYPE,
                                 Link<any,
                                      ID_TYPE,
                                      VALUE_TYPE>>>();
    }

    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------

    //----------------------------------------------------------------
    protected validateLayer<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
    (args: ARGS): Map<ID_TYPE,
                      Link<any,
                           ID_TYPE,
                           VALUE_TYPE>>
    {
        const {
            layerId
        } = args;

        // get layer from map (if not exists -> undefined is returned)
        const possibleLayer: undefined |
                             Map<ID_TYPE,
                                 Link<any,
                                      ID_TYPE,
                                      VALUE_TYPE>> = this.layers.get(layerId);

        // if "possibleLayer" == undefined => layer with id: "layerId" does not exists -> throw exception
        if(possibleLayer == undefined)
        {
            const layerIdString: string = layerId.toString();
            const errorMsg: string = MultiplexNode.nonExistingLayerErrorMsg({
                layerId: layerIdString
            });
            throw new Error(errorMsg);
        }

        return possibleLayer;
    }

    protected override validateLink<ARGS extends NeighborNodeId_ARGS<ID_TYPE> &
                                                 LayerId_ARGS<LAYER_ID_TYPE>>
    (args: ARGS): Link<LINK_VALUE_TYPE,
                       ID_TYPE,
                       VALUE_TYPE>
    {
        const {
            neighborNodeId,
            layerId
        } = args;

        const targetNodeId = neighborNodeId;

        const layer: Map<ID_TYPE,
                         Link<any,
                              ID_TYPE,
                              VALUE_TYPE>> = this.validateLayer({
                                layerId: layerId
                              });

        // get link from map (layer) (if not exists -> undefined is returned)
        const possibleLink: undefined |
                            Link<LINK_VALUE_TYPE,
                                 ID_TYPE,
                                 VALUE_TYPE> = layer.get(targetNodeId);

        // if "possibleLink" == undefined => link between id: "sourceNodeId" and id: "targetNodeId" does not exists -> throw exception
        if(possibleLink == undefined)
        {
            const sourceNodeIdString: string = this.getId().toString();
            const targetNodeIdString: string = targetNodeId.toString();
            const layerIdString: string = layerId.toString();
            const errorMsg: string = MultiplexNode.nonExistingLinkInLayerErrorMsg({
                sourceNodeId: sourceNodeIdString,
                targetNodeId: targetNodeIdString,
                layerId: layerIdString
            });
            throw new Error(errorMsg);
        }

        // exception was not throwed => link does exists => it can be returned
        return possibleLink;
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

        // POTENCIONÁLNĚ ZBYTEČNÉ -> VALIDACE MŮŽE PROBĚHNOUT UŽ V RÁMCI SÍTĚ
        // validation if layer already exists
        /* __errorThrowing__*/
        let sameIdNodeFound: Boolean = false;
        try
        {
            this.validateLayer({
                layerId: layerId
            });

            // __errorThrowing__
            sameIdNodeFound = true;
        }
        catch(_) // if not => create layer
        {
            const layer: Map<ID_TYPE,
                             Link<any,
                                  ID_TYPE,
                                  VALUE_TYPE>> = new Map<ID_TYPE,
                                                         Link<any,
                                                              ID_TYPE,
                                                              VALUE_TYPE>>();

            this.layers.set(layerId, layer);

            console.log(layerId);
        }

        // __errorThrowing__
        if(sameIdNodeFound == true)
        {
            const layerIdString: string = layerId.toString();
            const errorMsg: string = MultiplexNode.alreadyExistingLayerErrorMsg({
                layerId: layerIdString
            })
            throw Error(errorMsg);
        }
    }

    //----------------------------------------------------------------
    public override addLink<ARGS extends Link_ARGS<Link<LINK_VALUE_TYPE,
                                                        ID_TYPE,
                                                        VALUE_TYPE>> &
                                                   NeighborNodeId_ARGS<ID_TYPE> &
                                                   LayerId_ARGS<LAYER_ID_TYPE>>
    (args: ARGS): void
    {
        const {
            layerId,
            link,
            neighborNodeId
        } = args;

        const layer: Map<ID_TYPE,
                         Link<any,
                              ID_TYPE,
                              VALUE_TYPE>> = this.validateLayer({
                                layerId: layerId
                              });

        /* __errorThrowing__:
          Error throwing (of already existing link) must be out of try block */
        let linkAlreadyFound: Boolean = false;
        try
        {
            this.validateLink({
                neighborNodeId: neighborNodeId,
                layerId: layerId
            });
               
            // __errorThrowing__
            linkAlreadyFound = true;
        }
        catch(_)
        {
            // link does not exists => will be added
            layer.set(neighborNodeId, link);
        }
   
        // __errorThrowing__
        if(linkAlreadyFound == true)
        {
            const sourceNodeIdString: string = this.getId().toString();
            const targetNodeIdString: string = neighborNodeId.toString();
            const errorMsg: string = Node.alreadyExistingLinkErrorMsg({
                sourceNodeId: sourceNodeIdString,
                targetNodeId: targetNodeIdString
            });
            throw new Error(errorMsg);
        }
    }

    //----------------------------------------------------------------
    //----------------------------GETTERS-----------------------------

    //----------------------------------------------------------------
    public override getLink
    (args: Object): Link<LINK_VALUE_TYPE,
                         ID_TYPE,
                         VALUE_TYPE>
    {
        throw new Error("Method not implemented.");
    }

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------

    //----------------------------------------------------------------
    public override removeLink
    (args: Object): void
    {
        throw new Error("Method not implemented.");
    }
    
    //----------------------------------------------------------------
    public override iterateLinks<ALGORITHM_INTERFACE extends GenericFunction,
                                 ARGS extends Algorithm_ARGS<ALGORITHM_INTERFACE>>
    (args: ARGS): void
    {
        throw new Error("Method not implemented.");
    }
};