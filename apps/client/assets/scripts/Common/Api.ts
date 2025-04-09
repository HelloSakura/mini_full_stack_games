/**
* @author Lucida
* @description: Api协议约定，每一个req接口代表一个业务
* @date: 2025/03/24
*/

export interface IPlayer{
    playerID:number,
    name:string,
    roomID:number
}

export interface IRoom{
    roomID:number,
    playerList:IPlayer[],
}

//玩家加入
export interface IApiPlayerJoinReq{
    name:string
}

export interface IApiPlayerJoinRsp{
    player:IPlayer
}

//玩家列表
export interface IApiPlayerListReq{

}

export interface IApiPlayerListRsp{
    playerList:IPlayer[]
}


//创建新房间
export interface IApiRoomCreateReq{

}

export interface IApiRoomCreateRsp{
    room:IRoom
}

//房间列表
export interface IApiRoomListReq{
}

export interface IApiRoomListRsp{
    roomList:IRoom[]
}

//加入房间
export interface IApiRoomJoinReq{
    roomID:number
}

export interface IApiRoomJoinRsp{
    room:IRoom
}

//离开房间
export interface IApiRoomLeaveReq{
}

export interface IApiRoomLeaveRsp{
}

//开始游戏
export interface IApiGameStartReq{
}


export interface IApiGameStartRsp{
}


