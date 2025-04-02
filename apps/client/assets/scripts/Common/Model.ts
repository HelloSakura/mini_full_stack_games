import { IMsgPlayerJoinReq as IApiPlayerJoinReq, IMsgPlayerJoinRsp as IApiPlayerJoinRsp, IMsgPlayerListReq as IApiPlayerListReq, IMsgPlayerListRsp as IApiPlayerListRsp } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgPlayerList, IMsgServerSync } from "./Msg";

/**
* @author Lucida
* @description: 协议类型规范
* @date: 2025/03/24
*/
export interface IModel{
    api:{
        [ApiMsgEnum.ApiPlayerJoin]:{
            req:IApiPlayerJoinReq
            rsp:IApiPlayerJoinRsp
        },

        [ApiMsgEnum.ApiPlayerList]:{
            req:IApiPlayerListReq
            rsp:IApiPlayerListRsp
        }
    }
    msg:{
        [ApiMsgEnum.MsgPlayerList]:IMsgPlayerList
        [ApiMsgEnum.MsgClientSync]:IMsgClientSync
        [ApiMsgEnum.MsgServerSync]:IMsgServerSync
    }
}