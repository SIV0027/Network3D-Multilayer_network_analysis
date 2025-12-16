import type { IClassAny, Optional } from "@/utilities";

import type {
    ActorId,
    Actors_args,
    Callback_args,
    Data_args,
    Links_args,
    MultilayerNetwork,
    MultilayerNetworkIterate,
    MultiplexNetwork,
    ReadonlyAdjacency,
    ReadonlyDirected,
    Schema_args,
    SingleLayerNetwork,
    Validators_args,
    Weights_args
} from "@/core";

export type ISingleLayerNetworkIterate = IClassAny<MultilayerNetworkIterate,
                                                        "addActor" |
                                                        "addLink" |
                                                        "getActorsCount" |
                                                        "getLinksCount" |
                                                        "isActorExists" |
                                                        "isLinkExists" |
                                                        "getLinkWeight"
                                                    >;

export type SingleLayerIterateCallback = Callback_args<
   ({ }: Actors_args<ReadonlySet<string>>
       & Links_args<ReadonlyAdjacency | ReadonlyDirected>
       & Weights_args<ReadonlyMap<ActorId, ReadonlyMap<ActorId, number>>>
       & Validators_args<{
                validateActorIfExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateActorIfExists"]>[0], "partitionId">) => void,
                validateActorIfNotExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateActorIfNotExists"]>[0], "partitionId">) => void,
                validateLinkIfExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateLinkIfExists"]>[0], "layerId">) => void,
                validateLinkIfNotExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateLinkIfNotExists"]>[0], "layerId">) => void
            }   
    >) => void
>;

export type SingleLayerConstructor =
    Optional<Schema_args<Omit<Parameters<typeof MultiplexNetwork.prototype["addLayer"]>[0], "layerId">>, "schema">
  & Optional<Data_args<
        Optional<Actors_args<Array<ActorId>>, "actors">
      & Optional<Links_args<Array<Parameters<typeof SingleLayerNetwork.prototype["addLink"]>[0]>>, "links">
  >, "data">;