/**
* @author Lucida
* @description: 战场管理器，负责管理战场中每个单位
* @date: 2025/02/21
* 核心步骤：加载资源，初始化地图、update(dt)渲染每个对象（render，tick）
*/



import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame} from "cc";
import { DataManager } from "../Global/DataManager";
import { JoystickManager } from "../UI/JoystickManager";
import { ResourceManager } from "../Global/ResourceManager";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { EventEnum, PrefabPathEnum, TexturePathEnum } from "../Enum/Enum";
import { ApiMsgEnum, EntityTypeEnum, IClientInput, IMsgServerSync, InputTypeEnum } from "../Common";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import { ObjectPoolManager } from "../Global/ObjectPoolManager";
import { NetWorkManager } from "../Global/NetWorkManager";
import { EventManager } from "../Global/EventManager";

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component{
    private _stage:Node;
    private _UI:Node; 
    
    private _shouldUpdate:boolean = false;

    onLoad(){
    }


    /**
     * 异步加载的问题，先load资源在update，避坑没有加载玩就在update里面使用
     */
    async start(){
        this._clearGame();
        await Promise.all([
            this._connectServer(),
            this._loadRes(),
        ]);
        this._initGame();
    }

    onDestroy(){
        EventManager.Instance.off(EventEnum.ClientSync, this._handleClientSync, this);
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgServerSync, this._handleServerSync, this);
    }

    update(dt){
        if(this._shouldUpdate){
            this._render();
            this._tick(dt);
        }
    }


    /**
     * 初始化赋值
     */
    private _initGame(){
        DataManager.Instance.JoystickManager = this._UI.getComponentInChildren(JoystickManager);
        this._initMap();
        this._shouldUpdate = true;

        EventManager.Instance.on(EventEnum.ClientSync, this._handleClientSync, this);
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgServerSync, this._handleServerSync, this);
    }

    /**
     * 节点回收销毁
     */
    private _clearGame(){
        DataManager.Instance.Stage = this._stage = this.node.getChildByName("Stage");   //获取舞台UI节点
        this._UI = this.node.getChildByName("UI");
        this._stage.destroyAllChildren();
    }

    private _tick(dt:number){
        this._tickActor(dt);
        DataManager.Instance.applyInput({
            type:InputTypeEnum.TimePast,
            dt:dt
        })
    }

    private _tickActor(dt:number){
        for(const data of DataManager.Instance.State.actors){
            let am = DataManager.Instance.ActorMap.get(data.id);
            am.tick(dt);
        }

    }

    private _render(){
        this._renderActor();
        this._renderBullet();
    }

    private _renderActor(){
        for(const data of DataManager.Instance.State.actors){
            let am = DataManager.Instance.ActorMap.get(data.id);
            const {id, type} = data;
            if(!am){
                const prefab = DataManager.Instance.PrefabMap.get(type);
                const actor = instantiate(prefab);
                actor.setParent(this._stage);
                am = actor.addComponent(ActorManager);
                DataManager.Instance.ActorMap.set(id, am);
                am.init(data);
            }
            else{
                am.render(data);
            }
        }
    }

    private _renderBullet(){
        for(const data of DataManager.Instance.State.bullets){
            let bm = DataManager.Instance.BulletMap.get(data.id);
            const {id, bulleType} = data;
            if(!bm){
                // const prefab = DataManager.Instance.PrefabMap.get(bulleType);
                // const bullet = instantiate(prefab);
                // bullet.setParent(this._stage);

                const bullet = ObjectPoolManager.Instance.get(bulleType);
                bm = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager);
                DataManager.Instance.BulletMap.set(id, bm);
                bm.init(data);
            }
            else{
                bm.render(data);
            }
        }
    }


    private _initMap(){
        const prefab = DataManager.Instance.PrefabMap.get(EntityTypeEnum.Map);
        const map = instantiate(prefab);
        map.setParent(this._stage);
    }

    private async _loadRes(){
        const list = [];
        //加载预设
        for(const type in PrefabPathEnum){
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((Prefab)=>{
                DataManager.Instance.PrefabMap.set(type, Prefab);
            });
            list.push(p);
        }
        
        //加载贴图
        for(const type in TexturePathEnum){
            const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((spriteFrames)=>{
                DataManager.Instance.TextureMap.set(type, spriteFrames);
            });
            list.push(p);
        }
        await Promise.all(list);
    }


    //初始化网络服务
    private async _connectServer(){
        //网络波动下多次连接
        if(!(await NetWorkManager.Instance.connect().catch(()=>false))){
            //连接失败, 递归调用，1秒一次
            await new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(true);
                }, 1000);
            });
            this._connectServer();
        }
        // NetWorkManager.Instance.sendMsg("Client first connect to server");
        // NetWorkManager.Instance.listenMsg(
        //     "protocol", 
        //     (data)=>{
        //         console.log("client confirm protocol:", data)
        //     }, 
        //     this
        // );
        console.log("client connect to server success");
    }

    //处理客户端同步
    private _handleClientSync(input:IClientInput){
        const msg = {
            input,
            frameID:DataManager.Instance.FrameID
        }
        NetWorkManager.Instance.sendMsg(ApiMsgEnum.MsgClientSync, msg);
    }

    private _handleServerSync({inputs, lastFrameID}:IMsgServerSync){
        console.log("server sync:", inputs);
        for(const input of inputs){
            DataManager.Instance.applyInput(input);
        }
    }
}
