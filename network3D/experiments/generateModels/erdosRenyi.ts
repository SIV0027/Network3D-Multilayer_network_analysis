import * as Network3D from "../../src";

export class ErdosRenyi
{
    public static generate({ n, p }: { n: number, p: number }): Network3D.Core.SingleLayerNetwork
    {
        const network: Network3D.Core.SingleLayerNetwork = new Network3D.Core.SingleLayerNetwork();
        for(let i = 1; i <= n; i++)
        {
            network.addActor({ actorId: i.toString() });
        }

        for(let i = 1; i <= n; i++)
        {
            for(let ii = i + 1; ii <= n; ii++)
            {
                const probability = Math.random();
                if(probability < p)
                {
                    network.addLink({ sourceActorId: i.toString(), targetActorId: ii.toString() });
                }
            }
        }

        return network;
    }
};