import { Params } from "./params";

export default interface MultilayerNetwork
{
    addNode(params: Params): void;
    addLink(params: Params): void;
    getNode(params: Params): any;
    getLink(params: Params): any;
    getNodesCount(): Number;
    getLinksCount(): Number;
};