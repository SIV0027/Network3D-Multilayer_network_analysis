declare const ohm: any;

export class Parser
{
    private ohmParser: any;
    private semantics: Map<string, any>;

    constructor({ source }: { source: string })
    {
        this.ohmParser = ohm.grammar(source);
        this.semantics = new Map();
    }

    public addSemantic({ name }: { name: string }): void
    {
        this.semantics.set(name, this.ohmParser.createSemantics());
    }

    public addOperation({ semanticName, name, actionDictionary }: { semanticName: string, name: string, actionDictionary: object }): void
    {
        this.semantics.get(semanticName).addOperation(name, actionDictionary);
    }

    public match({ input }: { input: string }): any
    {
        return this.ohmParser.match(input);
    }

    public parse({ semanticName, input }: { semanticName: string, input: string }): any
    {
        return this.semantics.get(semanticName)(this.match({ input }));
    }

    /*public static createGrammar(): any
    {
        return ohm.grammar(source);
    }

    public static parse(): any
    {
        return this.createGrammar({ source }).match(input);
    }*/
};