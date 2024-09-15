import {
    ARGS_Source,
    ARGS_Target,
    ARGS_Value
} from "../../args_items.js";

import {
    TT,
    TU
} from "../hin/hin_types.js";

import {
    Node
} from "../node/node.js";

// Object type (interface) of parameters of Link constructor
export interface ARGS_Link_Constructor<LS extends keyof T, LT extends keyof T, T extends TT, U extends TU<T>, V> extends ARGS_Source<Node<LS, T, U>>,
                                                                                                                         ARGS_Target<Node<LT, T, U>>,
                                                                                                                         ARGS_Value<V>
{ };