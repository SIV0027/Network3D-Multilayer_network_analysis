import { 
    ARGS_
} from "../../args_items.js";

import {
    HIN,
    TT,
    TU
} from "../../core/index.js";

// Abstract class for concrete types of networks
// It receives layers (types) of nodes and layers (types) of links
export abstract class Network<T extends TT, U extends TU<T>>
{
    // Data structure which enable access to the structure of the network
    protected abstract core: any;
    // Access to metrics calculate methods
    protected abstract metrics: any;

    // Adds node
    public abstract addNode
    (args: any): any;

    // Getter of node
    public abstract getNode
    (args: any): any;

    // Adds link
    public abstract addLink
    (args: any): any;

    // Getter of link
    public abstract getLink
    (args: ARGS_): any;

    // Getter of HIN
    public abstract getHIN
    (): HIN<T, U>;

    // Getter of metrics
    public abstract getMetrics
    (args: ARGS_): any;

    // Enable iterate through the network
    public abstract iterate
    (args: ARGS_): any;
};