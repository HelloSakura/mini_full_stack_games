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

export enum EntityStateEnum {
  Idle = "Idle"
}
  
export enum EventEnum {
  Init = 'Init'
}

//PrefabPathEnum的key必须和EntityTypeEnum的value一致
export enum PrefabPathEnum {
  Actor1 = 'prefab/Actor',
  Map = 'prefab/Map'
}