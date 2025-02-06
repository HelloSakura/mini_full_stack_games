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