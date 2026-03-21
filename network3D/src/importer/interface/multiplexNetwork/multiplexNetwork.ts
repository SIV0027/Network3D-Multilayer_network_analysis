import * as Core from "../../../core";

import {
   CSVDFA
} from "../../core";

export abstract class MultiplexNetwork
{
    public static fromCSV({ csvInput, colDelimiter, rowDelimiter, header = false }: { csvInput: string, colDelimiter?: string, rowDelimiter?: string, header?: boolean }): Core.MultiplexNetwork
    {
        const network = new Core.MultiplexNetwork();        

        const parser = new CSVDFA({ colDelimiter, rowDelimiter });
        const data = parser.parse({ input: csvInput });
        if(header)
        {
            data.shift();
        }
        for(let row of data)
        {
            row = row.map((val) => val.trim());
            if(!network.isLayerExists({ layerId: row[2] ?? "default" }))
            {
                network.addLayer({ layerId: row[2] ?? "default" });
            }

            if(!network.isActorExists({ actorId: row[0] }))
            {
                network.addActor({ actorId: row[0] });
            }

            if(!network.isActorExists({ actorId: row[1] }))
            {
                network.addActor({ actorId: row[1] });
            }

            if(!network.isLinkExists({
                layerId: row[2] ?? "default",
                sourceActorId: row[0],
                targetActorId: row[1]
            }))
            {                
                network.addLink({
                    layerId: row[2] ?? "default",
                    sourceActorId: row[0],
                    targetActorId: row[1]
                });
            }
        }

        return network;
    }
};