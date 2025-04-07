/**
* @author Lucida
* @description: 房间
* @date: 2025/04/06
*/

import { ApiMsgEnum } from "../Common";
import { Player } from "./Player";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";

export class Room{
    private _rid:number;
    private _playerSet:Set<Player> = new Set();

    constructor(rid:number){
        this._rid = rid;

    }

    public get RoomID(){
        return this._rid;
    }

    public get PlayerSet(){
        return this._playerSet;
    }

    public get Size(){
        return this._playerSet.size;
    }

    /**
     * 加入房间
     * @param uid user id 
     */
    public join(uid:number){
        const player = PlayerManager.Instance.PlayerMap.get(uid);
        if(!player){
            console.log(`join room failed, No player ${uid} found`);
            return;
        }
        player.RoomID = this._rid;
        this._playerSet.add(player);
    }

    /**
     * 离开房间
     * @param uid user ID
     */
    public leave(uid:number){
        const player = PlayerManager.Instance.PlayerMap.get(uid);
        if(!player){
            console.log(`leave room failed, No player ${uid} found`);
            return;
        }
        player.RoomID = 0;
        this._playerSet.delete(player);

        if(this._playerSet.size === 0){
            RoomManager.Instance.closeRoom(this._rid);
        }
    }

    /**
     * 关闭房间，清除逻辑
     */
    public close(){
        this._playerSet.clear();
    }

    /**
     * 同步房间信息
     */
    public sync(){
        for(const player of this._playerSet){
            player.Connection.sendMsg(ApiMsgEnum.MsgRoomSync, {room:RoomManager.Instance.getRoomView(this)});
        }
    }
}
