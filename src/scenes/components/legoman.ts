import { SceneLoader, Animation } from "@babylonjs/core"
import type { Scene, AbstractMesh } from "@babylonjs/core"

type LegoMan = {
  model: AbstractMesh
  Idle: () => void
  Walk: () => void
}

const legoMan = (scene: Scene) => new Promise<LegoMan>((resolve,reject) => {
  SceneLoader.ImportMesh('', '/landing/', "legoman.babylon", scene, (meshes: AbstractMesh[]) => {
    if (meshes.length !== 6)
      return reject(new Error('wrong model'))

    const [body, HandL, LegL, Head, LegR, HandR] = meshes,
      animRotateL = new Animation("animRotateL", "rotation.x", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE),
      animRotateR = new Animation("animRotateR", "rotation.x", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

    animRotateL.setKeys([ { frame: 0,  value: 0 }, { frame: 25,  value: 1 }, { frame: 50,  value: 0 }, { frame: 75,  value: -1 }, { frame: 100,  value: 0 } ])
    animRotateR.setKeys([ { frame: 0,  value: 0 }, { frame: 25,  value: -1 }, { frame: 50,  value: 0 }, { frame: 75,  value: 1 }, { frame: 100,  value: 0 } ])

    HandL.animations.push(animRotateL)
    LegL.animations.push(animRotateL)
    HandR.animations.push(animRotateR)
    LegR.animations.push(animRotateR)

    Head.setParent(body)
    HandL.setParent(body)
    HandR.setParent(body)
    LegL.setParent(body)
    LegR.setParent(body)
    
    const legoman: LegoMan = {
      model: body,
      Idle: () => {
        scene.stopAnimation(LegL)
        scene.stopAnimation(LegR)
        scene.stopAnimation(HandR)
        scene.stopAnimation(HandL)
        LegL.rotation.set(0,0,0)
        LegR.rotation.set(0,0,0)
        HandR.rotation.set(0,0,0)
        HandL.rotation.set(0,0,0)
      },
      Walk() {
        scene.beginAnimation(LegL, 0, 100, true)
        scene.beginAnimation(LegR, 0, 100, true)
        scene.beginAnimation(HandR, 0, 100, true)
        scene.beginAnimation(HandL, 0, 100, true)
      }
    }
    resolve(legoman)
  })
})
export type {
  LegoMan
}
export default legoMan
