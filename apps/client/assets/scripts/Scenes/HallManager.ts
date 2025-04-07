/**
* @author Lucida
* @description: 大厅场景
* @date: 2025/03/31
*/

import { _decorator, Button, Component, director, instantiate, Node, Prefab } from "cc";
import { ApiMsgEnum, IApiPlayerListRsp, IApiRoomListRsp, IMsgPlayerList, IMsgRoomList, IPlayer } from "../Common";
import { PlayerManager } from "../UI/PlayerManager";
import { NetWorkManager } from "../Global/NetWorkManager";
import { RoomManager } from "../UI/RoomManager";
import { DataManager } from "../Global/DataManager";
import { EventEnum, SceneEnum } from "../Enum/Enum";
import { EventManager } from "../Global/EventManager";

type PlayerList = IApiPlayerListRsp | IMsgPlayerList;
type RoomList = IApiRoomListRsp | IMsgRoomList;

const {property,ccclass} = _decorator

@ccclass('HallManger')
export class HallManger extends Component{
    @property(Node)
    private playerContainer:Node;
    @property(Prefab)
    private playerPrefab:Prefab;
    @property(Node)
    private roomContainer:Node;
    @property(Prefab)
    private roomPrefab:Prefab;
    @property(Button)
    private createRoomBtn:Button;

    onLoad(){
        this.createRoomBtn.node.on(Button.EventType.CLICK, this._onCreateRoomBtnClicked, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this);
        EventManager.Instance.on(EventEnum.RoomJoin, this._handleRoomJoin, this);
    }

    
    onDestroy(){
        //Button作为子节点运行到这里的时候已经被销毁了
        //this.createRoomBtn.node.off(Button.EventType.CLICK, this._onCreateRoomBtnClicked, this);
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgRoomList, this.renderRoom, this);
        EventManager.Instance.off(EventEnum.RoomJoin, this._handleRoomJoin, this);
    }

    start(){
        this.playerContainer.removeAllChildren();
        this.getPlayers();
        this.roomContainer.removeAllChildren(); 
        this.getRooms();
    }

    async getPlayers(){
        //获取玩家列表
        const {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiPlayerList, {});
        if(!success){
            console.log("Get player list error:", error);
            return;
        }
        this.renderPlayer(data);
    }

    async getRooms(){
        const {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomList, {});
        if(!success){
            console.log("Get player list error:", error);
            return;
        }
        this.renderRoom(data);
    }

    public renderPlayer({playerList: list}:IApiPlayerListRsp | IMsgPlayerList){
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

    public renderRoom({roomList: list}:IApiRoomListRsp | IMsgRoomList){
        if(!this.roomContainer || !this.roomPrefab) return;
        console.log("hall render room list", list);
        for(const child of this.roomContainer.children){
            child.active = false;
        }

        while(!this.roomContainer.children || this.roomContainer.children.length < list.length){
            let node = instantiate(this.roomPrefab);
            node.setParent(this.roomContainer);
            node.active = false;
        }

        for(let i = 0; i < list.length; i++){
            const room = list[i];
            const node = this.roomContainer.children[i];
            node.active = true;
            const component = node.getComponent(RoomManager);
            component.setData(room)
        }
    }

    //处理创建房间按钮点击
    private async _onCreateRoomBtnClicked(){
        const {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomCreate, {});
        if(!success){
            console.log("Create room error:", error);
            return;
        }
        const {room} = data;
        console.log("Create room success ret:", room)
        DataManager.Instance.Room = room;
        //会刷两次list，由Create带来的list只包含一个id，导致显示问题
        //this.renderRoom({roomList:[room]});
        director.loadScene(SceneEnum.Room);
    }

    //处理房间加入
    private async _handleRoomJoin(rid:number){
        const {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiRoomJoin, {roomID:rid});
        if(!success){
            console.log("Join room error:", error);
            return;
        }
        //加入房间
        DataManager.Instance.Room = data.room;
        director.loadScene(SceneEnum.Room);
    }
}
