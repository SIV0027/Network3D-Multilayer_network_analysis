import type { Error_args } from "@/utilities/network3DError/network3DError_types";
import {
    AlreadyExistingActorError,
    AlreadyExistingLinkError,
    MultilayerNetworkErrors,
    NonExistingActorError,
    NonExistingLinkError
} from "../multilayerNetwork";
import {
    AlreadyExistingLayerError,
    NonExistingLayerError,
    NonWeightedLayerError,
    WeightedLayerError
} from "../networkSchema";

export abstract class MultiplexNetworkErrors extends MultilayerNetworkErrors
{
    public static override remapExceptions({ callback }: { callback: () => any }): void
    {
        super.remapExceptions({ callback, mapFunction: new Map([
                [AlreadyExistingLayerError.name, (error: AlreadyExistingLayerError) => new MultiplexAlreadyExistingLayerError({ error })],
                [NonExistingLayerError.name, (error: NonExistingLayerError) => new MultiplexNonExistingLayerError(error.data)],
                [WeightedLayerError.name, (error: WeightedLayerError) => new MultiplexWeightedLayerError(error.data)],
                [NonWeightedLayerError.name, (error: NonWeightedLayerError) => new MultiplexNonWeightedLayerError(error.data)],

                [AlreadyExistingActorError.name, (error: AlreadyExistingActorError) => new MultiplexAlreadyExistingActorError({ error })],
                [NonExistingActorError.name, (error: NonExistingActorError) => new MultiplexNonExistingActorError({ error })],
                [AlreadyExistingLinkError.name, (error: AlreadyExistingLinkError) => new MultiplexAlreadyExistingLinkError(error.data)],
                [NonExistingLinkError.name, (error: NonExistingLinkError) => new MultiplexNonExistingLinkError(error.data)]
            ])
        });
    }
};

export class MultiplexAlreadyExistingLayerError extends MultiplexNetworkErrors
{
    constructor({ error }: Error_args<AlreadyExistingActorError>)
    {
        const { layerId } = error.data;

        super(`${AlreadyExistingLayerError.layer({ layerId })} ${AlreadyExistingLayerError.alreadyExistMsg}`, error.data);
    }
};

export class MultiplexNonExistingLayerError extends NonExistingLayerError
{ };

export class MultiplexWeightedLayerError extends WeightedLayerError
{ };

export class MultiplexNonWeightedLayerError extends NonWeightedLayerError
{ };

export class MultiplexAlreadyExistingActorError extends MultiplexNetworkErrors
{
    constructor({ error }: Error_args<AlreadyExistingActorError>)
    {
        const { actorId } = error.data;
        super(`${MultiplexAlreadyExistingActorError.actor({ actorId })} ${MultiplexAlreadyExistingActorError.alreadyExistMsg}`, error.data);
    }
};

export class MultiplexNonExistingActorError extends MultiplexNetworkErrors
{
    constructor({ error }: Error_args<NonExistingActorError>)
    {
        const { actorId } = error.data;
        super(`${MultiplexNonExistingActorError.actor({ actorId })} ${MultiplexNonExistingActorError.nonExistMsg}`, error.data);
    }
};

export class MultiplexAlreadyExistingLinkError extends AlreadyExistingLinkError
{ };

export class MultiplexNonExistingLinkError extends NonExistingLinkError
{ };