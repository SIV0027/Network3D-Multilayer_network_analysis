import {
    type Adjacency_args,
    type NodesMetric
} from "../../../algorithm/utitlities";

export abstract class ClusteringCoefficient
{
    public static undirected({ adjacency }: Adjacency_args): {
        nodes: NodesMetric<number>,
        average: number,
        distribution: Map<number, number>
    }
    {
        const clusteringCoefficient: NodesMetric<number> = new Map();
        let clusteringCoefficientSum = 0;
        for(const [nodeId, neighbours] of adjacency)
        {
            // It is defined for more than one neighbour
            if(neighbours.size - (neighbours.has(nodeId) ? 1 : 0) < 2)
            {                
                clusteringCoefficient.set(nodeId, 0);
                continue;
            }

            let linksCount = 0;
            const maxLinksCount = neighbours.size * (neighbours.size - 1);
            // Count links of neighbours
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

            // Clustering Coefficeint for node i
            const nodeClusteringCoefficient = linksCount / maxLinksCount;
            clusteringCoefficient.set(nodeId, nodeClusteringCoefficient);
            // Avg clustering coefficient
            clusteringCoefficientSum += nodeClusteringCoefficient;
        }
        
        return {
            nodes: clusteringCoefficient,
            average: clusteringCoefficientSum / adjacency.size,
            distribution: this.undirectedDistribution({ adjacency, clusteringCoefficients: clusteringCoefficient })
        };
    }

    private static undirectedDistribution({ adjacency, clusteringCoefficients }: Adjacency_args & { clusteringCoefficients: NodesMetric<number> }): Map<number, number>
    {        
        const distribution: Map<number, number> = new Map();

        // Count frequencey of values
        for(const [_, clusteringCoefficient] of clusteringCoefficients)
        {
            let value = 1;
            if(distribution.has(clusteringCoefficient))
            {
                value += distribution.get(clusteringCoefficient)!;
            }
            distribution.set(clusteringCoefficient, value);
        }

        // Normalize clustering coefficient distribution
        for(const [clusteringCoefficient, _] of distribution)
        {
            distribution.set(clusteringCoefficient, distribution.get(clusteringCoefficient)! / adjacency.size);
        }

        return distribution;
    }
};