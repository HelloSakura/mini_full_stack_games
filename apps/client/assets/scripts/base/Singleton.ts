/**
 * @author Lucida
 * @description 单例
 * @date Mon Dec 23 23:49:57 CST 2024
 */

export default class Singleton<T>{
    //保存类的唯一实例
    private static _instance: any;

    //模板保证继承
    static get Instance(){
        if(!this._instance){
            this._instance = new Singleton();
        }
        return this._instance;
    }

    //构造函数私有化，防止外部创建
    protected constructor(){

    }

}