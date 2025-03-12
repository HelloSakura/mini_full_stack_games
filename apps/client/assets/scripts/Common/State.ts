/**
* @author Lucida
* @description: 角色及角色状态
* @date: 2025/02/21
*/

import { EntityTypeEnum, InputTypeEnum } from "./Enum"

export interface IVec2{
    x:number,
    y:number
}

export interface IActor{
    id:number,  //角色id
    position:IVec2,
    direction:IVec2,
    type:EntityTypeEnum,    //角色类型，在State里面通过类型区分出路径，决定加载哪一种图片
    weaponType:EntityTypeEnum,  //武器类型
    bulletType:EntityTypeEnum,  //子弹类型，可以混搭
}

export interface IBullet{
    id:number,  //子弹id
    owner:number,   //从属于角色id
    position:IVec2,
    direction:IVec2,
    bulleType:EntityTypeEnum,    //子弹类型
}


export interface IState{
    actors:IActor[],
    bullets:IBullet[],
    nextBulletID:number
}


export type IClientInput = IActorMove | IWeaponShoot | ITimePast;

export interface IActorMove{
    id:number,
    type:InputTypeEnum.ActorMove,
    direction:IVec2,
    dt:number       //时间
}

export interface IWeaponShoot{
    owner:number,
    type:InputTypeEnum.WeaponShoot,
    position:IVec2,
    direction:IVec2,
}

export interface ITimePast{
    type:InputTypeEnum.TimePast,
    dt:number
}

