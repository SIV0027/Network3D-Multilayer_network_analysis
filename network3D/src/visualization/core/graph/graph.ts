declare const G6: any;

export class G6Graph
{
    private graph;

    constructor({ init }: {
        init: Record<string, any>
    })
    {
        this.graph = new G6.Graph(init);
    }

    public render(): void
    {
        this.graph.render();
    }
};