import Node from "./node.js";

export default class Link<VALUE_TYPE,
                          NODE_ID_TYPE extends Object,
                          NODE_VALUE_TYPE>
{
    private source: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE>;
    private target: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE>;
    private value: VALUE_TYPE;

    constructor(args: {
        source: Node<NODE_ID_TYPE,
                     NODE_VALUE_TYPE>,
        target: Node<NODE_ID_TYPE,
                     NODE_VALUE_TYPE>,
        value: VALUE_TYPE
    })
    {
        this.source = args.source;
        this.target = args.target;
        this.value = args.value;
    }

    public getSource(): Node<NODE_ID_TYPE,
                             NODE_VALUE_TYPE>
    {
        return this.source;
    }

    public getTarget(): Node<NODE_ID_TYPE,
                             NODE_VALUE_TYPE>
    {
        return this.target;
    }

    public getValue(): VALUE_TYPE
    {
        return this.value;
    }
};