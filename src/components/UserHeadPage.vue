<template lang="html">
  <mu-paper :zDepth="3"class="user_outer">
    <button class="StartBtn userBtn" @click="fold=!fold">
      <mu-avatar slot="left" class="userAvatar" src="/static/logo.png" alt="123"/>
      <span>{{$store.state.user.username}}</span>
    </button>
    <mu-raised-button :labelClass="'btnLable'" label="注销" :class="contentBtnClass" @click="$emit('logout')"/>
    <mu-raised-button :labelClass="'btnLable'" label="其他按钮" :class="contentBtnClass"/>
    <mu-paper :class="contentBtnClass" v-html="'其他字段'"/>
  </mu-paper>
</template>

<script>
  export default {
    methods:{
      handleLogout(){
        thi
      }
    },
    computed:{
      contentBtnClass:function(){
        if (this.fold) {
          return "userBtn hideBtn"
        }else{
          return "userBtn"
        }
      },

    },
    data:function(){
      return {
        log:false,
        fold:true,
        dialog:{
          on:false,
          event:''
        },
        dialogForm:{
          signUp:{
            type:'signUp',
            username:'',
            password:'',
          },
          signIn:{
            type:'signIn',
            username:'',
            password:'',
            password2:'',
            invitation:''
          },
        },
        errorText:{
          signUp:{
            username:'',
            password:'',
          },
          signIn:{
            username:'',
            password:'',
            password2:'',
            invitation:''
          }
        },
        hintText:{
          password:"密码",
          password2:"确认密码",
          invitation:"邀请码",
          username:"用户名",
        }
      }
    },
  }
</script>

<style lang="less">
@import url('color.less');

 .user_outer{
   border: 2px solid @s-bd;
   background: transparent;
   transition: all 1s;
   position: relative;
   box-sizing: content-box;
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   padding: 10px;
   margin: 0 0.5rem;
   margin-top: 1.2rem;
   .userBtn{
     width: 100%;
     margin: 0.2rem auto;
     background: @p-bg;
     color: @p-f;
     transition: all 1s;
     display: flex;
     justify-content: center;
     align-items: center;
     overflow: hidden;
     height: 2rem;
     line-height: 36px;
     min-width: 0!important;
   }
   .userBtn:first-child{
     padding-left: 1rem;
     display: flex;
     justify-content: center;
     align-items: center;
     height: 3rem;
     background: darken(@p-bg,15%);
     span{
       flex-grow: 5
     }
   }
   .hideBtn{
     height: 0!important;
     margin: 0;
   }
   .btnLable{
     text-transform: none;
     padding: 0;
   }
 }
</style>
