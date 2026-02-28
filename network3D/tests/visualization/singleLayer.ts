import * as Network3D from "@/index";
import {
    realSingle
} from "../testNetwork/index";

class GoldenColorGenerator
{
    private readonly goldenAngle = 137.508;
    private hue = Math.random() * 360;

    constructor({ hue = Math.random() * 360 }: { hue?: number } = { })
    {
        this.hue = hue % 360;
    }

    public next({ lightness, saturation }: { saturation: number, lightness: number }): {
        hue: number,
        saturation: number,
        lightness: number
    }
    {
        this.hue = (this.hue + this.goldenAngle) % 360;
        return {
            hue: this.hue,
            saturation,
            lightness
        };
    }
};

const testNetwork = realSingle.karateKlubRealTestNetwork;

const network = new Network3D.Core.SingleLayerNetwork({
    data: {
        actors: testNetwork.data.nodes,
        links: testNetwork.data.links.map(({ source, target }) => { return { sourceActorId: source, targetActorId: target } })
    }
});

const communities = Network3D.Algorithm.SingleLayerNetwork.labelPropagation({ network });
console.log(communities);
const communitiesColors: Map<string, ReturnType<GoldenColorGenerator["next"]>> = new Map();

const colorGenerator = new GoldenColorGenerator();
for(const communityId of communities.values())
{
    communitiesColors.set(communityId, colorGenerator.next({ lightness: 50, saturation: 50 }));
}

const minSize = 20;
const maxSize = 50;

const {
    nodes
} = Network3D.Algorithm.SingleLayerNetwork.degree({ network });

const maxDegree = Math.max(...Array.from(nodes).map(([_, nodeDegree]) => nodeDegree));

const visualization = Network3D.Visualization.SingleLayerNetwork.create({
    network,
    init: Network3D.Visualization.MultiplexNetwork.init({
        // ID HTML prvku pro vykreslení
        container: "container",
        attrs: {
            // Nastavení pro vykreslení uzlů
            node: {
                // Uzly se vykreslí jako kruh
                type: "circle",
                // Nastavení barvy, popisku a velikosti uzlů
                style: {
                    // Velikost nastavena dle stupně
                    size: (node: any) => (nodes.get(node.id)! / maxDegree) * (maxSize - minSize) + minSize,
                    // Barva nastavena dle příslušnosti ke komunitě
                    fill: (node: any) => { const color = communitiesColors.get(communities.get(node.id)!)!; return `hsl(${color.hue.toFixed(1)}, 50%, 50%)`; },
                    stroke: (node: any) => { const color = communitiesColors.get(communities.get(node.id)!)!; return `hsl(${color.hue.toFixed(1)}, 40%, 40%)`; },
                    lineWidth: 2,

                    labelText: (node: any) => `${node.id}`,
                    labelPlacement: "center",
                    labelFontSize: 15,
                    labelFill: "#ffffff"
                }
            },
            // Nastavení pro vykreslení vazeb
            edge: {
                // Vazby se vykreslí jako rovné čáry
                type: "line",
                // Nastavení barvy a tloušťky
                style: {
                    stroke: "#888787",
                    lineWidth: 1
                }                            
            },
            // Nastavení rozložení
            layout: {
                // Rozložení se provede pomocí algoritmu Force Atlas 2
                type: 'force-atlas2',
                preventOverlap: true
            }
        }
    })
});

visualization.render();