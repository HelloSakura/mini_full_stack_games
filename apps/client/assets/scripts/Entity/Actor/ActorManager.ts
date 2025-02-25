/**
* @author Lucida
* @description: 角色控制
* @date: 2025/02/21
*/

import { _decorator, Component} from "cc";
import { DataManager } from "../../Global/DataManager";
import { IActor, InputTypeEnum } from "../../Common";

const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends Component{
    

    init(data:IActor){

    }

    update(dt){
        //没有用事件，而是根据摇杆的标量来判断是否有移动
        if(DataManager.Instance.JoystickManager.input.length() > 0){
            const {x, y} = DataManager.Instance.JoystickManager.input
            //摇杆在移动
            DataManager.Instance.applyInput({
                id:1,
                type:InputTypeEnum.ActorMove,
                direction:{x,y},
                dt:10
            })
            console.log(DataManager.Instance.State.actors[0].position.x, DataManager.Instance.State.actors[0].position.y);
        }
    }

    render(data:IActor){
        this.node.setPosition(data.position.x, data.position.y)
    }
}
