/**
 * @author Lucida
 * @description 枚举类型
 * @date ###### Tue Dec 24 23:38:42 CST 2024
 */


export enum FsmParamTypeEnum {
    Number = "Number",
    Trigger = "Trigger",
  }
  
export enum ParamsNameEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

//角色状态类型
export enum EntityStateEnum {
  Idle = "Idle",
  Run = 'Run',
  Attack = 'Attack'
}
  
export enum EventEnum {
  Init = 'Init',
  WeaponShoot = 'WeaponShoot',  //开火
}

//PrefabPathEnum的key必须和EntityTypeEnum的value一致
export enum PrefabPathEnum {
  Actor1 = 'prefab/Actor',
  Map = 'prefab/Map',
  Weapon1 = 'prefab/Weapon',
  //Bullet1 = 'prefab/Bullet1',
  Bullet2 = 'prefab/Bullet2',
}

export enum TexturePathEnum {
  Actor1Idle = 'texture/actor/actor1/idle',
  Actor1Run = 'texture/actor/actor1/run',
  Actor2Idle = 'texture/actor/actor2/idle',
  Actor2Run = 'texture/actor/actor2/run',
  Weapon1Idle = 'texture/weapon/weapon1/idle',
  Weapon1Attack = 'texture/weapon/weapon1/attack',
  Weapon2Idle = 'texture/weapon/weapon2/idle',
  Weapon2Attack = 'texture/weapon/weapon2/attack',
  Bullet1Idle = 'texture/bullet/bullet1',
  Bullet2Idle = 'texture/bullet/bullet2'
}
