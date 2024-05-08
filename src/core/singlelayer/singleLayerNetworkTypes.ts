import Direction from "./direction/direction.js";

export interface Directionality_ARGS<NODE_ID_TYPE extends Object,
                                     NODE_VALUE_TYPE,
                                     LINK_VALUE_TYPE>
{
    direction: Direction<NODE_ID_TYPE,
                         NODE_VALUE_TYPE,
                         LINK_VALUE_TYPE>;
};

export interface SingleLayerNetworkConstructor_ARGS<NODE_ID_TYPE extends Object,
                                                    NODE_VALUE_TYPE,
                                                    LINK_VALUE_TYPE>
       extends Directionality_ARGS<NODE_ID_TYPE,
                                   NODE_VALUE_TYPE,
                                   LINK_VALUE_TYPE>
{ };