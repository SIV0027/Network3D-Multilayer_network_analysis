import * as Core from "@/core";
import type {
    IO,
    NodesMetric,
    Adjacency_args,
    Adjacency_args_
} from "@/algorithm/utitlities";
import { DegreeError } from "./degreeErrors";
import { Algorithm } from "@/algorithm/utitlities";

export abstract class Degree
{
    /*public static directed({ adjacency, selfLoops }: Adjacency_args_<Core.ReadonlyDirected> & { selfLoops: boolean }): NodesMetric<IO<number>>
    {
        const degree: NodesMetric<IO<number>> = new Map();
        for(const [actorId, neighbours] of adjacency.out)
        {
            //actorDegree = 
            degree.set(actorId, { out: neighbours.size, in: adjacency.in.get(actorId)!.size });
        }

        return degree;
    }*/

    public static undirected({ adjacency, selfLoops }: Adjacency_args & { selfLoops: boolean }): NodesMetric<number>
    {
        const degree: NodesMetric<number> = new Map();
        for(const [actorId, neighbours] of adjacency)
        {
            let actorDegree = neighbours.size;
            if(neighbours.has(actorId) && !selfLoops)
            {
                actorDegree--;
            }
            degree.set(actorId, actorDegree);
        }

        return degree;
    }

    private static computeAverage({ adjacency, selfLoops }: Adjacency_args & { selfLoops: boolean }): number
    {
        DegreeError.remapExceptions({
            callback: () => Algorithm.validateLayerIfNotEmpty({ layer: adjacency })
        });

        let degreeAvg: number = 0;
        for(const [actorId, neighbours] of adjacency)
        {
            degreeAvg += neighbours.size;
            if(neighbours.has(actorId) && !selfLoops)
            {
                degreeAvg--;
            }
        }
        degreeAvg /= adjacency.size;

        return degreeAvg;
    }
    
    public static undirectedAverage({ adjacency, selfLoops }: Adjacency_args & { selfLoops: boolean }): number
    {
        return this.computeAverage({ adjacency, selfLoops });
    }

    /*public static directedAverage({ adjacency, selfLoops }: Adjacency_args_<Core.ReadonlyDirected> & { selfLoops: boolean }): number
    {
        return this.computeAverage({ adjacency: adjacency.out, selfLoops });
    }*/

    /*public static undirectedDistribution({ adjacency }: Adjacency_args): Array<number>
    {
        const distribution: Array<number> = new Array();
        const degrees = this.undirected({ adjacency });

        for(const [_, degree] of degrees)
        {
            for(let _ = distribution.length; _ <= degree; _++)
            {
                distribution.push(0);
            }
            distribution[degree]++;
        }

        for(let i = 0; i < distribution.length; i++)
        {
            distribution[i] /= adjacency.size;
        }

        return distribution;
    }

    /*public static directedDistribution({ adjacency }: Adjacency_args_<Core.ReadonlyDirected>): { out: Array<number>, in: Array<number> }
    {
        const distribution: { out: Array<number>, in: Array<number> } = {
            out: this.undirectedDistribution({ adjacency: adjacency.out }),
            in: this.undirectedDistribution({ adjacency: adjacency.in })
        };

        return distribution;
    }*/
};