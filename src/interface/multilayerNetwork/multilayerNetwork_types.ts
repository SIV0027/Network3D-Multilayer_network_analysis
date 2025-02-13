import {
    ARGS_Callback,
    ARGS_LayerId,
    ARGS_NodeId,
    ARGS_SourceNodeId,
    ARGS_TargetNodeId,
    ARGS_TUMeta
} from "../../args_items.js";

import {
    HIN,
    Multi_Data_Type,
    Node,
    Node_Links,
    TT,
    TU,
    TU_Meta
} from "../../core/index.js";

// Type which determines if concrete leayer of network enables multilinks or not - if enables => T; otherwise Array<T>
export type Multi_Data_Type_Value<T extends TT, U extends TU<T>, L extends keyof U> = U[L]["multi"] extends "Singlelinks" ? U[L]["value"] : Array<U[L]["value"]>;

// Type for iterate method which enables iterate through the network
export type Iterate<ARGS extends ARGS_Callback<IterateCallback<T, U>>, T extends TT, U extends TU<T>> = (args: ARGS) => void;

// Type for callback to iterate through network
export type IterateCallback<T extends TT, U extends TU<T>> = (args: {
    // Callback gets:
    // All node layers (the whole data structure)
    nodeLayers: {
        [K in keyof T]: Map<string, Node<K, T, U>>
    },
    // All link layers (the whole data structures of source node layer and target node layer of each link layer)
    linkLayers: {
        [K in keyof U]: [Map<string, Node<U[K]["source"], T, U>>, Map<string, Node<U[K]["target"], T, U>>]
    },
    // Information about whole multilayer network (HIN network)
    hin: HIN<T, U>,
    getNode: <L extends keyof T, ARGS extends ARGS_LayerId<L> &
                                              ARGS_NodeId<string>>
            (args: ARGS) => Node<L, T, U>,
    getLink: <L extends keyof U & keyof Node_Links<U[L]["source"], T, U> & keyof Node_Links<U[L]["target"], T, U>, ARGS extends ARGS_LayerId<L> &
                                                                                                                   ARGS_SourceNodeId<string> &
                                                                                                                   ARGS_TargetNodeId<string>>
            (args: ARGS) => Multi_Data_Type<L, T, U>
}) => void;


// Object type (interface) of parameters of MutlilayerNetwork constructor
export interface ARGS_MultilayerNetwork_Constructor<T extends TT, U extends TU<T>> extends ARGS_TUMeta<TU_Meta<T, U>>
{ };