import { Id } from "./networkArgsTypes";

export default abstract class Network
{
    protected static nonExistingNodeErrorMsg<ARGS extends Id<string>>
    (args: ARGS): string
    {
        const { id } = args;
        return `Node with given ID: ${id} does not exists.`;
    }

    protected static alreadyExistingNodeErrorMsg<ARGS extends Id<string>>
    (args: ARGS): string
    {
        const { id } = args;
        return `Node with given ID: ${id} already exists.`;
    }

    //--------------------------------------------------------------------------------
    //-----------------------------HELP-------------------------------
    protected abstract validateNodeId(args: Object): any;
    //--------------------------------------------------------------------------------
    //-----------------------------ADDERS-----------------------------
    public abstract addNode(args: Object): any;
    public abstract addLink(args: Object): any;
    //--------------------------------------------------------------------------------
    //-----------------------------GETTERS-----------------------------
    public abstract getNode(args: Object): any;
    public abstract getLink(args: Object): any;
    public abstract getNodesCount(args: Object): any;    
    public abstract getLinksCount(args: Object): any;
};