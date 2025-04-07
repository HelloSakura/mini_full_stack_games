
import { IApiPlayerJoinReq, IApiPlayerJoinRsp, IApiPlayerListReq, IApiPlayerListRsp, IApiRoomCreateReq, IApiRoomCreateRsp, IApiRoomJoinReq, IApiRoomJoinRsp, IApiRoomLeaveReq, IApiRoomLeaveRsp, IApiRoomListReq, IApiRoomListRsp } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgPlayerList, IMsgRoomList, IMsgRoomSync, IMsgServerSync } from "./Msg";

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
        },

        [ApiMsgEnum.ApiRoomCreate]:{
            req:IApiRoomCreateReq
            rsp:IApiRoomCreateRsp
        }

        [ApiMsgEnum.ApiRoomList]:{
            req:IApiRoomListReq
            rsp:IApiRoomListRsp
        }

        [ApiMsgEnum.ApiRoomJoin]:{
            req:IApiRoomJoinReq
            rsp:IApiRoomJoinRsp
        }

        [ApiMsgEnum.ApiRoomLeave]:{
            req:IApiRoomLeaveReq
            rsp:IApiRoomLeaveRsp
        }
    }

    msg:{
        [ApiMsgEnum.MsgPlayerList]:IMsgPlayerList
        [ApiMsgEnum.MsgRoomList]:IMsgRoomList
        [ApiMsgEnum.MsgClientSync]:IMsgClientSync
        [ApiMsgEnum.MsgServerSync]:IMsgServerSync
        [ApiMsgEnum.MsgRoomSync]:IMsgRoomSync
    }
}