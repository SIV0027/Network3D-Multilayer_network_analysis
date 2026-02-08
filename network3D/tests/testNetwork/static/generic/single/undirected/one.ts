import type { TestNetwork } from "../../../utilities";

export const oneUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "3" }
        ]
    },
    metrics: {
        N: 4,
        M: 1,
        density: 1/6,
        components: [["1", "3"], ["2"], ["4"]],

        degree: new Map([["1", 1], ["2", 0], ["3", 1], ["4", 0]]),
        averageDegree: 1/2,
        degreeDistribution: [2/4, 2/4],
        
        clusteringCoefficient: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageClusteringCoefficient: 0,
        clusteringCoefficientDistribution: new Map([[0, 1]]),

        closeness: undefined,
        
        betweenness: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageBetweenness: 0,
        betweennessDistribution: new Map([[0, 1]]),
         
        diameter: 1,
        averagePathLength: 1
    }
};