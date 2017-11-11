<template lang="html">
  <mu-paper :zDepth="3"class="user_outer">
    <mu-raised-button :labelClass="'btnLable'" :label="$store.state.user.username" class="StartBtn userBtn" @click="fold=!fold"/>
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
@keyframes breath {
  0%{background: #FFF}
  100%{background: #fff}
  50% {background: @orange}
}

 .user_outer{
   border: 3px solid @orange;
   background: transparent;
   transition: all 1s;
   position: relative;
   // width: 100%;
   box-sizing: content-box;
   // margin:
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   padding: 10px;
   margin: 0 0.5rem;
   margin-top: 1.2rem;

   // margin: 1.5rem auto;
   .userBtn{
     width: 100%;
     margin: 0.2rem auto;
     background: @orange;
     color: #FFF;
     transition: all 1s;
     display: flex;
     justify-content: center;
     align-items: center;
     overflow: hidden;
     height: 36px;
     line-height: 36px;
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
