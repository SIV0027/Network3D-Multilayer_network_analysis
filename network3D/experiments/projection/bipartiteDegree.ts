import * as Network3D from "../../src";

export abstract class BipartiteDegree extends Network3D.Core.BipartiteNetwork
{
    public static run({ network, partition }: { network: BipartiteDegree, partition: "source" | "target" }): Map<Network3D.Core.ActorId, number>
    {
        const bipartiteDegree: Map<Network3D.Core.ActorId, number> = new Map();
        network.iterate({
            callback({ links }) {
                for(const [actorId, neighbours] of links[partition])
                {
                    bipartiteDegree.set(actorId, neighbours.size);
                }
            },
        });

        return bipartiteDegree;
    }
};