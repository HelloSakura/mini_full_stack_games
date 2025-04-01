/**
* @author Lucida
* @description: message协议约定
* @date: 2025/03/24
*/

import { IPlayer } from "./Api";
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
    list:IPlayer[]
}