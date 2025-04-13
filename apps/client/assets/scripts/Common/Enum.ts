/**
* @author Lucida
* @description: 枚举定义
* @date: 2025/02/21
*/


export enum InputTypeEnum {
    ActorMove       = 1, // 'ActorMove',    //角色移动
    WeaponShoot     = 2, //'WeaponShoot',    //开火
    TimePast        = 3, //'TimePast',  //时间流逝
}


export enum EntityTypeEnum{
    Init        = 'Init',
    Actor1      = 'Actor1',
    Map         = 'Map',
    Weapon1     = 'Weapon1',
    Bullet1     = 'Bullet1',
    Bullet2     = 'Bullet2',
    Explosion   = 'Explosion',
}

export enum ApiMsgEnum{
    ApiPlayerJoin = 1,    //玩家加入
    ApiPlayerList = 2,    //玩家列表
    ApiRoomCreate = 3,    //创建房间
    ApiRoomJoin   = 4,    //加入房间
    ApiRoomList   = 5,    //房间列表
    ApiRoomLeave  = 6,    //离开房间
    ApiGameStart  = 7,    //游戏开始
    MsgClientSync = 8,    //客户端同步
    MsgServerSync = 9,
    MsgPlayerList = 10,    //玩家同步（通过消息）
    MsgRoomList   = 11,    //房间列表同步
    MsgRoomSync   = 12,    //房间内部信息同步 
    MsgGameStart  = 13,    //游戏开始
}