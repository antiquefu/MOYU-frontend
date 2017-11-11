<template lang="html">
  <div class="test_main">
    <mu-paper :zDepth="5"  class="line">服务器状态: {{states.server}}</mu-paper>
    <mu-paper :zDepth="5"  class="line">数据库状态: {{states.db}}</mu-paper>
    <mu-paper :zDepth="5"  class="line">SocketIO状态:{{$store.state.sio?'已连接':'未连接/失败'}} </mu-paper>
    <mu-paper :zDepth="5"  class="line" v-if="states.server=='ok'&&states.db=='ok'" v-html="'一切正常'"/>
    <mu-paper :zDepth="5"  class="line" v-if="states.server=='ok'&&states.db=='ok'" v-html="'其他功能摸了'"/>
  </div>
</template>

<script>
export default {
  props:["states",'sid'],
}
</script>

<style lang="less">
  .test_main{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

  }
</style>
