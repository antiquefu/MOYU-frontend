<template>
  <div id="app">
    <router-view/>
    <a id="ipc" href="http://www.miitbeian.gov.cn/" target="frame1">桂ICP备17007215号-2</a>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted(){

    // console.log(this.$http);
  },
};
</script>

<style>
#ipc{ color:#FFF;
  left: 0;
  right: 0;
  position: absolute;
  bottom: 0;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgb(84, 112, 228);
}
*{
  font-family: Noto Serif;
  /*font-family: Noto Serif;*/
  border: none;
  box-sizing: border-box;
  outline: none;
}
html{
  height: 100%;
  width: 100%;
  position: absolute;
  padding: 0;
  margin: 0;
}
</style>
