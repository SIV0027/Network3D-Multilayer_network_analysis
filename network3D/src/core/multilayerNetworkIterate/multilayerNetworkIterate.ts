import {
    type Adjacency,

    MultilayerNetwork,
} from "./../index";

export class MultilayerNetworkIterate extends MultilayerNetwork
{
    public override validatePartitionIfExists(args: Parameters<typeof MultilayerNetwork.prototype["validatePartitionIfExists"]>[0]): void
    {
        super.validatePartitionIfExists(args);
    }

    public override validatePartitionIfNotExists(args: Parameters<typeof MultilayerNetwork.prototype["validatePartitionIfNotExists"]>[0]): void
    {
        super.validatePartitionIfNotExists(args);
    }

    public override validateLayerIfExists(args: Parameters<typeof MultilayerNetwork.prototype["validateLayerIfExists"]>[0]): void
    {
        super.validateLayerIfExists(args);
    }

    public override validateLayerIfNotExists(args: Parameters<typeof MultilayerNetwork.prototype["validateLayerIfNotExists"]>[0]): void
    {
        super.validateLayerIfNotExists(args);
    }

    public override validateActorIfExists(args: Parameters<typeof MultilayerNetwork.prototype["validateActorIfExists"]>[0]): void
    {
        super.validateActorIfExists(args);
    }

    public override validateActorIfNotExists(args: Parameters<typeof MultilayerNetwork.prototype["validateActorIfNotExists"]>[0]): void
    {
        super.validateActorIfNotExists(args);
    }

    public override validateLinkIfExists(args: Parameters<typeof MultilayerNetwork.prototype["validateLinkIfExists"]>[0]): void
    {
        super.validateLinkIfExists(args);
    }

    public override validateLinkIfNotExists(args: Parameters<typeof MultilayerNetwork.prototype["validateLinkIfNotExists"]>[0]): void
    {
        super.validateLinkIfNotExists(args);
    }

    public override validateLayerIfWeighted(args: Parameters<typeof MultilayerNetwork.prototype["validateLayerIfWeighted"]>[0]): void
    {
        super.validateLayerIfWeighted(args);
    }

    public override validateLayerIfNotWeighted(args: Parameters<typeof MultilayerNetwork.prototype["validateLayerIfNotWeighted"]>[0]): void
    {
        super.validateLayerIfNotWeighted(args);
    }

    public override getAdjacency(args: Parameters<typeof MultilayerNetwork.prototype["getAdjacency"]>[0]): Adjacency
    {
        return super.getAdjacency(args);
    }

    public override iterate({ callback }: Parameters<typeof MultilayerNetwork.prototype["iterate"]>[0]): void
    {
        super.iterate({ callback });
    }
};