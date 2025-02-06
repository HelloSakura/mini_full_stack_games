/**
* @author Lucida
* @description: 数据中心
* @date: 2025/02/06
*/

import { SpriteFrame } from "cc";
import { Singleton } from "../Base/Singleton";


export class DataManager extends Singleton<DataManager>() {
    private _textureMap:Map<string, SpriteFrame[]> = new Map();

    public get TextureMap():Map<string, SpriteFrame[]>{
        return this._textureMap;
    }
}