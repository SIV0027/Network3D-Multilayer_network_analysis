import { NetworkSchemaError } from "../networkSchema";
import type { LayerId_args, PartitionId_args } from "../networkSchema/networkSchema_types";
import type { ActorId_args, SourceTargetId_args } from "./multilayerNetwork_types";

export abstract class MultilayerNetworkErrors extends NetworkSchemaError
{
    protected static readonly actorMsg = `actor ${this.withIdMsg}`;
    protected static readonly linkMsg = `link`;
    protected static readonly withinMsg = `within the`;

    protected static actor({ actorId }: ActorId_args): string
    {
        return `${this.actorMsg} "${actorId}"`;
    }

    protected static sourceActor({ actorId }: ActorId_args): string
    {
        return `source ${this.actor({ actorId })}`;
    }

    protected static targetActor({ actorId }: ActorId_args): string
    {
        return `target ${this.actor({ actorId })}`;
    }

    protected static link({ sourceActorId, targetActorId }: { sourceActorId: string, targetActorId: string }): string
    {
        return `${this.linkMsg} between ${this.sourceActor({ actorId: sourceActorId })} and ${this.targetActor({ actorId: targetActorId })}`;
    }
};

export class AlreadyExistingActorError extends MultilayerNetworkErrors
{
    constructor(args: ActorId_args & PartitionId_args)
    {
        const { actorId, partitionId } = args;
        super(`${AlreadyExistingActorError.actor({ actorId })} ${AlreadyExistingActorError.withinMsg} ${AlreadyExistingActorError.partition({ partitionId })} ${AlreadyExistingActorError.alreadyExistMsg}`, args);
    }
};

export class NonExistingActorError extends MultilayerNetworkErrors
{
    constructor(args: ActorId_args & PartitionId_args)
    {
        const { actorId, partitionId } = args
        super(`${NonExistingActorError.actor({ actorId })} ${NonExistingActorError.withinMsg} ${NonExistingActorError.partition({ partitionId })} ${NonExistingActorError.nonExistMsg}`, args);
    }
};

export class AlreadyExistingLinkError extends MultilayerNetworkErrors
{
    constructor(args: LayerId_args & SourceTargetId_args)
    {
        const { layerId, sourceActorId, targetActorId } = args;
        super(`${AlreadyExistingLinkError.link({ sourceActorId, targetActorId })} ${AlreadyExistingLinkError.withinMsg} ${AlreadyExistingLinkError.layer({ layerId })} ${AlreadyExistingLinkError.alreadyExistMsg}`, args);
    }
};

export class NonExistingLinkError extends MultilayerNetworkErrors
{
    constructor(args: LayerId_args & SourceTargetId_args)
    {
        const { layerId, sourceActorId, targetActorId } = args;
        super(`${AlreadyExistingLinkError.link({ sourceActorId, targetActorId })} ${AlreadyExistingLinkError.withinMsg} ${AlreadyExistingLinkError.layer({ layerId })} ${AlreadyExistingLinkError.nonExistMsg}`, args);
    }
};