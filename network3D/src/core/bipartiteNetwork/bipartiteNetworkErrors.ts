import {
    AlreadyExistingActorError,
    AlreadyExistingLinkError,
    MultilayerNetworkErrors,
    NonExistingActorError,
    NonExistingLinkError,
    NonWeightedLayerError,
    WeightedLayerError
} from "../../core";
import type { Error_args } from "../../utilities/network3DError/network3DError_types";

export class BipartiteNetworkErrors extends MultilayerNetworkErrors
{
    protected static readonly networkMsg = `Network`;

    public static override remapExceptions({ callback }: { callback: () => any }): void
    {
        super.remapExceptions({ callback, mapFunction: new Map([
                [WeightedLayerError.name, (error: WeightedLayerError) => new BipartiteWeightedLayerError({ error })],
                [NonWeightedLayerError.name, (error: NonWeightedLayerError) => new BipartiteNonWeightedLayerError({ error })],
        
                [AlreadyExistingActorError.name, (error: AlreadyExistingActorError) => new BipartiteAlreadyExistingActorError(error.data)],
                [NonExistingActorError.name, (error: NonExistingActorError) => new BipartiteNonExistingActorError(error.data)],
                [AlreadyExistingLinkError.name, (error: AlreadyExistingLinkError) => new BipartiteAlreadyExistingLinkError(error.data)],
                [NonExistingLinkError.name, (error: NonExistingLinkError) => new BipartiteNonExistingLinkError(error.data)]
            ])
        });
    }
};

export class BipartiteWeightedLayerError extends BipartiteNetworkErrors
{
    constructor({ error }: Error_args<WeightedLayerError>)
    {
        super(`${BipartiteWeightedLayerError.networkMsg} ${BipartiteWeightedLayerError.isWeightedMsg}`, error.data);
    }
};

export class BipartiteNonWeightedLayerError extends BipartiteNetworkErrors
{ 
    constructor({ error }: Error_args<NonWeightedLayerError>)
    {
        super(`${BipartiteNonWeightedLayerError.networkMsg} ${BipartiteNonWeightedLayerError.isNotWeightedMsg}`, error.data);
    }
};

export class BipartiteAlreadyExistingActorError extends AlreadyExistingActorError
{ };

export class BipartiteNonExistingActorError extends NonExistingActorError
{ };

export class BipartiteAlreadyExistingLinkError extends AlreadyExistingLinkError
{ };

export class BipartiteNonExistingLinkError extends NonExistingLinkError
{ };