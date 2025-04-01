/**
* @author Lucida
* @description: 枚举定义
* @date: 2025/02/21
*/


export enum InputTypeEnum {
    ActorMove = 'ActorMove',    //角色移动
    WeaponShoot = 'WeaponShoot',    //开火
    TimePast = 'TimePast',  //时间流逝
}


export enum EntityTypeEnum{
    Init = 'Init',
    Actor1 = 'Actor1',
    Map = 'Map',
    Weapon1 = 'Weapon1',
    Bullet1 = 'Bullet1',
    Bullet2 = 'Bullet2',
    Explosion = 'Explosion',
}

export enum ApiMsgEnum{
    MsgClientSync = 'MsgClientSync',
    MsgServerSync = 'MsgServerSync',
    MsgPlayerJoin = 'MsgPlayerJoin',    //玩家加入
    MsgPlayerList = 'MsgPlayerList',    //玩家列表
    MsgPlayerSync = 'MsgPlayerSync',    //玩家同步（通过消息）
}