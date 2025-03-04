/**
* @author Lucida
* @description: 数据中心
* @date: 2025/02/06
*/

import { Prefab, SpriteFrame } from "cc";
import { EntityTypeEnum, IActorMove, IState } from "../Common";
import { JoystickManager } from "../UI/JoystickManager";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { Singleton } from "../Base/Singleton";

const ACTOR_SPEED = 1;

export class DataManager extends Singleton<DataManager>() {
    private _textureMap:Map<string, SpriteFrame[]> = new Map();
    private _jm:JoystickManager;    //摇杆控制器
    private actorMap:Map<number, ActorManager> = new Map();
    private prefabMap:Map<string, Prefab> = new Map();
    
    private _state:IState = {
        actors:[
            {
                id:1,
                position:{x:0, y:0},
                direction:{x:0, y:0},
                type:EntityTypeEnum.Actor1
            }
        ]
    }


    public get State():IState{
        return this._state;
    }

    public get ActorMap():Map<number, ActorManager>{
        return this.actorMap;
    }

    public get PrefabMap():Map<string, Prefab>{
        return this.prefabMap;
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
