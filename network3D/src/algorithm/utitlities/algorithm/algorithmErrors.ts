import { Network3DError } from "@/utilities";

export abstract class AlgorithmError extends Network3DError
{
    protected static readonly layerMsg: string = `layer`;
    protected static readonly emptyMsg: string = `empty`;
};

export class AlgorithmEmptyLayerError extends AlgorithmError
{
    constructor()
    {
        super(`${AlgorithmEmptyLayerError.layerMsg} is ${AlgorithmEmptyLayerError.emptyMsg}`, { });
    }
};

export class AlgorithmMinimumActorsLayerError extends AlgorithmError
{
    constructor({ minActors }: { minActors: number })
    {
        super(`${AlgorithmMinimumActorsLayerError.layerMsg} must contains at least ${minActors} actor(s).`, { minActors });
    }
};