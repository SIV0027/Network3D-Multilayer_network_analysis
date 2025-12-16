import type { Adjacency_args, Adjacency_args_ } from "@/algorithm/utitlities";
import type { ReadonlyDirected } from "@/core";

export class M
{
    private static compute({ adjacency }: Adjacency_args): number
    {
        let M = 0;
        for(const [nodeId, neighbours] of adjacency)
        {
            M += neighbours.size;
            if(neighbours.has(nodeId))
            {
                M--;
            }
        }

        return M;
    }

    public static undirected({ adjacency }: Adjacency_args): number
    {
        return this.compute({ adjacency }) / 2;
    }
};