export default abstract class Node<ID_TYPE,
                                   VALUE_TYPE,
                                   LINK_VALUE_TYPE>
{
    private id: ID_TYPE;
    private value: VALUE_TYPE;

    constructor(args: { 
        id: ID_TYPE,
        value: VALUE_TYPE
    })
    {
        this.id = args.id;
        this.value = args.value;
    }

    public getId(): ID_TYPE
    {
        return this.id;
    }

    public getValue(): VALUE_TYPE
    {
        return this.value;
    }

    abstract addLink(args: {
        neighborNodeId: ID_TYPE
        linkValue: LINK_VALUE_TYPE
    }): void;

    abstract getLink(args: {
        neighborNodeId: ID_TYPE
    }): LINK_VALUE_TYPE;

    abstract removeLink(args: {
        neighborNodeId: ID_TYPE
    }): void;
};