import { SceneLoader, Animation, Color3 } from "@babylonjs/core"
import type { Scene, AbstractMesh, MultiMaterial, PBRMaterial } from "@babylonjs/core"

type LegoMan = {
  model: AbstractMesh
  Idle: () => void
  Walk: () => void
  setColors: (body: string, pants: string, skin: string) => void
}

class LegoManClass implements LegoMan {
  static instance: LegoManClass
  static async Init (scene: Scene) {
    if (!LegoManClass.instance) {
      const { meshes } = await SceneLoader.ImportMeshAsync('', '/landing/', "legoman.babylon", scene)
      LegoManClass.instance = new LegoManClass(scene, meshes)
    }
    return LegoManClass.instance
  }

  private _scene: Scene
  private _Body: AbstractMesh
  private _HandL: AbstractMesh
  private _LegL: AbstractMesh
  private _Head: AbstractMesh
  private _LegR: AbstractMesh
  private _HandR: AbstractMesh
  
  constructor (scene: Scene, meshes: AbstractMesh[]) {
    this._scene = scene
    if (meshes.length !== 6)
      throw new Error('wrong model')

    this._Body = meshes[0]
    this._HandL = meshes[1]
    this._LegL = meshes[2]
    this._Head = meshes[3]
    this._LegR = meshes[4]
    this._HandR = meshes[5]

    const animRotateL = new Animation("animRotateL", "rotation.x", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE),
    animRotateR = new Animation("animRotateR", "rotation.x", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

    animRotateL.setKeys([ { frame: 0,  value: 0 }, { frame: 15,  value: Math.PI / 4 }, { frame: 30,  value: 0 }, { frame: 45,  value: - Math.PI / 4 }, { frame: 60,  value: 0 } ])
    animRotateR.setKeys([ { frame: 0,  value: 0 }, { frame: 15,  value: - Math.PI / 4 }, { frame: 30,  value: 0 }, { frame: 45,  value: Math.PI / 4 }, { frame: 60,  value: 0 } ])

    this._HandL.animations.push(animRotateL)
    this._LegL.animations.push(animRotateR)
    this._HandR.animations.push(animRotateR)
    this._LegR.animations.push(animRotateL)
    
    this._Head.setParent(this._Body)
    this._HandL.setParent(this._Body)
    this._HandR.setParent(this._Body)
    this._LegL.setParent(this._Body)
    this._LegR.setParent(this._Body)
  }

  public get model () {
    return this._Body
  }

  public setColors(body: string, pants: string, skin: string) {
    const bm = this._Body.material as MultiMaterial,
      bmb = bm.subMaterials[0] as PBRMaterial,
      bmp = bm.subMaterials[1] as PBRMaterial,
      hlm = this._HandL.material as MultiMaterial,
      hlmb = hlm.subMaterials[0] as PBRMaterial,
      hrm = this._HandR.material as MultiMaterial,
      hrmb = hrm.subMaterials[0] as PBRMaterial,
      llmp = this._LegL.material as PBRMaterial,
      lrmp = this._LegR.material as PBRMaterial
    
    bmb.albedoColor = Color3.FromHexString(body)
    hlmb.albedoColor = Color3.FromHexString(body)
    hrmb.albedoColor = Color3.FromHexString(body)

    bmp.albedoColor = Color3.FromHexString(pants)
    llmp.albedoColor = Color3.FromHexString(pants)
    lrmp.albedoColor = Color3.FromHexString(pants)
  }

  public Idle() {
    this._scene.stopAnimation(this._LegL)
    this._scene.stopAnimation(this._LegR)
    this._scene.stopAnimation(this._HandR)
    this._scene.stopAnimation(this._HandL)
    this._LegL.rotation.x = 0
    this._LegR.rotation.x = 0
    this._HandR.rotation.x = 0
    this._HandL.rotation.x = 0
  }

  public Walk() {
    this._scene.beginAnimation(this._LegL, 0, 60, true)
    this._scene.beginAnimation(this._LegR, 0, 60, true)
    this._scene.beginAnimation(this._HandR, 0, 60, true)
    this._scene.beginAnimation(this._HandL, 0, 60, true)
  }
}

export type {
  LegoMan
}
export default LegoManClass.Init
