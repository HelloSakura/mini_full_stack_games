/**
* @author Lucida
* @description: 角色控制
* @date: 2025/02/21
*/

import { _decorator, Component, Animation, instantiate} from "cc";
import { DataManager } from "../../Global/DataManager";
import { EntityTypeEnum, IActor, InputTypeEnum } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { ActorStateMachine } from "./ActorStateMachine";
import { EntityStateEnum } from "../../Enum/Enum";
import { WeaponManager } from "../Weapon/WeaponManager";
import { rad2Angle } from "../../Utils/Utils";

const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager{
    private _weaponManager:WeaponManager;
    private _bulletType:EntityTypeEnum;
    init(data:IActor){
        this._fsm = this.node.addComponent(ActorStateMachine);
        this._fsm.init(data.type);      //初始化状态机
        this.State = EntityStateEnum.Idle;     //设置初始状态为Idle状态

        //根据预设，生成武器并初始化
        const prefab = DataManager.Instance.PrefabMap.get(EntityTypeEnum.Weapon1);
        const weapon = instantiate(prefab);
        weapon.setParent(this.node);
        this._weaponManager = weapon.addComponent(WeaponManager);
        this._weaponManager.init(data);

        //设置对应的子弹类型
        this._bulletType = data.bulletType;
    }

    public get BulletType():EntityTypeEnum{
        return this._bulletType;
    }

    public set BulletType(type:EntityTypeEnum){
        this._bulletType = type;
    }

    tick(dt:number){
        //没有用事件，而是根据摇杆的标量来判断是否有移动
        if(DataManager.Instance.JoystickManager.input.length() > 0){
            const {x, y} = DataManager.Instance.JoystickManager.input
            //摇杆在移动
            DataManager.Instance.applyInput({
                id:1,
                type:InputTypeEnum.ActorMove,
                direction:{x,y},
                dt:dt
            })
            //console.log(DataManager.Instance.State.actors[0].position.x, DataManager.Instance.State.actors[0].position.y);
            this.State = EntityStateEnum.Run;
        }
        else{
            this.State = EntityStateEnum.Idle;
        }
    }

    render(data:IActor){
        const {direction, position} = data;
        this.node.setPosition(position.x, position.y);
        if(direction.x !== 0){
            this.node.setScale(direction.x > 0 ? 1:-1, 1)
        }

        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const rad = Math.asin(direction.y / side);
        const angle = rad2Angle(rad);

        this._weaponManager.node.setRotationFromEuler(0, 0, angle);
    }
}
