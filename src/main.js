// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex';
import router from './router';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import libs from "@/components/libs.js";

Vue.use(MuseUI);
Vue.use(Vuex);

Vue.config.silent = true;
let localuserStr = localStorage.user;
let localUser = {};
let logState = false;

const store = new Vuex.Store({
  state:{
    user:localUser,
    logState:logState,
    lang:"chs",
    sio:''
  },
  mutations:{
    login(state){
      state.logState=true;
    },
    logout(state){
      state.logState=false;
    },
    signUser(state,user){
      console.log('now we got a user');
      state.user = user;
    },
    setIO(state,io){
      // console.log('set socket.io to $store');
      // console.log(io);
      console.log(io);
      state.sio = io.id;
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
});
