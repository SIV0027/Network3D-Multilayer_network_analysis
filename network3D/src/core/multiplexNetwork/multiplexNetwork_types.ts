import type { IClassAny, Optional } from "@/utilities";

import type {
    LayerId,
    LayerSchema,
    MultilayerNetwork,
    MultilayerNetworkIterate,
    MultiplexNetwork,
    ActorId,
    Callback_args,
    Actors_args,
    Data_args,
    GetAdjacency_args,
    Links_args,
    Schema_args,
    Validators_args,
    Weights_args,
    ReadonlyDirected,
    ReadonlyAdjacency
} from "@/core";


export type IMultiplexNetworkIterate = IClassAny<MultilayerNetworkIterate,
                                                        "addLayer" |
                                                        "addActor" |
                                                        "addLink" |
                                                        "getActorsCount" |
                                                        "getLayersCount" |
                                                        "getLayerSchema" |
                                                        "getLinksCount" |
                                                        "isActorExists" |
                                                        "isLayerExists" |
                                                        "isLinkExists" |
                                                        "getLayersList" |
                                                        "getLinkWeight"
                                                    >;

export type MultiplexLayerSchema = Omit<LayerSchema, "partitionIds">;

export type MultiplexIterateCallback = Callback_args<
   ({ }: Actors_args<ReadonlySet<string>>
       & Links_args<ReadonlyMap<LayerId, ReadonlyDirected | ReadonlyAdjacency>>
       & Weights_args<ReadonlyMap<LayerId, ReadonlyMap<ActorId, ReadonlyMap<ActorId, number>>>>
       & GetAdjacency_args<typeof MultilayerNetwork.prototype["getAdjacency"]>
       & Validators_args<
            Schema_args<{
                validateLayerIfExists: typeof MultilayerNetwork.prototype["validateLayerIfExists"],
                validateLayerIfNotExists: typeof MultilayerNetwork.prototype["validateLayerIfNotExists"],
                validateLayerIfWeighted: typeof MultilayerNetwork.prototype["validateLayerIfWeighted"],
                validateLayerIfNotWeighted: typeof MultilayerNetwork.prototype["validateLayerIfNotWeighted"]
            }>
          & Data_args<{
                validateActorIfExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateActorIfExists"]>[0], "partitionId">) => void,
                validateActorIfNotExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateActorIfNotExists"]>[0], "partitionId">) => void,
                validateLinkIfExists: typeof MultilayerNetwork.prototype["validateLinkIfExists"],
                validateLinkIfNotExists: typeof MultilayerNetwork.prototype["validateLinkIfNotExists"]
            }>    
    >) => void    
>;

export type MultiplexConstructor =
    Optional<Schema_args<Record<LayerId, Omit<Parameters<typeof MultiplexNetwork.prototype["addLayer"]>[0], "layerId">> | Array<LayerId>>, "schema">
  & Optional<Data_args<
        Optional<Actors_args<Array<ActorId>>, "actors">
      & Optional<Links_args<Record<LayerId, Array<Omit<Parameters<typeof MultiplexNetwork.prototype["addLink"]>[0], "layerId">>>>, "links">
    >, "data">;