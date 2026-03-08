import * as Network3D from "../../src";

import {
    Visualization
} from "./visualization";

export class BipartiteVisualization extends Network3D.Core.BipartiteNetwork
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

    public static create({ network, init }: { network: BipartiteVisualization, init: any }): Visualization
    {
        let visualization: Visualization;

        network.iterate({
            callback: ({ actors, links }) => {
                visualization = new Visualization({
                    init,
                    sourceNodes: actors.source,
                    targetNodes: actors.target,
                    links: links.source
                });
            }
        });
        
        return visualization!;
    }
};