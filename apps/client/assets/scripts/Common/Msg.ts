/**
* @author Lucida
* @description: message协议约定
* @date: 2025/03/24
*/

import { IPlayer, IRoom } from "./Api";
import { IClientInput } from "./State";


export interface IMsgClientSync{
    input:IClientInput,
    frameID:number,
}

export interface IMsgServerSync{
    inputs:IClientInput[],
    lastFrameID:number,
}

export interface IMsgPlayerList {
    playerList: IPlayer[];
}

export interface IMsgRoomList {
    roomList:IRoom[]
}

export interface IMsgRoomSync{
    room:IRoom
}