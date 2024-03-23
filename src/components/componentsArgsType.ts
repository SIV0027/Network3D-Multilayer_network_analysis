import { Id_ARGS, Value_ARGS } from "../network/networkArgsTypes";

export interface NodeConstructor_ARGS<ID_TYPE extends Object,
                                     VALUE_TYPE> 
       extends Id_ARGS<ID_TYPE>,
               Value_ARGS<VALUE_TYPE>
{ };

export interface NeighborNodeId_ARGS<ID_TYPE>
{
    neighborNodeId: ID_TYPE;
}

export interface Link_ARGS<LINK_TYPE>
{
    link: LINK_TYPE
};