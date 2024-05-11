import Node from "../node/node.js";
import Link from "../link/link.js";
import { Algorithm_ARGS, Link_ARGS, NeighborNodeId_ARGS, NodeConstructor_ARGS } from "../componentsArgsTypes.js";




export default class UndirectedNode<ID_TYPE extends Object,
                                    VALUE_TYPE,
                                    LINK_VALUE_TYPE> 
               extends Node<ID_TYPE,
                            VALUE_TYPE,
                            LINK_VALUE_TYPE>
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    protected links: Map<ID_TYPE,
                         Link<LINK_VALUE_TYPE,
                              ID_TYPE,
                              VALUE_TYPE>>;

    constructor(args: NodeConstructor_ARGS<ID_TYPE,
                                           VALUE_TYPE>)
    {
        super(args);

        this.links = new Map<ID_TYPE,
                             Link<LINK_VALUE_TYPE,
                                  ID_TYPE,
                                  VALUE_TYPE>>();
    }


    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------

    //----------------------------------------------------------------
    // validateLink() - check if link exists (if node is connected)
    // with neighbor (given ID), if it -> return link, if not -> throw
    // non-exsting link error
    protected override validateLink<ARGS extends NeighborNodeId_ARGS<ID_TYPE>>
    (args: ARGS): Link<LINK_VALUE_TYPE,
                       ID_TYPE,
                       VALUE_TYPE>
    {
        const { neighborNodeId } = args;
        const targetNodeId = neighborNodeId;

        // get link from map (if not exists -> undefined is returned)
        const possibleLink: undefined |
                            Link<LINK_VALUE_TYPE,
                                 ID_TYPE,
                                 VALUE_TYPE> = this.links.get(targetNodeId);

        // if "possibleLink" == undefined => link between id: "sourceNodeId" and id: "targetNodeId" does not exists -> throw exception
        if(possibleLink == undefined)
        {
            const sourceNodeIdString: string = this.getId().toString();
            const targetNodeIdString: string = targetNodeId.toString();
            const errorMsg: string = Node.nonExistingLinkErrorMsg({
                sourceNodeId: sourceNodeIdString,
                targetNodeId: targetNodeIdString
            });
            throw new Error(errorMsg);
        }

        // exception was not throwed => link does exists => it can be returned
        return possibleLink;
    }

    //----------------------------------------------------------------
    //----------------------------ADDERS------------------------------

    //----------------------------------------------------------------
    // addLink() - add link (and its value) between current node and 
    // node its ID is given as argument
    public  override addLink<ARGS extends Link_ARGS<Link<LINK_VALUE_TYPE,
                                                         ID_TYPE,
                                                         VALUE_TYPE>> &
                                          NeighborNodeId_ARGS<ID_TYPE>>
    (args: ARGS): void
    {
        const { 
            link,
            neighborNodeId
        } = args;

        /* check if link with between current node and node with given ID already exists 
           (by validateLink(...) method) - if do not, validateLink(...) method throw Error
           and in catch block is new link (with given value) created and added, if link
           already exists, Error is thrown */

        /* __errorThrowing__:
           Error throwing (of already existing link) must be out of try block */
        let linkAlreadyFound: Boolean = false;
        try
        {
            this.validateLink({
                neighborNodeId: neighborNodeId
            });
            
            // __errorThrowing__
            linkAlreadyFound = true;
        }
        catch(_)
        {
            // link does not exists => will be added

            this.links.set(neighborNodeId, link);
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
    // getLink() - return link by neighbor ID
    public override getLink<ARGS extends NeighborNodeId_ARGS<ID_TYPE>>
    (args: ARGS): Link<LINK_VALUE_TYPE,
                       ID_TYPE,
                       VALUE_TYPE>
    {
        const { neighborNodeId } = args;

        // Validate link, if exists -> return link
        const link: Link<LINK_VALUE_TYPE,
                         ID_TYPE,
                         VALUE_TYPE> |
                    undefined = this.validateLink({
                        neighborNodeId: neighborNodeId
                    });

        return link;
    }

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------

    //----------------------------------------------------------------
    // removeLink() - remove link of node by given neighbor ID
    public override removeLink(args: {
        neighborNodeId: ID_TYPE
    }): void
    {
        args;

        throw new Error("Method not implemented.");
    }

    //----------------------------------------------------------------
    // iterateLinks(...) - access to links of current node
    public override iterateLinks<ARGS extends Algorithm_ARGS<(args: { neighbourId: ID_TYPE
                                                                      link: Link<LINK_VALUE_TYPE,
                                                                                 ID_TYPE,
                                                                                 VALUE_TYPE> }) => void>>
    (args: ARGS): void
    {
        //ZOBECNIT SUB_ARGS (ARGS předávaného algoritmu) - Z NĚJAKÉHO DŮVODU TO VYHAZUJE CHYBU
        
        const { algorithm } = args;

        for(const [id, link] of this.links)
        {
            algorithm({
                neighbourId: id,
                link: link
            });
        }
    }
};