<template>
  <canvas class="canvas" :id="'room-'+room_hash"></canvas>
</template>
<script lang="ts" setup>
import { ref, onMounted  } from 'vue'
import { useRoute } from 'vue-router'
import useEventHub from '../utils/event-hub'
import MainScene from '../scenes/main'
import { Engine, Scene } from "@babylonjs/core"
import useWS from '../utils/websocket'
const $route = useRoute()
const room_hash = ref($route.params.room_hash || localStorage.getItem('room_hash') || '')

const body_color = localStorage.getItem('body_color') || '#ff0000'
const pants_color = localStorage.getItem('pants_color') || '#0000ff'
const skin_color = localStorage.getItem('skin_color') || '#ffff00'

const user_hash = ref('')
const users_hash = ref<string[]>([])
const createScene = (data: any) => {
  user_hash.value = data.user_hash
  users_hash.value = data.data
  const canvas = document.querySelector('#room-'+room_hash.value) as HTMLCanvasElement
  const engine = new Engine(canvas)
  const scene = MainScene(engine)
  scene.addUser(user_hash.value).then(user => user.setColors(body_color, pants_color, skin_color))

  engine.runRenderLoop(() => {
    scene.render()
    scene.sendPosition()
    //console.log(scene.userCamera.position, scene.userCamera.rotation)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}
onMounted(() => {
  useWS().then(ws => ws.sendPromise('create'))
  .then(createScene)
  .catch(console.error)
})
</script>