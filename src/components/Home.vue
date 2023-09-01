<template>
  <a-input-group compact>
    <a-input addon-before="Комната" v-model:value="room_hash" style="width: 20%" />
    <a-input addon-before="Пользователь" v-model:value="user_hash" style="width: 20%" />
    <a-button type="primary" @click="connect(user_hash || '', room_hash || '')">Войти</a-button>
    <a-button @click="connect(user_hash || '')">Создать новую комнату</a-button>
  </a-input-group>
</template>
<script lang="ts" setup>
import { ref,  } from 'vue'
import { useRouter } from 'vue-router'
const room_hash = ref(localStorage.getItem('room_hash'))
const user_hash = ref(localStorage.getItem('user_hash'))
const router = useRouter()

const connect = (user_hash: string, room_hash: string = 'new' ) => {
  if(room_hash.length === 0 )
    return alert('Укажите комнату')
  localStorage.setItem('room_hash', room_hash)
  localStorage.setItem('user_hash', user_hash)
  router.push({ path: `/landing/rooms/${room_hash}` })
}
</script>
