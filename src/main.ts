import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'

import App from './App.vue'
import Antd from 'ant-design-vue';

import routes from './routes'

import 'ant-design-vue/dist/reset.css';
import './style.css'

const router = createRouter({
  history: createWebHistory('/landing'),
  routes
})

router.afterEach((to) => document.title = (to.name || '') as string )

createApp(App)
  .use(router)
  .use(Antd)
  .mount('#app')
