/**
* @author Lucida
* @description: 玩家管理，分配id，记录玩家信息
* @date: 2025/03/24
*/

import { Singleton } from "../Base/Singleton";
import { ApiMsgEnum, IApiPlayerJoinReq, IPlayer, IMsgPlayerList } from "../Common";
import { Connection } from "../Core";
import { Player } from "./Player";
export class PlayerManager extends Singleton<PlayerManager>() {
    private _nextPlayID:number = 1;
    private _playerSet:Set<Player> = new Set();
    private _playerMap:Map<number, Player> = new Map();

    createPlayer({name, connection}:IApiPlayerJoinReq & {connection:Connection}){
        const player = new Player(this._nextPlayID++, name, connection);
        this._playerSet.add(player);
        this._playerMap.set(player.PlayerID, player);
        return player;
    }

    public get PlayerSet():Set<Player>{
        return this._playerSet;
    }
    public get PlayerMap():Map<number, Player>{
        return this._playerMap;
    }

    removePlayer(pid:number){
        const player = this._playerMap.get(pid);
        if(player){
            this._playerSet.delete(player);
            this._playerMap.delete(pid);
        }
    }

    //todo 同步玩家信息
    syncPlayers(){
        for(const player of this._playerSet){
            player.Connection.sendMsg(ApiMsgEnum.MsgPlayerList, {playerList:this.getPlayerListView()});
        }
    }

    getPlayerListView():IPlayer[]{
        return Array.from(this._playerSet).map(player=>this.getPlayerView(player));
    }

    getPlayerListViewBySet(playerSet:Set<Player>):IPlayer[]{
        return Array.from(playerSet).map(player=>this.getPlayerView(player));
    }

    getPlayerView(player:Player):IPlayer{
        return {
            playerID:player.PlayerID,
            name:player.Name,
            roomID:player.RoomID
        }
    }
}
