<template lang="html">
    <mu-dialog :open="open" title="欢迎" actionsContainerClass="dialogAction">
      <div class="level1 lev" v-if="!signEvent.on">
        <mu-raised-button class="lv1Btn" label="登录" @click="signEvent={on:true,type:'up'};upDateSignUpErr()"/>
        <mu-raised-button class="lv1Btn" label="注册" @click="signEvent={on:true,type:'in'};upDateSignInErr()"/>
        <mu-raised-button class="lv1Btn" label="取消" @click="close"/>
      </div>
      <div class="level2 lev" v-if="signEvent.on">
        <mu-text-field v-if="signEvent.type==='in'" :type="key.indexOf('password')>=0?'password':'text'" @input="upDateSignInErr" v-for="(err,key) in errorText.signIn" v-model="dialogForm.signIn[key]" :errorText="err" :hintText="hintText[key]"/>
        <mu-text-field v-if="signEvent.type==='up'" :type="key.indexOf('password')>=0?'password':'text'" @input="upDateSignUpErr" v-for="(err,key) in errorText.signUp" v-model="dialogForm.signUp[key]" :errorText="err" :hintText="hintText[key]"/>
        <span v-if="errorText.receive">{{errorText.receive}}</span>
        <div class="level3 lev">
          <mu-flat-button v-if="signEvent.type==='up'" primary label="登录" @click="handleSign('Up')"/>
          <mu-flat-button v-if="signEvent.type==='in'" primary label="注册" @click="handleSign('In')"/>
          <mu-flat-button  primary label="取消" @click="closeLv2"/>
        </div>
      </div>
    </mu-dialog>
</template>

<script>
export default {
  computed:{
    formValid:function(){
      let [signIn,signUp]=[true,true];
      for (let key in this.errorText.signIn) {
        if (this.errorText.signIn[key]) {
          signIn=false;
          break;
        }
      }
      for (let key in this.errorText.signUp) {
        if (this.errorText.signUp[key]) {
          signUp=false;
          break;
        }
      }
      return{
        signIn:signIn,
        signUp:signUp
      }
    }
  },
  methods:{
    handleSign(type){
      let body = this.dialogForm['sign'+type];
      let ret
      if (this.formValid['sign'+type]) { //验证成功后
       if (type==="Up") {
         ret = "登录";
         this.$emit('sign',body);
       }else{
         ret = "注册";
         this.$emit('sign',body);
       }
      }else{
       ret = (type==="Up"?"登录":"注册")+"失败"
      }
    },
    close(){
      this.$emit('closeStart')
    },
    closeLv2(){
      this.signEvent={
        on:false,
        type:''
      }
    },
    upDateSignInErr:function(){
      let {username,password,password2,invitation} = this.dialogForm.signIn
      let usnRe = /^[A-Za-z0-9_]+$/;
      let usnChrErr = usnRe.test(username);
      let usnLenErr = username.length>=6&&username.length<=20;

      let  usernameErr = (!usnChrErr?"用户名只能为字母，数字，下划线。":"")+(!usnLenErr?"用户名长度只能为6-20。":"");

      let passwordErr = !(password.length>=6&&password.length<=20);
      let password2Err = password===password2;
      let invitationErr = invitation.length!==6;

      this.errorText.signIn = {
        username:usernameErr,
        password:(passwordErr?"密码长度只能为6-20":''),
        password2:(password!==password2?"确认密码错误":''),
        invitation:(invitationErr?"邀请码长度不正确":'')
      }
    },
    upDateSignUpErr:function(){
      let username = this.dialogForm.signUp.username;
      let password = this.dialogForm.signUp.password;
      let usnRe = /^[A-Za-z0-9_]+$/;
      let usnChrErr = !usnRe.test(username);
      let usnLenErr = !(username.length>=6&&username.length<=20);
      let usernameErr = usnLenErr||usnChrErr;
      let passwordErr = !(password.length>=6&&password.length<=20);
      this.errorText.signUp =  {
        username:usernameErr?"请输入正确的用户名":'',
        password:passwordErr?"请输入正确的密码":''
      }
    },
  },
  props:['open'],
  data:function(){
    return {
      signEvent:{
        on:false,
        type:''
      },
      errorText:{
        signUp:{
          username:'',
          password:''
        },
        signIn:{
          username:'',
          password:'',
          password2:'',
          invitation:'',
        },
        receive:''
      },
      hintText:{
        password:"密码",
        password2:"确认密码",
        invitation:"邀请码",
        username:"用户名",
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
    }
  },
}
</script>

<style lang="less">
.dialogInner{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.dialogAction{
  display: flex;
  justify-content: center;
}
.lev{
  display: flex;
  justify-content: center;
  align-items: center;
}
.level1{
  margin: 2rem;
  .lv1Btn{
    margin: 0 1rem;
  }
};
.level2{
  flex-direction: column;
}
.level3{
  flex-direction: row;
}
</style>
