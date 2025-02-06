/**
* @author Lucida
* @description: 有限状态机基类
* @date: 2025/01/14
*/

import { _decorator, Component } from "cc";
import { FsmParamTypeEnum } from "../Enum/Enum";
import State from "./State";
import SubStateMachine from "./SubStateMachine";
import { EntityTypeEnum } from "../Common/Common";

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
export default abstract class StateMachine extends Component{
    //基本参数
    //当前状态
    private _curState: State | SubStateMachine = null;
    //参数？？
    private _params: Map<string, IParamsValue> = new Map();
    //??
    private _stateMachines: Map<string, State | SubStateMachine> = new Map();
    //当前状态动画机
    private _animation: Animation = null;
    private _type: EntityTypeEnum = EntityTypeEnum.Init;



    //状态流程控制

    //抽象方法
    /**
     * 由子类实现，决定如何根据当前状态和参数修改当前状态机
     */
    abstract init(...args:any[]):void;
    abstract run():void;

}