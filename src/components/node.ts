import { SourceTargetNodesIds_ARGS } from "../network/networkArgsTypes";
import { NodeConstructor_ARGS } from "./componentsArgsType";

export default abstract class Node<ID_TYPE extends Object,
                                   VALUE_TYPE>
{
    //------------------------STATIC------------------------
    protected static nonExistingLinkErrorMsg<ARGS extends SourceTargetNodesIds_ARGS<string>>
    (args: ARGS): string
    {
        const { sourceNodeId, targetNodeId } = args;
        return `Link between nodes: ${sourceNodeId} and ${targetNodeId} does not exists.`;
    }

    protected static alreadyExistingLinkErrorMsg<ARGS extends SourceTargetNodesIds_ARGS<string>>
    (args: ARGS): string
    {
        const { sourceNodeId, targetNodeId } = args;
        return `Link between nodes: ${sourceNodeId} and ${targetNodeId} already exists.`;
    }








    //------------------------INSTANCE------------------------
    private id: ID_TYPE;
    private value: VALUE_TYPE;

    constructor(args: NodeConstructor_ARGS<ID_TYPE,
                                           VALUE_TYPE>)
    {
        const { id, value } = args;

        this.id = id;
        this.value = value;
    }

    public getId(): ID_TYPE
    {
        return this.id;
    }

    public getValue(): VALUE_TYPE
    {
        return this.value;
    }

    protected abstract validateLink(args: Object): any;
    public abstract addLink(args: Object): any;
    public abstract getLink(args: Object): any;
    public abstract removeLink(args: Object): any;
};