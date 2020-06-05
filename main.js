import Vue        from 'vue'
import App        from './App'
import store      from './store/index.js'
import handle     from './common/handle.js'
import goEasy     from './common/GoEasy.js'
import * as $apis from './apis/index.js'

// 挂载全局方法
Vue.prototype.$store = store
Vue.prototype.$apis = $apis
Vue.prototype.$unit = handle
Vue.prototype.$goEasy = goEasy

// 检测网络状态变换
handle.netWorkChange();

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
