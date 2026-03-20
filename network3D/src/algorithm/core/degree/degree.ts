import type {
    NodesMetric,
    Adjacency_args
} from "../../../algorithm/utitlities";

export abstract class Degree
{
    public static undirected({ adjacency }: Adjacency_args): {
        nodes: NodesMetric<number>,
        average: number,
        distribution: Array<number>
    }
    {
        let sumDegree = 0;
        const nodes: NodesMetric<number> = new Map();
        for(const [actorId, neighbours] of adjacency)
        {
            let actorDegree = neighbours.size;
            // Decrement self-loops
            if(neighbours.has(actorId))
            {
                actorDegree--;
            }
            nodes.set(actorId, actorDegree);
            sumDegree += actorDegree;
        }

        return {
            nodes,
            average: sumDegree / adjacency.size,
            distribution: this.undirectedDistribution({ adjacency, degrees: nodes })
        };
    }

    private static undirectedDistribution({ adjacency, degrees }: Adjacency_args & { degrees: NodesMetric<number> }): Array<number>
    {        
        const distribution: Array<number> = new Array();

        for(const [_, degree] of degrees)
        {
            // Values of degrees which no nodes has
            for(let _ = distribution.length; _ <= degree; _++)
            {
                distribution.push(0);
            }
            distribution[degree]++;
        }

        for(let i = 0; i < distribution.length; i++)
        {
            // Normalize degree distribution
            distribution[i] /= adjacency.size;
        }

        return distribution;
    }
};