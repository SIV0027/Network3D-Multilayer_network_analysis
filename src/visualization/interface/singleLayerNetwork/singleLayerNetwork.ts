import {
    TT,
    TU
} from "../../../core/index.js";

import {
    MultilayerNetwork as InterfaceMultilayerNetwork
} from "../../../interface/index.js";

import { 
    Network
} from "../../core/index.js";

export class SingleLayerNetwork<T extends TT, U extends TU<T>>
{
    private core: Network<T, U>;

    constructor(args: {
        core: InterfaceMultilayerNetwork<T, U>
    })
    {
        const {
            core
        } = args;

        this.core = new Network({
            core: core
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
};