import { 
    type Adjacency_args
} from "../../../algorithm/utitlities";

export abstract class Density
{
    public static undirected({ adjacency }: Adjacency_args): number
    {
        if(adjacency.size < 2)
        {
            throw new Error(`Density is not defined for ${adjacency.size} nodes/actors`);
        }

        let density = 0;
        for(const [nodeId, neighbours] of adjacency)
        {
            density += neighbours.size;
            if(neighbours.has(nodeId))
            {
                density--;
            }
        }

        return density / (adjacency.size * (adjacency.size - 1));
    }
};