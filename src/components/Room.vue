<template>
  <canvas class="canvas" :id="'room-'+room_hash"></canvas>
</template>
<script lang="ts" setup>
import { ref, onMounted  } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useEventHub from '../utils/event-hub'
import MainScene from '../scenes/main'
import { Engine, Scene } from "@babylonjs/core"
const $route = useRoute()
const $router = useRouter()
const $hub = useEventHub()
const room_hash = ref($route.params.room_hash || localStorage.getItem('room_hash') || '')
const ws = new WebSocket(`ws://localhost:3001`)
onMounted(() => {
  const canvas = document.querySelector('#room-'+room_hash.value) as HTMLCanvasElement
  const engine = new Engine(canvas)
  console.log(canvas)
  const scene = MainScene(engine, canvas)
  engine.runRenderLoop(() => {
    scene.render()
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
})
ws.addEventListener('error', console.error)
ws.addEventListener('open', e => {
  if (room_hash.value === 'new') {
    $hub.on('create.catch', console.error)
    $hub.on('create.then', (rh: string) => {
      room_hash.value = rh
      localStorage.setItem('room_hash', rh)
      $router.push({ path: `/rooms/${rh}` })
    })
    ws.send(JSON.stringify({action: 'create'}))
  }
  else if (room_hash.value.length > 0) {
    $hub.on('enter.catch', console.error)
    $hub.on('enter.then', (rh: string) => {
      room_hash.value = rh
      localStorage.setItem('room_hash', rh)
      $router.push({ path: `/rooms/${rh}` })
    })
    ws.send(JSON.stringify({action: 'enter', data: room_hash.value}))
  }
})
ws.addEventListener('message', e => {
  const {action, room_hash, user_hash, data} = JSON.parse(e.data)
  $hub.emit(action, room_hash, user_hash, data)
})
</script>