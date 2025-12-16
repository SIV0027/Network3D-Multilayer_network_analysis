import {
    type LayerId,
    type PartitionId,
    type ReadonlyBipartite,

    BipartiteNetworkErrors,
    MultilayerNetworkIterate
} from "./../index";

import type {
    BipartiteConstructor,
    IMultilayerNetworkIterate,
    BipartiteIterateCallback
} from "./bipartiteNetwork_types";

// two actor types in single context (only one/single layer → actor types and layer are constants)
export class BipartiteNetwork
implements IMultilayerNetworkIterate
{
    // composition is more relevant than inheritance in this case
    private base!: MultilayerNetworkIterate;
    // default name of source actor type
    private readonly defaultSourcePartitionId: PartitionId = "sourceDefault";
    // default name of target actor type
    private readonly defaultTargetPartitionId: PartitionId = "targetDefault";
    // default name of layer (only one → considering layer is irrelevant)
    private readonly defaultLayerId: LayerId = "default";
    
    constructor({ schema, data }: BipartiteConstructor = { })
    {
        BipartiteNetworkErrors.remapExceptions({
            callback: () => {
                this.base = new MultilayerNetworkIterate({
                    schema: {
                        partitions: [this.defaultSourcePartitionId, this.defaultTargetPartitionId],
                        layers: {
                            [this.defaultLayerId]: {
                                partitionsIds: {
                                    source: this.defaultSourcePartitionId,
                                    target: this.defaultTargetPartitionId
                                },
                                ...schema
                            }
                        }
                    },
                    data: {
                        actors: {
                            [this.defaultSourcePartitionId]: data?.actors?.source ?? [],
                            [this.defaultTargetPartitionId]: data?.actors?.target ?? []
                        },
                        links: {
                            [this.defaultLayerId]: data?.links ?? []
                        }
                    }
                });
            }
        });
    }

    public isWeighted(): boolean
    {
        const { weighted } = this.base.getLayerSchema({ layerId: this.defaultLayerId });
        return weighted;
    }

    public addSourceActor({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addActor"]>[0], "partitionId">): void
    {
        BipartiteNetworkErrors.remapExceptions({
            callback: () => this.base.addActor({ partitionId: this.defaultSourcePartitionId, actorId })
        });
    }

    public addTargetActor({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addActor"]>[0], "partitionId">): void
    {
        BipartiteNetworkErrors.remapExceptions({
            callback: () => this.base.addActor({ partitionId: this.defaultTargetPartitionId, actorId })
        });
    }

    public addLink({ sourceActorId, targetActorId, weight }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addLink"]>[0], "layerId">): void
    {
        BipartiteNetworkErrors.remapExceptions({
            callback: () => this.base.addLink({ layerId: this.defaultLayerId, sourceActorId, targetActorId, weight })
        });
    }

    public getSourceActorsCount(): number
    {
        let count;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => count = this.base.getActorsCount({ partitionId: this.defaultSourcePartitionId })
        });

        return count!;
    }

    public getTargetActorsCount(): number
    {
        let count;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => count = this.base.getActorsCount({ partitionId: this.defaultTargetPartitionId })
        });

        return count!;
    }

    public getLinksCount(): number
    {
        let count;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => count = this.base.getLinksCount({ layerId: this.defaultLayerId })
        });

        return count!;
    }

    public isSourceActorExists({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["isActorExists"]>[0], "partitionId">): boolean
    {
        let exists;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => exists = this.base.isActorExists({ partitionId: this.defaultSourcePartitionId, actorId })
        });

        return exists!;
    }

    public isTargetActorExists({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["isActorExists"]>[0], "partitionId">): boolean
    {
        let exists;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => exists = this.base.isActorExists({ partitionId: this.defaultTargetPartitionId, actorId })
        });

        return exists!;
    }

    public isLinkExists({ sourceActorId, targetActorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["isLinkExists"]>[0], "layerId">): boolean
    {
        let exists;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => exists = this.base.isLinkExists({ layerId: this.defaultLayerId, sourceActorId, targetActorId })
        });
        return exists!;
    }

    public getLinkWeight({ sourceActorId, targetActorId } : Omit<Parameters<typeof MultilayerNetworkIterate.prototype["getLinkWeight"]>[0], "layerId">): number
    {
        let weight;
        BipartiteNetworkErrors.remapExceptions({
            callback: () => weight = this.base.getLinkWeight({ layerId: this.defaultLayerId, sourceActorId, targetActorId }) 
        });

        return weight!;
    }

    protected iterate({ callback }: BipartiteIterateCallback): void
    {
        this.base.iterate({
            callback: ({ actors, links, weights }) => {
                callback({
                    actors: {
                        source: actors.get(this.defaultSourcePartitionId)!,
                        target: actors.get(this.defaultTargetPartitionId)!
                    },
                    links: links.get(this.defaultLayerId)! as ReadonlyBipartite,
                    weights: weights.get(this.defaultLayerId)!,
                    validators: {
                        validateActorIfExists: (args) => {
                            const { partition } = args;
                            BipartiteNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateActorIfExists({
                                    partitionId: partition == "target" ?  this.defaultTargetPartitionId : this.defaultSourcePartitionId,
                                    ...args
                                })
                            });
                        },
                        validateActorIfNotExists: (args) => {
                            const { partition } = args;
                            BipartiteNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateActorIfNotExists({
                                    partitionId: partition == "target" ?  this.defaultTargetPartitionId : this.defaultSourcePartitionId,
                                    ...args
                                })
                            });
                        },
                        validateLinkIfExists: (args) => {
                            BipartiteNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateLinkIfExists({ layerId: this.defaultLayerId, ...args })
                            });
                        },
                        validateLinkIfNotExists: (args) => {
                            BipartiteNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateLinkIfNotExists({ layerId: this.defaultLayerId, ...args })
                            });
                        }
                    }
                });
            }
        });
    }
};