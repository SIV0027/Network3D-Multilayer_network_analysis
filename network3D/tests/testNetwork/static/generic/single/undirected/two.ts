import type { TestNetwork } from "../../../utilities";

export const twoUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "2", target: "4" },
            { source: "3", target: "4" }
        ]
    },
    metrics: {
        N: 4,
        M: 2,
        density: 1/3,
        components: [["1"], ["2", "3", "4"]],

        degree: new Map([["1", 0], ["2", 1], ["3", 1], ["4", 2]]),
        averageDegree: 1,
        degreeDistribution: [1/4, 2/4, 1/4],
        
        clusteringCoefficient: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageClusteringCoefficient: 0,
        clusteringCoefficientDistribution: new Map([[0, 1]]),

        closeness: undefined,
        
        betweenness: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 1]]),
        averageBetweenness: 1/4,
        betweennessDistribution: new Map([[0, 3/4], [1, 1/4]]),
         
        diameter: 2,
        averagePathLength: 1 / 3 + 1
    }
};