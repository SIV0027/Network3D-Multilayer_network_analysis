import {
    ARGS_LayerId,
    ARGS_Core,
    ARGS_Container
} from "../../../args_items.js";

import {
    TT,
    TU
} from "../../../core/hin/hin_types.js";

import {
    MultilayerNetwork
} from "../../../interface/index.js";

export type Edge = {
    source: string,
    target: string
};

export type Edges = Array<Edge>;

export type Node = {
    [key: string]: any;
};

export type Nodes = Array<Node>;

// Object type (interface) of parameters of Layer constructor
export interface ARGS_Layer_Constructor<T extends TT, U extends TU<T>> extends ARGS_LayerId<keyof U>,
                                                                               ARGS_Core<MultilayerNetwork<T, U>>,
                                                                               ARGS_Container<string | HTMLElement>
{ };