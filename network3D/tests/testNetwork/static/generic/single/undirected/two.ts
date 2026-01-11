import type { TestNetwork } from "../../../utilities";

export const twoUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "2", target: "4", weight: 6 },
            { source: "3", target: "4", weight: 7 }
        ]
    },
    metrics: {
        N: 4,
        M: 2,
        density: 1/3,
        components: [["1"], ["2", "3", "4"]],
        degree: new Map([["1", 0], ["2", 1], ["3", 1], ["4", 2]]),
        averageDegree: 1,
        degreeDistribution: [1/4, 2/4, 1/4]
    }
};