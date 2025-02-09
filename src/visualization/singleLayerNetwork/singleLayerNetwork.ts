/* import {
    ARGS_Callback
} from "../../args_items.js";

import {
    Multi,
    Orientation
} from "../../core/index.js";

import {
    Iterate,
    IterateCallback,
    Link_Types,
    Node_Types
} from "../../interface/index.js";

import {
    Network
} from "../core/network/network.js";

import { 
    MultilayerNetwork as Core
} from "../index.js";

export class SingleLayerNetwork<T, U, V extends keyof Orientation, W extends keyof Multi>
extends Network
{
    private core: Core<Node_Types<T>, Link_Types<U, V, W>>;

    constructor(args: {
        iterate: Iterate<ARGS_Callback<IterateCallback<Node_Types<T>, Link_Types<U, V, W>>>, Node_Types<T>, Link_Types<U, V, W>>
    })
    {
        const {
            iterate
        } = args;

        super();

        this.core = new Core({
            iterate: iterate
        });
    }

    public create
    (args: {
        container: string | HTMLElement
    })
    {
        const {
            container
        } = args;

        this.core.create({
            container: container,
            layerId: "default"
        });
    }

    public visualize
    (): void
    {
        this.core.visualize({
            layerId: "default"
        });
    }
}; */