import * as Network3D from "../../src";

export class Eccentricity extends Network3D.Core.SingleLayerNetwork
{
    public static run({ network }: { network: Eccentricity }): Map<Network3D.Core.ActorId, number>
    {
        const res: Map<Network3D.Core.ActorId, number> = new Map();

        network.iterate({
            callback({ actors, links }) {
                for(const actorId of actors)
                {
                    res.set(actorId, Infinity);
                }

                for(const actorId of actors)
                {
                    const dist: Map<Network3D.Core.ActorId, number> = new Map();
                    for(const actorId of actors)
                    {
                        dist.set(actorId, Infinity);
                    }
                    dist.set(actorId, 0);
                    
                    const queue: Array<Network3D.Core.ActorId> = new Array();
                    queue.push(actorId);
                    while(queue.length > 0)
                    {
                        const currentActorId = queue.shift()!;

                        for(const neighbourId of (links as Network3D.Core.ReadonlyAdjacency).get(currentActorId)!)
                        {
                            if(dist.get(neighbourId)! == Infinity)
                            {
                                dist.set(neighbourId, dist.get(currentActorId)! + 1);
                                queue.push(neighbourId);
                            }
                        }
                    }

                    const eccentricity = Math.max(...dist.values());
                    res.set(actorId, eccentricity);
                }
            }
        });

        return res;
    }
};