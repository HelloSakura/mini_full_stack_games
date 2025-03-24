import { WebSocketServer } from "ws";
import { symlinkBase, symlinkCommon } from "./Utils";
import {ApiMsgEnum, NetPort} from "./Common"

symlinkCommon();

const wss = new WebSocketServer({ port: NetPort });

let inputs:any[] = []

wss.on("connection", (socket) => {
  socket.on("message", (buffer) => {
    const str = buffer.toString();
    try{
      const msg = JSON.parse(str);
      const {head, data} = msg;
      const {frameID, input} = data;
      inputs.push(input);
    }
    catch(e){
      console.log("ws onmessage error:", e);
    }
  });

  setInterval(()=>{
      const temp = inputs;
      inputs = [];
      const msg = {
        head:ApiMsgEnum.MsgServerSync,
        data:{
          inputs:temp,
        }
      };
      socket.send(JSON.stringify(msg));
  })

});

wss.on("listening", () => {
    console.log("Server listening");
});
