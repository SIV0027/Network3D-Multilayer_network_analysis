import type { TestNetwork } from "../../../utilities";

export const oneUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "3", weight: 4 }
        ]
    },
    metrics: {
        N: 4,
        M: 1,
        density: 1/6,
        components: [["1", "3"], ["2"], ["4"]],
        degree: new Map([["1", 1], ["2", 0], ["3", 1], ["4", 0]]),
        averageDegree: 1/2,
        degreeDistribution: [2/4, 2/4]
    }
};