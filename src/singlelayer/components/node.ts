import { SourceTargetNodesIds_ARGS } from "../network/networkArgsTypes";
import { NodeConstructor_ARGS } from "./componentsArgsTypes";
import Link from "./link";

export default abstract class Node<ID_TYPE extends Object,
                                   VALUE_TYPE,
                                   LINK_VALUE_TYPE>
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------    

    //----------------------------------------------------------------
    // nonExistingLinkErrorMsg() - return error string with IDs of
    // nodes which is not connected
    protected static nonExistingLinkErrorMsg<ARGS extends SourceTargetNodesIds_ARGS<string>>
    (args: ARGS): string
    {
        const { sourceNodeId, targetNodeId } = args;
        return `Link between nodes: ${sourceNodeId} and ${targetNodeId} does not exists.`;
    }

    // alreadyExistingLinkErrorMsg() - return error string with IDs of
    // nodes which is already connected
    protected static alreadyExistingLinkErrorMsg<ARGS extends SourceTargetNodesIds_ARGS<string>>
    (args: ARGS): string
    {
        const { sourceNodeId, targetNodeId } = args;
        return `Link between nodes: ${sourceNodeId} and ${targetNodeId} already exists.`;
    }

    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    private id: ID_TYPE;
    private value: VALUE_TYPE;

    constructor(args: NodeConstructor_ARGS<ID_TYPE,
                                           VALUE_TYPE>)
    {
        const { id, value } = args;

        this.id = id;
        this.value = value;
    }

    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------

    //----------------------------------------------------------------
    // validateLink() - check if exists link and return it
    protected abstract validateLink(args: Object): Link<LINK_VALUE_TYPE,
                                                        ID_TYPE,
                                                        VALUE_TYPE>;

    //----------------------------------------------------------------
    //----------------------------ADDERS------------------------------

    //----------------------------------------------------------------
    // addLink() - add link to node
    public abstract addLink(args: Object): void;

    //----------------------------------------------------------------
    //----------------------------GETTERS-----------------------------

    //----------------------------------------------------------------
    // getLink() - return link of node
    public abstract getLink(args: Object): Link<LINK_VALUE_TYPE,
                                                ID_TYPE,
                                                VALUE_TYPE>;

    //----------------------------------------------------------------
    // getId() - return ID of node
    public getId(): ID_TYPE
    {
        return this.id;
    }

    //----------------------------------------------------------------
    // getValue() - return value of node
    public getValue(): VALUE_TYPE
    {
        return this.value;
    }

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------
    // removeLink() - remove link of node
    public abstract removeLink(args: Object): void;
};