/**
 * @author Lucida
 * @description 状态机状态类
 * @date ###### Tue Dec 24 23:41:35 CST 2024
 */

import { animation, AnimationClip, Sprite, SpriteFrame } from "cc"
import StateMachine from "./StateMachine";
import { sortSpriteFrame } from "../Utils/Utils";
import { DataManager } from "../Global/DataManager";

//TODO:动画播放速度
export const ANIMATION_SPEED = 1 / 10;

/**
 * 状态：每组动画的承接容器
 */
export default class State{
    private _animationClip:AnimationClip;
    private _fsm:StateMachine;
    private _path:string;
    /**动画剪辑表示一段使用动画编辑器编辑的关键帧动画或是外部美术工具生产的骨骼动画，asset资源对象*/
    private _wrapMode:AnimationClip.WrapMode = AnimationClip.WrapMode.Normal;
    private _force:boolean;


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
         * 2. 找到SpriteFrames属性
         */
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('SpriteFrame');
        const spriteFrames = DataManager.Instance.TextureMap.get(this._path);
        const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [index * ANIMATION_SPEED, item]);
        track.channel.curve.assignSorted(frames);

        //添加轨道
        this._animationClip = new AnimationClip();
        this._animationClip.name = this._path;
        this._animationClip.duration = frames.length * ANIMATION_SPEED;
        this._animationClip.addTrack(track);
        this._animationClip.wrapMode = this._wrapMode;
    }


    run(){
        // TODO: 为啥子这样写
        if(this._fsm.Animation.defaultClip?.name === this._animationClip.name && !this._force){
            return;
        }
        this._fsm.Animation.defaultClip = this._animationClip;
        this._fsm.Animation.play();
    }


}
