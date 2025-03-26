/**
* @author Lucida
* @description: 网络管理器
* @date: 2025/03/23
*/

import { Singleton } from "../Base/Singleton";
import { NetPort } from "../Common/Common";

//事件管理器 接口
interface IItem {
    callback: Function;
    ctx: unknown;       //上下文参数
}

interface ICallApiRet{
    success:boolean;
    data?:any,
    error?:Error
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
            console.log("ws try to connect: ", this._port);
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

    callApi(head:string, data):Promise<ICallApiRet>{
        return new Promise((resolve)=>{
            try{
                //定时器防止超时
                const timer = setTimeout(()=>{
                    resolve({success:false, error:new Error("NetWorkManager callApi timeout")});
                    this.unListen(head, callback, null);
                }, 5000);

                const callback = (res)=>{
                    resolve(res);
                    clearTimeout(timer);
                    this.unListen(head, callback, null);
                };
                this.listenMsg(head, callback, null);
                this.sendMsg(head, data);
            }
            catch(error){
                resolve({success:false, error});
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
            this._eventMap.get(event).push({ callback: callpack, ctx });
        }
        else{
            this._eventMap.set(event, [{ callback: callpack, ctx }]);
        }
    }

    private _off(event:string, callpack:Function, ctx:unknown){
            if(this._eventMap.has(event)){
                const index = this._eventMap.get(event).findIndex(item => item.callback === callpack && item.ctx === ctx);
                index > -1 && this._eventMap.get(event).splice(index, 1);
            }
        }

    private _emit(event:string, ...data:unknown[]){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).forEach(item => {
                item.callback.apply(item.ctx, data);
            });
        }
    }

}