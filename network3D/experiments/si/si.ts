import * as Network3D from "../../src";

export class SI extends Network3D.Core.SingleLayerNetwork
{
    public static run({ network, infectionRate = 0.1, startInfectious, callback }: { network: SI, infectionRate?: number, startInfectious: Array<Network3D.Core.ActorId>, callback: ({ }: { infectious: ReadonlySet<Network3D.Core.ActorId>, timeSlot: number }) => void }): void
    {
        network.iterate({
            callback({ actors, links, validators }) {
                for(const infect of startInfectious)
                {
                    validators.validateActorIfExists({ actorId: infect });
                }

                if(network.getSchema().directed)
                {
                    throw new Error("Network must be undirected.");
                }

                if(startInfectious.length < 1)
                {
                    throw new Error("At least one infectious actor must be at start.");
                }

                const infectious: Set<Network3D.Core.ActorId> = new Set();
                for(const infect of startInfectious)
                {
                    infectious.add(infect);
                }

                let timeSlot = 0;
                do
                {
                    callback({ infectious, timeSlot: timeSlot++ });

                    const newlyInfected: Array<Network3D.Core.ActorId> = new Array();
                    for(const infect of infectious)
                    {
                        for(const neighbour of (links as Network3D.Core.ReadonlyAdjacency).get(infect)!)
                        {
                            const probability = Math.random();
                            if(probability < infectionRate)
                            {
                                newlyInfected.push(neighbour);
                            }
                        }
                    }

                    for(const newlyInfect of newlyInfected)
                    {
                        infectious.add(newlyInfect);
                    }
                }
                while(infectious.size < actors.size)

                callback({ infectious, timeSlot });
            }
        });
    }
};