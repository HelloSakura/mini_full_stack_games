/**
* @author Lucida
* @description: 角色控制
* @date: 2025/02/21
*/

import { _decorator, Component} from "cc";
import { DataManager } from "../../Global/DataManager";
import { IActor, InputTypeEnum } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { ActorStateMachine } from "./ActorStateMachine";
import { EntityStateEnum } from "../../Enum/Enum";

const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager{

    init(data:IActor){
        this._fsm = this.node.addComponent(ActorStateMachine);
        this._fsm.init(data.type);      //初始化状态机
        this._state = EntityStateEnum.Idle;     //设置初始状态为Idle状态
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
                dt:10
            })
            console.log(DataManager.Instance.State.actors[0].position.x, DataManager.Instance.State.actors[0].position.y);
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

    }
}
