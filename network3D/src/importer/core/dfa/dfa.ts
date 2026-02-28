type TransitionTable = Record<string, {
    next: string,
    callback?: (char: string) => void
}>;

export class DFA
{
    private transitionTable: TransitionTable;
    private startState: string;
    private acceptStates: Set<string> = new Set();

    constructor({ transitionTable, startState, acceptStates = new Set() }: { transitionTable: TransitionTable, startState: string, acceptStates?: Set<string> })
    {
        this.transitionTable = transitionTable;
        this.startState = startState;
        this.acceptStates = acceptStates;
    }

    public parse({ input }: { input: string }): void
    {
        let state = this.startState;

        for(let i = 0; i < input.length; i++)
        {
            const char = input[i];
            const exact = this.transitionTable[`${state}|${char}`];
            const fallback = this.transitionTable[`${state}|*`];

            const transition = exact ?? fallback;

            if(!transition)
            {
                throw new Error(`No transition from ${state} with '${char}'`);
            }

            transition.callback?.(char);
            state = transition.next;
        }

        if(this.acceptStates.size > 0 && !this.acceptStates.has(state))
        {
            throw new Error(`Ended in non-accepting state: ${state}`);
        }
    }
};