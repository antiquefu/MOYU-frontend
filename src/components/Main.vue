<template>
  <div class="main">
    <div class="leftContainer hide" id="leftContainer">
      <div class="switch" @click="toggleLeftlist" v-if="$store.state.user.username"/>
      <mu-list class="leftList" id="leftList">
          <mo-user-head v-on:logout="handleLogout" v-show="$store.state.user.username"/>
          <mu-divider/>
          <mu-list-item v-for="(pageName,PageIndex) in pageObj" @click="changePage(pageName)" :class="cp===pageName?'listItem activeItem':'listItem'" :titleClass="'inListItem'" :title="pageMapping[$store.state.lang][pageName]"/>
      </mu-list>
    </div>
    <div class="rightContainer" id="rightContainer">
      <mo-hello :cp="cp" v-on:logoClick="start=!start"/>
      <mo-test :states="states" v-show="cp==='$test'"/>
      <mo-user-config v-show="cp==='$user'"/>
      <mo-room v-show="cp==='$room'"/>
    </div>
    <mo-sign ref="signArea" :open='start' v-on:closeStart="start=!start" v-on:sign="handleSign"/>
  </div>
</template>

<script>
  // import modules
  import Libs from '~/libs.js';
  const libs = new Libs();
  let server = libs.server;

  import axios from'axios';
  axios.defaults.baseURL=server;

  //  import compunents

  import UserHeadPage from "~/UserHeadPage";
  import SignPage from "~/SignPage";
  import RoomPage from "~/RoomPage";
  import TestPage from "~/TestPage";
  import HelloPage from "~/HelloPage"
  import UserConfigPage from "~/UserConfigPage"

  export default {
    components:{
      moUserHead:UserHeadPage,
      moUserConfig:UserConfigPage,
      moSign:SignPage,
      moRoom:RoomPage,
      moTest:TestPage,
      moHello:HelloPage
    },
    methods:{
      handleLogout(){
        this.toggleLeftlist();
        this.$store.commit("signUser",{})
        this.cp="$main";
        delete localStorage.user
      },
      handleSign(user){ //唯一登录入口

        let _this = this;

        let _type = user.type;

        if (_type==="signUp") { //处理本地用户登录
          if (user.expire&&new Date().getTime()>user.expire) {
            delete localStorage.user;
            console.log('user expire');
            return false;
          }else if(user.expire){
            this.$store.commit('signUser',user);
          };
        };

        axios.post('/user/sign',user)
        .then(resp=>resp.data)
        .then(data=>{
          if (data.main) { //登录成功 先登录再连接
            delete data.main.password;
            delete data.main.meta;
            data.main.token = data.token;

            libs.setCookie('token',data.token,7);
            _this.$store.commit('signUser',data.main);

            _this.start=false;
            _this.toggleLeftlist();
            if (!user.expire) { //从服务器返回的用户,设置过期,一天
              let expire = new Date().getTime()+(3600*24*1000);
                  user.type="signUp";
                  user.expire = expire
                  localStorage.user = JSON.stringify(user)
            }
          }else {
            let errText = libs.errCodeMapping[data.text][this.$store.state.lang]
            _this.$refs.signArea.errorText.receive=errText;
          }
          return data
        })
        .then(data=>{ //连接socketio
          global.sio = io(server,{transports: ['websocket']});
          sio.on('connect',function(){
             _this.$store.commit('setIO',sio)
          })

          sio.on('reconnect_attempt', () => {
            sio.io.opts.transports = ['polling', 'websocket'];
          });
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
          chs:{
            $main:"主页",
            $user:"用户(TODO)",
            $room:"房间",
            $test:"测试"
          }
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
  @import url('color.less');

  @keyframes breath {
    0%   {background: @s-bg}
    100% {background: @s-bg}
    50%  {background: @p-bg }
  };
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
      background: @s-bg;
      color: @p-f;
      border-right: 6px solid @p-bd;
      box-sizing: content-box;
      .switch{
        position: absolute;
        width: 30px;
        height: 30px;
        right: -18px;
        top: 50%;
        margin-top: -15px;
        border: 2px solid @p-bd;
        /*background: @p-bg;*/
        animation: breath 5s infinite;
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
          background: @p-bg;
          border: 2px solid @p-bd;
          border-radius: 0.5rem;
        };
        .inListItem{
          color:@p-f!important;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: nowrap;
        }
        .activeItem{
            background: darken(@p-bg,40%);
        };
      };
    };
    .rightContainer{
      .container;
      width: 100%;
      background: @p-bg;
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
    background: @s-bg;
    color: @p-f;
    font-size: 2.5rem;
  }
</style>
