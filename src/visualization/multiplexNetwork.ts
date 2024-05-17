import MultiplexNode from "../core/multiplex/components/node/multiplexNode.js";
import { LayerId_ARGS } from "../core/multiplex/components/node/multiplexNodeArgsTypes.js";
import { Core } from "../core/multiplex/multiplexNetwork.js";
import Link from "../core/singlelayer/components/link/link";
import { MultiplexNetworkConstructor_ARGS } from "./multiplexNetworkArgsTypes.js";
import { Scene_ARGS } from "./singleLayerNetworkArgsTypes";



export namespace Visualization
{
    export class MultiplexNetwork<NODE_ID_TYPE extends Object,
                                  NODE_VALUE_TYPE,
                                  LAYER_ID_TYPE extends Object>
            extends Core.MultiplexNetwork<NODE_ID_TYPE,
                                            NODE_VALUE_TYPE,
                                            LAYER_ID_TYPE>
    {

        protected canvas: HTMLCanvasElement;
        protected scene: BABYLON.Scene;
        protected nodesRender: Map<NODE_ID_TYPE, { x: number, y: number, mesh: BABYLON.Mesh }>; 
        protected linksRender: Array<BABYLON.LinesMesh>;

        constructor(args: MultiplexNetworkConstructor_ARGS)
        {
            super();

            const {
                canvasId
            } = args;

            this.canvas = document.querySelector(canvasId) as HTMLCanvasElement;
            this.scene = this.createPlayground();
            this.nodesRender = this.renderNodes({
                scene: this.scene
            });
            this.linksRender = new Array<BABYLON.LinesMesh>();
        }

        protected createPlayground(): BABYLON.Scene
        {
            const engine = new BABYLON.Engine(this.canvas, true); // Generate the BABYLON 3D engine
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = BABYLON.Color4.FromColor3(BABYLON.Color3.White());
            scene.lightsEnabled = false;
            scene.createDefaultEnvironment({
                createGround: false,
                createSkybox: false
            });

            const camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
            camera.setPosition(new BABYLON.Vector3(0, 0, -10));
            camera.target = new BABYLON.Vector3(0, 0, 0);

            camera.lowerRadiusLimit = 5;

            camera.rotation.x = Math.PI / 2;
            camera.upperBetaLimit = Math.PI / 2;
            camera.lowerBetaLimit = Math.PI / 2;
            
            camera.attachControl(this.canvas, true);

            const rotState = {
                x: camera.alpha,
                y: camera.beta
            };

            scene.registerBeforeRender(() =>
            {
                camera.alpha = rotState.x;
                camera.beta = rotState.y;
            });        

            engine.runRenderLoop(() =>
            {
                scene.render();
            });
            
            window.addEventListener("resize", () =>
            {
                engine.resize();
            });

            this.canvas.addEventListener("wheel", (event) =>
            {
                const delta: number = event.deltaY;
                const camera: BABYLON.ArcRotateCamera = scene.activeCamera as BABYLON.ArcRotateCamera;
            
                if(delta < 0 && camera.radius <= 5)
                {
                    event.preventDefault();
                }
            });

            return scene;
        }

        protected renderNodes<ARGS extends Scene_ARGS>
        (args: ARGS): Map<NODE_ID_TYPE, { x: number, y: number, mesh: BABYLON.Mesh }>
        {
            const { 
                scene
            } = args;

            const nodes: Map<NODE_ID_TYPE, { x: number, y: number, mesh: BABYLON.Mesh }> = new Map();
            const spheres: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();

            for(const [id, _] of this.nodes)
            {
                const nodeSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
                    diameter: 0.5,
                    segments: 32
                }, scene);

                spheres.push(nodeSphere);

                let nodeSphereMaterial = new BABYLON.StandardMaterial("Node sphere material", scene);
                nodeSphereMaterial.disableLighting = true;
                nodeSphereMaterial.emissiveColor = BABYLON.Color3.Gray();
                nodeSphere.material = nodeSphereMaterial;

                nodeSphere.position.x = Math.random() * 10 - 5;
                nodeSphere.position.y = Math.random() * 10 - 5;
                nodeSphere.position.z = 0;

                const plane = BABYLON.Mesh.CreatePlane("plane", 1, scene);
                plane.parent = nodeSphere;
                plane.position._z = 0;
                plane.position.y = 0.5;

                const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

                const backgroundRect = new BABYLON.GUI.Rectangle();
                backgroundRect.width = 0.35; // Šířka obdélníku
                backgroundRect.height = 0.35; // Výška obdélníku
                backgroundRect.background = 'blue'; // Barva pozadí
                backgroundRect.alpha = 0.9; // Průhlednost
                advancedTexture.addControl(backgroundRect);

                const button1 = new BABYLON.GUI.TextBlock("but1", id.toString());
                button1.width = 0.35;
                button1.height = 0.35;
                button1.color = "white";
                button1.fontSize = 150;
                //button1.background = "green";
                backgroundRect.addControl(button1);

                nodes.set(id, { x: nodeSphere.position.x, y: nodeSphere.position.y, mesh: nodeSphere });
            }

