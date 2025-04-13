/**
* @author Lucida
* @description: 玩家连接
* @date: 2025/03/24
*/

import { WebSocket } from "ws";
import { GameServer } from "./GameServer";
import { EventEmitter } from "stream";
import { ApiMsgEnum, IModel } from "../Common";
import { strDecode, strEncode } from "../Common/Utils";
import { binaryDecode, binaryEncode } from "../Common/Binary";
import { bufferToArrayBuffer } from "../Utils";

interface IItem {
    callback: Function;
    ctx: unknown;       //上下文参数
}

export class Connection extends EventEmitter{
    private _server:GameServer;
    private _ws:WebSocket;
    private _msgMap:Map<ApiMsgEnum, IItem[]> = new Map();

    constructor(server:GameServer, ws:WebSocket){
        super();
        this._server = server;
        this._ws = ws;

        //WebSocket关闭时通知server回收connect
        this._ws.on("close", ()=>{
            this.emit("close"); //触发回收事件
        });

        this._ws.on("message", (buffer:Buffer) => {
            try{
                const json = binaryDecode(bufferToArrayBuffer(buffer));
                const {head, data} = json;
                console.log('connection-client msg:', head, data);
                // const {frameID, input} = data;
                // console.log(this._msgMap, head, data);
                //console.log('connection-client msg:', head, data);
                //查看对应的server是否有监听事件，
                if(this._server.ApiMap.has(head)){
                    try{
                        const callback = this._server.ApiMap.get(head);
                        const res = callback?.call(null, this, data);
                        //将结果发回给客户端
                        //console.log('connection-server api ret:', res);
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
                        //没有server api，检查connection自身的msg event
                        //console.log('connection-client msg event:', head, data);
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

    async sendMsg<T extends keyof IModel['msg']>(head:T, data:IModel['msg'][T]){
        const msg = {
            head:head,
            data:data
        };
        // const str = JSON.stringify(msg);
        // const typeArray = strEncode(str);
        // const buffer = Buffer.from(typeArray);
        // this._ws.send(buffer);
        const dataView = binaryEncode(head, data);
        // console.log('connection-server msg:', head, data);
        // console.log('connection-server buffer:', dataView.buffer);
        this._ws.send(dataView.buffer);
    }

    // 监听
    listenMsg<T extends keyof IModel['msg']>(name:T, callback:(connection:Connection, args:IModel['msg'][T])=>void, ctx:unknown){
        this._on(name, callback, ctx);
    }

    //停止监听
    unListen<T extends keyof IModel['msg']>(name:T, callback:(connection:Connection, args:IModel['msg'][T])=>void, ctx:unknown){
        this._off(name, callback, ctx);
    }


    private _on<T extends keyof IModel['msg']>(event:T, callback:(connection:Connection, args:IModel['msg'][T])=>void, ctx:unknown){
        if(this._msgMap.has(event)){
            //@ts-ignore
            this._msgMap.get(event).push({ callback, ctx });
        }
        else{
            this._msgMap.set(event, [{ callback, ctx }])
        }
    }

    private _off<T extends keyof IModel['msg']>(event:T, callback:(connection:Connection, args:IModel['msg'][T])=>void, ctx:unknown){
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
                //console.log('connection emit msg event:', event);
                item.callback.call(item.ctx, this, args);
            });
        }
    }
}