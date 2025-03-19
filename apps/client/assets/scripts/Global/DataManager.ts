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

const ACTOR_RADIUS = 50;    //人物半径
const BULLET_RADIUS = 20;   //子弹半径

const BULLET_DAMAGE = 5;    //子弹上海

export class DataManager extends Singleton<DataManager>() {
    private _textureMap:Map<string, SpriteFrame[]> = new Map();
    private _jm:JoystickManager;    //摇杆控制器
    private _actorMap:Map<number, ActorManager> = new Map();
    private _bulletMap:Map<number, BulletManager> = new Map();
    private _prefabMap:Map<string, Prefab> = new Map();
    private _stage:Node;    //舞台

    //玩家ID，登陆的时候获取，鉴别身份
    private _selfPlayerID:number = 1;
    
    private _state:IState = {
        actors:[
            {
                id:1,
                hp:80,
                position:{x:150, y:150},
                direction:{x:0, y:0},
                type:EntityTypeEnum.Actor1,
                weaponType:EntityTypeEnum.Weapon1,
                bulletType:EntityTypeEnum.Bullet2
            },
            // {
            //     id:2,
            //     hp:80,
            //     position:{x:-150, y:-150},
            //     direction:{x:0, y:0},
            //     type:EntityTypeEnum.Actor1,
            //     weaponType:EntityTypeEnum.Weapon1,
            //     bulletType:EntityTypeEnum.Bullet2
            // }
        ],
        bullets:[],
        nextBulletID:1,
    }


    public get SelfPlayerID():number{
        return this._selfPlayerID;
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
        //产生子弹触发事件
        EventManager.Instance.emit(EventEnum.BulletBorn, owner);

        //推入数组
        this._state.bullets.push(bullet);
    }

    private _applyTimePast(input:ITimePast){
        const {dt} = input;
        const {bullets} = this._state
        //倒序遍历删除子弹，push会一直压在最上面
        for(let i = bullets.length - 1; i >= 0; i--){
            const bullet = bullets[i];
            
            for(let j = this._state.actors.length - 1; j >= 0; j--){
                let actor = this._state.actors[j]; 
                //子弹打中其它玩家，子弹不和自身碰撞
                if(bullet.owner != actor.id && Math.sqrt((bullet.position.x - actor.position.x) ** 2 + (bullet.position.y - actor.position.y) ** 2) < (BULLET_RADIUS + ACTOR_RADIUS)){
                    actor.hp -= BULLET_DAMAGE;
                    //爆炸位置取中点
                    //EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, (bullet.position.x + actor.position.x)/2,  (bullet.position.y + actor.position.y)/2);
                    EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, {x:(bullet.position.x + actor.position.x)/2,  y:(bullet.position.y + actor.position.y)/2});
                    bullets.splice(i, 1);
                    break;
                }

                //子弹穿过地图
                if(Math.abs(2 * bullet.position.x) > MAP_WIDTH || Math.abs(2 * bullet.position.y) > MAP_HEIGHT){
                    //回收子弹时触发子弹爆炸事件
                    EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, bullet.position);
                    bullets.splice(i, 1);
                    break;
                }
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
