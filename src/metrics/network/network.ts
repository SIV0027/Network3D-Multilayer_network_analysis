import {
    TT,
    TU
} from "../../core/index.js";

import {
    ARGS_Network_Constructor
} from "./network_types.js";

import {
    Iterate,
    IterateCallback
} from "../../interface/index.js";

import {
    ARGS_Callback
} from "../../args_items.js";

// Abstract (template) class for metrics classes of concrete types of networks
// It receives (generics) layers (types) of nodes, layers (types) of links and Network type over which the metrics are calculated
export abstract class Network<T extends TT, U extends TU<T>>
{
    // Network over which the metrics are calculated
    protected iterate: Iterate<ARGS_Callback<IterateCallback<T, U>>, T, U>;

    // Metrics is initialized by its network
    constructor(args: ARGS_Network_Constructor<T, U>)
    {
        const {
            iterate
        } = args;

        this.iterate = iterate;
    }
};