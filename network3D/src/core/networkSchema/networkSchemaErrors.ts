import { Network3DError } from "../../utilities";

import type {
    PartitionId_args,
    LayerId_args,
    PartitionsIds_args
} from "./networkSchema_types";

export abstract class NetworkSchemaError extends Network3DError
{
    protected static readonly partitionIdMsg: string = `partition ${this.withIdMsg}`;
    protected static readonly layerIdMsg: string = `layer ${this.withIdMsg}`;
    protected static readonly isWeightedMsg: string = `is weighted`;
    protected static readonly isNotWeightedMsg: string = `is not weighted`;

    protected static partition({ partitionId }: PartitionId_args): string
    {
        return `${this.partitionIdMsg} "${partitionId}"`;
    }

    protected static layer({ layerId }: LayerId_args): string
    {
        return `${this.layerIdMsg} "${layerId}"`;
    }
};

export class AlreadyExistingLayerError extends NetworkSchemaError
{
    constructor(args: LayerId_args & PartitionsIds_args)
    {
        const { layerId, partitionsIds } = args;
        const partitionMsg = (partitionsIds instanceof Array) ? `(between ${AlreadyExistingLayerError.partition({ partitionId: partitionsIds[0] })} and ${AlreadyExistingLayerError.partition({ partitionId: partitionsIds[1] })})`
                                                              : `(within ${AlreadyExistingLayerError.partition({ partitionId: partitionsIds as string })})`;

        super(`${AlreadyExistingLayerError.layer({ layerId })} ${AlreadyExistingLayerError.alreadyExistMsg} ${partitionMsg}`, args);
    }
};

export class NonExistingLayerError extends NetworkSchemaError
{
    constructor(args: LayerId_args)
    {
        const { layerId } = args;
        super(`${NonExistingLayerError.layer({ layerId })} ${NonExistingLayerError.nonExistMsg}`, args);
    }
};

export class AlreadyExistingPartitionError extends NetworkSchemaError
{
    constructor(args: PartitionId_args)
    {
        const { partitionId } = args;
        super(`${AlreadyExistingPartitionError.partition({ partitionId })} ${AlreadyExistingPartitionError.alreadyExistMsg}`, args);
    }
};

export class NonExistingPartitionError extends NetworkSchemaError
{
    constructor(args: PartitionId_args)
    {
        const { partitionId } = args;
        super(`${NonExistingPartitionError.partition({ partitionId })} ${NonExistingPartitionError.nonExistMsg}`, args);
    }
};

export class WeightedLayerError extends NetworkSchemaError
{
    constructor(args: LayerId_args)
    {
        const { layerId } = args;
        super(`${WeightedLayerError.layer({ layerId })} ${WeightedLayerError.isWeightedMsg}`, args);
    }
};

export class NonWeightedLayerError extends NetworkSchemaError
{
    constructor(args: LayerId_args)
    {
        const { layerId } = args;
        super(`${NonWeightedLayerError.layer({ layerId })} ${NonWeightedLayerError.isNotWeightedMsg}`, args);
    }
};
