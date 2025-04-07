/**
* @author Lucida
* @description: 房间管理
* @date: 2025/04/06
*/

import { _decorator, Button, Component, Label } from "cc";
import { IPlayer, IRoom } from "../Common";
import { EventManager } from "../Global/EventManager";
import { EventEnum } from "../Enum/Enum";

const {ccclass, property} = _decorator;
@ccclass('RoomManager')
export class RoomManager extends Component{
    
    @property(Label)
    private nameLabel:Label;
    @property(Button)
    private joinBtn:Button;

    private _data:IRoom;

    onLoad(){
        this.joinBtn.node.on(Button.EventType.CLICK, this._handleBtnClicked, this);
    }

    onDestroy(){
        this.joinBtn.node.off(Button.EventType.CLICK, this._handleBtnClicked, this);
    }


    public setData(data:IRoom){
        if(!data) return;
        this._data = data;
        this._setName(this._getRoomStr(data));
    }


    private _setName(str:string){
        if(!str) return;
        this.nameLabel.string = str;
    }

    private _getRoomStr(data:IRoom):string{
        if(!data) return '';
        return `roomID:${data.roomID}, player size:${data.playerList?.length}`;
    }

    private _handleBtnClicked(){
        if(!this._data) return;
        EventManager.Instance.emit(EventEnum.RoomJoin, this._data.roomID);
    }

}