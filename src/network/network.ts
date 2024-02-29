export default abstract class Network
{
    protected static nonExistingNodeErrorMsg(id: string): string
    {
        return `Node with given ID: ${id} does not exists.`;
    } 


    
    abstract addNode(args: Object): any;
    abstract addLink(args: Object): any;
    abstract getNode(args: Object): any;
    abstract getLink(args: Object): any;
    abstract getNodesCount(args: Object): any;    
    abstract getLinksCount(args: Object): any;
};