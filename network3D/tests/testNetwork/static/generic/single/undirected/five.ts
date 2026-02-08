import type { TestNetwork } from "../../../utilities";

export const fiveUndirectedGenericTestNetwork: TestNetwork = {
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

            { source: "2", target: "4" },

            { source: "3", target: "4" }
        ]
    },
    metrics: {
        N: 4,
        M: 5,
        density: 5/6,
        components: [["1", "2", "3", "4"]],

        degree: new Map([["1", 3], ["2", 2], ["3", 2], ["4", 3]]),
        averageDegree: 5/2,
        degreeDistribution: [0, 0, 2/4, 2/4],

        clusteringCoefficient: new Map([["1", 2/3], ["2", 1], ["3", 1], ["4", 2/3]]),
        averageClusteringCoefficient: ((4/3 + 2) / 4),
        clusteringCoefficientDistribution: new Map([[2/3, 1/2], [1, 1/2]]),

        closeness: new Map([["1", 1], ["2", 0.75], ["3", 0.75], ["4", 1]]),
        averageCloseness: 3.5/4,
        closenessDistribution: new Map([[0.75, 0.5], [1, 0.5]]),
        
        betweenness: new Map([["1", 0.5], ["2", 0], ["3", 0], ["4", 0.5]]),
        averageBetweenness: 1/4,
        betweennessDistribution: new Map([[0.5, 0.5], [0, 0.5]]),
         
        diameter: 2,
        averagePathLength: 1.1666666666666667
    }
};