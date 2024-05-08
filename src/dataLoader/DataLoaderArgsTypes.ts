export interface FileContent_ARGS
{
    fileContent: string;
};

export interface Network_ARGS<NETOWRK_TYPE>
{
    network: NETOWRK_TYPE;
};

export interface NodeIDParser_ARGS<NODE_ID_TYPE>
{
    nodeIDParser: NodeIDParserCallback<NODE_ID_TYPE>;
};

export interface NodeValueParser_ARGS<NODE_VALUE_TYPE>
{
    nodeValueParser: NodeValueParserCallback<NODE_VALUE_TYPE>;
};

export interface LinkValueParser_ARGS<LINK_VALUE_TYPE>
{
    linkValueParser: LinkValueParserCallback<LINK_VALUE_TYPE>;
};

export type NodeIDParserCallback<NODE_ID_TYPE> = (args: {
    id: string
}) => NODE_ID_TYPE;

export type NodeValueParserCallback<NODE_VALUE_TYPE> = (args: {
    value: string
}) => NODE_VALUE_TYPE;

export type LinkValueParserCallback<LINK_VALUE_TYPE> = (args: {
    value: string
}) => LINK_VALUE_TYPE;