/**
* @author Lucida
* @description: 有限子状态机基类,把同类型的但具体不同的state都封装在子状态机中
* @date: 2025/01/14
*/

import { _decorator, Component} from "cc";
import { StateMachine } from "./StateMachine";
import { State } from "./State";

const { ccclass, property } = _decorator;

export default abstract class SubStateMachine {
    private _currentState: State;
    private _stateMachines:Map<string, State> = new Map();
    private _stateMachine:StateMachine;

    constructor (fsm : StateMachine){
        this._stateMachine = fsm;
    }

    public get StateMachine():StateMachine{
        return this._stateMachine;
    }
    
    public get CurrentState(): State {
        return this._currentState;
    }

    public set CurrentState(newSate: State) {
        if(!newSate) return;

        this._currentState = newSate;
        this._currentState.run();
    }

    /**
     * 交由具体子类自身实现
     */
    abstract run() : void;
}
