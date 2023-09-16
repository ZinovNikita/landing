import { Engine, Scene, FreeCamera, Vector3, Vector2, Color3, Texture, ShadowGenerator, DirectionalLight, HemisphericLight, MeshBuilder, StandardMaterial, CubeTexture, Behavior } from "@babylonjs/core"
import { MixMaterial, WaterMaterial } from "@babylonjs/materials"
import legoMan from './components/legoman'
import useWS, { WSClass } from '../utils/websocket'

const body_color = localStorage.getItem('body_color') || '#ff0000'
const pants_color = localStorage.getItem('pants_color') || '#0000ff'
const skin_color = localStorage.getItem('skin_color') || '#ffff00'

class MainSceneClass extends Scene{
  static instanceCount: number = 0
  static ws: WSClass
  static instance: MainSceneClass
  static Init (engine: Engine) {
    if (!MainSceneClass.instance) {
      MainSceneClass.instanceCount++
      MainSceneClass.instance = new MainSceneClass(engine)
      useWS().then(ws => MainSceneClass.ws = ws)
    }
    return MainSceneClass.instance
  }

  private get ws(): WSClass { return MainSceneClass.ws }
  private _camera: FreeCamera
  private _lastPosition: Vector3 = Vector3.Zero()
  private _lastRotation: Vector3 = Vector3.Zero()
  private _room_hash: string
  public get room_hash(): string { return this._room_hash }

  private _lightes () {
    const light = new HemisphericLight(`${this._room_hash}.light1`, new Vector3(0, 1, 0), this);
    light.intensity = 0.5;
    light.specular = Color3.Black();

    const light2 = new DirectionalLight(`${this._room_hash}.light2`, new Vector3(0, -0.5, -1.0), this);
    light2.position = new Vector3(0, 5, 5);
    const shadowGenerator = new ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
  }
  private _ground () {
    const ground = Object.assign(MeshBuilder.CreateGroundFromHeightMap(`${this._room_hash}.ground1`, '/landing/hm1.png', {
      subdivisions: 250, height: 500, width: 500, maxHeight: 12
    }), {
      material: Object.assign(new MixMaterial("mix", this), {
        mixTexture1: new Texture("/landing/mix.png", this),
        diffuseTexture1: Object.assign(new Texture("/landing/rock.jpg", this), {uScale: 50, vScale: 50}),
        diffuseTexture2: Object.assign(new Texture("/landing/sand.jpg", this), {uScale: 50, vScale: 50}),
        diffuseTexture3: Object.assign(new Texture("/landing/ground.jpg", this), {uScale: 50, vScale: 50}),
        diffuseTexture4: Object.assign(new Texture("https://playground.babylonjs.com/textures/mixMap.png", this), {uScale: 50, vScale: 50})
      }),
      position: new Vector3(0, -1.5, 0),
      checkCollisions: true
    })
    const skybox = Object.assign(MeshBuilder.CreateBox("skyBox", {size: 5000}, this), {
      material: Object.assign(new StandardMaterial("skyBox", this), {
        reflectionTexture: Object.assign(new CubeTexture("https://playground.babylonjs.com/textures/TropicalSunnyDay", this), {
          coordinatesMode: Texture.SKYBOX_MODE
        }),
        diffuseColor: new Color3(0, 0, 0),
        specularColor: new Color3(0, 0, 0),
        disableLighting: true,
        backFaceCulling: false
      })
    })
    const waterMesh = Object.assign(MeshBuilder.CreateGround("waterMesh", { subdivisions: 32, height: 2048,  width: 2048 }, this), {
      material: Object.assign(new WaterMaterial("water", this, new Vector2(512, 512)), {
        backFaceCulling: true,
        bumpTexture: new Texture("https://playground.babylonjs.com/textures/waterbump.png", this),
        windForce: -10,
        waveHeight: 0,
        bumpHeight: 0.1,
        windDirection: new Vector2(0.5, 0.5),
        waterColor: new Color3(0, 0, 0.5),
        colorBlendFactor: 0.01
      })
    });
    (waterMesh.material as WaterMaterial).addToRenderList(ground);
    (waterMesh.material as WaterMaterial).addToRenderList(skybox);
  }
  private _addCamera (): FreeCamera {
    const camera = Object.assign(new FreeCamera(`${this._room_hash}.camera1`, new Vector3(0, 5, 100), this), {
      applyGravity: true,
      checkCollisions: true,
      ellipsoid: new Vector3(1,1,1),
      minZ: 0.45,
      speed: 0.6,
      angularSensibility: 4000,
      keysUp: [87],
      keysDown: [83],
      keysLeft: [65],
      keysRight: [68]
    })
    camera.attachControl(this, true)
    return camera
  }

  constructor (engine: Engine) {
    super(engine)
    this.gravity = new Vector3(0,-9.81 / 30,0)
    this.collisionsEnabled = true
    this._room_hash = localStorage.getItem('room_hash') || `room${MainSceneClass.instanceCount}`

    this._ground()
    this._lightes()
    this._camera = this._addCamera()
    this.onPointerDown = (e) => {
      if(e.button === 0) this.getEngine().enterFullscreen(true)
      if(e.button === 1) this.getEngine().exitFullscreen()
    }

    this.addUser(localStorage.getItem('user_hash')).then(user => user.setColors(body_color, pants_color, skin_color))
    this.addUser(localStorage.getItem('user_hash')).then(user => {
      user.setColors(Color3.Random().toHexString(), Color3.Random().toHexString(), Color3.Random().toHexString())
      user.model.position.x += 1
      user.Walk()
    })
  }
  public async addUser(user_hash: string | null) {
    return await legoMan(this, user_hash)
  }

  public sendPosition() {
    if(!this._lastPosition || Vector3.Distance(this._camera.position, this._lastPosition) > 1 ||
    !this._lastRotation || Vector3.Distance(Vector3.FromArray(this._camera.rotation.asArray().map(n=> Math.floor(n / Math.PI * 180))), Vector3.FromArray(this._lastRotation.asArray().map(n=> Math.floor(n / Math.PI * 180)))) > 5) {
      this._lastPosition = this._camera.position.clone()
      this._lastRotation = this._camera.rotation.clone()
      this.ws.send('position', [...this._camera.position.asArray().map(Math.floor), ...this._camera.rotation.asArray().map(n=> Math.floor(n / Math.PI * 180))])
    }
  }

}

export type { MainSceneClass }
export default MainSceneClass.Init
