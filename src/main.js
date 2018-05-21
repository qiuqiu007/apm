// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { InfiniteScroll } from 'mint-ui'
import App from './App'
import router from './router'
import service from './request/service'
Vue.use(InfiniteScroll);


Vue.prototype.$http = service;
import '@/assets/js/rem.js'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
