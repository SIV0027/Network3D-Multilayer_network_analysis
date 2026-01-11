import type { TestNetwork } from "../../utilities";

export const karateKlubRealTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: false
    },
    data: {
        nodes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"],
        links: [
           { source: "2", target: "1" },

           { source: "3", target: "1" },
           { source: "3", target: "2" },

           { source: "4", target: "1" },
           { source: "4", target: "2" },
           { source: "4", target: "3" },

           { source: "5", target: "1" },

           { source: "6", target: "1" },

           { source: "7", target: "1" },
           { source: "7", target: "5" },
           { source: "7", target: "6" },

           { source: "8", target: "1" },
           { source: "8", target: "2" },
           { source: "8", target: "3" },
           { source: "8", target: "4" },

           { source: "9", target: "1" },
           { source: "9", target: "3" },

           { source: "10", target: "3" },

           { source: "11", target: "1" },
           { source: "11", target: "5" },
           { source: "11", target: "6" },

           { source: "12", target: "1" },

           { source: "13", target: "1" },
           { source: "13", target: "4" },

           { source: "14", target: "1" },
           { source: "14", target: "2" },
           { source: "14", target: "3" },
           { source: "14", target: "4" },

           { source: "17", target: "6" },
           { source: "17", target: "7" },

           { source: "18", target: "1" },
           { source: "18", target: "2" },

           { source: "20", target: "1" },
           { source: "20", target: "2" },

           { source: "22", target: "1" },
           { source: "22", target: "2" },

           { source: "26", target: "24" },
           { source: "26", target: "25" },

           { source: "28", target: "3" },
           { source: "28", target: "24" },
           { source: "28", target: "25" },

           { source: "29", target: "3" },

           { source: "30", target: "24" },
           { source: "30", target: "27" },

           { source: "31", target: "2" },
           { source: "31", target: "9" },

           { source: "32", target: "1" },
           { source: "32", target: "25" },
           { source: "32", target: "26" },
           { source: "32", target: "29" },
           
           { source: "33", target: "3" },
           { source: "33", target: "9" },
           { source: "33", target: "15" },
           { source: "33", target: "16" },
           { source: "33", target: "19" },
           { source: "33", target: "21" },
           { source: "33", target: "23" },
           { source: "33", target: "24" },
           { source: "33", target: "30" },
           { source: "33", target: "31" },
           { source: "33", target: "32" },

           { source: "34", target: "9" },
           { source: "34", target: "10" },
           { source: "34", target: "14" },
           { source: "34", target: "15" },
           { source: "34", target: "16" },
           { source: "34", target: "19" },
           { source: "34", target: "20" },
           { source: "34", target: "21" },
           { source: "34", target: "23" },
           { source: "34", target: "24" },
           { source: "34", target: "27" },
           { source: "34", target: "28" },
           { source: "34", target: "29" },
           { source: "34", target: "30" },
           { source: "34", target: "31" },
           { source: "34", target: "32" },
           { source: "34", target: "33" },
        ]
    },
    metrics: {
        N: 34,
        M: 78,
        density: 0.139,
        components: [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"]],
        degree: new Map([["1", 16], ["2", 9], ["3", 10], ["4", 6], ["5", 3], ["6", 4], ["7", 4], ["8", 4], ["9", 5], ["10", 2], ["11", 3], ["12", 1], ["13", 2], ["14", 5], ["15", 2], ["16", 2], ["17", 2], ["18", 2], ["19", 2], ["20", 3], ["21", 2], ["22", 2], ["23", 2], ["24", 5], ["25", 3], ["26", 3], ["27", 2], ["28", 4], ["29", 3], ["30", 4], ["31", 4], ["32", 6], ["33", 12], ["34", 17]]),
        averageDegree: 4.588,
        degreeDistribution: [0, 1/34, 11/34, 6/34, 6/34, 3/34, 2/34, 0, 0, 1/34, 1/34, 0, 1/34, 0, 0, 0, 1/34, 1/34]
    }
};
/*
[2 1]
[3 1] [3 2]
[4 1] [4 2] [4 3]
[5 1]
[6 1]
[7 1] [7 5] [7 6]
[8 1] [8 2] [8 3] [8 4]
[9 1] [9 3]
[10 3]
[11 1] [11 5] [11 6]
[12 1]
[13 1] [13 4]
[14 1] [14 2] [14 3] [14 4]
[17 6] [17 7]
[18 1] [18 2]
[20 1] [20 2]
[22 1] [22 2]
[26 24] [26 25]
[28 3] [28 24] [28 25]
[29 3]
[30 24] [30 27]
[31 2] [31 9]
[32 1] [32 25] [32 26] [32 29]
[33 3] [33 9] [33 15] [33 16] [33 19] [33 21] [33 23] [33 24] [33 30] [33 31] [33 32]
[34 9] [34 10] [34 14] [34 15] [34 16] [34 19] [34 20] [34 21] [34 23] [34 24] [34 27] [34 28] [34 29] [34 30] [34 31] [34 32] [34 33]*/