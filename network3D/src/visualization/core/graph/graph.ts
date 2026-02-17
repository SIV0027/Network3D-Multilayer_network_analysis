declare const G6: any;

export class G6Graph
{
    protected graph: typeof G6.Graph;

    constructor({ init }: {
        init: Record<string, any>
    })
    {
        this.graph = new G6.Graph(init);
    }

    public modify(callback: (graph: any) => void): void
    {
        callback(this.graph);
    }

    public render(): void
    {
        this.graph.render();
    }
};