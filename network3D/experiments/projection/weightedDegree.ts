import * as Network3D from "../../src";

export abstract class WeightedDegree extends Network3D.Core.SingleLayerNetwork
{
    public static compute({ network }: { network: WeightedDegree }): Map<Network3D.Core.ActorId, number>
    {
        const weightedDegree: Map<Network3D.Core.ActorId, number> = new Map();

        network.iterate({
            callback({ actors, weights }) {
                for(const actorId of actors)
                {
                    weightedDegree.set(actorId, 0);
                }

                for(const [actorId, neighbours] of weights)
                {
                    for(const [neighbourId, weight] of neighbours)
                    {
                        weightedDegree.set(actorId, weightedDegree.get(actorId)! + weight);
                        weightedDegree.set(neighbourId, weightedDegree.get(neighbourId)! + weight);
                    }
                }
            },
        });

        return weightedDegree;
    }
};