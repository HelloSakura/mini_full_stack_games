/**
* @author Lucida
* @description: 对象池
* @date: 2025/03/18
*/

import { instantiate, Node } from "cc";
import { Singleton } from "../Base/Singleton";
import { EntityTypeEnum } from "../Common";
import { DataManager } from "./DataManager";

export class ObjectPoolManager extends Singleton<ObjectPoolManager>(){
    private _objectPool:Node;
    private _poolMap:Map<EntityTypeEnum, Node[]> = new Map();

    /**
     * 
     * @param type 
     * @returns 获取对象节点
     */
    public get(type:EntityTypeEnum){
        // 初始化父节点
        if(!this._objectPool){
            this._objectPool = new Node("ObjectPool");
            this._objectPool.setParent(DataManager.Instance.Stage);
        }

        //判断poolMap有无对应类型
        if(!this._poolMap.has(type)){
            this._poolMap.set(type, []);
            //创建二级节点
            const container = new Node(type + "Pool");
            container.setParent(this._objectPool);
        }

        //获取节点
        const nodes = this._poolMap.get(type);
        if(!nodes.length){
            const prefab = DataManager.Instance.PrefabMap.get(type);
            const node = instantiate(prefab);
            node.name = type;
            node.setParent(this._objectPool.getChildByName(type + "Pool"));
            node.active = true;
            return node;
        }
        else{
            const node = nodes.pop();
            node.active = true;
            return node;
        }
    }

    /**
     * 
     * @param node 回收节点
     */
    public ret(node:Node){
        node.active = false;
        this._poolMap.get(node.name as EntityTypeEnum).push(node);
    }
}