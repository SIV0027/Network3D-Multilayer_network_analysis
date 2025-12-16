import { 
    type Optional
} from "@/utilities";
import {
    type Directed_args,
    type LayerId,
    type PartitionId,
    type PartitionsIds_args,
    type ReadonlyAdjacency,
    type ReadonlyDirected,
    type Weight_args,

    MultilayerNetworkIterate
} from "./../index";

import type {
    MultiplexConstructor,
    IMultiplexNetworkIterate,
    MultiplexIterateCallback,
    MultiplexLayerSchema
} from "./multiplexNetwork_types";
import { MultiplexNetworkErrors } from "./multiplexNetworkErrors";

// one partition in multiple context (multiple intra layers → partition is constant)
export class MultiplexNetwork
implements IMultiplexNetworkIterate
{
    // composition is more relevant than inheritance in this case
    private base!: MultilayerNetworkIterate;
    // default name of partition (only one → considering partitions is irrelevant)
    private readonly defaultPartitionId: PartitionId = "default";

    constructor(init?: MultiplexConstructor)
    {
        // multiple (intra) layers within single partition
        const layers: Record<LayerId, PartitionsIds_args & Optional<Weight_args, "weight"> & Optional<Directed_args, "directed">> = { };
        if(init?.schema instanceof Array)
        {
            for(const layerId of init.schema)
            {
                layers[layerId] = { partitionsIds: this.defaultPartitionId };
            }
        }
        else if(init?.schema !== undefined)
        {
            for(const layerId in init.schema)
            {
                layers[layerId] = { partitionsIds: this.defaultPartitionId, ...init!.schema![layerId] };
            }
        }

        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                this.base = new MultilayerNetworkIterate({
                    schema: {
                        partitions: [this.defaultPartitionId],
                        layers
                    },
                    data: {
                        actors: { [this.defaultPartitionId]: init?.data?.actors ?? [] },
                        links: init?.data?.links
                    }
                });
            }
        });
    }

    public getLayersList(): ReturnType<typeof MultilayerNetworkIterate.prototype["getLayersList"]>
    {
        return this.base.getLayersList();
    }

    public getLinkWeight(args: Parameters<typeof MultilayerNetworkIterate.prototype["getLinkWeight"]>[0]): number
    {
        let weight;
        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                weight = this.base.getLinkWeight(args);
            }
        });

        return weight!;
    }

    public addLayer(args: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addLayer"]>[0], "partitionsIds">): void
    {
        MultiplexNetworkErrors.remapExceptions({
            callback: () => this.base.addLayer({ partitionsIds: this.defaultPartitionId, ...args })
        });
    }
    
    public addActor({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addActor"]>[0], "partitionId">): void
    {
        MultiplexNetworkErrors.remapExceptions({
            callback: () => this.base.addActor({ partitionId: this.defaultPartitionId, actorId })
        });
    }

    public addLink(args: Parameters<typeof MultilayerNetworkIterate.prototype["addLink"]>[0]): void
    {
        MultiplexNetworkErrors.remapExceptions({
            callback: () => this.base.addLink(args)
        });
    }

    public getActorsCount(): number
    {
        return this.base.getActorsCount({ partitionId: this.defaultPartitionId });
    }
    
    public getLayersCount(): number
    {
        return this.base.getLayersCount();
    }
    
    public getLayerSchema(args: Parameters<typeof MultilayerNetworkIterate.prototype["getLayerSchema"]>[0]): MultiplexLayerSchema
    {
        let schema;
        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                const { directed, weighted } = this.base.getLayerSchema(args);
                schema = {
                    directed,
                    weighted
                };
            }
        });

        return schema as any as MultiplexLayerSchema;
    }

    public getLinksCount(args: Parameters<typeof MultilayerNetworkIterate.prototype["getLinksCount"]>[0]): number
    {
        let count;
        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                count = this.base.getLinksCount(args);
            }
        });
        return count as any as number;
    }

    public isActorExists({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["isActorExists"]>[0], "partitionId">): boolean
    {
        let exists;
        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                exists = this.base.isActorExists({ partitionId: this.defaultPartitionId, actorId });
            }
        });

        return exists as any as boolean;
    }

    public isLayerExists(args: Parameters<typeof MultilayerNetworkIterate.prototype["isLayerExists"]>[0]): boolean
    {
        let exists;
        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                exists = this.base.isLayerExists(args);
            }
        });

        return exists as any as boolean;
    }

    public isLinkExists(args: Parameters<typeof MultilayerNetworkIterate.prototype["isLinkExists"]>[0]): boolean
    {
        let exists;
        MultiplexNetworkErrors.remapExceptions({
            callback: () => {
                exists = this.base.isLinkExists(args);
            }
        });

        return exists as any as boolean;
    }

    protected iterate({ callback }: MultiplexIterateCallback): void
    {
        this.base.iterate({
            callback: ({ actors, links, weights }) => {
                callback({
                    actors: actors.get(this.defaultPartitionId)!,
                    links: links as ReadonlyMap<LayerId, ReadonlyDirected | ReadonlyAdjacency>,
                    weights,
                    getAdjacency: (args) => {
                        let adjacency: ReturnType<typeof MultilayerNetworkIterate.prototype["getAdjacency"]>
                        MultiplexNetworkErrors.remapExceptions({
                            callback: () => {
                                adjacency = this.base.getAdjacency(args);
                            }
                        });

                        return adjacency!;
                    },
                    validators: {
                        schema: {
                            validateLayerIfExists: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateLayerIfExists(args)
                                });
                            },
                            validateLayerIfNotExists: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateLayerIfNotExists(args)
                                });
                            },
                            validateLayerIfWeighted: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateLayerIfWeighted(args)
                                })
                            },
                            validateLayerIfNotWeighted: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateLayerIfNotWeighted(args)
                                })
                            }
                        },
                        data: {
                            validateActorIfExists: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateActorIfExists({ ...args, partitionId: this.defaultPartitionId })
                                });
                            },
                            validateActorIfNotExists: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateActorIfNotExists({ ...args, partitionId: this.defaultPartitionId })
                                });
                            },
                            validateLinkIfExists: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateLinkIfExists(args)
                                });
                            },
                            validateLinkIfNotExists: (args) => {
                                MultiplexNetworkErrors.remapExceptions({
                                    callback: () => this.base.validateLinkIfNotExists(args)
                                })
                            }
                        }
                    }
                });
            }
        });
    }
};