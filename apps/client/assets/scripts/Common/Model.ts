import { IMsgPlayerJoinReq, IMsgPlayerJoinRsp } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgServerSync } from "./Msg";

/**
* @author Lucida
* @description: 协议类型规范
* @date: 2025/03/24
*/
export interface IModel{
    api:{
        [ApiMsgEnum.MsgPlayerJoin]:{
            req:IMsgPlayerJoinReq,
            rsp:IMsgPlayerJoinRsp
        }
    }
    msg:{
        [ApiMsgEnum.MsgClientSync]:IMsgClientSync
        [ApiMsgEnum.MsgServerSync]:IMsgServerSync
    }
}