const routes = [
  { name: 'Главная', path: '/', component: () => import('./components/Home.vue') },
  { name: 'Комната', path: '/rooms/:room_hash', component: () => import('./components/Room.vue') },
  { name: 'Шаблоны XML', path: '/xml-template', component: () => import('./components/XMLTemplates.vue') },
]

export default routes