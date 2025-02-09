/* import {
    ARGS_Callback
} from "../../../args_items.js";

import {
    TT,
    TU
} from "../../../core/hin/hin_types.js";

import {
    Iterate,
    IterateCallback
} from "../../../interface/index.js";

import {
    Layer
} from "../layer/layer.js";

import {
    Network
} from "../network/network.js";

export class MultilayerNetwork<T extends TT, U extends TU<T>>
extends Network
{
    private layers: Map<keyof U, Layer<T, U>>;
    private iterate: Iterate<ARGS_Callback<IterateCallback<T, U>>, T, U>;

    constructor(args: {
        iterate: Iterate<ARGS_Callback<IterateCallback<T, U>>, T, U>
    })
    {        
        const {
            iterate
        } = args;

        super();

        this.layers = new Map();
        this.iterate = iterate;
    }

    public create
    (args: {
        container: string | HTMLElement,
        layerId: keyof U
    }): void
    {
        const {
            container,
            layerId
        } = args;

        // if this.layers.get(layerId) exists -> throw Error

        const layer = new Layer({
            container: container,
            iterate: this.iterate,
            layerId: layerId
        });

        this.layers.set(layerId, layer);
    }

    public visualize
    (args: {
        layerId: keyof U
    }): void
    {
        const {
            layerId
        } = args;

        const layer = this.layers.get(layerId);

        if(layer == undefined)
        {
            throw Error("Unexisted Layer");
        }

        layer.render();
    }
}; */