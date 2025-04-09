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
    ApiPlayerJoin = 'ApiPlayerJoin',    //玩家加入
    ApiPlayerList = 'ApiPlayerList',    //玩家列表
    ApiRoomCreate = 'ApiRoomCreate',    //创建房间
    ApiRoomJoin   = 'ApiRoomJoin',      //加入房间
    ApiRoomList   = 'ApiRoomList',      //房间列表
    ApiRoomLeave  = 'ApiRoomLeave',     //离开房间
    ApiGameStart  = 'ApiGameStart',     //游戏开始
    MsgClientSync = 'MsgClientSync',    //客户端同步
    MsgServerSync = 'MsgServerSync',
    MsgPlayerList = 'MsgPlayerList',    //玩家同步（通过消息）
    MsgRoomList   = 'MsgRoomList',      //房间列表同步
    MsgRoomSync   = "MsgRoomSync",      //房间内部信息同步 
    MsgGameStart  = 'MsgGameStart',     //游戏开始
}