import Vue from 'vue'
import './plugins/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import moment from 'moment/moment'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$moment = moment
Vue.use(mavonEditor)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

Vue.directive('hasPermission', {
    bind(el, binding, vnode) {
        let flag = false;
        let user = vnode.context?.$store.state.user;
        let perms = vnode.context?.$store.state.perms;
        let value = binding.value;
        if (user.admin || perms.indexOf(value) !== -1) flag = true;
        if (!flag) {
            el.setAttribute("disabled", String(true));
            el.classList.add("is-disabled");
        }
    }
});
