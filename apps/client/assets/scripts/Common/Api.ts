/**
* @author Lucida
* @description: Api协议约定
* @date: 2025/03/24
*/

interface IPlayer{
    playerID:number,
    name:string,
    roomID:number
}

export interface IMsgPlayerJoinReq{
    name:string
}

export interface IMsgPlayerJoinRsp{
    player:IPlayer
}