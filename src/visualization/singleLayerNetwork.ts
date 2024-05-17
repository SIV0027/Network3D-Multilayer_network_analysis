import { Core } from "../core/singlelayer/singleLayerNetwork.js";
import Link from "../core/singlelayer/components/link/link.js";
import { Nodes_ARGS, Scene_ARGS, SingleLayerNetworkConstructor_ARGS } from "./singleLayerNetworkArgsTypes.js";
import { SingleLayerNetworkConstructor_ARGS as SuperConstructor_ARGS } from "../core/singlelayer/singleLayerNetworkTypes.js";

interface Constructor_ARGS<NODE_ID_TYPE extends Object,
                      NODE_VALUE_TYPE,
                      LINK_VALUE_TYPE>
extends SingleLayerNetworkConstructor_ARGS, SuperConstructor_ARGS<NODE_ID_TYPE,
                                                                         NODE_VALUE_TYPE,
                                                                         LINK_VALUE_TYPE>
{ };

export namespace Visualization
{
    export class SingleLayerNetwork<NODE_ID_TYPE extends Object,
                                 NODE_VALUE_TYPE,
                                 LINK_VALUE_TYPE>
               extends Core.SingleLayerNetwork<NODE_ID_TYPE,
                                               NODE_VALUE_TYPE,
                                               LINK_VALUE_TYPE>
    {

        protected canvas: HTMLCanvasElement;

        constructor(args: Constructor_ARGS<NODE_ID_TYPE,
                                           NODE_VALUE_TYPE,
                                           LINK_VALUE_TYPE>)
        {
            super({
                direction: args.direction
            });

            const { 
                canvasId
            } = args;

            this.canvas = document.querySelector(canvasId) as HTMLCanvasElement;;
        }

        private createPlayground(): BABYLON.Scene
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

        private renderNodes<ARGS extends Scene_ARGS>
        (args: ARGS): Map<NODE_ID_TYPE, { x: number, y: number, mesh: BABYLON.Mesh }>
        {
            const { scene } = args;

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

        private renderLinks<ARGS extends Scene_ARGS &
                                         Nodes_ARGS<NODE_ID_TYPE>>
        (args: ARGS): Array<Link<LINK_VALUE_TYPE,
                                 NODE_ID_TYPE,
                                 NODE_VALUE_TYPE>>
        {
            const { 
                scene,
                nodes
            } = args;

            const links: Array<Link<LINK_VALUE_TYPE,
                                    NODE_ID_TYPE,
                                    NODE_VALUE_TYPE>> = this.direction.getAllLinks({
                nodes: this.nodes
            });

            for(const link of links)
            {
                const sourceNodeGraphic: { x: number, y: number, mesh: BABYLON.Mesh } = nodes.get(link.getSource().getId()) as { x: number, y: number, mesh: BABYLON.Mesh };
                const targetNodeGraphic: { x: number, y: number, mesh: BABYLON.Mesh } = nodes.get(link.getTarget().getId()) as { x: number, y: number, mesh: BABYLON.Mesh };
                

                const points = [
                    new BABYLON.Vector3(sourceNodeGraphic.x, sourceNodeGraphic.y, 0),
                    new BABYLON.Vector3(targetNodeGraphic.x, targetNodeGraphic.y, 0)
                ];
                
                const line = BABYLON.MeshBuilder.CreateLines("line", { points: points }, scene);
                const material = new BABYLON.StandardMaterial("material", scene);
                material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                line.material = material;
            }

            return links;
        }

        public render(): void
        {
            const scene: BABYLON.Scene = this.createPlayground();


            const nodes: Map<NODE_ID_TYPE, { x: number, y: number, mesh: BABYLON.Mesh }> = this.renderNodes({
                scene: scene
            });

            const links: Array<Link<LINK_VALUE_TYPE,
                                    NODE_ID_TYPE,
                                    NODE_VALUE_TYPE>> = this.renderLinks({
                                        scene: scene,
                                        nodes: nodes
                                    });
            

            // ITEMS MOVING
            /* let selectedSphere: BABYLON.Nullable<BABYLON.Mesh> = null;
            let startingPoint: BABYLON.Nullable<BABYLON.Vector3> = null;

            scene.onPointerObservable.add((eventData) => {
                switch (eventData.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                        if (pickResult.hit) {
                            selectedSphere = pickResult.pickedMesh as BABYLON.Mesh;
                            if (selectedSphere && spheres.includes(selectedSphere)) {
                                startingPoint = pickResult.pickedPoint;
                            }
                        }
                        break;
                    case BABYLON.PointerEventTypes.POINTERMOVE:
                        if (startingPoint && selectedSphere) {
                            const currentPick = scene.pick(scene.pointerX, scene.pointerY);
                            if (currentPick.hit) {
                                const delta = (currentPick.pickedPoint as BABYLON.Vector3).subtract(startingPoint);
                                selectedSphere.position.addInPlace(delta);
                                startingPoint = currentPick.pickedPoint;
                            }
                        }
                        break;
                    case BABYLON.PointerEventTypes.POINTERUP:
                        selectedSphere = null;
                        startingPoint = null;
                        break;
                }
            }); */
        }
    };
};