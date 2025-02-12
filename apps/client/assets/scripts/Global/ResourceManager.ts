/**
* @author Lucida
* @description: 资源管理器，游戏一些资源的加载，通用方式进行加载
* @date: 2025/02/12
*/

import { Asset } from "cc";
import { Singleton } from "../Base/Singleton";


export class ResourceManager extends Singleton<ResourceManager>() {
    /**
     * 加载资源，这段泛型代码啥子意思
     */
    loadRes<T extends Asset>(path:string, type: new (...args:any[])=>T){

    }

    /**
     * 加载文件夹
     */
    loadDir<T extends Asset>(path:string, type: new (...args:any[])=>T){

    }
}