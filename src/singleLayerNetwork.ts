import Network from "./network";

export default class SingleLayerNetwork<NODE_ID_TYPE,
                                        NODE_VALUE_TYPE,
                                        LINK_VALUE_TYPE>
               implements Network<NODE_VALUE_TYPE,
                                  LINK_VALUE_TYPE>
{
    protected nodes: Map<NODE_ID_TYPE,
                         Node>;

    constructor()
    {
        this.nodes = new Map();
    }

    addNode(args: {}): void
    {
        throw new Error("Method not implemented.");
    }

    addLink(args: {}): void
    {
        throw new Error("Method not implemented.");
    }

    getNode(args: {}): NODE_VALUE_TYPE
    {
        throw new Error("Method not implemented.");
    }

    getLink(args: {}): LINK_VALUE_TYPE
    {
        throw new Error("Method not implemented.");
    }

    getNodesCount(): Number
    {
        throw new Error("Method not implemented.");
    }

    getLinksCount(): Number
    {
        throw new Error("Method not implemented.");
    }
};