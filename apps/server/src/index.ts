/**
* @author Lucida
* @description: 服务器主脚本
* @date: 2025/04/01
*/

import { PlayerManager } from "./Business/PlayerManager";
import { RoomManager } from "./Business/RoomManager";
import { ApiMsgEnum, IApiGameStartReq, IApiGameStartRsp, IApiPlayerJoinReq, IApiPlayerJoinRsp, IApiPlayerListReq, IApiPlayerListRsp, IApiRoomCreateReq, IApiRoomCreateRsp, IApiRoomJoinReq, IApiRoomJoinRsp, IApiRoomLeaveReq, IApiRoomLeaveRsp, IApiRoomListReq, IApiRoomListRsp, NetPort } from "./Common";
import { Connection, GameServer } from "./Core";
 import { symlinkCommon } from "./Utils";

 symlinkCommon();

declare module "./Core"{
    interface Connection{
        playerID:number;
    }
}

const server = new GameServer(NetPort);
//玩家登录
server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection:Connection, data:IApiPlayerJoinReq):IApiPlayerJoinRsp=>{
    const {name} = data;
    const player = PlayerManager.Instance.createPlayer({name, connection});
    connection.playerID = player.PlayerID;
    console.log('set api ret');
    //玩家登录的时候同步列表
    PlayerManager.Instance.syncPlayers();
    RoomManager.Instance.syncRooms();
    return {
        player:PlayerManager.Instance.getPlayerView(player)
    };
});

//玩家列表刷新
server.setApi(ApiMsgEnum.ApiPlayerList, (connection:Connection, data:IApiPlayerListReq):IApiPlayerListRsp=>{
    const players = PlayerManager.Instance.getPlayerListView();
    return {
        playerList:players
    };
});

//玩家创建房间
server.setApi(ApiMsgEnum.ApiRoomCreate, (connection:Connection, data:IApiRoomCreateReq):IApiRoomCreateRsp=>{
    //判断连接是否存在
    if(!connection.playerID){
        throw new Error("ApiRoomCreate: connection not found");
    }

    const newRoom = RoomManager.Instance.createRoom();
    const room = RoomManager.Instance.joinRoom(newRoom.RoomID, connection.playerID);
    if(!room){
        throw new Error("ApiRoomCreate: Room not exists");
    }
    PlayerManager.Instance.syncPlayers();
    RoomManager.Instance.syncRooms();
    return {
        room:RoomManager.Instance.getRoomView(room)
    };
});

//获取房间列表
server.setApi(ApiMsgEnum.ApiRoomList, (connection:Connection, data:IApiRoomListReq):IApiRoomListRsp=>{
    return {
        roomList:RoomManager.Instance.getRoomListView()
    };
});


//玩家加入房间
server.setApi(ApiMsgEnum.ApiRoomJoin, (connection:Connection, data:IApiRoomJoinReq):IApiRoomJoinRsp=>{
    if(!connection.playerID){
        throw new Error("ApiRoomJoin: connection not found");
    }

    const {roomID} = data;
    const room = RoomManager.Instance.joinRoom(roomID, connection.playerID);
    if(!room){
        throw new Error("ApiRoomJoin: Room not exists");
    }
    PlayerManager.Instance.syncPlayers();
    RoomManager.Instance.syncRooms();
    RoomManager.Instance.syncRoom(roomID);
    return {
        room:RoomManager.Instance.getRoomView(room)
    };
})

//玩家离开房间
server.setApi(ApiMsgEnum.ApiRoomLeave, (connection:Connection, data:IApiRoomLeaveReq):IApiRoomLeaveRsp=>{
    if(!connection.playerID){
        throw new Error("ApiRoomLeave: connection not found");
    }
    
    const playerID = connection.playerID;
    const player = PlayerManager.Instance.PlayerMap.get(playerID);
    if(!player){
        throw new Error(`ApiRoomLeave: player ${playerID} not exists`);
    }

    let roomID = player.RoomID;
    if(!roomID){
        throw new Error(`ApiRoomLeave: player ${playerID} not in room`);
    }

    RoomManager.Instance.leaveRoom(roomID, playerID);
    PlayerManager.Instance.syncPlayers();
    RoomManager.Instance.syncRooms();
    RoomManager.Instance.syncRoom(roomID);
    return {};
})

server.setApi(ApiMsgEnum.ApiGameStart, (connection:Connection, data:IApiGameStartReq):IApiGameStartRsp=>{
    if(!connection.playerID){
        throw new Error("ApiGameStart: connection not found");
    }
    const player = PlayerManager.Instance.PlayerMap.get(connection.playerID);
    if(!player){
        throw new Error(`ApiGameStart: player ${connection.playerID} not exists`);
    }
    RoomManager.Instance.startRoom(player.RoomID);
    return {};
})


server.on("connection", (connection:Connection)=>{
    console.log("New connection established, server size:", server.ConnectionSet.size);
});

server.on("disconnection", (connection:Connection)=>{
    console.log("Connection closed, server size", server.ConnectionSet.size);
    if(connection.playerID){
        console.log("remove player", connection.playerID);
        PlayerManager.Instance.removePlayer(connection.playerID);
    }
    //玩家退出的时候同步列表
    PlayerManager.Instance.syncPlayers();
})

server.start()
.then(()=>{
    console.log("Server started");

}).catch((e)=>{
    console.log("Server start error:", e);
});
