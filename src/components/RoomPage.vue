<template lang="html">
  <div class="room_outer">
    <div class="enterRoom room" v-show="curR.name">
      <div class="roomBoard">
        <mu-paper class="userList" :zDepth="5">
          {{curR.name}} <br> $online: {{userList.length}}
          <br>
          <span v-for="(arr,index) in userList" class="onlineSpan self"  v-if="arr[1]===$store.state.sio">{{arr[0]}}</span>
          <span v-for="(arr,index) in userList" class="onlineSpan other" v-if="arr[1]!==$store.state.sio">{{arr[0]}}</span>
        </mu-paper>
        <mu-paper class="msgBoard" :zDepth="5">
          <mu-paper :zDepth="2" class="msgLine"  v-for ="(msg,index) in msgBox">
            <div class="msgLineContainer own" v-if="msg.own">{{msg.main}}&nbsp;&nbsp;-{{msg.time}} &nbsp;&nbsp;<mu-icon value="chevron_left" iconClass="iconSpan"/></div>
            <div class="msgLineContainer" v-if="!msg.own"><mu-icon value="chevron_right" iconClass="iconSpan"/>&nbsp;&nbsp;{{msg.from}}:&nbsp;&nbsp; {{msg.main}}&nbsp;&nbsp;-{{msg.time}}</div>
          </mu-paper>
        </mu-paper>
        <mu-paper class="sender" :zDepth="3">
          <input type="text" v-model="msg" class="senderInput" @keypress="triger($event)"/>
          <input type="submit" id="senderBtn" class="senderBtn" :value="'Send'" @click="sendMsg(msg)"/>
        </mu-paper>

        <!--   DICE AREA DOWN HERE-->
        <mu-paper class="dicer" :zDepth="3">

          <div class="presetLine diceLine">

            <mu-icon-button class="presetBtn" icon="chevron_left" :disabled="customDice||!diceTemplate.current" @click="diceTemplate.current--"/>

            <span class="presetName" v-if="!customDice">{{diceTemplate.template[diceTemplate.current].text}}</span>

            <div class="presetName" v-if="customDice">
              <input class="customDiceInput" v-model.number="dice.x">D
              <input class="customDiceInput" v-model.number="dice.d">+
              <input class="customDiceInput" v-model.number="dice.p">
            </div>

            <mu-icon-button class="presetBtn"icon="chevron_right" :disabled="customDice||diceTemplate.current===diceTemplate.template.length-1" @click="diceTemplate.current++"/>
          </div>

          <div class="iconLine diceLine">
            <button type="button" class="iconLineBtn" name="button">
              <span class="iconBtnSpan" @click="customDice=!customDice">{{customDice?"$custom":'$preset'}}</span>
            </button>

            <button type="button" class="iconLineBtn" name="button" @click="rollTheDice($event)">
              <img  class="iconBtnSpan" src="../assets/dice-white.png" alt="DiceIcon">
            </button>

            <button type="button" class="iconLineBtn" name="button" @click="currentDiceMode=1">
              <span class="iconBtnSpan" @click="showCustom=0;showPreset=1">预留</span>
            </button>

          </div>
          <div class="reasonLine diceLine">
            <input type="text" class="iconInput" placeholder="$Reason" v-model="dice.r">
          </div>
        </mu-paper>
      </div>
    </div>
    <div class="beforeEnter room" v-show="!curR.name">
      服务器{{$store.state.sio?"已连接":"未连接/连接失败"}}--
      <input  hintText="请输入房间名" v-model="roomName" class="roomMTF" contentClass="roomCtn" inputClass="roomNameIpu" required :underlineShow='false'/>
      <mu-flat-button label="连接" class="enterBtn" @click="connect_room" :disabled="!$store.state.sio"/>
    </div>
  </div>
</template>

