import {
    DFA
} from "../dfa";

export class CSVDFA extends DFA
{
    private res: {
        rows: Array<Array<string>>,
        row: Array<string>,
        field: string
    } = {
        rows: [],
        row: [],
        field: ""
    };

    constructor({ colDelimiter = ",", rowDelimiter = "\n" }: { colDelimiter?: string, rowDelimiter?: string } = { })
    {
        super({
            transitionTable: {
                [`S|${colDelimiter}`]: { next: "S", callback: () => this.pushCol() },
                [`S|${rowDelimiter}`]: { next: "S", callback: () => { this.pushCol(); this.pushRow(); } },
                "S|*":  { next: "S", callback: (ch) => this.res.field += ch },
            },
            startState: "S"
        });
    }

    private pushCol(): void
    {
        this.res.row.push(this.res.field);
        this.res.field = "";
    }

    private pushRow(): void
    {
        this.res.rows.push(this.res.row);
        this.res.row = [];
    }

    public override parse({ input }: { input: string; }): Array<Array<string>>
    {
        super.parse({ input });

        if(this.res.field.length > 0 || this.res.row.length > 0)
        {
            this.res.row.push(this.res.field);
            this.res.rows.push(this.res.row);
        }

        const res = this.res.rows;
        this.res = {
            rows: [],
            row: [],
            field: ""
        };

        return res;
    }
};