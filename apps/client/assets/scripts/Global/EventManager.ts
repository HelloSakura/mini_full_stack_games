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
    ctx: unknown;       //上下文参数
}


export class EventManager extends Singleton<EventManager>() {
    private _eventMap: Map<string, IItem[]> = new Map();

    //注册
    public on(event:EventEnum, callpack:Function, ctx:unknown){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).push({ callpack, ctx });
        }
        else{
            this._eventMap.set(event, [{ callpack, ctx }]);
        }
    }

    //取消
    public off(event:EventEnum, callpack:Function, ctx:unknown){
        if(this._eventMap.has(event)){
            const index = this._eventMap.get(event).findIndex(item => item.callpack === callpack && item.ctx === ctx);
            index > -1 && this._eventMap.get(event).splice(index, 1);
        }
    }

    //触发
    public emit(event:EventEnum, ...args:unknown[]){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).forEach(item => {
                item.callpack.apply(item.ctx, args);
            });
        }
    }

    //清除
    public clear(){
        this._eventMap.clear();
    }
}
