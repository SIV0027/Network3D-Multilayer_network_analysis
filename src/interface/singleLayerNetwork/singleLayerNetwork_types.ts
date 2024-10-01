import {
    ARGS_Network,
    ARGS_Orientation,
    ARGS_Multi
} from "../../args_items.js";

import {
    Orientation,
    Multi
} from "../../core/index.js";

import {
    MultilayerNetwork
} from "../multilayerNetwork/multilayerNetwork.js";

// Type T for Single layer network
export type Node_Types<T> = { 
    "default": {
        value: T
    }
};

// Type U for Single layer network
export type Link_Types<U, V, W> = {
    "default": {
        source: "default",
        target: "default",
        value: U,
        orientation: V,
        multi: W
    } 
};

// Object type (interface) of parameters of SingleLayerNetworkMetrics constructor
export interface ARGS_SingleLayerNetworkMetrics_Constructor<T, U, V extends keyof Orientation, W extends keyof Multi> extends ARGS_Network<MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>>
{ };

// Object type (interface) of parameters of SingleLayerNetworkMetrics constructor
export interface ARGS_SingleLayerNetwork_Constructor<V extends keyof Orientation, W extends keyof Multi> extends ARGS_Orientation<V>,
                                                                                                                 ARGS_Multi<W>
{ };