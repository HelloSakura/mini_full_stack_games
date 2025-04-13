/**
 * @author Lucida
 * @description 全局工具类
 * @date 2025-1-14
 */

import { SpriteFrame } from "cc";

const INDEX_REG = /\((\d+)\)/;

const getNumberWithinString = (str:string)=> parseInt(str.match(INDEX_REG)?.[1] || '0');

export const sortSpriteFrame = (spriteFrames: Array<SpriteFrame>) => {
    return spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name));
}

export const rad2Angle = (rad:number) => {
    return rad * 180 / Math.PI;
}

export const deepClone = (obj:any) => {
    //基本类型直接返回
    if(typeof obj !== 'object' || obj === null){
        return obj;
    }
    //是否是数组类型
    const res = Array.isArray(obj) ? [] : {};
    for(const key in obj){
        if(Object.prototype.hasOwnProperty.call(obj, key)){
            res[key] = deepClone(obj[key]);
        }
    }
    return res;
}

export const randomBySeed = (seed:number)=>{
    return (seed * 9301 + 49297) % 233280;
}