import {
    AlgorithmError
} from "@/algorithm/utitlities";

export abstract class DensityError extends AlgorithmError
{
    protected static readonly densityMsg: string = `density`;
};

export class DensityMinimumActorsLayerError extends DensityError
{
    constructor({ minActors }: { minActors: number })
    {
        super(`${DensityMinimumActorsLayerError.layerMsg} must contains at least ${minActors} actor(s).`, { minActors });
    }
};