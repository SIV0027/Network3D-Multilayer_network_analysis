import {
    TT,
    TU
} from "../../core/index.js";

import {
    Network
} from "./network.js";

import {
    ARGS_Metrics_Constructor
} from "./metrics_types.js";

// Abstract (template) class for metrics classes of concrete types of networks
// It receives (generics) layers (types) of nodes, layers (types) of links and Network type over which the metrics are calculated
export abstract class Metrics<T extends TT, U extends TU<T>, N extends Network<T, U>>
{
    // Network over which the metrics are calculated
    protected network: N;

    // Metrics is initialized by its network
    constructor(args: ARGS_Metrics_Constructor<T, U, N>)
    {
        const {
            network
        } = args;

        this.network = network;
    }
};