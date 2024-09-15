import {
   ARGS_Value,
   ARGS_NodeId,
   ARGS_LayerId,
   ARGS_HIN
} from "../../args_items.js";

// Object type (interface) of parameters of Node constructor
export interface ARGS_Node_Constructor<T, U, V> extends ARGS_NodeId<string>,
                                                        ARGS_Value<T>,
                                                        ARGS_LayerId<U>,
                                                        ARGS_HIN<V>
{ };