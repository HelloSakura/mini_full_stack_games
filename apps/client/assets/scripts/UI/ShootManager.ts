/**
* @author Lucida
* @description: 射击控制
* @date: 2025/03/11
*/

import { _decorator, Component, EventTouch, Input, input, Node, UITransform, Vec2 } from 'cc';
import { EventManager } from '../Global/EventManager';
import { EventEnum } from '../Enum/Enum';
const { ccclass, property } = _decorator;

@ccclass('ShootManager')
export class ShootManager extends Component {
    public handleWeaponShoot(){
        console.log('shoot btn clicked');
        EventManager.Instance.emit(EventEnum.WeaponShoot);
    }
}
