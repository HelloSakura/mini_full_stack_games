/**
* @author Lucida
* @description: room场景管理
* @date: 2025/04/06
*/

import { _decorator, Button, Component, director, instantiate, Node, Prefab } from "cc";
import { ApiMsgEnum, IMsgGameStart, IMsgRoomSync, IPlayer } from "../Common";
import { DataManager } from "../Global/DataManager";
import { NetWorkManager } from "../Global/NetWorkManager";
import { PlayerManager } from "../UI/PlayerManager";
import { SceneEnum } from "../Enum/Enum";
import { deepClone } from "../Utils/Utils";

const {ccclass, property} = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component{
    @property(Node)
    private playerContainer:Node;
    @property(Prefab)
    private playerPrefab:Prefab;
    @property(Button)
    private leaveBtn:Button;
    @property(Button)
    private startBtn:Button;

    onLoad(){
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomSync, this._handleRoomSync, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this._handleGameStart, this);
        this.leaveBtn.node.on(Button.EventType.CLICK, this._onLeaveBtnClicked$$, this);
        this.startBtn.node.on(Button.EventType.CLICK, this._onStartBtnClicked$$, this);
    }

    onDestroy(){
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgRoomSync, this._handleRoomSync, this);
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgGameStart, this._handleGameStart, this);
    }

    start(){
        this.renderPlayer(DataManager.Instance.Room?.playerList);
    }



    public renderPlayer(list:IPlayer[]){
        if(!this.playerContainer || !this.playerPrefab) return;
        console.log("hall render player list", list);
        for(const child of this.playerContainer.children){
            child.active = false;
        }

        while(!this.playerContainer.children || this.playerContainer.children.length < list.length){
            let node = instantiate(this.playerPrefab);
            node.setParent(this.playerContainer);
            node.active = false;
        }

        for(let i = 0; i < list.length; i++){
            const player = list[i];
            const node = this.playerContainer.children[i];
            node.active = true;
            const component = node.getComponent(PlayerManager);
            component.setData(player)
        }
    }


    private _handleRoomSync({room}:IMsgRoomSync){
        if(!room) return;
        this.renderPlayer(room.playerList);
    }


    private async _onLeaveBtnClicked$$(){
        let {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomLeave, {});
        if(!success){
            console.log("Leave room error:", error);
            return;
        }
        //置空Room信息
        DataManager.Instance.Room = null;
        director.loadScene(SceneEnum.Hall);
    }

    private async _onStartBtnClicked$$(){
        //某玩家点击开始游戏
        let {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiGameStart, {});
        if(!success){
            console.log("Start game error:", error);
            return;
        }
    }

    private _handleGameStart({state}:IMsgGameStart){
        if(!state){
            console.log("Start game error with null state");
            return;
        }
        DataManager.Instance.State = state;
        DataManager.Instance.LastState = deepClone(state);
        console.log("Start game success", state);

        director.loadScene(SceneEnum.Battle);
    }
}

