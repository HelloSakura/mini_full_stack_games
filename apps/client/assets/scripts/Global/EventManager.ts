/**
* @author Lucida
* @description: 事件管理器
* @date: 2025/02/12
*/

import { Singleton } from "../Base/Singleton";
import { EventEnum } from "../Enum/Enum";

//事件管理器 接口
interface IItem {
    callpack: Function;
    ctx: unknown;
}
  


export class EventManager extends Singleton<EventManager>() {
    private _eventMap: Map<string, IItem[]> = new Map();

    //注册
    public on(event:EventEnum, callpack:Function, ctx:unknown){

    }

    //取消
    public off(event:EventEnum, callpack:Function, ctx:unknown){

    }

    //触发
    public emit(event:EventEnum, ...args:unknown[]){

    }

    //清除
    public clear(){

    }
}