import { AlgorithmMinimumActorsLayerError } from "@/algorithm/utitlities";
import type { TestNetwork } from "../../../utilities";
import { DegreeEmptyLayerError } from "@/algorithm/core/degree/degreeErrors";

export const noneUndirectedGenericTestNetwork: TestNetwork = {
    schema: {
        directed: false,
        weighted: true
    },
    data: {
        nodes: [],
        links: []
    },
    metrics: {
        N: 0,
        M: 0,
        density: AlgorithmMinimumActorsLayerError,
        components: [],
        degree: new Map(),
        averageDegree: DegreeEmptyLayerError,
        degreeDistribution: DegreeEmptyLayerError
    }
};