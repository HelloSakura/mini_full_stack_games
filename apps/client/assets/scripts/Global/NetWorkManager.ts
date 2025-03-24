/**
* @author Lucida
* @description: 网络管理器
* @date: 2025/03/23
*/

import { Singleton } from "../Base/Singleton";
import { NetPort } from "../Common/Common";

//事件管理器 接口
interface IItem {
    callpack: Function;
    ctx: unknown;       //上下文参数
}


export class NetWorkManager extends Singleton<NetWorkManager>(){
    private _port;
    private _ws:WebSocket;

    //事件回调注册
    private _eventMap:Map<string, IItem[]> = new Map();

    //注册事件    
    connect(){
        this._port = NetPort;
        return new Promise((resolve, reject)=>{
            this._ws = new WebSocket(`ws://localhost:${this._port}`);
            this._ws.onopen = ()=>{
                resolve(true);
            };

            this._ws.onclose = ()=>{
                reject(false);
            };

            this._ws.onerror = ()=>{
                reject(false);
            };

            this._ws.onmessage = (msg)=>{
                //console.log("ws onmessage:", msg.data);
                try{
                    let json = JSON.parse(msg.data);
                    //解构，head和data前后端约定的结构
                    const {head, data} = json;
                    this._emit(head, data);
                }
                catch(e){
                    console.log("ws onmessage error:", e);
                }
                
            }

        });
    }


    sendMsg(head:string, data){
        const msg = {
            head:head,
            data:data
        };
        this._ws.send(JSON.stringify(msg));
    }

    // 监听
    listenMsg(name:string, callback:Function, ctx:unknown){
        this._on(name, callback, ctx);
    }

    //停止监听
    unListen(name:string, callback:Function, ctx:unknown){
        this._off(name, callback, ctx);
    }


    private _on(event:string, callpack:Function, ctx:unknown){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).push({ callpack, ctx });
        }
        else{
            this._eventMap.set(event, [{ callpack, ctx }]);
        }
    }

    private _off(event:string, callpack:Function, ctx:unknown){
            if(this._eventMap.has(event)){
                const index = this._eventMap.get(event).findIndex(item => item.callpack === callpack && item.ctx === ctx);
                index > -1 && this._eventMap.get(event).splice(index, 1);
            }
        }

    private _emit(event:string, ...data:unknown[]){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).forEach(item => {
                item.callpack.apply(item.ctx, data);
            });
        }
    }

}