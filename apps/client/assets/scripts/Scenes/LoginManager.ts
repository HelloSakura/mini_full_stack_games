/**
* @author Lucida
* @description: 登录场景
* @date: 2025/03/24
*/

import { _decorator, Button, Component, director, EditBox } from "cc";
import { NetWorkManager } from "../Global/NetWorkManager";
import { ApiMsgEnum } from "../Common";
import { DataManager } from "../Global/DataManager";
import { SceneEnum } from "../Enum/Enum";

const {property,ccclass} = _decorator

@ccclass('LoginManager')
export class LoginManager extends Component{
    @property(EditBox)
    private input:EditBox;
    @property(Button)
    private loginButton:Button;

    onLoad(){
        this.loginButton.node.on(Button.EventType.CLICK, this._handleLoginBtnClicked, this);
        //预加载更快跳转
        director.preloadScene(SceneEnum.Hall);
    }

    async start(){
        await NetWorkManager.Instance.connect();
    }

    private async _handleLoginBtnClicked(){
        if(!NetWorkManager.Instance.IsConnected){
            console.log("Not connected to the server!");
            await NetWorkManager.Instance.connect();
            return;
        }

        const name = this.input?.string;
        if(!name){
            console.log("Please input your name!");
            return;
        }
        
        const {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.ApiPlayerJoin, {
            name:name,
        });
        if(!success){
            console.log("Login error:", error);
            return;
        }

        DataManager.Instance.SelfPlayerID = data.player.playerID;
        console.log("Login success ret:", data);
        director.loadScene(SceneEnum.Hall);
    }
}
