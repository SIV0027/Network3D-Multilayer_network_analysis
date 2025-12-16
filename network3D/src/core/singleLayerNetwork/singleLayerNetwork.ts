import {
    type ISingleLayerNetworkIterate,
    type PartitionId,
    type ReadonlyAdjacency,
    type ReadonlyDirected,
    type SingleLayerConstructor,
    type SingleLayerIterateCallback,

    SingleLayerNetworkErrors
} from "@/core";

import {
    type LayerId,

    MultilayerNetworkIterate
} from "./../index";

// one actor type in single context (only one/single layer → actor type and layer are constants)
export class SingleLayerNetwork
implements ISingleLayerNetworkIterate
{
    // composition is more relevant than inheritance in this case
    private base!: MultilayerNetworkIterate;
    // default name of actor type (only one → considering actor type is irrelevant)
    private readonly defaultPartitionId: PartitionId = "default";
    // default name of layer (only one → considering layer is irrelevant)
    private readonly defaultLayerId: LayerId = "default";

    constructor({ data, schema }: SingleLayerConstructor = { })
    {
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => {
                this.base = new MultilayerNetworkIterate({
                    schema: {
                        partitions: [this.defaultPartitionId],
                        layers: { [this.defaultLayerId]: { partitionsIds: this.defaultPartitionId, ...schema } }
                    },
                    data: {
                        actors: {
                            [this.defaultPartitionId]: data?.actors ?? []
                        },
                        links: {
                            [this.defaultLayerId]: data?.links ?? []
                        }
                    }
                });
            }
        });
    }

    public getSchema(): Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addLayer"]>[0], "layerId" | "partitionsIds">
    {
        const { directed, weighted } = this.base.getLayerSchema({ layerId: this.defaultLayerId });
        return { directed, weighted };
    }

    public addActor({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addActor"]>[0], "partitionId">): void
    {
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => this.base.addActor({ partitionId: this.defaultPartitionId, actorId })
        });
    }

    public addLink({ sourceActorId, targetActorId, weight }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["addLink"]>[0], "layerId">): void
    {
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => this.base.addLink({ layerId: this.defaultLayerId, sourceActorId, targetActorId, weight })
        });
    }
    
    public getActorsCount(): number
    {
        let count;
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => count = this.base.getActorsCount({ partitionId: this.defaultPartitionId })
        });

        return count!;
    }

    public getLinksCount(): number
    {
        let count;
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => count = this.base.getLinksCount({ layerId: this.defaultLayerId })
        });

        return count!;
    }

    public isActorExists({ actorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["isActorExists"]>[0], "partitionId">): boolean
    {
        let exists;
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => exists = this.base.isActorExists({ partitionId: this.defaultPartitionId, actorId })
        });

        return exists!;
    }

    public isLinkExists({ sourceActorId, targetActorId }: Omit<Parameters<typeof MultilayerNetworkIterate.prototype["isLinkExists"]>[0], "layerId">): boolean
    {
        let exists;
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => exists = this.base.isLinkExists({ layerId: this.defaultLayerId, sourceActorId, targetActorId })
        });

        return exists!;
    }

    public getLinkWeight({ sourceActorId, targetActorId } : Omit<Parameters<typeof MultilayerNetworkIterate.prototype["getLinkWeight"]>[0], "layerId">): number
    {
        let weight;
        SingleLayerNetworkErrors.remapExceptions({
            callback: () => weight = this.base.getLinkWeight({ layerId: this.defaultLayerId, sourceActorId, targetActorId }) 
        });

        return weight!;
    }

    protected iterate({ callback }: SingleLayerIterateCallback): void
    {
        this.base.iterate({
            callback: ({ actors, links, weights }) => {
                callback({
                    actors: actors.get(this.defaultPartitionId)!,
                    links: links.get(this.defaultLayerId)! as (ReadonlyAdjacency | ReadonlyDirected),
                    weights: weights.get(this.defaultLayerId)!,
                    validators: {
                        validateActorIfExists: (args) => {
                            SingleLayerNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateActorIfExists({ partitionId: this.defaultPartitionId, ...args })
                            });
                        },
                        validateActorIfNotExists: (args) => {
                            SingleLayerNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateActorIfNotExists({ partitionId: this.defaultPartitionId, ...args })
                            });
                        },
                        validateLinkIfExists: (args) => {
                            SingleLayerNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateLinkIfExists({ layerId: this.defaultLayerId, ...args })
                            });
                        },
                        validateLinkIfNotExists: (args) => {
                            SingleLayerNetworkErrors.remapExceptions({
                                callback:  () => this.base.validateLinkIfNotExists({ layerId: this.defaultLayerId, ...args })
                            });
                        }
                    }
                });
            }
        });
    }
};