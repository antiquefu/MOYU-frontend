<template>
  <div class="main">
    <div class="leftContainer hide" id="leftContainer">
      <div class="switch" @click="toggleLeftlist" v-if="$store.state.user.username"/>
      <mu-list class="leftList" id="leftList">
          <mo-user v-on:logout="handleLogout" v-show="$store.state.user.username"/>
          <mu-divider/>
          <mu-list-item v-for="(pageName,PageIndex) in pageObj" @click="changePage(pageName)" :class="cp===pageName?'listItem activeItem':'listItem'" :titleClass="'inListItem'" :title="pageMapping[pageName][$store.state.lang]"/>
      </mu-list>
    </div>
    <div class="rightContainer" id="rightContainer">
      <div class="rightSingle Hello" v-show="cp==='$main'">
        <mu-flat-button class="logoBtn" @click="start=!start" v-if="!$store.state.user.username">
          <img src="../assets/logo400.png" alt="LOGO">
        </mu-flat-button>
        <img class="logoBtn" src="../assets/logo400.png" alt="LOGO" v-if="$store.state.user.username">
        <mu-paper :zDepth="5" v-html="'MOYU - A LIFE ATTITUDE'" class="line slogan" v-if="$store.state.user.username"/>
        <mu-paper :zDepth="5" v-html="'点击LOGO开始'" class="line" v-if="!$store.state.user.username"/>
      </div>
      <moTest :states="states" v-show="cp==='$test'"/>
      <mo-room v-show="cp==='$room'"/>
    </div>
    <mo-sign-area ref="signArea" :open='start' v-on:closeStart="start=!start" v-on:sign="handleSign"/>
  </div>
</template>

<script>

import libs from "./libs.js";
let server = libs.getServer();
import User from "./UserArea";
import SignArea from "./SignArea";
import Room from "./Room";
import TestPage from "~/TestPage";

function setCookie(c_name,value,expiredays=7){
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" +escape(value)+
  ((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
}

import axios from'axios';
axios.withCredentials = true;
axios.defaults.baseURL=server;
export default {
  components:{
    moUser:User,
    moSignArea:SignArea,
    moRoom:Room,
    moTest:TestPage,
  },
  methods:{
    handleLogout(){
      this.toggleLeftlist();
      this.$store.commit("signUser",{})
      this.cp="$main";
      delete localStorage.user
    },
    handleSign(user){ //唯一登录入口
      console.log('sign start');
      let _this = this;
      let _type = user.type

      if (_type==="signUp") { //处理本地用户登录
        if (user.expire&&new Date().getTime()>user.expire) {
          delete localStorage.user;
          console.log('user expire');
          return false;
        }else if(user.expire){
          this.$store.commit('signUser',user);
        };
      }
      axios.post('/user/sign',user)
      .then(resp=>resp.data)
      .then(data=>{
        console.log('receive data');
        if (data.main) { //登录成功
          console.log('get user');
          delete data.main.password;
          delete data.main.meta;
          data.main.token = data.token;
          setCookie('token',data.token,7);
          _this.$store.commit('signUser',data.main);
          global.sio = io(server,{transports: ['websocket']});
          sio.on('connect',function(){
             _this.$store.commit('setIO',sio)
          })

          sio.on('reconnect_attempt', () => {
            sio.io.opts.transports = ['polling', 'websocket'];
          });


          _this.start=false;
          _this.toggleLeftlist();
          if (!user.expire) {
            let expire = new Date().getTime()+(3600*24*1000);
                user.type="signUp";
                user.expire = expire
                localStorage.user = JSON.stringify(user)
          }
        }else {
          console.log(data.text);
          let errText = libs.errCodeMapping[data.text][this.$store.state.lang]
          _this.$refs.signArea.errorText.receive=errText;
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    changeMode(n,m){
      this.cm = m
      this.cp = n
    },
    changePage(pn,l){
      if (!l) {
        this.cp = pn
      }
    },
    toggleLeftlist(){
      document.getElementById('leftContainer').classList.toggle('hide')
    },
  },
  data () {
    return {
      debug:false,
      cm:'',
      cp:"$main",
      msg: 'Welcome to Your Vue.js App',
      states:{
        server:'initiating',
        db:'initiating',
      },
      pageObj:['$main','$user','$room','$test'],
      pageMapping:{
        $main:{chs:'主页'},
        $user:{chs:'用户(TODO)'},
        $room:{chs:'房间'},
        $test:{chs:'测试'}
      },
      iconList:{
        view:"pageview",
        edit:"menu",
        test:"mode_edit"
      },
      start:false
    }
  },
  mounted(){

  },
  beforeMount(){
    // console.log(this.cp);
    localStorage.user?this.handleSign(JSON.parse(localStorage.user)):console.log('no local user');
    axios.get('/test')
    .then(resp=>resp.data).then(d=>{
        [this.states.server,this.states.db] = [d.serverState,d.dbState]
    }).catch(err=>{
      [this.states.server,this.states.db]=['error','error']
    })
  }
}
</script>

<style lang ="less">
  @keyframes breath {
    0%   {background: rgb(255, 255, 255)}
    100% {background: rgb(255, 255, 255)}
    50%  {background: rgb(255, 138, 0) }
  };
  @import url('color.less');
  .container{
    transition: 1s all;
    position: relative;
    display: inline-block;
    float: left;
    height: 100%;
  };
.main{
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .leftContainer{
    .container;
    width: 15%;
    background: rgb(0, 0, 0);
    color: #fff;
    border-right: 6px solid #FFF;
    box-sizing: content-box;
    .switch{
      position: absolute;
      width: 30px;
      height: 30px;
      right: -18px;
      top: 50%;
      margin-top: -15px;
      border: 2px solid #FFF;
      background: @orange;
      border-radius: 50%;
      z-index: 10;
    };
    .leftList{
      transition: 1s all;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left:0;
      padding: 0;
      margin: 0;
      .listItem{
        text-align:left;
        margin: 0.50rem;
        background: #000;
        border: 3px solid @orange;
        border-radius: 0.5rem;
      };
      .inListItem{
        color:#FFF!important;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
      }
      .activeItem{
          background: darken(@orange,20%);
      };
      .activeMode{
        background: rgb(4, 217, 255)!important;
      };
      .userArea{
        background: rgb(77, 77, 77);
        width: 90%;
        margin: 5px auto;
        margin-top: 30px;
        padding: 0.2rem;
        min-height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFF;
        border-radius: 0.5rem;
        .userAreaBtn{
          margin: 0.5rem;
          border-radius: 0.5rem;
        }
      };
      .userAvatar{
        margin: 0.5rem;
      };
    };
  };
  .rightContainer{
    .container;
    width: 100%;
    background: @orange;
    .Hello{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      width: 100%;
      .logoBtn{
        margin-top: -50px;
        height: 400px;
        width: 400px;
      }
      img{
        width: 100%;
        height: 100%;
      }

    }
    .debug{
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      left: 0;
      background: rgba(255, 62, 62, 0.39);
      width: 100%;
      height: 200px;
      color: #FFF;
    }
  }
}
.hide{
  width: 0!important;
  .leftList{
    display: none;
  }
}
  .hideLeft{
    margin-left: -15%;
  }
  .moveLeft{
    margin-left: -15%;
    width: 100%!important;
  }

  .line{
    margin: 1rem auto;
    width: 50%;
    height: 4rem;
    font-size: 1.5rem;
    line-height: 4rem;
  }
  .slogan{
    color: @orange;
    font-size: 2.5rem;
  }
</style>
