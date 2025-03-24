/**
 * @author Lucida
 * @description 单例
 * @date Mon Dec 23 23:49:57 CST 2024
 */

export function Singleton<T>() {
    class Singleton {
        private static _instance: T;

        /**
         * 获取该类的唯一实例
         * @returns {T} 返回该类的唯一实例
         */
        public static get Instance(): T {
            return Singleton._instance ??= new this() as T
        }
    }
    return Singleton;
}