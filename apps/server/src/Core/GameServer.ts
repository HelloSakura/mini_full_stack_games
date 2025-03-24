/**
* @author Lucida
* @description: 服务器
* @date: 2025/03/24
*/

import WebSocket, { WebSocketServer } from "ws";
import { Connection } from "./Connection";


export class GameServer{

    private _port:number;
    private _wss:WebSocketServer;
    private _connectionSet:Set<Connection> = new Set();

    constructor(port:number){
        this._port = port;
    }

    start(){
        return new Promise((resolve, reject)=>{
            //构造WebSocket并注册各类事件
            this._wss = new WebSocketServer({port:this._port});
            this._wss.on("listening", ()=>{
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
                console.log("New connection established", this._connectionSet.size);
                //监听close事件，connection关闭时server移除连接
                connection.on("close", ()=>{
                    this._connectionSet.delete(connection);
                    console.log("Connection closed", this._connectionSet.size);
                });
            })
        });
    }
}