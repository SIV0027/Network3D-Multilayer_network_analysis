import type { TestNetwork } from "../../utilities";

export const weightedUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        links: [
            { source: "1", target: "2", weight: 3 },
            { source: "1", target: "3", weight: 4 },

            { source: "2", target: "4", weight: 6 },
            { source: "3", target: "4", weight: 7 },
            
            { source: "4", target: "5", weight: 9 },
            { source: "4", target: "6", weight: 10 },
            
            { source: "5", target: "7", weight: 12 },
            { source: "6", target: "7", weight: 13 },
            
            { source: "7", target: "8", weight: 15 },
            { source: "7", target: "9", weight: 16 },
            
            { source: "8", target: "10", weight: 18 },
            { source: "9", target: "10", weight: 19 }
        ]   
    },
    metrics: {
        N: 10,
        M: 12,
        density: 12/45,
        components: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]],
        degree: new Map([["1", 2], ["2", 2], ["3", 2], ["4", 4], ["5", 2], ["6", 2], ["7", 4], ["8", 2], ["9", 2], ["10", 2]]),
        averageDegree: 24/10
    }
};