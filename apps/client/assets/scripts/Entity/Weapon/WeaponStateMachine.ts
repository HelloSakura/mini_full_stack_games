/**
* @author Lucida
* @description: 武器状态机
* @date: 2025/03/10
*/

import { _decorator, Node, Animation, AnimationClip} from "cc";
import { StateTypeEnum } from "../../Common/Common";
import { EntityStateEnum, ParamsNameEnum } from "../../Enum/Enum";
import { EntityTypeEnum } from "../../Common";
import { State } from "../../Base/State";
import { StateMachine, getInitParamsTrigger } from "../../Base/StateMachine";

const {ccclass, property} = _decorator
export class WeaponStateMachine extends StateMachine{

    public init(type:EntityTypeEnum){
        this._type = type;
        this._animComponent = this.node.addComponent(Animation);
        this._initParams();
        this._initStateMachines();
        this._initAnimationEvent();
    }


    private _initParams(){
        this._params.set(ParamsNameEnum.Idle, getInitParamsTrigger());
        this._params.set(ParamsNameEnum.Attack, getInitParamsTrigger());
    }

    private _initStateMachines(){
        this._stateMachines.set(ParamsNameEnum.Idle, new State(this, `${this._type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Loop));
        this._stateMachines.set(ParamsNameEnum.Attack, new State(this, `${this._type}${EntityStateEnum.Attack}`, AnimationClip.WrapMode.Loop));
    }

    private _initAnimationEvent(){

    }

    
    public run(){
        switch(this._curState){
            case this._stateMachines.get(ParamsNameEnum.Idle):
            case this._stateMachines.get(ParamsNameEnum.Attack):
                if(this._params.get(ParamsNameEnum.Attack).value){
                    this.CurrentState = this._stateMachines.get(ParamsNameEnum.Attack);
                }
                else if(this._params.get(ParamsNameEnum.Idle).value){
                    this.CurrentState = this._stateMachines.get(ParamsNameEnum.Idle);
                }
                else{
                    this.CurrentState = this._curState;
                }
                break
            default:
                this.CurrentState = this._stateMachines.get(ParamsNameEnum.Idle);
                break;
        }
    }

}