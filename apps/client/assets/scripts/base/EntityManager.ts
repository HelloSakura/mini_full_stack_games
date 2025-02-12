/**
* @author Lucida
* @description: 实体管理类
* @date: 2025/01/14
*/

import { _decorator, Component} from 'cc';
import StateMachine from './StateMachine';
import { EntityStateEnum } from '../Enum/Enum';

const {ccclass, property} = _decorator

@ccclass('EntityManager')
export abstract class EntityManager extends Component{
    //状态机
    private _fsm:StateMachine;
    //状态枚举
    private _state:EntityStateEnum;


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