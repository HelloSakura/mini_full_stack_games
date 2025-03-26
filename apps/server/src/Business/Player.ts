/**
* @author Lucida
* @description: 玩家类
* @date: 2025/03/24
*/

import { Connection } from "../Core";

export class Player {
    private _playerID:number;
    private _name:string;
    private _connection:Connection;
    private _roomID:number;

    constructor(playerID:number, name:string, connection:Connection){
        this._playerID = playerID;
        this._name = name;
        this._connection = connection;
    }

    public get PlayerID(){
        return this._playerID;
    }

    public get Name(){
        return this._name;
    }

    public get Connection(){
        return this._connection;
    }

    public get RoomID(){
        return this._roomID;
    }
}