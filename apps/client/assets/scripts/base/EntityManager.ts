/**
* @author Lucida
* @description: 实体管理类
* @date: 2025/01/14
*/

import { _decorator, Component} from 'cc';
import StateMachine from './StateMachine';
import { EntityStateEnum } from '../Enum/enum';

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

    set State(state:EntityStateEnum){
        this._state = state;
        this._fsm.setParam(state, true);
    }

    abstract init(...agrs:any[]):void;
}