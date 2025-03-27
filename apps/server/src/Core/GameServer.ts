/**
* @author Lucida
* @description: 服务器
* @date: 2025/03/24
*/

import {WebSocket, WebSocketServer } from "ws";
import { Connection } from "./Connection";
import { ApiMsgEnum, IModel } from "../Common";
import { EventEmitter } from "stream";

export class GameServer extends EventEmitter{

    private _port:number;
    private _wss!:WebSocketServer;
    private _connectionSet:Set<Connection> = new Set();
    private _apiMap:Map<ApiMsgEnum, Function> = new Map();

    constructor(port:number){
        super();
        this._port = port;
    }

    public get ApiMap():Map<ApiMsgEnum, Function>{
        return this._apiMap;
    }

    public get ConnectionSet():Set<Connection>{
        return this._connectionSet;
    }

    start(){
        return new Promise((resolve, reject)=>{
            //构造WebSocket并注册各类事件
            this._wss = new WebSocketServer({port:this._port});
            this._wss.on("listening", ()=>{
                console.log('server listening');
                resolve(true);
            });

            this._wss.on("close", ()=>{
                reject(false);
            });

            this._wss.on("error", (e)=>{
                reject(e);
            });

            this._wss.on("connection", (ws:WebSocket)=>{
                const connection = new Connection(this, ws);
                this._connectionSet.add(connection);
                this.emit("connection", connection)
                //监听close事件，connection关闭时server移除连接
                connection.on("close", ()=>{
                    this._connectionSet.delete(connection);
                    this.emit("disconnection", connection);
                });
            })
        });
    }

    setApi<T extends keyof IModel['api']>(api:T, callback:(connection:Connection, args:IModel['api'][T]['req'])=>void){
        console.log("server set api:", api, callback);
        this._apiMap.set(api, callback);
    }

}
