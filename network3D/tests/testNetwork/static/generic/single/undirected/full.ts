import type { TestNetwork } from "../../../utilities";

export const fullUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "2" },
            { source: "1", target: "3" },
            { source: "1", target: "4" },

            { source: "2", target: "3" },
            { source: "2", target: "4" },

            { source: "3", target: "4" }
        ]
    },
    metrics: {
        N: 4,
        M: 6,
        density: 1,
        components: [["1", "2", "3", "4"]],

        degree: new Map([["1", 3], ["2", 3], ["3", 3], ["4", 3]]),
        averageDegree: 3,
        degreeDistribution: [0, 0, 0, 4/4],
        
        clusteringCoefficient: new Map([["1", 1], ["2", 1], ["3", 1], ["4", 1]]),
        averageClusteringCoefficient: 1,
        clusteringCoefficientDistribution: new Map([[1, 1]]),

        closeness: new Map([["1", 1], ["2", 1], ["3", 1], ["4", 1]]),
        averageCloseness: 1,
        closenessDistribution: new Map([[1, 1]]),
        
        betweenness: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageBetweenness: 0,
        betweennessDistribution: new Map([[0, 1]]),
         
        diameter: 1,
        averagePathLength: 1
    }
};