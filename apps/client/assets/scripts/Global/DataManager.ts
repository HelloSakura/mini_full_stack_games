/**
* @author Lucida
* @description: 数据中心
* @date: 2025/02/06
*/

import { Prefab, SpriteFrame, Node } from "cc";
import { EntityTypeEnum, IActorMove, IBullet, IClientInput, InputTypeEnum, IState, ITimePast, IWeaponShoot } from "../Common";
import { JoystickManager } from "../UI/JoystickManager";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { Singleton } from "../Base/Singleton";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { EventManager } from "./EventManager";
import { EventEnum } from "../Enum/Enum";

const ACTOR_SPEED = 100;        //人物移速
const BULLET_SPEED = 500;       //子弹移速

const MAP_WIDTH = 1280;     //地图-宽
const MAP_HEIGHT = 720;     //地图-高



export class DataManager extends Singleton<DataManager>() {
    private _textureMap:Map<string, SpriteFrame[]> = new Map();
    private _jm:JoystickManager;    //摇杆控制器
    private _actorMap:Map<number, ActorManager> = new Map();
    private _bulletMap:Map<number, BulletManager> = new Map();
    private _prefabMap:Map<string, Prefab> = new Map();
    private _stage:Node;    //舞台
    
    private _state:IState = {
        actors:[
            {
                id:1,
                position:{x:0, y:0},
                direction:{x:0, y:0},
                type:EntityTypeEnum.Actor1,
                weaponType:EntityTypeEnum.Weapon1,
                bulletType:EntityTypeEnum.Bullet2
            }
        ],
        bullets:[],
        nextBulletID:1,
    }

    public get Stage():Node{
        return this._stage;
    }

    public set Stage(stage:Node){
        this._stage = stage;
    }

    public get State():IState{
        return this._state;
    }

    public get ActorMap():Map<number, ActorManager>{
        return this._actorMap;
    }

    public get BulletMap():Map<number, BulletManager>{
        return this._bulletMap;
    }

    public get PrefabMap():Map<string, Prefab>{
        return this._prefabMap;
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


    public applyInput(input:IClientInput){
        switch(input.type){
            case InputTypeEnum.ActorMove:
                this._applyActorMove(input);
                break;
            case InputTypeEnum.WeaponShoot:
                this._applyWeaponShoot(input);
                break;
            case InputTypeEnum.TimePast:
                this._applyTimePast(input);
                break;
        }
        
    }

    private _applyActorMove(input:IActorMove){
        const {id, dt, direction:{x, y}} = input;   //解构
        const actor = this._state.actors.find(actor => actor.id === id);
        if(!actor) return;
        actor.direction.x = x;
        actor.direction.y = y;
        actor.position.x += x * dt * ACTOR_SPEED;
        actor.position.y += y * dt * ACTOR_SPEED;
    }

    private _applyWeaponShoot(input:IWeaponShoot){
        const {owner, position, direction} = input;
        const bullet:IBullet = {
            id:this._state.nextBulletID++,
            owner:owner,
            position:position,
            direction:direction,
            bulleType:this._actorMap.get(owner).BulletType
        }
        //console.log(bullet);
        //推入数组
        this._state.bullets.push(bullet);
    }

    private _applyTimePast(input:ITimePast){
        const {dt} = input;
        const {bullets} = this._state
        //倒序遍历删除子弹，push会一直压在最上面
        for(let i = bullets.length - 1; i >= 0; i--){
            const bullet = bullets[i];
            //子弹穿过地图
            if(Math.abs(2 * bullet.position.x) > MAP_WIDTH || Math.abs(2 * bullet.position.y) > MAP_HEIGHT){
                bullets.splice(i, 1);
                //回收子弹时触发子弹爆炸事件
                EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, bullet.position);
            }
        }

        //更新子弹
        for(const bullet of bullets){
            //方向 * 速度 * 时间
            bullet.position.x += bullet.direction.x * BULLET_SPEED * dt;
            bullet.position.y += bullet.direction.y * BULLET_SPEED * dt;
        }
    }
}
