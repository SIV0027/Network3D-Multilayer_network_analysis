import type { Optional } from "../../utilities";
import type { NetworkSchema } from "./networkSchema";

export type Id = string;
export type PartitionId = Id;
export type PartitionIds = { source: PartitionId,  target: PartitionId };
export type LayerId = Id;
export type LayerSchema = PartitionIds_args & Directed_args & Weighted_args;

export type LayerId_args = {
    layerId: LayerId
};

export type PartitionId_args = {
    partitionId: PartitionId
};

export type PartitionIds_args = {
    partitionIds: PartitionIds
};

export type PartitionsIds_args = {
    partitionsIds: PartitionId | PartitionIds
};

export type Directed_args = {
    directed: boolean
};

export type Weighted_args = {
    weighted: boolean
};

export type Partitions_args<T> = {
    partitions: T
};

export type Layer_args<T> = {
    layers: T
};

export type SchemaConstructor = 
    Optional<Partitions_args<Array<Parameters<typeof NetworkSchema.prototype["addPartition"]>[0]["partitionId"]>>, "partitions">
  & Optional<Layer_args<Record<LayerId, Omit<Parameters<typeof NetworkSchema.prototype["addLayer"]>[0], "layerId">>>, "layers">;