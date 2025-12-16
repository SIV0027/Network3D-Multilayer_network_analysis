import type { TestNetwork } from "./types";

export const toCSV = (args: {
    delimiters: [string, string],
    testNetwork: TestNetwork
}) => {
    const { delimiters, testNetwork } = args;
    let csv: string = `source${delimiters[0]}target${testNetwork.schema.weighted ? delimiters[0] + "weight" : "" }${delimiters[1]}`;
    
    let line = 1;
    for(const { source, target, weight } of testNetwork.data.links)
    {
        csv += `${source}${delimiters[0]}${target}`;
        if(testNetwork.schema.weighted)
        {
            csv += `${delimiters[0]}${weight}`;
        }

        if(line++ < testNetwork.data.links.length)
        {            
            csv += delimiters[1];
        }
    }

    return csv;
};