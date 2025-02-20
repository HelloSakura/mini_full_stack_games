/**
* @author Lucida
* @description: 角色控制
* @date: 2025/02/21
*/

import { _decorator, Component} from "cc";
import { DataManager } from "../../Global/DataManager";
import { InputTypeEnum } from "../../Common";

const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends Component{
    

    onLoad(){

    }

    update(dt){
        //没有用事件，而是根据摇杆的标量来判断是否有移动
        if(DataManager.Instance.JoystickManager.input.length() > 0){
            //摇杆在移动
            DataManager.Instance.applyInput({
                id:1,
                type:InputTypeEnum.ActorMove,
                direction:{x:10,y:10},
                dt:10
            })
            console.log(DataManager.Instance.State.actors[0]);
        }
    }
}
