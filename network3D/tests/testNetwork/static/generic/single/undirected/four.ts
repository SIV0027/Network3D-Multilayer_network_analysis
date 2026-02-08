import type { TestNetwork } from "../../../utilities";

export const fourUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "2" },
            { source: "1", target: "4" },

            { source: "2", target: "3" },

            { source: "3", target: "4" }
        ]
    },
    metrics: {
        N: 4,
        M: 4,
        density: 2/3,
        components: [["1", "2", "3", "4"]],

        degree: new Map([["1", 2], ["2", 2], ["3", 2], ["4", 2]]),
        averageDegree: 2,
        degreeDistribution: [0, 0, 4/4],
        
        clusteringCoefficient: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageClusteringCoefficient: 0,
        clusteringCoefficientDistribution: new Map([[0, 1]]),

        closeness: new Map([["1", 0.75], ["2", 0.75], ["3", 0.75], ["4", 0.75]]),
        averageCloseness: 3/4,
        closenessDistribution: new Map([[0.75, 1]]),
        
        betweenness: new Map([["1", 0.5], ["2", 0.5], ["3", 0.5], ["4", 0.5]]),
        averageBetweenness: 0.5,
        betweennessDistribution: new Map([[0.5, 1]]),
         
        diameter: 2,
        averagePathLength: 1/3 + 1
    }
};