import type { TestNetwork } from "../../../utilities";

export const threeUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "4" },
            { source: "2", target: "3" },
            { source: "3", target: "4" }
        ]
    },
    metrics: {
        N: 4,
        M: 3,
        density: 1/2,
        components: [["1", "2", "3", "4"]],

        degree: new Map([["1", 1], ["2", 1], ["3", 2], ["4", 2]]),
        averageDegree: 3/2,
        degreeDistribution: [0, 2/4, 2/4],
        
        clusteringCoefficient: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageClusteringCoefficient: 0,
        clusteringCoefficientDistribution: new Map([[0, 1]]),

        closeness: new Map([["1", 0.5], ["2", 0.5], ["3", 0.75], ["4", 0.75]]),
        averageCloseness: 2.5/4,
        closenessDistribution: new Map([[0.5, 0.5], [0.75, 0.5]]),
        
        betweenness: new Map([["1", 0], ["2", 0], ["3", 2], ["4", 2]]),
        averageBetweenness: 1,
        betweennessDistribution: new Map([[0, 0.5], [2, 0.5]]),
         
        diameter: 3,
        averagePathLength: 1.6666666666666667
    }
};