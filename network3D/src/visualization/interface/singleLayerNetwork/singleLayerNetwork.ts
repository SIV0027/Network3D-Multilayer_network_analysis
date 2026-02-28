import * as Core from "../../../core";

import {
    Visualization
} from "../../core/";

export class SingleLayerNetwork extends Core.SingleLayerNetwork
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

    public static create({ network, init }: { network: SingleLayerNetwork, init: any }): Visualization
    {
        let visualization: Visualization;

        network.iterate({
            callback: ({ links }) => {

                visualization = new Visualization({
                    init,
                    layer: links as Core.ReadonlyAdjacency
                });
            }
        });
        
        return visualization!;
    }
};