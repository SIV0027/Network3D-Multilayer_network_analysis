import {
    ARGS_TUMeta
} from "../../args_items.js";

import {
    Node
} from "./../node/node.js";

import { 
    Link
} from "../link/link.js";

// Template for multi prop key of link layer structure
export type Multi = {
    Multilinks: any,
    Singlelinks: any
};

// Data structures for link layer structure by if link layer enable multilinks or not
export type Multi_Gen<L extends keyof U, T extends TT, U extends TU<T>> = {
    Multilinks: Map<string, Array<Link<L, T, U>>>,
    Singlelinks: Map<string, Link<L, T, U>>
};

// Template for orientation prop of link layer structure
export type Orientation = {
    Undirected: any,
    Directed: any
};

// Data structures for link layer structure by orientation of link layer
export type Orientation_Gen<K extends keyof Multi, L extends keyof U, T extends TT, U extends TU<T>> = {
    Undirected: Multi_Gen<L, T, U>[K],
    Directed: U[K]["source"] extends U[K]["target"] ? U[K]["target"] extends U[K]["source"] ? { in: Multi_Gen<L, T, U>[K], out: Multi_Gen<L, T, U>[K] } : Multi_Gen<L, T, U>[K] : Multi_Gen<L, T, U>[K]
};

// Directed or undirected
export type Orientation_Undir<T> = T;
export type Orientation_Dir<T> = { in: T, out: T };
export type Orientation_Undir_Dir<V extends keyof Orientation, T> = V extends "Undirected" ? Orientation_Undir<T> : Orientation_Dir<T>;

// Type filter for filtering if given node layer is source or target node type of given link layer
export type Filtered_U_Keys<K extends keyof U, L extends keyof T, T extends TT, U extends TU<T>> = U[K]["source"] extends L ? K : U[K]["target"] extends L ? K : never;
// Data structure for link layers of given node
export type Node_Links<L extends keyof T, T extends TT, U extends TU<T>> = {
    [K in keyof U as Filtered_U_Keys<K, L, T, U>]: Orientation_Gen<U[K]["multi"], K, T, U>[U[K]["orientation"]];
};

// Data structure for node layers of multilayer network
export type MultilayerNetwork_Nodes<T extends TT, U extends TU<T>> = { 
    [K in keyof T]: Map<string, Node<K, T, U>>;
};

// Type which decides if given link layer have enabled multilinks
export type Multi_Data_Type<L extends keyof U, T extends TT, U extends TU<T>> = U[L]["multi"] extends "Singlelinks" ? Link<L, T, U> : Array<Link<L, T, U>>;

// Template for Node types (key -> name of node type)
export type TT = {
    [key: string]: {
        value: any
    }
};

// Template for Link types
export type TU<T extends TT> = { 
    [key: string]: {
        source: keyof T,
        target: keyof T,
        value: any,
        orientation: keyof Orientation,
        multi: keyof Multi
    }
};

// Type for store source and target type
export type Source_Target<T, U> = {
    source: T,
    target: U
};

// Type for store orientation and multilinks information
export type Orientation_Multi<T, U> = {
    orientation: T,
    multi: U
};

// Type for describing structure of (node and link) layers in network for runtime
export type TU_Meta<T extends TT, U extends TU<T>> = {
    nodes: {
        [L in keyof T]: null
    }
    links: {
        [L in keyof U]: Source_Target<U[L]["source"], U[L]["target"]> & Orientation_Multi<U[L]["orientation"], U[L]["multi"]>
    }
};

// Same as Orientation_Multi (maybe replace it by Orientation_Multi type)
export type Layer_Orientation_Multi<T extends TT, U extends TU<T>, L extends keyof U> = {
    orientation: U[L]["orientation"],
    multi: U[L]["multi"]
};

// Object type (interface) of parameters of HIN constructor
export interface ARGS_HIN_Constructor<T> extends ARGS_TUMeta<T>
{ };