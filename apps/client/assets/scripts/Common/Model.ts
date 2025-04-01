import { IMsgPlayerJoinReq, IMsgPlayerJoinRsp, IMsgPlayerListReq, IMsgPlayerListRsp } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgPlayerList, IMsgServerSync } from "./Msg";

/**
* @author Lucida
* @description: 协议类型规范
* @date: 2025/03/24
*/
export interface IModel{
    api:{
        [ApiMsgEnum.MsgPlayerJoin]:{
            req:IMsgPlayerJoinReq
            rsp:IMsgPlayerJoinRsp
        },

        [ApiMsgEnum.MsgPlayerList]:{
            req:IMsgPlayerListReq
            rsp:IMsgPlayerListRsp
        }
    }
    msg:{
        [ApiMsgEnum.MsgPlayerList]:IMsgPlayerList
        [ApiMsgEnum.MsgClientSync]:IMsgClientSync
        [ApiMsgEnum.MsgServerSync]:IMsgServerSync
    }
}