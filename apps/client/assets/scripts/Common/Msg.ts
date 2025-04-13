/**
* @author Lucida
* @description: message协议约定
* @date: 2025/03/24
*/

import { IPlayer, IRoom } from "./Api";
import { IClientInput, IState } from "./State";


export interface IMsgClientSync{
    frameID:number,
    input:IClientInput,
}

export interface IMsgServerSync{
    lastFrameID:number,
    inputs:IClientInput[],
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

export interface IMsgGameStart{
    state:IState
}