<template lang="html">
  <div class="room_outer">
    <div class="enterRoom room" v-show="curR.name">
      <div class="roomBoard">
        <mu-paper class="userList" :zDepth="5">
          {{curR.name}} <br> Online: {{userList.length}}
          <br>
          <span v-for="(arr,index) in userList">{{arr[0]}}-{{index}}</span>
        </mu-paper>
        <mu-paper class="msgBoard" :zDepth="5">
          <mu-paper :zDepth="2" class="msgLine"  v-for ="(msg,index) in msgBox">
            <div class="msgLineContainer own" v-if="msg.own">{{msg.main}}&nbsp;&nbsp;-{{msg.time}} &nbsp;&nbsp;<mu-icon value="chevron_left" color="orange"/></div>
            <div class="msgLineContainer" v-if="!msg.own"><mu-icon value="chevron_right" color="orange"/>&nbsp;&nbsp;{{msg.from}}:&nbsp;&nbsp; {{msg.main}}&nbsp;&nbsp;-{{msg.time}}</div>
          </mu-paper>
        </mu-paper>
        <mu-paper class="sender" :zDepth="3">
          <input type="text" v-model="msg" class="senderInput" @keypress="triger($event)"/>
          <input type="submit" class="senderBtn" :value="'Send'" @click="sendMsg(msg)"/>
        </mu-paper>
        <mu-paper class="dicer" :zDepth="3">

          <!-- v-model.number="age" type="number" -->
          <input class="diceIpt"type="number" v-model.number="dice.x" @input="checkNum">D
          <input class="diceIpt"type="number" v-model.number="dice.d" @input="checkNum">+
          <input class="diceIpt"type="number" v-model.number="dice.p" @input="checkNum">
          <input class="diceIpt"type="button" value="GO" @click="sendDice">
        </mu-paper>
      </div>
    </div>
    <div class="beforeEnter room" v-show="!curR.name">
      <input  hintText="请输入房间名" v-model="roomName" class="roomMTF" contentClass="roomCtn" inputClass="roomNameIpu" required :underlineShow='false'/>
      <mu-flat-button label="连接" :backgroundColor="'#FFF'" class="enterBtn" @click="connect_room"/>
    </div>
  </div>
</template>

<script>
const libs = require('./libs');
let server = libs.getServer();
export default {
  computed:{
    _user:function(){return this.$store.state.user},
  },
  data:function(){
    return {
      curR:{name:'',online:1},
      newR:{},
      joinR:{},
      tempR:{name:'',password:''},
      msg:'',
      msgBox:[],
      userList:[],
      roomName:"大厅",
      dice:{
        x:1,
        d:6,
        p:0
      },
      diceMsg:{
        chs:[' 投掷了 ',' 结果为: ']
      },
      diceSpecial:{
        chs:"投出骰子全是0,这是*小*概率事件,也是bug"
      },
    }
  },
  methods:{
    sendDice(){
      let diceValid = parseInt(this.dice.x)>0&&parseInt(this.dice.d)>0&&!isNaN(parseInt(this.dice.p));
      if (!diceValid) {
        return ;
      }
      let roll = 0
      for (var i = 0; i < this.dice.x; i++) {
        let single = Math.ceil(this.dice.d*Math.random())
        roll+=single
      };
      let result = parseInt(roll)+parseInt(this.dice.p)
      let dm = this.diceMsg[this.$store.state.lang];
      let ds = this.diceSpecial[this.$store.state.lang];
      let retString = `${this.$store.state.user.username}${dm[0]}${this.dice.x}D${this.dice.d}+${this.dice.p},${dm[1]} ${result} .${roll?'':ds}`
      this.sendMsg(retString)
      // console.log(retString);
    },
    checkNum(e){
      let ok = isNaN(parseInt(e.data))
    },
    connect_room(){
      let _this = this;
      let _user = this._user;
      let _name = this._user.username;
      let _rName = this.roomName;

      sio.emit('join room',{rName:_rName,uName:_name},(rl,selfID)=>{
        _this.userList=rl;
        _this.socketID = selfID;
        _this.curR.name = _rName;
        _this.curR.online = rl.length;
      });
      sio.on('receive',(msgObj)=>{
        msgObj.own = msgObj.from===name;
        _this.msgBox.unshift(msgObj)
      })
      sio.on('user change',(ul)=>{
        _this.userList=ul;
      })

     if (_name) {
       this.msgBox.unshift(this.generateMO('Hello! it\'s me,'+_name,_name));
       this.msgBox.unshift(this.generateMO('Oh, I see, nice to meet u! '+_name,"SYSTEM"));
     }

    },
    generateMO(msg,from){
      return {
        main:msg,
        from:from,
        own:from===this.$store.state.user.username,
        time:new Date().toLocaleTimeString()
      }
    },
    triger(e){
      if (e.keyCode===13&&this.msg) {
        this.sendMsg()
      }
    },
    sendMsg(msg=this.msg){
      if (msg) {
        let msgObj = {
          main:msg,
          from:this.$store.state.user.username,
          time:new Date().toLocaleTimeString(),
          own:true
        };
        this.msgBox.unshift(msgObj)
        sio.emit('userSend',msgObj)
        this.msg=''
      }
    },
  },
  mounted(){

  },

}
</script>
<style lang="less">
@import url('color.less');
.room_outer{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.beforeEnter{
  display: flex;
  justify-content: center;
  .enterBtn{
    height: 2rem;

  }
  .roomMTF{
    background: #FFF;
    padding: 0;
    margin: 0;
    text-align: center;
    height: 2rem;
    width: 10rem;
    margin-right: 1rem;
  }
}
.room{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  .roomBoard{
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    position: relative;
    padding-bottom: 2rem;
    .lv1{
      border: 3px solid #FFF;
      border-radius: 0.5rem;
      position: absolute;
      background: darken(@orange,20%);
    }
    .dicer{
      .lv1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 18%;
      height: 13%;
      right: 0;
      top: 85%;
      color: #FFF;
      .diceIpt{
        border: 2px solid #FFF;
        border-radius: 0.5rem;
        width:3rem;
        height:2.5rem;
        text-align: center;
        padding: 0;
        margin: 0.5rem;
        color:#000;
      }
    }
    .msgBoard{
      .lv1;
      left: 0;
      top: 0;
      width: 80%;
      height: 80%;
      display: flex;
      align-items: center;
      flex-wrap: no-wrap;
      flex-shrink: 0;
      flex-direction: column-reverse;
      overflow-y: scroll;
      overflow-x: hidden;
      .msgLine{
        font-size: 1rem;
        width: 80%;
        min-height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem 0;
        padding: 0 1rem;
        color: #000;
        border: 3px solid #FFF;
        flex-shrink: 0;
        .msgLineContainer{
          display: flex;
          align-items: center;
          width: 100%;
        };
        .own{
          justify-content: flex-end;
        }
      }
    };
    .sender{
      left: 0;
      top: 85%;
      height: 13%;
      width: 80%;
      padding:1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .lv1;
      .senderInput{
        height: 100%;
        display: flex;
        flex-grow: 5;
        text-align: center;
      }
      .senderBtn{
        height: 100%;
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        margin: 0 0.5rem;
        background: #FFF;
      }
    };
    .userList{
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #FFF;
      font-size: 1rem;
      right: 0;
      top: 0;
      width: 18%;
      height: 80%;
      .lv1;
    };

  }
}

</style>
