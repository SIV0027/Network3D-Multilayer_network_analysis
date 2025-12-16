import type { Error_args } from "@/utilities/network3DError/network3DError_types";
import {
    AlgorithmError,
    AlgorithmEmptyLayerError
} from "@/algorithm/utitlities";

export abstract class DegreeError extends AlgorithmError
{    
    protected static readonly degreeAvgMsg: string = `average degree`;    

    public static override remapExceptions({ callback }: { callback: () => any }): void
    {
        super.remapExceptions({ callback, mapFunction: new Map([
                [AlgorithmEmptyLayerError.name, (error: AlgorithmEmptyLayerError) => new DegreeEmptyLayerError({ error })]
            ])
        });
    }
};

export class DegreeEmptyLayerError extends DegreeError
{
    constructor({ error }: Error_args<AlgorithmEmptyLayerError>)
    {
        super(`${DegreeEmptyLayerError.layerMsg} ${DegreeEmptyLayerError.cannotBeMsg} ${DegreeEmptyLayerError.emptyMsg} ${DegreeEmptyLayerError.withinMsg} ${DegreeEmptyLayerError.degreeAvgMsg}`, error.data);
    }
};