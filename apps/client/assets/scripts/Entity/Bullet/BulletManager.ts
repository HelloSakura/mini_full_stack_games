/**
* @author Lucida
* @description: 子弹控制
* @date: 2025/03/10
*/

import { _decorator} from "cc";
import { EntityTypeEnum, IBullet } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { BulletStateMachine } from "./BulletStateMachine";
import { EntityStateEnum } from "../../Enum/Enum";
import { rad2Angle } from "../../Utils/Utils";

const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager{
    private _type:EntityTypeEnum;

    init(data:IBullet){
        this._type = data.bulleType;
        this._fsm = this.node.addComponent(BulletStateMachine);
        this._fsm.init(data.bulleType);
        this.State = EntityStateEnum.Idle;
        
        //子弹初始化不显示，避免渲染出来的第一帧出现屏闪的问题
        this.node.active = false;
    }


    render(data:IBullet){
        this.node.active = true;
        const {position, direction} = data;
        this.node.setPosition(position.x, position.y);

        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const angle = direction.x > 0 ? rad2Angle(Math.asin(direction.y / side)) : rad2Angle(Math.PI - Math.asin(direction.y / side));

        this.node.setRotationFromEuler(0, 0, angle);
    }
}
