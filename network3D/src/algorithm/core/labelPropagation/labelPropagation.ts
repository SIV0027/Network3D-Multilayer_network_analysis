import * as Core from "../../../core";

import { 
    type Adjacency_args
} from "../../../algorithm/utitlities";

export abstract class LabelPropagation
{
    public static undirected({ adjacency, maximumIterations = Infinity }: Adjacency_args & { maximumIterations?: number }): Map<Core.ActorId, string>
    {
        const communities: Map<Core.ActorId, string> = new Map();

        for(const [nodeId, _] of adjacency)
        {
            communities.set(nodeId, nodeId);
        }

        let updated = true;
        let iteration = 0;
        
        while(updated && iteration < maximumIterations)
        {
            updated = false;
            iteration++;

            // Node shaking
            const nodes = Array.from(adjacency.keys()).sort(() => Math.random() - 0.5);
            for(const nodeId of nodes)
            {
                const neighbours = adjacency.get(nodeId)!;

                // Communities of neighbours
                const communitiesTmp: Map<string, number>  = new Map();
                for(const neighbourId of neighbours)
                {
                    const neighbourCommunity: string = communities.get(neighbourId) as string;
                    const currentCount: number = (communitiesTmp.get(neighbourCommunity) ?? 0);
                    communitiesTmp.set(neighbourCommunity, currentCount + 1);
                }

                const maxCount = Math.max(...communitiesTmp.values());
                const mostFrequentCommunities = [...communitiesTmp.entries()].filter(([_, count]) => count === maxCount).map(([community]) => community);
                const winner = mostFrequentCommunities[Math.floor(Math.random() * mostFrequentCommunities.length)];

                if(communities.get(nodeId) !== winner && winner !== undefined)
                {
                    communities.set(nodeId, winner);
                    updated = true;
                }
            }
        }

        return communities;
    }
};