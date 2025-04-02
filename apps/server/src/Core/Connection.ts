/**
* @author Lucida
* @description: 玩家连接
* @date: 2025/03/24
*/

import { WebSocket } from "ws";
import { GameServer } from "./GameServer";
import { EventEmitter } from "stream";
import { IModel } from "../Common";

interface IItem {
    callback: Function;
    ctx: unknown;       //上下文参数
}

export class Connection extends EventEmitter{
    private _server:GameServer;
    private _ws:WebSocket;
    private _msgMap:Map<string, IItem[]> = new Map();

    constructor(server:GameServer, ws:WebSocket){
        super();
        this._server = server;
        this._ws = ws;

        //WebSocket关闭时通知server回收connect
        this._ws.on("close", ()=>{
            this.emit("close"); //触发回收事件
        });

        this._ws.on("message", (buffer:Buffer) => {
            const str = buffer.toString();
            try{
                const msg = JSON.parse(str);
                const {head, data} = msg;
                // const {frameID, input} = data;
                // console.log(this._msgMap, head, data);
                //console.log('connection-client msg:', head, data);
                if(this._server.ApiMap.has(head)){
                    try{
                        const callback = this._server.ApiMap.get(head);
                        const res = callback?.call(null, this, data);
                        //将结果发回给客户端
                        console.log('connection-server api ret:', res);
                        this.sendMsg(head, {
                            success:true,
                            data:res
                        });
                    }
                    catch(error){
                        console.log("connection server api error:", error);
                        this.sendMsg(head, {
                            success:false,
                            data:error
                        });
                    }
                }
                else{
                    try{
                        //没有server api，除法connection自身的msg event
                        console.log('connection-client msg event:', head, data);
                        this._emit(head, data);
                    }
                    catch(error){
                        console.log("connection msg event error:", error);
                    }
                }
            }
            catch(e){
                console.log("ws onmessage error:", e);
            }
        });
    }

    sendMsg<T extends keyof IModel['msg']>(head:T, data:IModel['msg'][T]){
        const msg = {
            head:head,
            data:data
        };
        console.log('server send msg:', msg);
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
        if(this._msgMap.has(event)){
            //@ts-ignore
            this._msgMap.get(event).push({ callback, ctx });
        }
        else{
            this._msgMap.set(event, [{ callback, ctx }])
        }
    }

    private _off<T extends keyof IModel['msg']>(event:T, callback:(args:IModel['msg'][T])=>void, ctx:unknown){
        if(this._msgMap.has(event)){
            //@ts-ignore
            const index = this._msgMap.get(event).findIndex(item => item.callback === callback && item.ctx === ctx);
            //@ts-ignore
            index > -1 && this._msgMap.get(event).splice(index, 1);
        }
    }

    private _emit<T extends keyof IModel['msg']>(event:T, args:IModel['msg'][T]){
        if(this._msgMap.has(event)){
            //@ts-ignore
            this._msgMap.get(event).forEach(item => {
                console.log('connection emit msg event:', event);
                item.callback.apply(item.ctx, args);
            });
        }
    }
}