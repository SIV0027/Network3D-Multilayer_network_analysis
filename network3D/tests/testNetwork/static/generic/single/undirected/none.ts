import { AlgorithmMinimumActorsLayerError } from "@/algorithm/utitlities";
import type { TestNetwork } from "../../../utilities";

export const noneUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: [],
        links: []
    },
    metrics: {
        N: 0,
        M: 0,
        density: AlgorithmMinimumActorsLayerError,
        components: [],

        degree: new Map(),
        averageDegree: NaN,
        degreeDistribution: new Array(),
        
        clusteringCoefficient: new Map(),
        averageClusteringCoefficient: NaN,
        clusteringCoefficientDistribution: new Map(),

        closeness: new Map(),
        averageCloseness: NaN,
        closenessDistribution: new Map(),
        
        betweenness: new Map(),
        averageBetweenness: NaN,
        betweennessDistribution: new Map(),
         
        diameter: 0,
        averagePathLength: 0
    }
};