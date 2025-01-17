/**
 * @author Lucida
 * @description 单例, 返回一个类，私有成员
 * @date Mon Dec 23 23:49:57 CST 2024
 */

export function Singleton<T>(){
    class Singleton{
        private static _instance: T;
        
        public static get Instance():T{
            return Singleton._instance ??= new this() as T;
        }
    }

    return Singleton;
}

