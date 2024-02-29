export interface Id<ID_TYPE>
{
    id: ID_TYPE;
};

export interface Value<VALUE_TYPE>
{
    value: VALUE_TYPE;
}

export interface SourceTargetNodesIds<NODE_ID_TYPE>
{
    sourceNodeId: NODE_ID_TYPE;
    targetNodeId: NODE_ID_TYPE;
};