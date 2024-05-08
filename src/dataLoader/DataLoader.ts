import { Visualization } from "../visualization/singleLayerNetwork.js";
import { FileContent_ARGS, Network_ARGS, NodeIDParser_ARGS, NodeValueParser_ARGS, LinkValueParser_ARGS } from "./DataLoaderArgsTypes.js";

export namespace DataLoad
{
    export class DataLoader
    {
        public static load<NODE_ID_TYPE extends Object,
                           NODE_VALUE_TYPE,
                           LINK_VALUE_TYPE,
                           ARGS extends FileContent_ARGS &
                                        Network_ARGS<Visualization.SingleLayerNetwork<NODE_ID_TYPE,
                                                                                      NODE_VALUE_TYPE,
                                                                                      LINK_VALUE_TYPE>> &
                                        NodeIDParser_ARGS<NODE_ID_TYPE> &
                                        NodeValueParser_ARGS<NODE_VALUE_TYPE> &
                                        LinkValueParser_ARGS<LINK_VALUE_TYPE>>
        (args: ARGS): void
        {
            const { 
                fileContent,
                network,
                nodeIDParser,
                nodeValueParser,
                linkValueParser
            } = args;

            for(const row of fileContent.split("\n"))
            {
                if(row.trim().length > 0)
                {
                    const rowSplitted = row.trim().split(";");

                    try
                    {
                        network.addNode({
                            id: nodeIDParser({
                                id: rowSplitted[0]
                            }),
                            value: nodeValueParser({
                                value: rowSplitted[0]
                            })
                        });
                    }
                    catch(_)
                    {
                        // DOPLNIT VÝJIMKU
                    }

                    try
                    {
                        network.addNode({
                            id: nodeIDParser({
                                id: rowSplitted[1]
                            }),
                            value: nodeValueParser({
                                value: rowSplitted[1]
                            })
                        });
                    }
                    catch(_)
                    {
                        // DOPLNIT VÝJIMKU
                    }

                    try
                    {
                        network.addLink({
                            sourceNodeId: nodeIDParser({
                                id: rowSplitted[0]
                            }),
                            targetNodeId: nodeIDParser({
                                id: rowSplitted[1]
                            }),
                            value: linkValueParser({
                                value: ""
                            })
                        });
                    }
                    catch(_)
                    {
                        // DOPLNIT VÝJIMKU
                    }
                }
            }
        }
    };
};