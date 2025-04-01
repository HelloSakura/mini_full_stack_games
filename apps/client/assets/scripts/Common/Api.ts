/**
* @author Lucida
* @description: Api协议约定
* @date: 2025/03/24
*/

export interface IPlayer{
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

export interface IMsgPlayerListReq{

}

export interface IMsgPlayerListRsp{
    list:Array<IPlayer>
}