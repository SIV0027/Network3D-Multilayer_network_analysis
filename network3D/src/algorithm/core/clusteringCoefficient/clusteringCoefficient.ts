import type {
    Adjacency_args,
    NodesMetric
} from "@/algorithm/utitlities";

export abstract class ClusteringCoefficient
{
    public static undirected({ adjacency }: Adjacency_args): NodesMetric<number>
    {
        const clusteringCoefficient: NodesMetric<number> = new Map();
        for(const [nodeId, neighbours] of adjacency)
        {
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