import { Algorithm, type Adjacency_args } from "@/algorithm/utitlities";
import type { ReadonlyDirected } from "@/core";

export abstract class Density
{
    private static linksCount({ adjacency, selfLoops }: Adjacency_args & { selfLoops: boolean }): number
    {
        let linksCount = 0;
        for(const [nodeId, neighbours] of adjacency)
        {
            linksCount += neighbours.size;
            if(neighbours.has(nodeId) && !selfLoops)
            {
                linksCount--;
            }
        }

        return linksCount;
    }

    private static compute({ adjacency, selfLoops }: Adjacency_args & { selfLoops: boolean }): number
    {
        if(selfLoops)
        {
            Algorithm.validateLayerMinimumActors({ adjacency, minActorsCount: 1 });
        }
        else
        {
            Algorithm.validateLayerMinimumActors({ adjacency, minActorsCount: 2 });
        }

        const linksCount = this.linksCount({ adjacency, selfLoops });
        let maxLinksCount = adjacency.size * (adjacency.size - 1);
        if(selfLoops)
        {
            maxLinksCount += adjacency.size;
        }

        return linksCount / maxLinksCount;
    }

    public static undirected({ adjacency, selfLoops }: Adjacency_args & { selfLoops: boolean }): number
    {
        return this.compute({ adjacency, selfLoops });
    }

    /*public static directed({ adjacency, selfLoops }: { adjacency: ReadonlyDirected } & { selfLoops: boolean }): number
    {
        return this.compute({ adjacency: adjacency.out, selfLoops });
    }*/
};