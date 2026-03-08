import * as Network3D from "../../src";

export class Projection extends Network3D.Core.BipartiteNetwork
{
    public static run({ network, partition }: { network: Projection, partition: "source" | "target" }): Network3D.Core.SingleLayerNetwork
    {
        const retNetwork = new Network3D.Core.SingleLayerNetwork({ schema: { weighted: true } });

        network.iterate({
            callback({ actors, links }) {
                const matrix: Map<Network3D.Core.ActorId, Map<Network3D.Core.ActorId, number>> = new Map();
                for(const actorId of actors[partition])
                {
                    retNetwork.addActor({ actorId });
                    matrix.set(actorId, new Map());
                }

                for(const actorId of actors[partition])
                {
                    for(const neighbourId of actors[partition])
                    {
                        matrix.get(actorId)!.set(neighbourId, 0);
                    }
                }

                const adjacency = links[partition == "source" ? "target" : "source"];
                for(const [_, neighbours] of adjacency)
                {
                    for(const actorId of neighbours)
                    {
                        for(const neighbourId of neighbours)
                        {
                            if(actorId != neighbourId)
                            {
                                matrix.get(actorId)!.set(neighbourId, matrix.get(actorId)!.get(neighbourId)! + 1);
                            }
                        }
                    }
                }

                for(const [actorId, neighbours] of matrix)
                {
                    for(const [neighbourId, weight] of neighbours)
                    {
                        if(weight > 0 && actorId != neighbourId)
                        {
                            try
                            {
                                retNetwork.addLink({ sourceActorId: actorId, targetActorId: neighbourId, weight });
                            }
                            catch(e) { }
                        }
                    }
                }
            }
        });

        return retNetwork;
    }
};