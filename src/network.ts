export default interface Network<NODE_ID_TYPE,
                                 NODE_VALUE_TYPE,
                                 LINK_VALUE_TYPE>
{
    addNode(args: {
        id: NODE_ID_TYPE;
        value: NODE_VALUE_TYPE;
    }): void;

    addLink(args: {
        sourceNodeId: NODE_ID_TYPE;
        targetNodeId: NODE_ID_TYPE;
        value: LINK_VALUE_TYPE
    }): void;

    getNode(args: {
        id: NODE_ID_TYPE;
    }): NODE_VALUE_TYPE;

    getLink(args: {
        sourceNodeId: NODE_ID_TYPE;
        targetNodeId: NODE_ID_TYPE;
    }): LINK_VALUE_TYPE;

    getNodesCount(args: { }): number;
    
    getLinksCount(args: { }): number;
};