import type {
    LayerId,
    LayerSchema,
    LayerId_args,
    SchemaConstructor,
    Directed_args,
    Weighted_args,
    PartitionId,
    PartitionId_args,
    PartitionsIds_args,
    PartitionIds
} from "./networkSchema_types";

import { ID } from "../../utilities/id/id";
import {
    NonExistingPartitionError,
    AlreadyExistingPartitionError,
    AlreadyExistingLayerError,
    NonExistingLayerError,
    NonWeightedLayerError,
    WeightedLayerError
} from "./networkSchemaErrors";
import type { Optional } from "../../utilities";

// schema (structure definition) of any kind of (multilayer) network
export class NetworkSchema
{    
    // partition (actor type) IDs
    private partitions: Set<PartitionId> = new Set();
    // layers & their info (source type, target type)
    private layers: Map<LayerId, LayerSchema> = new Map();
    // inversion of layers - partition → layers IDs in which is as source partition
    private layersOfPartitions: Map<PartitionId, Array<LayerId>> = new Map();

    // initialization of network schema by constructor
    constructor(args: Parameters<NetworkSchema["init"]>[0] = { })
    {
        this.init(args);
    }

    protected init({ partitions, layers }: SchemaConstructor = { }): void
    {
        if(partitions !== undefined)
        {
            for(const partitionId of partitions)
            {
                this.addPartition({ partitionId });
            }
        }

        if(layers !== undefined)
        {
            for(const layerId in layers)
            {
                this.addLayer({ layerId, ...layers[layerId] });
            }
        }
    }

    public getPartitionsCount(): number
    {
        return this.partitions.size;
    }
    
    public getLayersCount(): number
    {
        return this.layers.size;
    }

    public getPartitionsList(): ReadonlyArray<PartitionId>
    {
        return Array.from(this.partitions);
    }

    public getLayersList(): ReadonlyArray<LayerId>
    {
        return Array.from(this.layers.keys());
    }
    
    public isPartitionExists({ partitionId }: PartitionId_args): boolean
    {
        ID.validateID({ id: partitionId });
        return this.partitions.has(partitionId);
    }
    
    public isLayerExists({ layerId }: LayerId_args): boolean
    {
        ID.validateID({ id: layerId });
        return this.layers.has(layerId);
    }

    public getLayersOfPartition({ partitionId }: PartitionId_args): ReadonlyArray<LayerId>
    {
        this.validatePartitionIfExists({ partitionId });
        return this.layersOfPartitions.get(partitionId)!;
    }

    protected validatePartitionIfExists({ partitionId }: PartitionId_args): void
    {
        if(!this.isPartitionExists({ partitionId }))
        {
            throw new NonExistingPartitionError({ partitionId });
        }
    }

    protected validatePartitionIfNotExists({ partitionId }: PartitionId_args): void
    {
        if(this.isPartitionExists({ partitionId }))
        {
            throw new AlreadyExistingPartitionError({ partitionId });
        }
    }

    protected validateLayerIfExists({ layerId }: LayerId_args): void
    {
        if(!this.isLayerExists({ layerId }))
        {
            throw new NonExistingLayerError({ layerId });
        }
    }

    protected validateLayerIfNotExists({ layerId }: LayerId_args): void
    {
        if(this.isLayerExists({ layerId }))
        {
            const { partitionIds } = this.getLayerSchema({ layerId });
            const partitionsIds = partitionIds.source == partitionIds.target ? partitionIds.source : partitionIds;
            throw new AlreadyExistingLayerError({ layerId, partitionsIds });
        }
    }

    protected validateLayerIfWeighted({ layerId }: LayerId_args): void
    {
        const { weighted } = this.getLayerSchema({ layerId });
        if(!weighted)
        {
            throw new NonWeightedLayerError({ layerId });
        }
    }

    protected validateLayerIfNotWeighted({ layerId }: LayerId_args): void
    {
        const { weighted } = this.getLayerSchema({ layerId });
        if(weighted)
        {
            throw new WeightedLayerError({ layerId });
        }
    }

    public getLayerSchema({ layerId }: LayerId_args): Readonly<LayerSchema>
    {
        // try to get schema of partition of layer, which does not exists in network schema → throw error
        this.validateLayerIfExists({ layerId });
        return this.layers.get(layerId)!;
    }

    public addPartition({ partitionId }: PartitionId_args): void
    {
        // duplicate partition ID → throw error
        this.validatePartitionIfNotExists({ partitionId });
        // add new partition
        this.partitions.add(partitionId);
        // create new item for given partition ID in "layersOfActorTypes"
        this.layersOfPartitions.set(partitionId, new Array());
    }

    public addLayer({ layerId, partitionsIds, directed = false, weighted = false }: LayerId_args & PartitionsIds_args & Optional<Directed_args, "directed"> & Optional<Weighted_args, "weighted">): void
    {
        const partitionIds: PartitionIds = {
            source: "",
            target: ""
        };

        if(typeof partitionsIds === "string")
        {
            // partition, which does not exists in network schema → throw error
            this.validatePartitionIfExists({ partitionId: partitionsIds });
            partitionIds.source = partitionIds.target = partitionsIds;
        }
        else
        {
            // partitions, which does not exists in network schema → throw error
            this.validatePartitionIfExists({ partitionId: partitionsIds.source });
            this.validatePartitionIfExists({ partitionId: partitionsIds.target });

            partitionIds.source = partitionsIds.source;
            partitionIds.target = partitionsIds.target;
        }

        // duplicate layer ID → throw error
        this.validateLayerIfNotExists({ layerId });
        // set new layer
        this.layers.set(layerId, { partitionIds, directed, weighted });
        // store layers IDs to "layersOfPartitions" of partitions
        if(typeof partitionsIds === "string")
        {
            this.layersOfPartitions.get(partitionsIds)!.push(layerId);
        }
        else
        {
            this.layersOfPartitions.get(partitionsIds.source)!.push(layerId);
            this.layersOfPartitions.get(partitionsIds.target)!.push(layerId);
        }
    }
};