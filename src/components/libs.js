function setCookie(c_name,value,expiredays=7){
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" +escape(value)+
  ((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
};

function getTimeString(){
  let rt = new Date();
  let [h,m,s] = [rt.getHours(),rt.getMinutes(),rt.getSeconds()].map(e=>String(e).padStart(2,'0'))
  return [h,m,s].join(':')
}


let rollDice = (x,d,p)=>{
  let res = 0;
  let roll =[]
  for (var i = 0; i < x; i++) {
    let single = Math.ceil(d*Math.random())
    roll.push(single);
    res+=single;
  };
  return {
    result:parseInt(res)+parseInt(p),
    detail:roll}
}
function Exp (env='production'){
  this.diceTemplate = [
    {x:1,d:6,p:0,text:"1D6+0"},
    {x:3,d:6,p:0,text:"3D6+0"},
    {x:1,d:100,p:0,text:"1D100+0"},
  ]
  this.env = env;
  this.setCookie = setCookie;
  this.rollDice = rollDice;
  this.server = {
    production:"http://api.antique-fu.com",
    dev:"http://localhost:3000"
  }[this.env];
  this.errCodeMapping = {
    $errFindUser:{chs:"查询用户时发生错误"},
    $noUser:{chs:"用户不存在"},
    $errPwd:{chs:"密码错误"},
    $errSaveUser:{chs:"保存用户时发生错误"},
    $errSavInvCode:{chs:"保存邀请码时发生错误"},
    $invCodeOccupied:{chs:"邀请码已被使用"},
    $errInvCode:{chs:"邀请码错误"},
    $userOccupied:{chs:"用户名已被使用"},
    $noJson:{chs:"未收到数据"},
  }
  this.getTimeString = getTimeString;
  return this;
};

export default Exp
