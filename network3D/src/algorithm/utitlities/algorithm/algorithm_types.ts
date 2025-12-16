import * as Core from "@/core";

export type LayerType = "Undirected" | "Directed" | "Bipartite";

export type IO<T> = { out: T, in: T };

export type NodesMetric<T> = Map<Core.ActorId, T>;

export type Adjacency_args_<T> = {
    adjacency: T
};

export type Adjacency_args = Adjacency_args_<Core.ReadonlyAdjacency>;

export type Layer_args_<T> = {
    layer: T
};

export type Layer_args = Layer_args_<Core.ReadonlyLayer>;

export type LayerType_args = {
    layerType: LayerType
};

export type Network_args_<T> = {
    network: T
};