            return nodes;
        }

        protected renderLinks<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const {
                layerId
            } = args;

            const links: Array<Link<any,
                                NODE_ID_TYPE,
                                NODE_VALUE_TYPE>> = new Array<Link<any,
                                                                   NODE_ID_TYPE,
                                                                   NODE_VALUE_TYPE>>();

            for(const [_, node] of this.nodes)
            {
                (node as MultiplexNode<NODE_ID_TYPE,
                                        NODE_VALUE_TYPE,
                                       any,
                                       LAYER_ID_TYPE>).iterateLinks({
                                            algorithm: (args: {
                                                neighbourId: NODE_ID_TYPE
                                                link: Link<any,
                                                        NODE_ID_TYPE,
                                                        NODE_VALUE_TYPE>
                                            }) =>
                                            {
                                                const {
                                                    link
                                                } = args;

                                                links.push(link);
                                            },
                                            layerId: layerId
                                        });
            }

            const linksRender: Array<BABYLON.LinesMesh> =  new Array<BABYLON.LinesMesh>();
            for(const link of links)
            {
                const sourceNodeGraphic: { x: number, y: number, mesh: BABYLON.Mesh } = this.nodesRender.get(link.getSource().getId()) as { x: number, y: number, mesh: BABYLON.Mesh };
                const targetNodeGraphic: { x: number, y: number, mesh: BABYLON.Mesh } = this.nodesRender.get(link.getTarget().getId()) as { x: number, y: number, mesh: BABYLON.Mesh };
                

                const points = [
                    new BABYLON.Vector3(sourceNodeGraphic.x, sourceNodeGraphic.y, 0),
                    new BABYLON.Vector3(targetNodeGraphic.x, targetNodeGraphic.y, 0)
                ];
                
                const line = BABYLON.MeshBuilder.CreateLines("line", { points: points }, this.scene);
                const material = new BABYLON.StandardMaterial("material", this.scene);
                material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                line.material = material;
                
                linksRender.push(line);
            }

            this.linksRender = linksRender;
        }

        public render<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const {
                layerId
            } = args;

            this.scene = this.createPlayground();
            this.nodesRender = this.renderNodes({
                scene: this.scene
            });

            this.switchLayer({
                layerId: layerId
            });
        }

        public switchLayer<ARGS extends LayerId_ARGS<LAYER_ID_TYPE>>
        (args: ARGS): void
        {
            const {
                layerId
            } = args;

            for(const linkRender of this.linksRender)
            {
                linkRender.dispose();
            }

            this.renderLinks({
                scene: this.scene,
                nodes: this.nodesRender,
                layerId: layerId
            });
        }
    };
};