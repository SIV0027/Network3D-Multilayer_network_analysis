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
    Flattening
} from "../../../algorithm/core";

export class MultiplexNetwork extends Core.MultiplexNetwork
{
    public static L({ network }: { network: MultiplexNetwork }): number
    {
        return network.getLayersCount();
    }

    public static N({ network }: { network: MultiplexNetwork }): number
    {
        return network.getActorsCount();
    }

    public static M({ network, layerId }: { network: MultiplexNetwork, layerId: Core.LayerId }): number
    {
        return network.getLinksCount({ layerId });
    }

    public static density({ network, layerId }: { network: MultiplexNetwork, layerId: Core.LayerId }): number
    {
        let density: number;
        if(!network.isLayerExists({ layerId }))
        {
            throw new Error(`Given layer ID "${layerId}" does not exist in network`);
        }

        network.iterate({
            callback: ({ links }) => {
                const layer = links.get(layerId)!;
                const layerType = Algorithm.getLayerType({ layer });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        density = Density.undirected({ adjacency: layer as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return density!;
    }

    public static components({ network, layerId }: { network: MultiplexNetwork, layerId: Core.LayerId }): Array<Array<Core.ActorId>>
    {
        let components: Array<Array<Core.ActorId>>;
        if(!network.isLayerExists({ layerId }))
        {
            throw new Error(`Given layer ID "${layerId}" does not exist in network`);
        }

        network.iterate({
            callback: ({ links }) => {
                const layer = links.get(layerId)!;
                const layerType = Algorithm.getLayerType({ layer });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        components = Component.undirected({ adjacency: layer as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return components!;
    }

    public static degree({ network, layerId }: { network: MultiplexNetwork, layerId: Core.LayerId }): {
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
        if(!network.isLayerExists({ layerId }))
        {
            throw new Error(`Given layer ID "${layerId}" does not exist in network`);
        }

        network.iterate({
            callback: ({ links }) => {
                const layer = links.get(layerId)!;
                const layerType = Algorithm.getLayerType({ layer });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        degree = Degree.undirected({ adjacency: layer as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return degree!;
    }

    public static clusteringCoefficient({ network, layerId }: { network: MultiplexNetwork, layerId: Core.LayerId }): {
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
        if(!network.isLayerExists({ layerId }))
        {
            throw new Error(`Given layer ID "${layerId}" does not exist in network`);
        }

        network.iterate({
            callback: ({ links }) => {
                const layer = links.get(layerId)!;
                const layerType = Algorithm.getLayerType({ layer });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        clusteringCoefficient = ClusteringCoefficient.undirected({ adjacency: layer as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return clusteringCoefficient!;   
    }

    public static brandes({ network, layerId }: { network: MultiplexNetwork, layerId: Core.LayerId }): {
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

        if(!network.isLayerExists({ layerId }))
        {
            throw new Error(`Given layer ID "${layerId}" does not exist in network`);
        }

        network.iterate({
            callback: ({ links }) => {
                const layer = links.get(layerId)!;
                const layerType = Algorithm.getLayerType({ layer });
                switch(layerType)
                {
                    case "Directed":
                        throw new Error("Directed layers are not supported");
                        break;
                    case "Undirected":
                        brandes = Brandes.undirected({ adjacency: layer as Core.ReadonlyAdjacency });
                        break;
                }
            }
        });

        return brandes;
    }

    public static flattening({ network, layerIds, newLayerId }: { network: MultiplexNetwork, layerIds: Array<Core.LayerId>, newLayerId: string }): void
    {
        for(const layerId of layerIds)
        {            
            if(!network.isLayerExists({ layerId }))
            {
                throw new Error(`Given layer ID "${layerId}" does not exist in network`);
            }
        }

        network.addLayer({ layerId: newLayerId });

        const adjacencies: Array<Core.ReadonlyAdjacency> = new Array();
        network.iterate({
            callback: ({ links }) => {

                for(const layerId of layerIds)
                {
                    const layer = links.get(layerId)!;
                    const layerType = Algorithm.getLayerType({ layer });
                    switch(layerType)
                    {
                        case "Directed":
                            throw new Error("Directed layers are not supported");
                            break;
                        case "Undirected":
                            adjacencies.push(layer as Core.ReadonlyAdjacency);
                            break;
                    }
                }
            }
        });
        
        Flattening.undirected({
            adjacencies,
            callback: ({ sourceActorId, targetActorId }) => {
                try {
                    network.addLink({ layerId: newLayerId, sourceActorId, targetActorId });
                }
                catch(e) { }
            }
        });
    }
};