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

    // Getter for all nodes IDs
    public abstract getNodesIds
    (_: ARGS_): Array<string>;

    /* // Getter for all links IDs (source and target)
    public abstract getLinksIds
    (_: ARGS_): Array<{ source: string, target: string }>; */

    // Getter of metrics
    public abstract getMetrics
    (_: ARGS_): any;

    // Getter of visualization
    public abstract getVisualization
    (_: ARGS_): any;
};