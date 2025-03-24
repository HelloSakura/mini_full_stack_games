/**
* @author Lucida
* @description: 玩家连接
* @date: 2025/03/24
*/

import { WebSocket } from "ws";
import { GameServer } from "./GameServer";
import { EventEmitter } from "stream";

interface IItem {
    callpack: Function;
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
        })
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
        if(this._msgMap.has(event)){
            //@ts-ignore
            this._msgMap.get(event).push({ callpack, ctx });
        }
        else{
            this._msgMap.set(event, [{ callpack, ctx }]);
        }
    }

    private _off(event:string, callpack:Function, ctx:unknown){
        if(this._msgMap.has(event)){
            //@ts-ignore
            const index = this._msgMap.get(event).findIndex(item => item.callpack === callpack && item.ctx === ctx);
            //@ts-ignore
            index > -1 && this._msgMap.get(event).splice(index, 1);
        }
    }

    private _emit(event:string, ...data:unknown[]){
        if(this._msgMap.has(event)){
            //@ts-ignore
            this._msgMap.get(event).forEach(item => {
                item.callpack.apply(item.ctx, data);
            });
        }
    }
}