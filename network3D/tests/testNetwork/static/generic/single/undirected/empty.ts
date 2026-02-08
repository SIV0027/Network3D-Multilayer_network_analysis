import type { TestNetwork } from "../../../utilities";

export const emptyUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: []
    },
    metrics: {
        N: 4,
        M: 0,
        density: 0,
        components: [["1"], ["2"], ["3"], ["4"]],

        degree: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageDegree: 0,
        degreeDistribution: [4/4],
        
        clusteringCoefficient: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageClusteringCoefficient: 0,
        clusteringCoefficientDistribution: new Map([[0, 1]]),

        closeness: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageCloseness: 0,
        closenessDistribution: new Map([[0, 1]]),
        
        betweenness: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageBetweenness: 0,
        betweennessDistribution: new Map([[0, 1]]),
         
        diameter: 0,
        averagePathLength: 0
    }
};