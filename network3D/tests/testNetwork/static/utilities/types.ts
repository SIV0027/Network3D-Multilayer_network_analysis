export type TestNetwork = {
    schema: {
        directed: boolean,
        weighted: boolean
    },
    data: {
        nodes: Array<string>,
        links: Array<{ source: string, target: string, weight?: number }>
    },
    metrics: { [key: string]: any }
};