/**
* @author Lucida
* @description: 有限状态机基类
* @date: 2025/01/14
*/

import { _decorator, Component, Animation } from "cc";
import { FsmParamTypeEnum } from "../Enum/Enum";
import SubStateMachine from "./SubStateMachine";
import { StateTypeEnum } from "../Common/Common";
import { EntityTypeEnum } from "../Common";
import { State } from "./State";

const { ccclass } = _decorator

//状态机状态类型
type ParamsValueType = number | boolean;

//状态机参数接口
export interface IParamsValue {
    type: FsmParamTypeEnum;
    value: ParamsValueType;
}

//触发器函数-获得相应类型的触发器
export const getInitParamsTrigger = () => {
    return {
        type: FsmParamTypeEnum.Trigger,
        value: false
    };
}

export const getInitParamsNumber = () => {
    return {
        type: FsmParamTypeEnum.Number,
        value: 0
    };
}

/**
 * 有限状态机基类
 * 子状态：播放动画
 * 子状态机：套娃执行run方法
 */
@ccclass('StateMachine')
export abstract class StateMachine extends Component{
    //基本参数
    //当前状态
    protected _curState: State | SubStateMachine = null;
    //参数？？
    protected _params: Map<string, IParamsValue> = new Map();
    //??
    protected _stateMachines: Map<string, State | SubStateMachine> = new Map();
    //当前状态动画机
    protected _animation: Animation = null;
    protected _type: EntityTypeEnum = EntityTypeEnum.Init;
    

    /**
     * 获得状态参数
     */
    public getParams(key:string){
        if(this._params.has(key)){
            return this._params.get(key);
        }
    }

    /**
     * 设置状态参数
     */
    public setParams(key:string, value:ParamsValueType){
        //如果保存了这个参数，表示可以进行状态切换
        if(this._params.has(key)){
            this._params.get(key).value = value;
            this.run();
            this.resetTrigger();
        }
    }

    public get Animation():Animation{
        return this._animation;
    }

    public get Type(): EntityTypeEnum{
        return this._type;
    }

    public get CurrentState(): State | SubStateMachine{
        return this._curState;
    }

    public set CurrentState(newSate: State | SubStateMachine) {
        if(!newSate) return;

        this._curState = newSate;
        this._curState.run();
    }

    /**
     * 重置所有触发器，为啥？？
     */
    public resetTrigger(){
        for(const [_, value] of this._params){
            if(value.type === FsmParamTypeEnum.Trigger){
                value.value = false;
            }
        }
    }

    //状态流程控制

    //抽象方法
    /**
     * 由子类实现，决定如何根据当前状态和参数修改当前状态机
     */
    abstract init(...args:any[]):void;
    abstract run():void;

}