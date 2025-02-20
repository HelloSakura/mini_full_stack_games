/**
* @author Lucida
* @description: 战场管理器，负责管理战场中每个单位
* @date: 2025/02/21
*/

import { _decorator, Component, Node} from "cc";
import { DataManager } from "../Global/DataManager";
import { JoystickManager } from "../UI/JoystickManager";

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component{
    private _stage:Node;
    private _UI:Node;    

    onLoad(){
        this._stage = this.node.getChildByName("Stage");
        this._UI = this.node.getChildByName("UI");
        DataManager.Instance.JoystickManager = this._UI.getComponentInChildren(JoystickManager);
    }
}
