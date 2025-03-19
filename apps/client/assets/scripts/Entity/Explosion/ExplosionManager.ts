/**
* @author Lucida
* @description: 子弹控制
* @date: 2025/03/10
*/

import { _decorator, instantiate, IVec2} from "cc";
import { EntityTypeEnum, IBullet, IExplosion } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { EntityStateEnum, EventEnum } from "../../Enum/Enum";
import { rad2Angle } from "../../Utils/Utils";
import { EventManager } from "../../Global/EventManager";
import { DataManager } from "../../Global/DataManager";
import { ExplosionStateMachine } from "./ExplosionStateMachine";

const { ccclass, property } = _decorator;

@ccclass('ExplosionManager')
export class ExplosionManager extends EntityManager{
    private _type:EntityTypeEnum;

    init(data:IExplosion){
        this._type = data.explosionType;
        this.node.setPosition(data.position.x, data.position.y);

        this._fsm = this.node.getComponent(ExplosionStateMachine) || this.node.addComponent(ExplosionStateMachine);
        this._fsm.init(data.explosionType);
        this.State = EntityStateEnum.Idle;
    }
}
