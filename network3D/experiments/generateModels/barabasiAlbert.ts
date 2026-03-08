import * as Network3D from "../../src";

export class BarabasiAlbert extends Network3D.Core.SingleLayerNetwork
{
    public static generate({ networkInit, n, nm }: { networkInit: ConstructorParameters<typeof BarabasiAlbert>["0"], n: number, nm: number }): Network3D.Core.SingleLayerNetwork
    {
        const network = new BarabasiAlbert(networkInit);
        const n0 = network.getActorsCount();
        if(nm > n0)
        {
            throw new Error("Must be true: n0 >= nm");
        }

        if(n < n0)
        {
            throw new Error("Must be true: n >= n0");
        }

        const degrees = Network3D.Algorithm.SingleLayerNetwork.degree({ network }).nodes;
        let degreeSum = Array.from(degrees.values()).reduce((p, c) => p + c, 0);
        const nodes: Set<string> = new Set();
        network.iterate({
            callback({ actors }) {
                for(const actorId of actors)
                {
                    nodes.add(actorId);
                }
            }
        });

        let candidateId = 0;
        while(network.getActorsCount() < n)
        {
            do
            {
                candidateId++;
            }
            while(network.isActorExists({ actorId: candidateId.toString() }));

            const neighbours: Set<Network3D.Core.ActorId> = new Set();
            while(neighbours.size < nm)
            {
                const probability = Math.random() * degreeSum;
                let cumulative = 0;
                for(const nodeId of nodes)
                {
                    cumulative += degrees.get(nodeId)!;
                    if(probability <= cumulative)
                    {
                        neighbours.add(nodeId);
                        break;
                    }
                }
            }
            
            network.addActor({ actorId: candidateId.toString() });
            for(const neighbourId of neighbours)
            {
                network.addLink({ sourceActorId: candidateId.toString(), targetActorId: neighbourId });
                degrees.set(neighbourId, degrees.get(neighbourId)! + 1);
            }

            nodes.add(candidateId.toString());
            degrees.set(candidateId.toString(), nm);
            degreeSum += 2 * nm;
        }

        return network;
    }
};