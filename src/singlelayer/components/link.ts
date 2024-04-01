import Node from "./node.js";

export default class Link<VALUE_TYPE,
                          NODE_ID_TYPE extends Object,
                          NODE_VALUE_TYPE>
{
    //----------------------------------------------------------------
    //----------------------------STATIC------------------------------
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //---------------------------INSTANCE-----------------------------
    //----------------------------------------------------------------

    private source: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE,
                         VALUE_TYPE>;
    private target: Node<NODE_ID_TYPE,
                         NODE_VALUE_TYPE,
                         VALUE_TYPE>;
    private value: VALUE_TYPE;

    constructor(args: {
        source: Node<NODE_ID_TYPE,
                     NODE_VALUE_TYPE,
                     VALUE_TYPE>,
        target: Node<NODE_ID_TYPE,
                     NODE_VALUE_TYPE,
                     VALUE_TYPE>,
        value: VALUE_TYPE
    })
    {
        this.source = args.source;
        this.target = args.target;
        this.value = args.value;
    }

    //----------------------------------------------------------------
    //-----------------------------HELP-------------------------------

    //----------------------------------------------------------------
    //----------------------------ADDERS------------------------------

    //----------------------------------------------------------------
    //----------------------------GETTERS-----------------------------

    //----------------------------------------------------------------
    // getSource() - return source node of link
    public getSource(): Node<NODE_ID_TYPE,
                             NODE_VALUE_TYPE,
                             VALUE_TYPE>
    {
        return this.source;
    }

    //----------------------------------------------------------------
    // getTarget() - return target node of link
    public getTarget(): Node<NODE_ID_TYPE,
                             NODE_VALUE_TYPE,
                             VALUE_TYPE>
    {
        return this.target;
    }

    //----------------------------------------------------------------
    // getValue() - return value of link
    public getValue(): VALUE_TYPE
    {
        return this.value;
    }

    //----------------------------------------------------------------
    //----------------------------OTHERS------------------------------
};