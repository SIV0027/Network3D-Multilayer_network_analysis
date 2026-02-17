import * as Core from "../../../core";

import type {
    Layer_args_,
    LayerType,
} from "../types";

export abstract class Algorithm
{
    /*public static validateLayerMinimumActors({ adjacency, minActorsCount }: Adjacency_args & { minActorsCount: number }): void
    {
        if(adjacency.size < minActorsCount)
        {
            throw new AlgorithmMinimumActorsLayerError({ minActors: minActorsCount });
        }
    }

    public static isLayerEmpty({ layer, layerType }: Layer_args & LayerType_args): boolean
    {
        switch(layerType)
        {
            case "Undirected":
                return (layer as Core.ReadonlyAdjacency).size == 0;
                break;
            case "Directed":
                return (layer as Core.ReadonlyDirected).out.size == 0;
                break;
            default:
                return (layer as Core.ReadonlyBipartite).source.size == 0;
        }
    }

    public static validateLayerIfNotEmpty({ layer }: Layer_args): void
    {
        const layerType = this.getLayerType({ layer });
        if(this.isLayerEmpty({layer, layerType}))
        {
            throw new AlgorithmEmptyLayerError();
        }
    }*/

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