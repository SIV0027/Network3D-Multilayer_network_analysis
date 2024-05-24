import { Id_ARGS } from "./networkArgsTypes";

export default abstract class Network
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    // nonExistingNodeErrorMsg() - return error string with ID of node
    // which not exists
    protected static nonExistingNodeErrorMsg<ARGS extends Id_ARGS<string>>
    (args: ARGS): string
    {
        const {
            id
        } = args;

        return `Node with given ID: ${id} does not exists.`;
    }

    //----------------------------------------------------------------
    // alreadyExistingNodeErrorMsg() - return error string with ID of
    // node which already exists
    protected static alreadyExistingNodeErrorMsg<ARGS extends Id_ARGS<string>>
    (args: ARGS): string
    {
        const {
            id
        } = args;
        
        return `Node with given ID: ${id} already exists.`;
    }

    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------
    
    //----------------------------------------------------------------
    //----------------------------ADDERS------------------------------

    //----------------------------------------------------------------
    // addNode(...) - add node to network
    public abstract addNode(args: Object): any;

    //----------------------------------------------------------------
    // addLink(...) - add link to network
    public abstract addLink(args: Object): any;

    //----------------------------------------------------------------
    //----------------------------GETTERS-----------------------------

    //----------------------------------------------------------------
    // getNode(...) - get node of network
    public abstract getNode(args: Object): any;

    //----------------------------------------------------------------
    // getLink(...) - get link of network
    public abstract getLink(args: Object): any;

    //----------------------------------------------------------------
    // getNodesCount(...) - get count of nodes in network
    public abstract getNodesCount(args: Object): any; 
       
    //----------------------------------------------------------------
    // getLinksCount(...) - get count of links in network
    public abstract getLinksCount(args: Object): any;

    //----------------------------------------------------------------
    // getAllNodeIds(...) - get all node IDs of network
    public abstract getAllNodeIds(args: Object): any;

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------
};