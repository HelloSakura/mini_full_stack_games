/**
* @author Lucida
* @description: room场景管理
* @date: 2025/04/06
*/

import { _decorator, Button, Component, director, instantiate, Node, Prefab } from "cc";
import { ApiMsgEnum, IMsgRoomSync, IPlayer } from "../Common";
import { DataManager } from "../Global/DataManager";
import { NetWorkManager } from "../Global/NetWorkManager";
import { PlayerManager } from "../UI/PlayerManager";
import { SceneEnum } from "../Enum/Enum";

const {ccclass, property} = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component{
    @property(Node)
    private playerContainer:Node;
    @property(Prefab)
    private playerPrefab:Prefab;
    @property(Button)
    private leaveBtn:Button;

    onLoad(){
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomSync, this._handleRoomSync, this);
        this.leaveBtn.node.on(Button.EventType.CLICK, this._handleBtnClicked$$, this);
    }

    onDestroy(){
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgRoomSync, this._handleRoomSync, this);
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


    private async _handleBtnClicked$$(){
        let {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomLeave, {});
        if(!success){
            console.log("Leave room error:", error);
            return;
        }
        //置空Room信息
        DataManager.Instance.Room = null;
        director.loadScene(SceneEnum.Hall);
    }
}

