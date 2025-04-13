/**
* @author Lucida
* @description: 角色控制
* @date: 2025/02/21
*/

import { _decorator, Component, Animation, instantiate, ProgressBar, IVec2, Vec3, Tween, tween} from "cc";
import { DataManager } from "../../Global/DataManager";
import { EntityTypeEnum, IActor, InputTypeEnum, toFixed } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { ActorStateMachine } from "./ActorStateMachine";
import { EntityStateEnum, EventEnum } from "../../Enum/Enum";
import { WeaponManager } from "../Weapon/WeaponManager";
import { rad2Angle } from "../../Utils/Utils";
import { EventManager } from "../../Global/EventManager";

const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager{
    private _actorID:number;
    private _weaponManager:WeaponManager;
    private _bulletType:EntityTypeEnum;
    private _hpProgress:ProgressBar;
    private _targetPos:Vec3;
    private _tween:Tween<unknown>;

    init(data:IActor){
        this._actorID = data.id;
        this._fsm = this.node.addComponent(ActorStateMachine);
        this._hpProgress = this.node.getComponentInChildren(ProgressBar);
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

        //设置节点为false，解决人物刚开始初始化时候的闪烁问题
        this.node.active = false;
        this._targetPos = undefined;
    }

    public get BulletType():EntityTypeEnum{
        return this._bulletType;
    }

    public set BulletType(type:EntityTypeEnum){
        this._bulletType = type;
    }

    tick(dt:number){
        //根据playerID决定渲染
        if(this._actorID !== DataManager.Instance.SelfPlayerID) return;

        //没有用事件，而是根据摇杆的标量来判断是否有移动
        if(DataManager.Instance.JoystickManager.input.length() > 0){
            const {x, y} = DataManager.Instance.JoystickManager.input
            //摇杆在移动，通过事件传送
            EventManager.Instance.emit(EventEnum.ClientSync, {
                    id:DataManager.Instance.SelfPlayerID,
                    type:InputTypeEnum.ActorMove,
                    direction:{
                        x:toFixed(x),
                        y:toFixed(y)
                    },
                    dt:toFixed(dt)
                }
            );            
        }

    }

    render(data:IActor){
        this._renderPosition(data);
        this._renderDirection(data);
        this._renderHP(data);
    }

    private _renderPosition(data:IActor){
        const {position} = data;
        const newPos = new Vec3(position.x, position.y);
        
        if(!this._targetPos){
            //目标位置不存在直接赋值
            this.node.active = true;
            this.node.setPosition(position.x, position.y);
            this._targetPos = new Vec3(newPos);
        }
        else if(!this._targetPos.equals(newPos)){    //保证下面代码段每100ms执行一次，避免每帧刷新
            //停止上一次缓动
            this._tween?.stop();
            //将当前节点位置设置为上一次位置
            this.node.setPosition(this._targetPos);
            this._targetPos = newPos;   //设置目标位置为最新位置
            this.State = EntityStateEnum.Run;
            this._tween = tween(this.node)
            .to(0.1, {position:this._targetPos})
            .call(()=>{
                this.State = EntityStateEnum.Idle;
            })
            .start();
        }

        
    }

    private _renderDirection(data:IActor){
        const {direction} = data;
        if(direction.x !== 0){
            this.node.setScale(direction.x > 0 ? 1:-1, 1);
        }
        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const rad = Math.asin(direction.y / side);
        const angle = rad2Angle(rad);

        this._weaponManager.node.setRotationFromEuler(0, 0, angle);
    }

    private _renderHP(data:IActor){
        const {direction} = data;
        if(direction.x !== 0){
            this._hpProgress.node.setScale(direction.x > 0 ? 1:-1, 1);  //保证血条始终从左开始
        }
        this._hpProgress.progress= data.hp / this._hpProgress.totalLength;
    }
}
