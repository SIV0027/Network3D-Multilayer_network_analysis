import {
    AlreadyExistingActorError,
    AlreadyExistingLinkError,
    MultilayerNetworkErrors,
    NonExistingActorError,
    NonExistingLinkError,
    NonWeightedLayerError,
    WeightedLayerError
} from "../../core";

import {
    type Error_args
} from "../../utilities/network3DError/network3DError_types";

export class SingleLayerNetworkErrors extends MultilayerNetworkErrors
{
    protected static readonly networkMsg = `Network`;

    public static override remapExceptions({ callback }: { callback: () => any }): void
    {
        super.remapExceptions({ callback, mapFunction: new Map([
                [WeightedLayerError.name, (error: WeightedLayerError) => new SingleLayerWeightedLayerError({ error })],
                [NonWeightedLayerError.name, (error: NonWeightedLayerError) => new SingleLayerNonWeightedLayerError({ error })],
    
                [AlreadyExistingActorError.name, (error: AlreadyExistingActorError) => new SingleLayerAlreadyExistingActorError({ error })],
                [NonExistingActorError.name, (error: NonExistingActorError) => new SingleLayerNonExistingActorError({ error })],
                [AlreadyExistingLinkError.name, (error: AlreadyExistingLinkError) => new SingleLayerAlreadyExistingLinkError({ error })],
                [NonExistingLinkError.name, (error: NonExistingLinkError) => new SingleLayerNonExistingLinkError({ error })]
            ])
        });
    }
};

export class SingleLayerWeightedLayerError extends SingleLayerNetworkErrors
{
    constructor({ error }: Error_args<WeightedLayerError>)
    {
        super(`${SingleLayerWeightedLayerError.networkMsg} ${SingleLayerWeightedLayerError.isWeightedMsg}`, error.data);
    }
};

export class SingleLayerNonWeightedLayerError extends SingleLayerNetworkErrors
{ 
    constructor({ error }: Error_args<NonWeightedLayerError>)
    {
        super(`${SingleLayerNonWeightedLayerError.networkMsg} ${SingleLayerNonWeightedLayerError.isNotWeightedMsg}`, error.data);
    }
};

export class SingleLayerAlreadyExistingActorError extends SingleLayerNetworkErrors
{
    constructor({ error }: Error_args<AlreadyExistingActorError>)
    {
        const { actorId } = error.data;
        super(`${SingleLayerAlreadyExistingActorError.actor({ actorId })} ${SingleLayerAlreadyExistingActorError.alreadyExistMsg}`, error.data);
    }
};

export class SingleLayerNonExistingActorError extends SingleLayerNetworkErrors
{
    constructor({ error }: Error_args<NonExistingActorError>)
    {
        const { actorId } = error.data;
        super(`${SingleLayerNonExistingActorError.actor({ actorId })} ${SingleLayerNonExistingActorError.nonExistMsg}`, error.data);
    }
};

export class SingleLayerAlreadyExistingLinkError extends SingleLayerNetworkErrors
{
    constructor({ error }: Error_args<AlreadyExistingLinkError>)
    {
        const { sourceActorId, targetActorId } = error.data;
        super(`${SingleLayerAlreadyExistingLinkError.link({ sourceActorId, targetActorId })} ${SingleLayerAlreadyExistingLinkError.alreadyExistMsg}`, error.data);
    }
};

export class SingleLayerNonExistingLinkError extends SingleLayerNetworkErrors
{
    constructor({ error }: Error_args<AlreadyExistingActorError>)
    {
        const { sourceActorId, targetActorId } = error.data;
        super(`${SingleLayerNonExistingLinkError.link({ sourceActorId, targetActorId })} ${SingleLayerNonExistingLinkError.nonExistMsg}`, error.data);
    }
};