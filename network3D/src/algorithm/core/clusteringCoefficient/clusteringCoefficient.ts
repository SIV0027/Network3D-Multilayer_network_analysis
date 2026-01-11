import {
    type Adjacency_args,
    type NodesMetric
} from "@/algorithm/utitlities";

export abstract class ClusteringCoefficient
{
    public static undirected({ adjacency }: Adjacency_args): NodesMetric<number>
    {
        const clusteringCoefficient: NodesMetric<number> = new Map();
        for(const [nodeId, neighbours] of adjacency)
        {
            if(neighbours.size < 2)
            {                
                clusteringCoefficient.set(nodeId, NaN);
                continue;
            }

            let linksCount = 0;
            const maxLinksCount = neighbours.size * (neighbours.size - 1);
            for(const neighbourAId of neighbours)
            {
                if(neighbourAId == nodeId)
                {
                    continue;
                }

                for(const neighbourBId of neighbours)
                {
                    if(neighbourBId == nodeId)
                    {
                        continue;
                    }

                    if(adjacency.get(neighbourAId)!.has(neighbourBId))
                    {
                        linksCount++;
                    }
                }
            }

            clusteringCoefficient.set(nodeId, linksCount / maxLinksCount);
        }
        
        return clusteringCoefficient;
    }
};