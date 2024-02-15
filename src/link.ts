export default class Link<VALUE_TYPE, NODE_ID_TYPE>
{
    private source: NODE_ID_TYPE;
    private target: NODE_ID_TYPE;
    private value: VALUE_TYPE;

    constructor(args: {
        source: NODE_ID_TYPE,
        target: NODE_ID_TYPE,
        value: VALUE_TYPE
    })
    {
        this.source = args.source;
        this.target = args.target;
        this.value = args.value;
    }

    public getSource(): NODE_ID_TYPE
    {
        return this.source;
    }

    public getTarget(): NODE_ID_TYPE
    {
        return this.target;
    }

    public getValue(): VALUE_TYPE
    {
        return this.value;
    }
};