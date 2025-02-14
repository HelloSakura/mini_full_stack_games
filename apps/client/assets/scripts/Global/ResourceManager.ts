/**
* @author Lucida
* @description: 资源管理器，游戏一些资源的加载，通用方式进行加载
* @date: 2025/02/12
*/

import { Asset, resources } from "cc";
import { Singleton } from "../Base/Singleton";


export class ResourceManager extends Singleton<ResourceManager>() {
    /**
     * 加载资源，这段泛型代码啥子意思
     */
    public loadRes<T extends Asset>(path: string, type: new (...args: any[]) => T) {
        return new Promise<T>((resolve, reject) => {
            resources.load(path, type, (err, res)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(res);
            })
        })
    }

    /**
     * 加载文件夹
     */
    public loadDir<T extends Asset>(path: string, type: new (...args: any[]) => T) {
        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(path, type, (err, res)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(res);
            })
        })
    }
}