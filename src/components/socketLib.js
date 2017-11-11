const exp = {};
const Room = require('./Room');

exp.$roomList = {

}


exp.newRoom = (obj,cb)=>{
  exp.$roomList[roomOjb.name] = new Room(roomOjb);
  cb('room create success')
}
