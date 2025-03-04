/**
* @author Lucida
* @description: 实体管理类
* @date: 2025/01/14
*/

import { _decorator, Component} from 'cc';
import { EntityStateEnum } from '../Enum/Enum';
import { StateMachine } from './StateMachine';

const {ccclass, property} = _decorator

@ccclass('EntityManager')
export abstract class EntityManager extends Component{
    //状态机
    protected _fsm:StateMachine;
    //状态枚举
    protected _state:EntityStateEnum;


    get State():EntityStateEnum{
        return this._state;
    }

    set State(newState:EntityStateEnum){
        this._state = newState;
        //怎么转出来的，用字符串做key？？
        this._fsm.setParams(newState, true);
    }

    abstract init(...agrs:any[]):void;
}