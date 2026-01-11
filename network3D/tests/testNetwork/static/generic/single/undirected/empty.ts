import type { TestNetwork } from "../../../utilities";

export const emptyUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: ["1", "2", "3", "4"],
        links: []
    },
    metrics: {
        N: 4,
        M: 0,
        density: 0,
        components: [["1"], ["2"], ["3"], ["4"]],
        degree: new Map([["1", 0], ["2", 0], ["3", 0], ["4", 0]]),
        averageDegree: 0,
        degreeDistribution: [4/4]
    }
};