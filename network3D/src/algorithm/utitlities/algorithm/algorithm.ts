import * as Core from "../../../core";

import type {
    Layer_args_,
    LayerType,
} from "../types";

export abstract class Algorithm
{
    public static getLayerType({ layer }: Layer_args_<Core.ReadonlyLayer>): LayerType
    {
        if((layer as any).out !== undefined)
        {
            return "Directed";
        }
        if((layer as any).source !== undefined)
        {
            return "Bipartite";
        }
        else
        {
            return "Undirected";
        }
    }    
};