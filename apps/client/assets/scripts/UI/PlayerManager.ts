/**
* @author Lucida
* @description: player UI 组件
* @date: 2025/04/01
*/

import { _decorator, Component, Label } from 'cc';
import { IPlayer } from '../Common';

const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
    
    @property(Label)
    private nameLabel:Label;

    private _data:IPlayer;

    public setData(data:IPlayer){
        if(!data) return;
        this._data = data;
        this._setName(data.name);
    }


    private _setName(str:string){
        if(!str) return;
        this.nameLabel.string = str;
    }
}