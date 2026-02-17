import * as Core from "../../../core";

import {
    Visualization
} from "../../core/";

export class MultiplexNetwork extends Core.MultiplexNetwork
{
    public static init({ container, attrs }: { container: string | HTMLElement, attrs?: Record<string, any> }): Record<string, any>
    {
        const init: Record<string, any> = {
            container,
            autoFit: "view",
            layout: {
                type: "d3-force",
                manyBody: { },
                x: { },
                y: { },
            },
            behaviors: ["drag-canvas", "zoom-canvas", "drag-element"]
        };

        for(const attrName in attrs)
        {
            init[attrName] = attrs[attrName];
        }

        return init;
    }

    public static create({ network, layerId, init }: { network: MultiplexNetwork, layerId: Core.LayerId, init: any }): Visualization
    {
        let visualization: Visualization;

        network.iterate({
            callback: ({ links, validators }) => {
                validators.schema.validateLayerIfExists({ layerId });

                visualization = new Visualization({
                    init,
                    layer: links.get(layerId)! as Core.ReadonlyAdjacency
                });
            }
        });
        
        return visualization!;
    }
};