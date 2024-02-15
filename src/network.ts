export default interface Network<NODE_VALUE_TYPE, LINK_VALUE_TYPE>
{
    addNode(args: { }): void;
    addLink(args: { }): void;
    getNode(args: { }): NODE_VALUE_TYPE;
    getLink(args: { }): LINK_VALUE_TYPE;
    getNodesCount(): Number;
    getLinksCount(): Number;
};