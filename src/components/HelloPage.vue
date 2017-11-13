<template lang="html">
  <div class="rightSingle Hello" v-show="cp==='$main'">
    <mu-flat-button class="logoBtn" @click="handleLogoClick" v-if="!$store.state.user.username">
      <img src="../assets/logo400.png" alt="LOGO">
    </mu-flat-button>
    <img class="logoBtn" src="../assets/logo400.png" alt="LOGO" v-if="$store.state.user.username">
    <mu-paper :zDepth="5" v-html="'MOYU - A LIFE ATTITUDE'" class="line slogan" v-if="$store.state.user.username"/>
    <mu-paper :zDepth="5" v-html="'点击LOGO开始'" class="line" v-if="!$store.state.user.username"/>
  </div>
</template>

<script>
export default {
  props:['cp','start'],
  methods:{
    handleLogoClick(){
      this.$emit('logoClick')
    }
  },

}
</script>

<style lang="less">
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
</style>
