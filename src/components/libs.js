const Exp ={};

// Exp.env = 'dev';
Exp.env = 'production';

Exp.server = {
  production:"http://api.antique-fu.com",
  dev:"http://localhost:3000"
};

Exp.getServer = function(){
  return this.env==='dev'?this.server.dev:this.server.production;
};
Exp.errCodeMapping = {
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
module.exports = Exp;
