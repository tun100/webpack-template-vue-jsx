import App from './App.vue'

utils.init();

Vue.use(ELEMENT)
Vue.use(Vuex)
Vue.use(VueRouter)

var store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {}
})

let routes = []

const router = new VueRouter({
  routes
})

router.beforeEach((to, from) => {})
router.afterEach((to, from) => {})

var gvm = new Vue({
  el: '#root',
  render: h => {
		return <App />
  },
  store,
  router
})

window.Vue = Vue
window.Vuex = Vuex
window.VueRouter = VueRouter
window._ = _
window.moment = moment
window.axios = axios
window.ELEMENT = ELEMENT
window.STORE = store
window.gvm = gvm
