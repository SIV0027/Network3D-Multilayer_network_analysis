import * as Network3D from "../../src";

export class DuplexBarabasiAlbert extends Network3D.Core.MultiplexNetwork
{
    public static generate({ networkInitSchema, networkInitData, n, nm, c11, c12, c21, c22 }: { networkInitSchema: [string, string], networkInitData: NonNullable<ConstructorParameters<typeof DuplexBarabasiAlbert>["0"]>["data"], n: number, nm: number, c11: number, c12: number, c21: number, c22: number }): Network3D.Core.MultiplexNetwork
    {
        const network = new DuplexBarabasiAlbert({
            schema: networkInitSchema,
            data: networkInitData
        });
        const n0 = network.getActorsCount();
        if(nm > n0)
        {
            throw new Error("Must be true: n0 >= nm");
        }

        if(n < n0)
        {
            throw new Error("Must be true: n >= n0");
        }

        if(c11 + c12 != 1 || c22 + c21 != 1)
        {
            throw new Error("Must be true: c11 + c12 = c22 + 21 = 1");
        }

        const degreesFirst = Network3D.Algorithm.MultiplexNetwork.degree({ network, layerId: networkInitSchema[0] }).nodes;
        const degreesSecond = Network3D.Algorithm.MultiplexNetwork.degree({ network, layerId: networkInitSchema[1] }).nodes;

        const actors: Set<string> = new Set();
        network.iterate({
            callback({ actors: a }) {
                for(const actorId of a)
                {
                    actors.add(actorId);
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

            const neighboursFirst = this.neighboursOfLayer({ cOver: c12, cSame: c11, degreesSame: degreesFirst, degreesOver: degreesSecond, nm, nodes: actors });
            const neighboursSecond = this.neighboursOfLayer({ cSame: c22, cOver: c21, degreesOver: degreesFirst, degreesSame: degreesSecond, nm, nodes: actors });
            
            network.addActor({ actorId: candidateId.toString() });
            for(const neighbourId of neighboursFirst)
            {
                network.addLink({ layerId: networkInitSchema[0], sourceActorId: candidateId.toString(), targetActorId: neighbourId });
                degreesFirst.set(neighbourId, degreesFirst.get(neighbourId)! + 1);
            }
            for(const neighbourId of neighboursSecond)
            {
                network.addLink({ layerId: networkInitSchema[1], sourceActorId: candidateId.toString(), targetActorId: neighbourId });
                degreesSecond.set(neighbourId, degreesSecond.get(neighbourId)! + 1);
            }

            actors.add(candidateId.toString());
            degreesFirst.set(candidateId.toString(), nm);
            degreesSecond.set(candidateId.toString(), nm);
        }

        return network;
    }

    private static neighboursOfLayer({ cOver, cSame, degreesSame, degreesOver, nm, nodes }: { cSame: number, cOver: number, nm: number, nodes: Set<string>, degreesSame: Map<Network3D.Core.ActorId, number>, degreesOver: Map<Network3D.Core.ActorId, number> }): Set<Network3D.Core.ActorId>
    {
        const neighbours: Set<Network3D.Core.ActorId> = new Set();
        while(neighbours.size < nm)
        {
            let weightSum = 0;
            const weights: Map<string, number> = new Map();
            for(const nodeId of nodes)
            {
                const weight = cSame * degreesSame.get(nodeId)! + cOver * degreesOver.get(nodeId)!;
                weights.set(nodeId, weight);
                weightSum += weight;
            }

            const probability = Math.random() * weightSum;
            let cumulative = 0;
            for(const nodeId of nodes)
            {
                cumulative += weights.get(nodeId)!;
                if(probability <= cumulative)
                {
                    neighbours.add(nodeId);
                    break;
                }
            }
        }

        return neighbours;
    }
};