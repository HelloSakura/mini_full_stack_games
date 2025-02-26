import { _decorator, Component, EventTouch, Input, input, Node, UITransform, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoystickManager')
export class JoystickManager extends Component {
    //对外暴露的移动向量
    public input:Vec2 = Vec2.ZERO;

    @property({type:Node, tooltip: 'Body'})
    private body:Node = null;

    @property({type:Node, tooltip: 'Joystick'})
    private joystick:Node = null;


    //摇杆初始坐标
    private _defaultPos:Vec2;
    //摇杆半径
    private _radius:number = 0;

    onLoad(){
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this._init();
    }

    onDestroy(){
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }


    //初始化各项数据
    private _init(){
        if(this.body){
            const pos = this.body.getPosition();
            this._defaultPos = new Vec2(pos.x, pos.y);

            const uiTrans = this.body.getComponent(UITransform);
            this._radius = uiTrans.contentSize.width / 2;
        }

    }

    onTouchStart(event: EventTouch){
        let touchPos = event.getUILocation();
        this.body.setPosition(touchPos.x, touchPos.y);
    }

    onTouchEnd(event: EventTouch){
        this.body.setPosition(this._defaultPos.x, this._defaultPos.y);
        this.joystick.setPosition(0, 0);
        this.input = Vec2.ZERO;
        //console.log('End: ', this.input);
    }

    onTouchMove(event: EventTouch){
        let touchPos = event.getUILocation();
        let bodyPos = this.body.getPosition();
        let stickPos = new Vec2(touchPos.x - bodyPos.x, touchPos.y - bodyPos.y);
        
        if(stickPos.length() > this._radius){
            stickPos.multiplyScalar(this._radius / stickPos.length());
        }
        this.joystick.setPosition(stickPos.x, stickPos.y);
        this.input = stickPos.clone().normalize();
        //console.log('Move: ', this.input);

    }
}
