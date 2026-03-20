import type { Adjacency_args } from "../../../algorithm/utitlities";
import * as Core from "../../../core";

export abstract class Component
{
    public static undirected({ adjacency }: Adjacency_args): Array<Array<Core.ActorId>>
    {
        const connection: Array<Array<Core.ActorId>> = new Array();
        const nodes: Set<Core.ActorId> = new Set();
        for(const [nodeId, _] of adjacency)
        {
            nodes.add(nodeId);
        }

        while(nodes.size > 0)
        {
            const start: Core.ActorId = nodes.values().next().value!;
        
            // BFS
            const visited: Set<Core.ActorId> = new Set();
            visited.add(start);

            const stack: Array<Core.ActorId> = new Array();
            stack.push(start);
            while(stack.length > 0)
            {
                const current = stack.pop()!;
                nodes.delete(current);

                for(const neighbour of adjacency.get(current)!)
                {
                    if(!visited.has(neighbour))
                    {
                        stack.push(neighbour);
                        visited.add(neighbour);
                    }
                }
            }

            connection.push(Array.from(visited));
        }

        return connection;
    }
};