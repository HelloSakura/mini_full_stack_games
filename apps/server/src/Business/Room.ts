/**
* @author Lucida
* @description: 房间
* @date: 2025/04/06
*/

import { ApiMsgEnum, EntityTypeEnum, IClientInput, IMsgClientSync, InputTypeEnum, IState } from "../Common";
import { toFixed } from "../Common/Utils";
import { Connection } from "../Core";
import { Player } from "./Player";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";

export class Room{
    private _rid:number;
    private _playerSet:Set<Player> = new Set();
    private _pendingInput:IClientInput[] = [];
    //@ts-ignore
    private _lastTime:number;   //使用undifine作为初值可以使用??运算符
    //<playerID, frameID>
    private _lastPlayerFrameIdMap:Map<number, number> = new Map();

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

    /**
     * 开始房间内游戏
     */
    public start(){
        const state:IState = {
            actors:[...this._playerSet].map((player, index)=>({
                    id:player.PlayerID,
                    name:player.Name,
                    hp:100,
                    position:{
                        x:50 + index * 50,  //注意一下距离，看不到可能是位置超出了屏幕
                        y:50 + index * 50
                    },
                    direction:{
                        x:1, 
                        y:0
                    },
                    type:EntityTypeEnum.Actor1,
                    weaponType:EntityTypeEnum.Weapon1,
                    bulletType:EntityTypeEnum.Bullet2
            })),
            bullets:[],
            nextBulletID:1,
            seed: 1
        }

        console.log('Game start', state);
        for(const player of this._playerSet){
            player.Connection.sendMsg(ApiMsgEnum.MsgGameStart, {state});
            //监听玩家输入
            player.Connection.listenMsg(ApiMsgEnum.MsgClientSync, this._getClientMsg, this);
        }
        //定时同步帧数据
        const timer1 = setInterval(()=>{
            this._sendClientMsg();
        }, 100);

        const timer2 = setInterval(()=>{
            this._timePast();
        }, 16);
    }

    //暂存客户端输入，
    private _getClientMsg(connection:Connection, {input, frameID}:IMsgClientSync){
        this._pendingInput.push(input);
        this._lastPlayerFrameIdMap.set(connection.playerID, frameID);
        console.log('get client msg:', input, frameID);
    }

    //发送同步的帧数据给客户端
    private _sendClientMsg(){
        const inputs = this._pendingInput;
        this._pendingInput = [];
        //遍历所有玩家，发送同步帧数据
        for(const player of this._playerSet){
            player.Connection.sendMsg(ApiMsgEnum.MsgServerSync, {
                inputs:inputs,
                lastFrameID:this._lastPlayerFrameIdMap.get(player.PlayerID) ?? 0
            });
        }
    }

    //同步时间流速
    private _timePast(){
        const now = process.uptime();
        const dt = now - (this._lastTime ?? now);   //第一帧就是0
        this._pendingInput.push({
            type:InputTypeEnum.TimePast,
            dt:toFixed(dt)
        });
        this._lastTime = now;
    }
}
