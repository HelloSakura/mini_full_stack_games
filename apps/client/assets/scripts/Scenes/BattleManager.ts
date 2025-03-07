/**
* @author Lucida
* @description: 战场管理器，负责管理战场中每个单位
* @date: 2025/02/21
*/

import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame} from "cc";
import { DataManager } from "../Global/DataManager";
import { JoystickManager } from "../UI/JoystickManager";
import { ResourceManager } from "../Global/ResourceManager";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { PrefabPathEnum, TexturePathEnum } from "../Enum/Enum";
import { EntityTypeEnum } from "../Common";

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component{
    private _stage:Node;
    private _UI:Node; 
    
    private _shouldUpdate:boolean = false;

    onLoad(){
        this._stage = this.node.getChildByName("Stage");
        this._UI = this.node.getChildByName("UI");
        this._stage.destroyAllChildren();
        DataManager.Instance.JoystickManager = this._UI.getComponentInChildren(JoystickManager);
    }


    /**
     * 异步加载的问题，先load资源在update，避坑没有加载玩就在update里面使用
     */
    async start(){
        await this._loadRes();
        this._initMap();
        this._shouldUpdate = true;
    }

    update(dt){
        if(this._shouldUpdate){
            this._render();
            this._tick(dt);
        }
    }

    private _tick(dt:number){
        this._tickActor(dt)
    }

    private _tickActor(dt:number){
        for(const data of DataManager.Instance.State.actors){
            let am = DataManager.Instance.ActorMap.get(data.id);
            am.tick(dt);
        }

    }

    private _render(){
        this._renderActor();
    }

    private _renderActor(){
        for(const data of DataManager.Instance.State.actors){
            let am = DataManager.Instance.ActorMap.get(data.id);
            const {id, type} = data;
            if(!am){
                const prefab = DataManager.Instance.PrefabMap.get(type);
                const node = instantiate(prefab);
                node.setParent(this._stage);
                am = node.addComponent(ActorManager);
                DataManager.Instance.ActorMap.set(id, am);
                am.init(data);
            }
            else{
                am.render(data);
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
}
