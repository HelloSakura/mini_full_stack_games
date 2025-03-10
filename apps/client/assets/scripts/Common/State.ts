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
    id:number,
    position:IVec2,
    direction:IVec2,
    type:EntityTypeEnum,    //角色类型，在State里面通过类型区分出路径，决定加载哪一种图片
    weaponType:EntityTypeEnum,  //武器类型
}


export interface IState{
    actors:[IActor],
}


export interface IActorMove{
    id:number,
    type:InputTypeEnum.ActorMove,
    direction:IVec2,
    dt:number       //时间
}
