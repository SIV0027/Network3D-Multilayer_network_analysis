import { 
    ARGS_HIN
} from "../../args_items.js";

import {
    HIN
} from "../hin/hin.js";

import {
    TT,
    TU
} from "../hin/hin_types.js";

// Object type (interface) of parameters of MulitlayerNetwork constructor
export interface ARGS_MultilayerNetwork_Constructor<T extends TT, U extends TU<T>> extends ARGS_HIN<HIN<T, U>>
{ };