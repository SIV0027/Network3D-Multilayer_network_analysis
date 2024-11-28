import {
    ARGS_Metrics,
    ARGS_Visualization,
    ARGS_Core
} from "../../args_items.js";

import {
    Orientation,
    Multi,
    TU_Meta
} from "../../core/index.js";

import {
    SingleLayerNetwork as SingleLayerNetworkMetrics
} from "../../metrics/index.js";

import {
    SingleLayerNetwork as SingleLayerNetworkVisualization
} from "../../visualization/index.js";

import {
    MultilayerNetwork
} from "../core/index.js";

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

// Type TU_Meta for Single layer network
export type SingleLayerNetwork_TU_Meta<T, U, V extends keyof Orientation, W extends keyof Multi> = TU_Meta<Node_Types<T>, Link_Types<U, V, W>> & {
    nodes: {
        default: null
    },
    links: {
        default: {
            source: "default",
            target: "default",
            orientation: V,
            multi: W
        }
    }
};

// Object type (interface) of parameters of SingleLayerNetworkMetrics constructor
export interface ARGS_SingleLayerNetwork_Constructor<T, U, V extends keyof Orientation, W extends keyof Multi> extends /* ARGS_Orientation<V>,
                                                                                                                       ARGS_Multi<W>, */
                                                                                                                       ARGS_Core<MultilayerNetwork<Node_Types<T>, Link_Types<U, V, W>>>,
                                                                                                                       ARGS_Metrics<SingleLayerNetworkMetrics<T, U, V, W>>,
                                                                                                                       ARGS_Visualization<SingleLayerNetworkVisualization<T, U, V, W>>
{ };