import type { TestNetwork } from "../../utilities";

export const fullUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: [
            { source: "1", target: "2", weight: 3 },
            { source: "1", target: "3", weight: 4 },
            { source: "1", target: "4", weight: 5 },

            { source: "2", target: "3", weight: 5 },
            { source: "2", target: "4", weight: 6 },

            { source: "3", target: "4", weight: 7 }
        ]
    },
    metrics: {
        N: 4,
        M: 6,
        density: 1,
        components: [["1", "2", "3", "4"]],
        degree: new Map([["1", 3], ["2", 3], ["3", 3], ["4", 3]]),
        averageDegree: 3
    }
};