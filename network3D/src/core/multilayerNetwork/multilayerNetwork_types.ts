import type {
    Id,
    LayerId,
    PartitionId
} from "@/core/networkSchema/networkSchema_types";
import type {
    MultilayerNetwork,
    NetworkSchema
} from "..";
import type { Optional } from "@/utilities";

export type Adjacency  = Map<ActorId, Set<ActorId>>;
export type Directed = { out: Adjacency, in: Adjacency };
export type Bipartite = { source: Adjacency, target: Adjacency };
export type Layer = Adjacency | Directed | Bipartite;

export type ReadonlyAdjacency = ReadonlyMap<ActorId, ReadonlySet<ActorId>>;
export type ReadonlyDirected = Readonly<{ out: ReadonlyAdjacency, in: ReadonlyAdjacency }>;
export type ReadonlyBipartite = Readonly<{ source: ReadonlyAdjacency, target: ReadonlyAdjacency }>;
export type ReadonlyLayer = ReadonlyAdjacency | ReadonlyDirected | ReadonlyBipartite;

export type AdjacencyType = "in" | "out" | "source" | "target";

export type ActorId = Id;
export type ActorId_args = {
    actorId: ActorId
};
export type SourceTargetId_args = {
    sourceActorId: ActorId,
    targetActorId: ActorId
};

export type Weight_args = {
    weight: number
};

export type AdjacencyType_args = {
    adjacencyType: AdjacencyType
};

export type Callback_args<T> = {
    callback: T
};

export type Actors_args<T> = {
    actors: T
};

export type Links_args<T> = {
    links: T
};

export type GetAdjacency_args<T> = {
    getAdjacency: T
};

export type Validators_args<T> = {
    validators: T
};

export type Schema_args<T> = {
    schema: T
};

export type Data_args<T> = {
    data: T
};

export type Weights_args<T> = {
    weights: T
};

export type MultilayerConstructor =
    Optional<Schema_args<ConstructorParameters<typeof NetworkSchema>[0]>, "schema">
  & Optional<Data_args<
        Optional<Actors_args<Record<PartitionId, Array<Omit<Parameters<typeof MultilayerNetwork.prototype["addActor"]>[0], "partitionId">["actorId"]>>>, "actors">
      & Optional<Links_args<Record<LayerId, Array<Omit<Parameters<typeof MultilayerNetwork.prototype["addLink"]>[0], "layerId">>>>, "links">
    >, "data">;

export type MultilayerIterateCallback = Callback_args<
    ({ }: Actors_args<ReadonlyMap<ActorId, ReadonlySet<string>>>
        & Links_args<ReadonlyMap<LayerId, ReadonlyLayer>>
        & Weights_args<ReadonlyMap<LayerId, ReadonlyMap<ActorId, ReadonlyMap<ActorId, number>>>>
        & GetAdjacency_args<typeof MultilayerNetwork.prototype["getAdjacency"]>
        & Validators_args<
            Schema_args<{
                validatePartitionIfExists: typeof MultilayerNetwork.prototype["validatePartitionIfExists"],
                validatePartitionIfNotExists: typeof MultilayerNetwork.prototype["validatePartitionIfNotExists"],
                validateLayerIfExists: typeof MultilayerNetwork.prototype["validateLayerIfExists"],
                validateLayerIfNotExists: typeof MultilayerNetwork.prototype["validateLayerIfNotExists"],                
                validateLayerIfWeighted: typeof MultilayerNetwork.prototype["validateLayerIfWeighted"],
                validateLayerIfNotWeighted: typeof MultilayerNetwork.prototype["validateLayerIfNotWeighted"]
            }>
          & Data_args<{
                validateActorIfExists: typeof MultilayerNetwork.prototype["validateActorIfExists"],
                validateActorIfNotExists: typeof MultilayerNetwork.prototype["validateActorIfNotExists"],
                validateLinkIfExists: typeof MultilayerNetwork.prototype["validateLinkIfExists"],
                validateLinkIfNotExists: typeof MultilayerNetwork.prototype["validateLinkIfNotExists"] 
            }>    
    >) => void
>;