import {
    Degree
} from "@/algorithm/core";

import * as Core from "@/core/";

import type {
    NetworkSingleLayer_args
} from "./singleLayerNetwork_types";
import type {
    IO,
    NodesMetric
} from "@/algorithm/utitlities";
import { Algorithm } from "../../utitlities/algorithm";
import {
    M as M_alg,
    Density,
    Component
} from "@/algorithm/core";

export class SingleLayerNetwork extends Core.SingleLayerNetwork
{
    public static N({ network }: NetworkSingleLayer_args): number
    {
        return network.getActorsCount();
    }

    public static M({ network, selfloops = false }: NetworkSingleLayer_args & { selfloops?: boolean }): number
    {
        if(selfloops)
        {
            return network.getLinksCount();
        }

        let M: number;
        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    /*case "Directed":
                        M = M_alg.directed({ adjacency: links as Core.Directed });
                        break;*/
                    case "Undirected":
                        M = M_alg.undirected({ adjacency: links as Core.Adjacency });
                        break;
                }
            }
        });

        return M!;
    }

    public static density({ network, selfLoops = false }: NetworkSingleLayer_args & { selfLoops?: boolean }): number
    {
        let density: number;
        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {                    
                    /*case "Directed":
                        density = Density.directed({ adjacency: links as Core.ReadonlyDirected, selfLoops });
                        break;*/
                    case "Undirected":
                        density = Density.undirected({ adjacency: links as Core.ReadonlyAdjacency, selfLoops });
                        break;
                }
            }
        });

        return density!;
    }

    public static components({ network }: NetworkSingleLayer_args): Array<Array<Core.ActorId>>
    {
        let components: Array<Array<Core.ActorId>>;
        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {                    
                    case "Directed":
                        throw Error("not implemented method directed within Component metric");
                        //components = Component.directed({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                    case "Undirected":
                        components = Component.undirected({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return components!;
    }

    public static degree({ network, selfLoops = false }: NetworkSingleLayer_args & { selfLoops?: boolean }): NodesMetric<number> | NodesMetric<IO<number>>
    {
        let degree: NodesMetric<number> | NodesMetric<IO<number>>;
        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    /*case "Directed":
                        degree = Degree.directed({ adjacency: links as Core.ReadonlyDirected, selfLoops });
                        break;*/
                    case "Undirected":
                        degree = Degree.undirected({ adjacency: links as Core.ReadonlyAdjacency, selfLoops });
                }
            }
        });

        return degree!;
    }

    public static averageDegree({ network, selfLoops = false }: NetworkSingleLayer_args & { selfLoops?: boolean }): number
    {
        let degreeAvg: number;
        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    /*case "Directed":
                        degreeAvg = Degree.directedAverage({ adjacency: links as Core.ReadonlyDirected, selfLoops });
                        break;*/
                    case "Undirected":
                        degreeAvg = Degree.undirectedAverage({ adjacency: links as Core.ReadonlyAdjacency, selfLoops });
                }
            }
        });
        
        return degreeAvg!;
    }

    /*public static degreeDistribution({ network }: NetworkSingleLayer_args): Array<number> | { out: Array<number>, in: Array<number> }
    {
        let degreeDistribution: Array<number> | { out: Array<number>, in: Array<number> };
        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Undirected":
                        degreeDistribution = Degree.undirectedDistribution({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                    case "Directed":
                        degreeDistribution = Degree.directedDistribution({ adjacency: links as Core.ReadonlyDirected });
                        break;
                }
            }
        });

        return degreeDistribution!;
    }

    public static closeness({ network }: NetworkSingleLayer_args): NodesMetric<number>
    {
        let closeness;
        network.iterate({
            callback: ({ links }) => {
                closeness = ;
            }
        });

        return closeness!;
    }

    public static closenessAvg({ network }: NetworkSingleLayer_args): number
    {
        
    }

    public static betweenness({ network }: NetworkSingleLayer_args): Map<ActorId, number>
    {

    }

    public static betweennessAvg({ network }: NetworkSingleLayer_args): number
    {
        
    }

    public static clusteringCoefficient({ network }: NetworkSingleLayer_args): Map<ActorId, number>
    {

    }

    public static clusteringCoefficientAvg(): number
    {
        
    }

    public static degreeDistribution(): Map<number, number>
    {

    }*/
};