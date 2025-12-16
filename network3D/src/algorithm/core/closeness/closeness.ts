/*import {
    type NodesMetric,
    type Layer_args,
    type AdjacencyIO_args,
    type Adjacency_args,

    Validator
} from "../utilities/";

import * as Core from "@/core";
*/
export abstract class Closeness
{

    /*public static undirected({ adjacency }: Adjacency_args): NodesMetric<number>
    {
        
    }

    public static singleLayer({ layer }: Layer_args): NodesMetric<number>
    {
        const layerType = Validator.getLayerType({ layer });

        switch(layerType)
        {
            case "Directed":
                return this.directed({ adjacencyIn: (layer as Core.ReadonlyDirected).in, adjacencyOut: (layer as Core.ReadonlyDirected).out });
                break;
            case "Undirected":
                return this.undirected({ adjacency: layer as Core.ReadonlyAdjacency });
                break;
            default:
                return new Map();
                break;
        }
    }*/
};