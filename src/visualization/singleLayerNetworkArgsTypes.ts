export interface CanvasId_ARGS
{
    canvasId: string;
};

export interface Scene_ARGS
{
    scene: BABYLON.Scene;
};

export interface Nodes_ARGS<NODE_ID_TYPE>
{
    nodes: Map<NODE_ID_TYPE, { x: number, y: number, mesh: BABYLON.Mesh }>;
};

export interface SingleLayerNetworkConstructor_ARGS
       extends CanvasId_ARGS
{ };

export interface Layout_ARGS
{
    layout: String;
}