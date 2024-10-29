import {
    TT,
    TU
} from "../../../core/hin/hin_types.js";

import {
    MultilayerNetwork
} from "../../../interface/index.js";

import {
    Layer
} from "../layer/layer.js";

export class Network<T extends TT, U extends TU<T>>
{
    private layers: Map<keyof U, Layer<T, U>>;
    private core: MultilayerNetwork<T, U>;

    constructor(args: {
        core: MultilayerNetwork<T, U>
    })
    {        
        const {
            core
        } = args;

        this.layers = new Map();
        this.core = core;
    }

    public create
    (args: {
        container: string | HTMLElement,
        layerId: keyof U
    })
    {
        const {
            container,
            layerId
        } = args;

        // if this.layers.get(layerId) exists -> throw Error

        const layer = new Layer({
            container: container,
            core: this.core,
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
};