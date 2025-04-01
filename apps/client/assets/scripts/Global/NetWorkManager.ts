/**
* @author Lucida
* @description: 网络管理器
* @date: 2025/03/23
*/

import { Singleton } from "../Base/Singleton";
import { IModel } from "../Common";
import { NetPort } from "../Common/Common";

//事件管理器 接口
interface IItem {
    callback: Function;
    ctx: unknown;       //上下文参数
}

interface ICallApiRet<T>{
    success:boolean;
    data?:T,
    error?:Error
}


export class NetWorkManager extends Singleton<NetWorkManager>(){
    private _port;
    private _ws:WebSocket;
    private _isConnected:boolean = false;   //是否建立成功连接

    //事件回调注册
    private _eventMap:Map<string, IItem[]> = new Map();


    public get IsConnected(){
        return this._isConnected;
    }

    //注册事件    
    connect(){
        this._port = NetPort;
        return new Promise((resolve, reject)=>{
            if(this._isConnected){
                resolve(true);
                return;
            }

            console.log("ws try to connect: ", this._port);
            this._ws = new WebSocket(`ws://localhost:${this._port}`);
            this._ws.onopen = ()=>{
                this._isConnected = true;
                console.log("connect to server succeeded");
                resolve(true);
            };

            this._ws.onclose = ()=>{
                this._isConnected = false;
                console.log("connect to server false");
                reject(false);
            };

            this._ws.onerror = (error)=>{
                this._isConnected = false;
                console.log("connect to server error", error);
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

    callApi<T extends keyof IModel['api']>(head:T, data:IModel['api'][T]['req']):Promise<ICallApiRet<IModel['api'][T]['rsp']>>{
        return new Promise((resolve)=>{
            try{
                //定时器防止超时
                const timer = setTimeout(()=>{
                    resolve({success:false, error:new Error("NetWorkManager callApi timeout")});
                    this.unListen(head as any, callback, null);
                }, 5000);

                const callback = (res:ICallApiRet<IModel['api'][T]['rsp']>)=>{
                    console.log('closure callback res:', res);
                    resolve(res);
                    clearTimeout(timer);
                    this.unListen(head as any, callback, null);
                };
                this.listenMsg(head as any, callback, null);
                this.sendMsg(head as any, data);
            }
            catch(error){
                resolve({success:false, error});
            }
        });
    }
    sendMsg<T extends keyof IModel['msg']>(head:T, data:IModel['msg'][T]){
        const msg = {
            head:head,
            data:data
        };
        this._ws.send(JSON.stringify(msg));
    }

    // 监听
    listenMsg<T extends keyof IModel['msg']>(name:T, callback:(args:IModel['msg'][T])=>void, ctx:unknown){
        this._on(name, callback, ctx);
    }

    //停止监听
    unListen<T extends keyof IModel['msg']>(name:T, callback:(args:IModel['msg'][T])=>void, ctx:unknown){
        this._off(name, callback, ctx);
    }


    private _on<T extends keyof IModel['msg']>(event:T, callback:(args:IModel['msg'][T])=>void, ctx:unknown){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).push({ callback: callback, ctx });
        }
        else{
            this._eventMap.set(event, [{ callback: callback, ctx }]);
        }
    }

    private _off<T extends keyof IModel['msg']>(event:T, callback:(args:IModel['msg'][T])=>void, ctx:unknown){
            if(this._eventMap.has(event)){
                const index = this._eventMap.get(event).findIndex(item => item.callback === callback && item.ctx === ctx);
                index > -1 && this._eventMap.get(event).splice(index, 1);
            }
        }

    private _emit<T extends keyof IModel['msg']>(event:T, args:any){
        if(this._eventMap.has(event)){
            this._eventMap.get(event).forEach(item => { 
                item.callback.call(item.ctx, args);
            });
        }
    }

}