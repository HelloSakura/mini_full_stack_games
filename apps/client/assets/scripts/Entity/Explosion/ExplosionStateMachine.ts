/**
* @author Lucida
* @description: 爆炸状态机
* @date: 2025/03/12
*/

import { _decorator, Node, Animation, AnimationClip} from "cc";
import { StateTypeEnum } from "../../Common/Common";
import { EntityStateEnum, ParamsNameEnum } from "../../Enum/Enum";
import { EntityTypeEnum } from "../../Common";
import { State } from "../../Base/State";
import { StateMachine, getInitParamsTrigger } from "../../Base/StateMachine";
import { ObjectPoolManager } from "../../Global/ObjectPoolManager";

const {ccclass, property} = _decorator
export class ExplosionStateMachine extends StateMachine{

    public init(type:EntityTypeEnum){
        this._type = type;
        this._animComponent = this.node.getComponent(Animation) || this.node.addComponent(Animation);
        this._initParams();
        this._initStateMachines();
        this._initAnimationEvent();
    }


    private _initParams(){
        this._params.set(ParamsNameEnum.Idle, getInitParamsTrigger());
    }

    private _initStateMachines(){
        this._stateMachines.set(ParamsNameEnum.Idle, new State(this, `${this._type}${EntityStateEnum.Idle}`, AnimationClip.WrapMode.Normal));
    }

    private _initAnimationEvent(){
        //动画播放完毕将节点返回到对象池
        this._animComponent.on(Animation.EventType.FINISHED, ()=>{
            ObjectPoolManager.Instance.ret(this.node);
        });
    }

    
    public run(){
        switch(this._curState){
            case this._stateMachines.get(ParamsNameEnum.Idle):
                if(this._params.get(ParamsNameEnum.Idle).value){
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