<script>
 // √TODO: 时间戳优化
 // √TODO: 发言冷却
 //  TODO: 浏览器适配
 // √TODO: roll点优化 预设骰子+自定义骰子
 // √TODO: 聊天框roll点

  import Libs from '~/libs.js'
  const libs = new Libs();
  let server = libs.server;
  export default {
    computed:{
      _user:function(){return this.$store.state.user},
    },
    data:function(){
      return {
        cold:1,
        curR:{name:'',online:1},
        msg:'',
        msgBox:[],
        userList:[],
        roomName:"大厅",
        dice:{
          x:1,
          d:6,
          p:0,
          r:''
        },
        customDice:false,
        diceTemplate:{template:libs.diceTemplate,current:0},
        diceMsg:{
          chs:[' 掷了 ',' 掷出 ',' 结果为: ',' 的']
        },
      }
    },
    methods:{
      startCold(t=1){
        this.cold = 0;
        setTimeout(()=>{
          this.cold=1;
        },t*1000)
      },
      rollTheDice(e){
        if (this.cold) {
          e.target.classList.toggle('rolling');
          if (this.customDice) {
            this.sendDice(this.dice)
          }else {
            // log
            let {x,d,p} = this.diceTemplate.template[this.diceTemplate.current];
            let diceObj = {
                  x:x,
                  d:d,
                  p:p,
                  r:this.dice.r
                }
                this.sendDice(diceObj)
          }
          this.startCold()
        };

      },
      sendDice(diceObj){
        let {x,d,p,r} = diceObj;
        let diceValid = parseInt(x)>0&&parseInt(d)>0&&!isNaN(parseInt(p));
        if (diceValid) {
          let {result,detail} = libs.rollDice(x,d,p);
          let dm = this.diceMsg[this.$store.state.lang];
          let retString = `
            ${this.$store.state.user.username}
            ${r?dm[3]+r:''}
            ${dm[0]}
            ${x}D
            ${d}+
            ${p},
            ${dm[1]}
            ${detail.join(',')}
            ${dm[2]}
            ${result}
            `
          this.sendMsg(retString)
        }
      },
      connect_room(){
        let _this = this;
        let _name = this._user.username;
        let _rName = this.roomName;
        sio.emit('join room',{rName:_rName,uName:_name},(rl,selfID)=>{
          _this.userList=rl;
          console.log(_this.userList);
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
          time:libs.getTimeString()
        }
      },
      triger(e){
        if (e.keyCode===13&&this.msg) {
          this.sendMsg()
        }
      },
      sendMsg(msg=this.msg){
        if (msg&&this.cold) {
          let matchStart = /^#/
          let D = /^#([1-9][0-9]*)[Dd]([1-9][0-9]*)(\+?([0-9]*))(@?([\s\S]*))/
          let diceMatch = msg.match(D);
          if (diceMatch) {
            let x = diceMatch[1];
            let d = diceMatch[2];
            let p = diceMatch[4]||'0';
            let r = diceMatch[6];
            this.sendDice({x:x,d:d,p:p,r:r});
            return
          }

          let msgObj = {
            main:msg,
            from:this.$store.state.user.username,
            time:libs.getTimeString(),
            own:true
          };
          this.msgBox.unshift(msgObj)
          sio.emit('userSend',msgObj)

          this.cold = 0;
          document.getElementById('senderBtn').classList.add('cold');
          setTimeout(()=>{
            this.cold = 1;
            document.getElementById('senderBtn').classList.remove('cold');
          },1000)
          this.msg=''
        }
      },
    },
  }
</script>
<style lang="less">
@import url('color.less');
@keyframes cold {
  from{background: @red}
    to{background: @p-f}
}
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
      border: 3px solid @p-bd;
      border-radius: 0.5rem;
      position: absolute;
      background: darken(@p-bg,20%);
    }
    .dicer{
      .lv1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      width: 12rem;
      height: 12rem;
      right: 0;
      bottom: 1rem;
      color: @s-f;
      .diceLine{
        width: 100%!important;
        background: @p-bg;
        height: 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      };
      .reasonLine{
        .iconInput{
          width: 100%;
          height: 100%;
          background: transparent;
          text-align: center;
          color: @s-f;
        }
      };
      .presetLine{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .presetBtn{
          width: 2rem;
          height: 100%;
          padding: 0;
          color: @s-f;
        }
        .presetName{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 8rem;
          height: 100%;
          border-left: 2px solid @p-bd;
          border-right: 2px solid @p-bd;
          border-bottom: 1px solid @p-bd;
          line-height: 2rem;
          box-sizing: content-box;
          margin: 0 -4px;
          color: @s-f;
          font-size: 1rem;
          .customDiceInput{
            width: 2rem;
            border: 0;
            padding: 0;
            background: @s-bg;
            text-align: center;
          }
        }
      }
      .iconLine{
        height: 8rem!important;
        display: flex;
        align-items: flex-start;
        .iconLineBtn{
          background: transparent;
          width: 2rem;
          height: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          border: 1px solid @p-bd;
          .iconBtnSpan{
            transition: all 1s;
            -webkit-writing-mode: vertical-rl;
            writing-mode: tb-rl;
            font-size: 1rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: @s-f;
          };
        }
        .iconLineBtn:nth-child(2){
          width: 8rem;
        }
      }
      .diceIpt{
        border: 2px solid @s-bd;
        border-radius: 0.5rem;
        width:3rem;
        height:2.5rem;
        text-align: center;
        padding: 0;
        margin: 0.5rem;
        background: @p-f;
        color:@s-f;
      }
    };
    .msgBoard{
      .lv1;
      left: 0;
      top: 0;
      right:14rem;
      bottom: 8rem;
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
        color: @s-f;
        border: 3px solid @p-bd;
        flex-shrink: 0;
        .iconSpan{
          color:@s-f
        };
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
      height: 6rem;
      right: 14rem;
      bottom:1rem;
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
        background: @p-f;
      }
      .cold{
        animation: cold 1s
      }
    };
    .userList{
      .onlineSpan{
        margin-top: 0.5rem;
        width: 80%;
        margin: 0.5rem auto;
        border: 1px solid @p-bd;
        border-radius: 0.5rem;
        background: transparent;
      }
      .self{
        background: @p-bg;
      };
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: @s-f;
      font-size: 1rem;
      right: 0;
      top: 0;
      width: 12rem;
      bottom: 14rem;
      overflow: scroll;
      .lv1;
    };

  }
}
.rolling{
  transform: rotate(720deg);
}
</style>
