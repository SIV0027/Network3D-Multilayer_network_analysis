import {
    ARGS_
} from "../../args_items.js";

import {
    Network as Core
} from "../core/index.js";

import {
    TT,
    TU
} from "../index.js";

export abstract class Network<T extends TT, U extends TU<T>>
extends Core<T, U>
{
    // Access to metrics calculate methods
    protected abstract metrics: any;
    // Enable visualization of network
    protected abstract visualization: any;

    // Getter of metrics
    public getMetrics
    (_: ARGS_): any
    {
        return this.metrics;
    }

    // Getter of visualization
    public getVisualization
    (_: ARGS_): any
    {
        return this.visualization;
    }
};