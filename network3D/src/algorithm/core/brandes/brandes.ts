import {
    type Adjacency_args,
    type NodesMetric
} from "../../utitlities";

//Brandes, U. (2001). A faster algorithm for betweenness centrality* . The Journal of Mathematical Sociology, 25(2), 163–177. https://doi.org/10.1080/0022250X.2001.9990249
export abstract class Brandes
{
    public static undirected({ adjacency }: Adjacency_args): {
        closeness: {
            nodes: NodesMetric<number>,
            average: number,
            distribution: Map<number, number>
        },
        betweenness: {
            nodes: NodesMetric<number>,
            average: number,
            distribution: Map<number, number>
        },
        diameter: number,
        averagePathLength: number
    }
    {
        const nodes = Array.from(adjacency.keys());
        const n = nodes.length;

        const betweenness: Map<string, number> = new Map();
        const closeness: Map<string, number> = new Map();

        for(const nodeId of nodes)
        {
            betweenness.set(nodeId, 0);
            closeness.set(nodeId, 0);
        }

        let totalPathLength = 0;
        let totalPathCount = 0;
        let diameter = 0;

        // Brandes algorithm
        for(const nodeS of nodes)
        {
            const stack: Array<string> = new Array();
            const predecessors: Map<string, Array<string>> = new Map();
            const sigma: Map<string, number> = new Map();
            const dist: Map<string, number> = new Map();

            for(const nodeV of nodes)
            {
                predecessors.set(nodeV, new Array());
                sigma.set(nodeV, 0);
                dist.set(nodeV, -1);
            }

            sigma.set(nodeS, 1);
            dist.set(nodeS, 0);

            const queue: Array<string> = new Array(nodeS);

            // Breadth-First Search
            while(queue.length > 0)
            {
                const nodeV = queue.shift()!;
                stack.push(nodeV);

                for(const nodeW of adjacency.get(nodeV) ?? [])
                {
                    if(dist.get(nodeW)! < 0)
                    {
                        dist.set(nodeW, dist.get(nodeV)! + 1);
                        queue.push(nodeW);
                    }

                    if(dist.get(nodeW) === dist.get(nodeV)! + 1)
                    {
                        sigma.set(nodeW, sigma.get(nodeW)! + sigma.get(nodeV)!);
                        predecessors.get(nodeW)!.push(nodeV);
                    }
                }
            }

            // Closeness & paths
            let sumDistances = 0
            for (const nodeV of nodes)
            {
                const d = dist.get(nodeV)!;
                if(d > 0)
                {
                    sumDistances += d;
                    totalPathLength += d;
                    totalPathCount++;
                    diameter = Math.max(diameter, d);
                }
            }

            if(sumDistances > 0)
            {
                closeness.set(nodeS, (n - 1) / sumDistances);
            }

            // Dependency accumulation
            const delta: Map<string, number> = new Map();
            for(const nodeId of nodes)
            {
                delta.set(nodeId, 0);
            }

            while(stack.length > 0)
            {
                const nodeW = stack.pop()!;
                for(const nodeV of predecessors.get(nodeW)!)
                {
                    const coeff = (sigma.get(nodeV)! / sigma.get(nodeW)!) * (1 + delta.get(nodeW)!);
                    delta.set(nodeV, delta.get(nodeV)! + coeff);
                }

                if(nodeW !== nodeS)
                {
                    betweenness.set(nodeW, betweenness.get(nodeW)! + delta.get(nodeW)!);
                }
            }
        }

        // Betweenness normalization (undirected)
        for(const nodeId of nodes)
        {
            betweenness.set(nodeId, betweenness.get(nodeId)! / 2);
        }

        // Averages
        const avgBetweenness = Array.from(betweenness.values()).reduce((a, b) => a + b, 0) / n;
        const avgCloseness = Array.from(closeness.values()).reduce((a, b) => a + b, 0) / n;

        const averagePathLength = totalPathCount > 0 ? totalPathLength / totalPathCount : 0;

        // Distributions
        const betweennessDistribution: Map<number, number> = new Map();
        const closenessDistribution: Map<number, number> = new Map();

        for(const nodeId of nodes)
        {
            const nodeBetweenness = betweenness.get(nodeId)!;
            const nodeCloseness = closeness.get(nodeId)!;

            betweennessDistribution.set(nodeBetweenness, (betweennessDistribution.get(nodeBetweenness) ?? 0) + 1 / adjacency.size);
            closenessDistribution.set(nodeCloseness, (closenessDistribution.get(nodeCloseness) ?? 0) + 1 / adjacency.size);
        }

        return {
            closeness: {
                nodes: closeness,
                average: avgCloseness,
                distribution: closenessDistribution
            },
            betweenness: {
                nodes: betweenness,
                average: avgBetweenness,
                distribution: betweennessDistribution
            },
            diameter,
            averagePathLength
        };
    }
}