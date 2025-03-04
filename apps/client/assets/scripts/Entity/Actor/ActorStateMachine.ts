/**
* @author Lucida
* @description: 角色状态机
* @date: 2025/03/03
*/

import { _decorator, Node, Animation, AnimationClip} from "cc";
import { StateTypeEnum } from "../../Common/Common";
import { EntityStateEnum, ParamsNameEnum } from "../../Enum/Enum";
import { EntityTypeEnum } from "../../Common";
import { State } from "../../base/State";
import { StateMachine, getInitParamsTrigger } from "../../base/StateMachine";


const {ccclass, property} = _decorator
export class ActorStateMachine extends StateMachine{

    public init(type:EntityTypeEnum){
        this._type = type;
        this._animation = this.node.addComponent(Animation);
        this._initParams();
        this._initStateMachines();
        this._initAnimationEvent();
    }


    private _initParams(){
        this._params.set(ParamsNameEnum.Idle, getInitParamsTrigger());
        this._params.set(ParamsNameEnum.Run, getInitParamsTrigger());
    }

    private _initStateMachines(){
        this._stateMachines.set(ParamsNameEnum.Idle, new State(this, `${this._type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Loop));
        this._stateMachines.set(ParamsNameEnum.Run, new State(this, `${this._type}${EntityStateEnum.Run}`, AnimationClip.WrapMode.Loop));
    }

    private _initAnimationEvent(){

    }

    
    public run(){

    }

}