const routes = [
  { name: 'Главная', path: '/landing/', component: () => import('./components/Home.vue') },
  { name: 'Комната', path: '/landing/rooms/:room_hash', component: () => import('./components/Room.vue') },
  { name: 'Шаблоны XML', path: '/landing/xml-template', component: () => import('./components/XMLTemplates.vue') },
]

export default routes