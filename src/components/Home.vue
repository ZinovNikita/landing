<template>
  <a-result title="Укажите номер комнаты или создайте новую">
    <template #subTitle>
      <a-input size="large" v-model:value="room_hash" style="width: 20%"/>
    </template>
    <template #extra>
      <a-button size="large" type="primary" @click="connect">Войти</a-button>
      <a-button size="large" type="dashed" @click="create">Создать</a-button>
    </template>
  </a-result>
</template>
<script lang="ts" setup>
import { ref,  } from 'vue'
import { useRouter } from 'vue-router'
const room_hash = ref(localStorage.getItem('room_hash') || '')
const router = useRouter()

const connect = () => {
  if(room_hash.value.length === 0 )
    return alert('Укажите комнату')
  localStorage.setItem('room_hash', room_hash.value)
  router.push({ path: `/rooms/${room_hash.value}` })
}
const create = () => {
  room_hash.value = ''
  localStorage.removeItem('room_hash')
  router.push({ path: `/rooms/new` })
}
</script>
