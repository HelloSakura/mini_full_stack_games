/**
 * @author Lucida
 * @description 状态机状态类
 * @date ###### Tue Dec 24 23:41:35 CST 2024
 */

import { animation, AnimationClip, Sprite, SpriteFrame } from "cc"
import { sortSpriteFrame } from "../Utils/Utils";
import { DataManager } from "../Global/DataManager";
import { StateMachine } from "./StateMachine";

//TODO:动画播放速度
export const ANIMATION_SPEED = 1 / 10;

/**
 * 状态：每组动画的承接容器
 */
export class State{
    private _animationClip:AnimationClip;
    private _fsm:StateMachine;
    private _path:string;
    /**动画剪辑表示一段使用动画编辑器编辑的关键帧动画或是外部美术工具生产的骨骼动画，asset资源对象*/
    private _wrapMode:AnimationClip.WrapMode = AnimationClip.WrapMode.Normal;
    private _force:boolean;

    //#region 
    private _count:number = 0;
    //#endregion


    constructor(fsm:StateMachine, path:string, wrapMode:AnimationClip.WrapMode, force:boolean = false){
        this._fsm = fsm;
        this._path = path;
        this._wrapMode = wrapMode;
        this._force = force;

        //生成动画轨道属性
        //生成对象轨道（仅包含一条曲线）
        const track = new animation.ObjectTrack();
        //添加轨道路径，指定了在 运行时 如何从当前节点对象寻址到目标对象
        /**
         * 1. 找到节点上的Sprite组件
         * 2. 找到spriteFrames属性 属性名小写，煞笔Cocos
         */
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        const spriteFrames = DataManager.Instance.TextureMap.get(this._path);
        const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [index * ANIMATION_SPEED, item]);
        //const frames:Array<[number, SpriteFrame]> = spriteFrames.map((item:SpriteFrame, index:number)=>[ANIMATION_SPEED*index, item]);
        track.channel.curve.assignSorted(frames);

        //添加轨道
        this._animationClip = new AnimationClip();
        this._animationClip.name = this._path;
        this._animationClip.duration = frames.length * ANIMATION_SPEED;
        this._animationClip.addTrack(track);
        this._animationClip.wrapMode = this._wrapMode;
    }


    run(){
        if(this._fsm.AnimComponent.defaultClip?.name === this._animationClip.name && !this._force){
            return;
        }
        this._fsm.AnimComponent.defaultClip = this._animationClip;
        //console.log('before play:', this._fsm.AnimComponent.getState(this._animationClip.name));
        this._fsm.AnimComponent.play();
        //console.log('after play:', this._fsm.AnimComponent.getState(this._animationClip.name));
    }
}
