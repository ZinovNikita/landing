import { Engine, Scene, ArcRotateCamera, Vector3, Color3, SceneLoader, ShadowGenerator, DirectionalLight, HemisphericLight } from "@babylonjs/core"
import legoMan, { LegoMan } from './components/legoman'


const body_color = localStorage.getItem('body_color') || '#ff0000'
const pants_color = localStorage.getItem('pants_color') || '#0000ff'
const skin_color = localStorage.getItem('skin_color') || '#ffff00'

const MainScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  const camera = new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true)

  camera.lowerRadiusLimit = 2
  camera.upperRadiusLimit = 10
  camera.wheelDeltaPercentage = 0.01
  
	var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
	light.intensity = 0.6;
	light.specular = Color3.Black();

    var light2 = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), scene);
    light2.position = new Vector3(0, 5, 5);
    var shadowGenerator = new ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
  legoMan(scene).then((lm: LegoMan)=>{
    lm.setColors(body_color, pants_color, skin_color)
    lm.Walk()
    setTimeout(()=>{
        lm.Idle()
    },6000)
  })
  return scene
}
export default MainScene
