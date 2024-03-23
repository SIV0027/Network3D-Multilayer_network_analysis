export interface Id_ARGS<ID_TYPE extends Object>
{
    id: ID_TYPE;
};

export interface Value_ARGS<VALUE_TYPE>
{
    value: VALUE_TYPE;
}

export interface SourceTargetNodesIds_ARGS<NODE_ID_TYPE extends Object>
{
    sourceNodeId: NODE_ID_TYPE;
    targetNodeId: NODE_ID_TYPE;
};