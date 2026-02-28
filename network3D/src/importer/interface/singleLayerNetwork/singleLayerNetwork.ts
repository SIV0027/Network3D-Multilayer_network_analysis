//import { Parser } from "../../../importer/core";

//import * as Core from "../../../core";

export abstract class SingleLayerNetwork
{
    /*public static readonly CSV: ({ }: { delimiters: { col: string, row: string } }) => string = ({ delimiters }) => {
        return `
            CSV {
                File = Content "${delimiters.row}"? end

                Content = Row ("${delimiters.row}" Row)*

                Row = Id "${delimiters.col}" Id
                        
                Id = (digit | letter)+
            }`;
    };

    public static parse({ input, parserSource }: { input: string, parserSource: string }): Core.SingleLayerNetwork
    {
        const actors: Set<string> = new Set();
        const links: Array<{ sourceActorId: string, targetActorId: string }> = new Array();

        const parser = new Parser({
            source: parserSource
        });
        parser.addSemantic({ name: "CSV" });
        parser.addOperation({ semanticName: "CSV", name: "parse", actionDictionary: {
                    File(content: any, _: any, _end: any)
                    {
                        content.parse();
                    },
                    Content(row: any, _: any, rest: any)
                    {
                        row.parse();
                        rest.children.forEach((element: any) => {
                            element.parse();
                        });
                    },
                    Row(source: any, _: any, target: any)
                    {
                        const sourceId = source.parse();
                        const targetId = target.parse();

                        actors.add(sourceId);
                        actors.add(targetId);
                        links.push({ sourceActorId: sourceId, targetActorId: targetId });
                    },
                    Id(letters: any)
                    {
                        return letters.sourceString
                    }
                }
            });

        parser.parse({ input, semanticName: "CSV" }).parse();

        const network = new Core.SingleLayerNetwork({
            data: {
                actors: Array.from(actors),
                links
            }
        });

        return network;
    }*/
};