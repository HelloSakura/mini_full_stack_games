/**
* @author Lucida
* @description: 房间管理器
* @date: 2025/04/06
*/

import { Singleton } from "../Base/Singleton";
import { ApiMsgEnum, IRoom } from "../Common";
import { PlayerManager } from "./PlayerManager";
import { Room } from "./Room";


export class RoomManager extends Singleton<RoomManager>(){
    //next room id
    private _nextRoomID:number = 1;
    //room set
    private _roomSet:Set<Room> = new Set();
    //room Map
    private _roomMap:Map<number, Room> = new Map();

    //createRoom
    public createRoom():Room{
        let room = new Room(this._nextRoomID++);
        this._roomSet.add(room);
        this._roomMap.set(room.RoomID, room);
        console.log('create room:', room);
        return room;
    }

    /**
     * 
     * @param rid 房间id
     * @param uid 用户id
     */
    public joinRoom(rid:number, uid:number){
        let room = this._roomMap.get(rid);
        if(room){
            room.join(uid);
        }
        return room;
    }

    /**
     * 离开房间
     * @param rid 房间id
     * @param uid 用户id
     */
    public leaveRoom(rid:number, uid:number){
        let room = this._roomMap.get(rid);
        if(room){
            room.leave(uid);
        }
    }

    /**
     * 关闭房间
     */
    public closeRoom(rid:number){
        let room = this._roomMap.get(rid);
        if(room){
            room.close();
            this._roomSet.delete(room);
            this._roomMap.delete(rid);
            console.log('close room:', room);
        }
    }


    public syncRooms(){
        for(const player of PlayerManager.Instance.PlayerSet){
            player.Connection.sendMsg(ApiMsgEnum.MsgRoomList, {roomList:this.getRoomListView()});
        }
    }

    public syncRoom(rid:number){
        const room = this._roomMap.get(rid);
        if(room){
            room.sync();
        }
    }


    public getRoomListView():IRoom[]{
        return Array.from(this._roomSet).map(room=>this.getRoomView(room));
    }

    public getRoomListViewBySet(roomSet:Set<Room>):IRoom[]{
        return Array.from(roomSet).map(room=>this.getRoomView(room));
    }

    /**
     * 解构剔除掉房间中不需要的字段
     * @param room 房间
     */
    public getRoomView(room:Room):IRoom{
        return {
            roomID:room.RoomID,
            playerList: PlayerManager.Instance.getPlayerListViewBySet(room.PlayerSet)
        }
    }

}
