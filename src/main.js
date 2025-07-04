import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue' 
// import App from './Interpolasi.vue' 
// import App from './ref.vue' 
// import App from './reactives.vue'
// import App from './reactiveWithNestedArr.vue'
// import App from './reactiveWithArr.vue'
// import App from './reactiveWithNested.vue'
// import App from './reactiveWithNestedArry.vue'
// import App from './consumeApi.vue'
// import  App from './if.vue'
// import App from './vModel.vue'
// import App from './event.vue'
// import App from './state.vue'
// import App from './Login.vue'
import App from './trialFileSingleFileComponentSFC.vue'
// import App from './trialFileVersiPinia.vue'
// import App from './trials.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createPinia } from 'pinia'
const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
createApp(App).mount('#app')
