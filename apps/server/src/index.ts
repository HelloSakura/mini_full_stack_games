import { WebSocketServer } from "ws";
import { symlinkBase, symlinkCommon } from "./Utils";
import {ApiMsgEnum, IMsgPlayerJoinReq, IMsgPlayerListReq, NetPort} from "./Common"
import { Connection, GameServer } from "./Core";
import { connect } from "http2";
import { Player } from "./Business/Player";
import { PlayerManager } from "./Business/PlayerManager";

symlinkCommon();

declare module "./Core"{
    interface Connection{
        playerID:number;
    }
}

const server = new GameServer(NetPort);
server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection:Connection, data:IMsgPlayerJoinReq)=>{
    const {name} = data;
    const player = PlayerManager.Instance.createPlayer({name, connection});
    connection.playerID = player.PlayerID;
    console.log('set api ret');
    //玩家登录的时候同步列表
    PlayerManager.Instance.syncPlayers();
    return {
        player:PlayerManager.Instance.getPlayerView(player)
    };
});

server.setApi(ApiMsgEnum.ApiPlayerList, (connection:Connection, data:IMsgPlayerListReq)=>{
    const players = PlayerManager.Instance.getPlayerListView();
    return {
        list:players
    };
});

//todo 注册获取玩家列表API

server.on("connection", (connection:Connection)=>{
    console.log("New connection established, server size:", server.ConnectionSet.size);
});

server.on("disconnection", (connection:Connection)=>{
    console.log("Connection closed, server size", server.ConnectionSet.size);
    if(connection.playerID){
        console.log("remove player", connection.playerID);
        //玩家退出的时候同步列表
        PlayerManager.Instance.syncPlayers();
        PlayerManager.Instance.removePlayer(connection.playerID);
    }
})


server.start()
.then(()=>{
    console.log("Server started");

}).catch((e)=>{
    console.log("Server start error:", e);
});



// const wss = new WebSocketServer({ port: NetPort });

// let inputs:any[] = []

// wss.on("connection", (socket) => {
//   socket.on("message", (buffer) => {
//     const str = buffer.toString();
//     try{
//       const msg = JSON.parse(str);
//       const {head, data} = msg;
//       const {frameID, input} = data;
//       inputs.push(input);
//     }
//     catch(e){
//       console.log("ws onmessage error:", e);
//     }
//   });

//   setInterval(()=>{
//       const temp = inputs;
//       inputs = [];
//       const msg = {
//         head:ApiMsgEnum.MsgServerSync,
//         data:{
//           inputs:temp,
//         }
//       };
//       socket.send(JSON.stringify(msg));
//   })

// });

// wss.on("listening", () => {
//     console.log("Server listening");
// });
