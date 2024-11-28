import {
    ARGS_Callback,
    ARGS_Iterate
} from "../../args_items.js";

import {
    TT,
    TU
} from "../../core/index.js";

import {
    Iterate,
    IterateCallback
} from "../../interface/index.js";

// interfaces of individual metrics for concrete classes
export interface GetLinksCount
{
    getLinksCount(args: any): any;
};

export interface GetNodesCount
{
    getNodesCount(args: any): any;
};

export interface Degree
{
    degree(args: any): any;
}

export interface DegreeSequence
{
    degreeSequence(args: any): any;
};

export interface AverageDegree
{
    averageDegree(args: any): any;
};

export interface DegreeDistribution
{
    degreeDistribution(args: any): any;
}

export interface ClusteringCoefficient
{
    clusteringCoefficient(args: any): any;
}

// Object type (interface) of parameters of metrics constructor
export interface ARGS_Network_Constructor<T extends TT, U extends TU<T>> extends ARGS_Iterate<Iterate<ARGS_Callback<IterateCallback<T, U>>, T, U>>
{ };