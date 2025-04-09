/**
* @author Lucida
* @description: 子弹控制
* @date: 2025/03/10
*/

import { _decorator, instantiate, IVec2, tween, Tween, Vec3} from "cc";
import { EntityTypeEnum, IBullet } from "../../Common";
import { EntityManager } from "../../Base/EntityManager";
import { BulletStateMachine } from "./BulletStateMachine";
import { EntityStateEnum, EventEnum } from "../../Enum/Enum";
import { rad2Angle } from "../../Utils/Utils";
import { EventManager } from "../../Global/EventManager";
import { DataManager } from "../../Global/DataManager";
import { ExplosionManager } from "../Explosion/ExplosionManager";
import { ObjectPoolManager } from "../../Global/ObjectPoolManager";

const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager{
    private _type:EntityTypeEnum;
    private _bulletID:number;
    private _targetPos:Vec3;
    private _tween:Tween<unknown>;

    init(data:IBullet){
        this._type = data.bulleType;
        this._bulletID = data.id;
        this._fsm = this.node.getComponent(BulletStateMachine) || this.node.addComponent(BulletStateMachine);
        this._fsm.init(data.bulleType);
        this.State = EntityStateEnum.Idle;
        
        //子弹初始化不显示，避免渲染出来的第一帧出现屏闪的问题
        this.node.active = false;
        this._targetPos = undefined;
    }

    onLoad(){
        EventManager.Instance.on(EventEnum.ExplosionBorn, this._handleExplosionBorn, this);
    }

    onDestroy(){
        EventManager.Instance.off(EventEnum.ExplosionBorn, this._handleExplosionBorn, this);
    }

    render(data:IBullet){
        this._renderPosition(data);
        this._renderDirection(data);
    }

    private _renderPosition(data:IBullet){
        const {position} = data;
        const newPos = new Vec3(position.x, position.y);
        if(!this._targetPos){
            this.node.active = true;
            this.node.setPosition(position.x, position.y);
            this._targetPos = new Vec3(newPos);
        }
        else if(!this._targetPos.equals(newPos)){
            this._tween?.stop();
            this.node.setPosition(this._targetPos);
            this._targetPos = newPos;
            this._tween = tween(this.node)
            .to(0.1, {position:this._targetPos})
            .start();
        }
        
    }

    private _renderDirection(data:IBullet){
        const {direction} = data;
        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const angle = direction.x > 0 ? rad2Angle(Math.asin(direction.y / side)) : rad2Angle(Math.PI - Math.asin(direction.y / side));
        this.node.setRotationFromEuler(0, 0, angle);
    }

    /**
     * 
     * @param id 子弹id
     * @param pos 爆炸产生的位置
     */
    private _handleExplosionBorn(id:number, pos:IVec2){
        if(this._bulletID !== id) return;
        
        //初始化explosion node
        // const prefab = DataManager.Instance.PrefabMap.get(EntityTypeEnum.Explosion);
        // const explosion = instantiate(prefab);
        //explosion.setParent(DataManager.Instance.Stage);

        //从对象池获取explosion node
        const explosion = ObjectPoolManager.Instance.get(EntityTypeEnum.Explosion);
        const component:ExplosionManager = explosion.getComponent(ExplosionManager) || explosion.addComponent(ExplosionManager);
        component.init({
            id:id,
            position:pos,
            explosionType:EntityTypeEnum.Explosion
        });
        
        
        //console.log(`BulletMap:${DataManager.Instance.BulletMap.size}`);
        //console.log(`ret bullet id:${this.node.uuid}`);
        
        //回收子弹
        DataManager.Instance.BulletMap.delete(this._bulletID);
        //返回到对象池中
        ObjectPoolManager.Instance.ret(this.node);
    }
}
