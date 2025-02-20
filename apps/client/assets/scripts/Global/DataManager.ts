/**
* @author Lucida
* @description: 数据中心
* @date: 2025/02/06
*/

import { SpriteFrame } from "cc";
import { Singleton } from "../Base/Singleton";
import { IActorMove, IState } from "../Common";
import { JoystickManager } from "../UI/JoystickManager";

const ACTOR_SPEED = 100;

export class DataManager extends Singleton<DataManager>() {
    private _textureMap:Map<string, SpriteFrame[]> = new Map();
    private _jm:JoystickManager;    //摇杆控制器
    
    private _state:IState = {
        actors:[
            {
                id:1,
                position:{x:0, y:0},
                direction:{x:0, y:0},
            }

        ]
    }


    public get State():IState{
        return this._state;
    }
    public set JoystickManager(jm:JoystickManager){
        this._jm = jm;
    }

    public get JoystickManager():JoystickManager{
        return this._jm;
    }
    public get TextureMap():Map<string, SpriteFrame[]>{
        return this._textureMap;
    }


    public applyInput(input:IActorMove){
        const {id, dt, direction:{x, y}} = input;   //解构
        const actor = this._state.actors.find(actor => actor.id === id);
        if(!actor) return;
        actor.direction.x = x;
        actor.direction.y = y;
        actor.position.x += x * dt * ACTOR_SPEED;
        actor.position.y += y * dt * ACTOR_SPEED;
    }
}
