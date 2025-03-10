/**
* @author Lucida
* @description: 武器控制
* @date: 2025/03/10
*/

import { _decorator, Component, Animation, Node} from "cc";
import { DataManager } from "../../Global/DataManager";
import { IActor, InputTypeEnum } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { EntityStateEnum } from "../../Enum/Enum";
import { WeaponStateMachine } from "./WeaponStateMachine";

const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager{
    private _body:Node;
    private _anchor:Node;
    private _point:Node;        //子弹射出的节点

    init(data:IActor){
        this._body = this.node.getChildByName('Body');
        this._anchor = this.node.getChildByName("Anchor");
        this._point = this.node.getChildByName("Point");

        this._fsm = this._body.addComponent(WeaponStateMachine);
        this._fsm.init(data.type);      //初始化状态机
        this.State = EntityStateEnum.Idle;     //设置初始状态为Idle状态

        
    }
}
