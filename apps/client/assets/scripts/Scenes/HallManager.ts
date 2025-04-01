/**
* @author Lucida
* @description: 大厅场景
* @date: 2025/03/31
*/

import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { ApiMsgEnum, IMsgPlayerList } from "../Common";
import { PlayerManager } from "../UI/PlayerManager";
import { NetWorkManager } from "../Global/NetWorkManager";

const {property,ccclass} = _decorator

@ccclass('HallManger')
export class HallManger extends Component{
    @property(Node)
    private playerContainer:Node;
    @property(Prefab)
    private playerPrefab:Prefab;

    onLoad(){
        NetWorkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
    }

    onDestroy(){
        NetWorkManager.Instance.unListen(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this);
    }

    start(){
        this.getPlayer();
    }

    async getPlayer(){
        //获取玩家列表
        const {success, error, data} = await NetWorkManager.Instance.callApi(ApiMsgEnum.MsgPlayerList, {});
        if(!success){
            console.log("Get player list error:", error);
            return;
        }
        this.renderPlayer(data);
    }

    public renderPlayer({list}:IMsgPlayerList){
        if(!this.playerContainer || !this.playerPrefab) return;
        
        for(const child of this.playerContainer.children){
            child.active = false;
        }

        while(!this.playerContainer.children || this.playerContainer.children.length < list.length){
            let node = instantiate(this.playerPrefab);
            node.setParent(this.playerContainer);
            node.active = false;
        }

        for(let i = 0; i < list.length; i++){
            const player = list[i];
            const node = this.playerContainer.children[i];
            node.active = true;
            const component = node.getComponent(PlayerManager);
            component.setData(player)
        }

    }
}