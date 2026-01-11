import type { TestNetwork } from "../../../utilities";

export const threeUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "4", weight: 5 },
            { source: "2", target: "3", weight: 5 },
            { source: "3", target: "4", weight: 7 }
        ]
    },
    metrics: {
        N: 4,
        M: 3,
        density: 1/2,
        components: [["1", "2", "3", "4"]],
        degree: new Map([["1", 1], ["2", 1], ["3", 2], ["4", 2]]),
        averageDegree: 3/2,
        degreeDistribution: [0, 2/4, 2/4]
    }
};