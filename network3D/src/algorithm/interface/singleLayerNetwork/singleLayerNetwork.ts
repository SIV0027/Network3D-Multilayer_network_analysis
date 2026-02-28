import {
    Algorithm,
    type NodesMetric
} from "../../utitlities";

import * as Core from "../../../core/";

import {
    Brandes,
    ClusteringCoefficient,
    Component,
    Degree,
    Density,
    LabelPropagation
} from "../../../algorithm/core";

export class SingleLayerNetwork extends Core.SingleLayerNetwork
{
    public static N({ network }: { network: SingleLayerNetwork }): number
    {
        return network.getActorsCount();
    }

    public static M({ network }: { network: SingleLayerNetwork }): number
    {
        return network.getLinksCount();
    }

    public static density({ network }: { network: SingleLayerNetwork }): number
    {
        let density: number;

        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        density = Density.undirected({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return density!;
    }

    public static components({ network }: { network: SingleLayerNetwork }): Array<Array<Core.ActorId>>
    {
        let components: Array<Array<Core.ActorId>>;

        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        components = Component.undirected({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return components!;
    }

    public static degree({ network }: { network: SingleLayerNetwork }): {
        nodes: NodesMetric<number>,
        average: number,
        distribution: Array<number>
    }
    {
        let degree: {
            nodes: NodesMetric<number>,
            average: number,
            distribution: Array<number>
        };

        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        degree = Degree.undirected({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return degree!;
    }

    public static clusteringCoefficient({ network }: { network: SingleLayerNetwork }): {
        nodes: NodesMetric<number>,
        average: number,
        distribution: Map<number, number>
    }
    {
        let clusteringCoefficient: {
            nodes: NodesMetric<number>,
            average: number,
            distribution: Map<number, number>
        };

        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        clusteringCoefficient = ClusteringCoefficient.undirected({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return clusteringCoefficient!;   
    }

    public static brandes({ network }: { network: SingleLayerNetwork }): {
        closeness: {
            nodes: NodesMetric<number>,
            average: number,
            distribution: Map<number, number>
        },
        betweenness: {
            nodes: NodesMetric<number>,
            average: number,
            distribution: Map<number, number>
        },
        diameter: number,
        averagePathLength: number
    }
    {
        let brandes: {
            closeness: {
                nodes: NodesMetric<number>,
                average: number,
                distribution: Map<number, number>
            },
            betweenness: {
                nodes: NodesMetric<number>,
                average: number,
                distribution: Map<number, number>
            },
            diameter: number,
            averagePathLength: number
        } = { } as {
            closeness: {
                nodes: NodesMetric<number>,
                average: number,
                distribution: Map<number, number>
            },
            betweenness: {
                nodes: NodesMetric<number>,
                average: number,
                distribution: Map<number, number>
            },
            diameter: number,
            averagePathLength: number
        };

        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        brandes = Brandes.undirected({ adjacency: links as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return brandes;
    }

    public static labelPropagation({ network, maximumIterations }: { network: SingleLayerNetwork, maximumIterations?: number }): Map<Core.ActorId, string>
    {
        let communities: Map<Core.ActorId, string> = new Map();

        network.iterate({
            callback: ({ links }) => {
                const layerType = Algorithm.getLayerType({ layer: links });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        communities = LabelPropagation.undirected({ adjacency: links as Core.ReadonlyAdjacency, maximumIterations });
                        break;
                }
            }
        });

        return communities!;
    }
};