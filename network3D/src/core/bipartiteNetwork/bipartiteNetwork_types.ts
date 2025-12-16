import type { IClassAny, Optional } from "@/utilities";

import type {
    ActorId,
    MultilayerNetwork,
    MultilayerNetworkIterate,
    Callback_args,
    Validators_args,
    Weighted_args,
    Data_args,
    Schema_args,
    Links_args,
    Actors_args,
    BipartiteNetwork,
    ReadonlyBipartite,
    Weights_args
} from "@/core";

export type IMultilayerNetworkIterate = IClassAny<MultilayerNetworkIterate,
                                                        "addLink" |
                                                        "getLinksCount" |
                                                        "isLinkExists" |
                                                        "getLinkWeight"
                                                    >;

export type Source_args<T> = {
    source: T
};

export type Target_args<T> = {
    target: T
};

export type Partition_args = {
    partition: "source" | "target"
};

export type BipartiteConstructor =
    Optional<Schema_args<Weighted_args>, "schema">
  & Optional<Data_args<
        Optional<Actors_args<
            Optional<Source_args<Array<ActorId>>, "source">
          & Optional<Target_args<Array<ActorId>>, "target">        
        >, "actors">
      & Optional<Links_args<Array<Parameters<typeof BipartiteNetwork.prototype["addLink"]>[0]>>, "links">
  >, "data">;

export type BipartiteIterateCallback = Callback_args<
   ({ }: Actors_args<
            Source_args<ReadonlySet<string>>
          & Target_args<ReadonlySet<string>>
         >
       & Links_args<ReadonlyBipartite>
       & Weights_args<ReadonlyMap<ActorId, ReadonlyMap<ActorId, number>>>
       & Validators_args<{
                validateActorIfExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateActorIfExists"]>[0], "partitionId"> & Optional<Partition_args, "partition">) => void,
                validateActorIfNotExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateActorIfNotExists"]>[0], "partitionId"> & Optional<Partition_args, "partition">) => void,
                validateLinkIfExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateLinkIfExists"]>[0], "layerId">) => void,
                validateLinkIfNotExists: (args: Omit<Parameters<typeof MultilayerNetwork.prototype["validateLinkIfNotExists"]>[0], "layerId">) => void
            }   
    >) => void
>;