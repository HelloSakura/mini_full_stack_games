/**
* @author Lucida
* @description: 武器控制
* @date: 2025/03/10
*/

import { _decorator, Component, Animation, Node, UITransform, Vec2} from "cc";
import { DataManager } from "../../Global/DataManager";
import { IActor, InputTypeEnum } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { EntityStateEnum, EventEnum } from "../../Enum/Enum";
import { WeaponStateMachine } from "./WeaponStateMachine";
import { EventManager } from "../../Global/EventManager";

const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends EntityManager{
    private _body:Node;
    private _anchor:Node;
    private _point:Node;        //子弹射出的节点
    private _owner:number
    init(data:IActor){
        this._body = this.node.getChildByName('Body');  //getChildByName只会根据
        this._anchor = this._body.getChildByName("Anchor");
        this._point = this._anchor.getChildByName("Point");
        this._owner = data.id;

        this._fsm = this._body.addComponent(WeaponStateMachine);
        this._fsm.init(data.weaponType);      //初始化状态机
        this.State = EntityStateEnum.Idle;     //设置初始状态为Idle状态


        
    }

    onLoad(){
        //onLoad里面保证事件只注册一次
        EventManager.Instance.on(EventEnum.WeaponShoot, this._handleWeaponShoot, this);
        EventManager.Instance.on(EventEnum.BulletBorn, this._handleBulletBorn, this);
    }

    onDestroy(){
        EventManager.Instance.off(EventEnum.WeaponShoot, this._handleWeaponShoot, this);
        EventManager.Instance.off(EventEnum.BulletBorn, this._handleBulletBorn, this);
    }


    private _handleWeaponShoot(){
        //判断是否是自己
        if(this._owner !== DataManager.Instance.SelfPlayerID) return;

        //世界坐标转舞台坐标
        const pointWorldPos = this._point.getWorldPosition();
        const pointStagePos = DataManager.Instance.Stage.getComponent(UITransform).convertToNodeSpaceAR(pointWorldPos);
        //计算方向
        const anchorWorldPos = this._anchor.getWorldPosition();
        const direction = new Vec2(pointWorldPos.x - anchorWorldPos.x, pointWorldPos.y - anchorWorldPos.y).normalize();
        //每次接受射击事件，在当前位置生成了新的bullet Data
        DataManager.Instance.applyInput({
            owner:this._owner,
            type:InputTypeEnum.WeaponShoot,
            position:{
                x:pointStagePos.x,
                y:pointStagePos.y
            },
            direction:{
                x:direction.x,
                y:direction.y
            }
        });

        //console.log(DataManager.Instance.State.bullets);
    }


    //处理子弹生成事件
    private _handleBulletBorn(owner:number){
        if(owner !== this._owner) return;
        this.State = EntityStateEnum.Attack;
    }
}
