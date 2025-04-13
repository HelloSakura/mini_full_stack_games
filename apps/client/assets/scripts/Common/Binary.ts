/**
* @author Lucida
* @description: 二进制编码
* @date: 2025/04/13
*/

import { ApiMsgEnum, InputTypeEnum } from "./Enum";
import { IActorMove, IClientInput, ITimePast, IWeaponShoot } from "./State";
import { strDecode, strEncode, toFixed } from "./Utils";


const encodeActorMove = (input: any, view: DataView, index: number) => {
    view.setUint8(index++, input.type)
    view.setUint8(index++, input.id)
    const {direction, dt} = input
    view.setFloat32(index, direction.x)
    index += 4
    view.setFloat32(index, direction.y)
    index += 4
    view.setFloat32(index, dt)
    index += 4
    //console.log("encodeActorMove", view, input, index);
  }
  
  const encodeWeaponShoot = (input: any, view: DataView, index: number) => {
    view.setUint8(index++, input.type)
    view.setUint8(index++, input.owner)
    view.setFloat32(index, input.position.x)
    index += 4
    view.setFloat32(index, input.position.y)
    index += 4
    view.setFloat32(index, input.direction.x)
    index += 4
    view.setFloat32(index, input.direction.y)
    index += 4
    console.log("encodeWeaponShoot", view, input, index);
  }
  
  export const encodeTimePast = (input: any, view: DataView, index: number) => {
    view.setUint8(index++, input.type)
    view.setFloat32(index, input.dt)
    index += 4
    // console.log("encodeTimePast", view, input, index);
  }
  

/**
 * 
 * @param head 
 * @param data 
 * 手搓二进制编码，压缩传输过程中包体大小（把有用的信息提取出来）
 */
//根据数据包的结构决定
// export interface IMsgClientSync{
//     input:IClientInput,
//     frameID:number,
// }
export const binaryEncode = (head:ApiMsgEnum, data:any)=>{
    
    if(head === ApiMsgEnum.MsgClientSync){
        const {input, frameID} = data
        if(input.type === InputTypeEnum.ActorMove){
            //head 1
            //frameID:1,    
            //id:1,
            //type:1,
            //direction:IVec2, 4 + 4
            //dt:4
            let index = 0;
            const arrayBuffer = new ArrayBuffer(1 + 4 + 14);
            const dataView = new DataView(arrayBuffer);
            //head
            dataView.setUint8(index++, head);
            //frameID
            dataView.setUint32(index, frameID);
            index += 4;
            encodeActorMove(input, dataView, index);
            return dataView;
        }
        else if(input.type === InputTypeEnum.WeaponShoot){
            let index = 0
            const ab = new ArrayBuffer(1 + 4 + 18);
            const view = new DataView(ab);
            view.setUint8(index++, head);
            view.setUint32(index, frameID);
            index += 4
            encodeWeaponShoot(input, view, index);
            return view
        }
        else{
            let index = 0
            const ab = new ArrayBuffer(1 + 4 + 5);
            const view = new DataView(ab);
            view.setUint8(index++, head);
            view.setUint32(index, frameID);
            index += 4
            encodeTimePast(input, view, index);
            return view
        }
        
    }
    else if(head === ApiMsgEnum.MsgServerSync){
        const { lastFrameId, inputs } = data
        // console.log("server sync:", data);
        let total = 0
        for (const input of inputs) {
            if (input.type === InputTypeEnum.ActorMove) {
                total += 14
            } else if (input.type === InputTypeEnum.WeaponShoot) {
                total += 18
            } else {
                total += 5
            }
        }
        const ab = new ArrayBuffer(1 + 4 + 1 + total)
        const view = new DataView(ab)
        let index = 0
        view.setUint8(index++, head)
        view.setUint32(index, lastFrameId)
        index += 4
        view.setUint8(index++, inputs.length)
        
        inputs.length >= 5 && console.log('inputs lens:', inputs.length);

        for (const input of inputs) {
          if (input.type === InputTypeEnum.ActorMove) {
            encodeActorMove(input, view, index)
            index += 14
          } else if (input.type === InputTypeEnum.WeaponShoot) {
            encodeWeaponShoot(input, view, index)
            index += 18
          } else {
            encodeTimePast(input, view, index)
            index += 5
          }
        }
        inputs.length >= 5 && console.log("view", view);
        return view
    }
    else{
        let index = 0;
        const str = JSON.stringify(data);
        const ta = strEncode(str);
        const ab = new ArrayBuffer(ta.length + 1);
        const view = new DataView(ab);
        view.setUint8(index++, head);
        for (let i = 0; i < ta.length; i++) {
            view.setUint8(index++, ta[i]);
        }
        return view
    }

}


/**
 * 解码
 */
const decodeActorMove = (view: DataView, index: number) => {
    console.log("decodeActorMove", view, index);
    const id = view.getUint8(index++);
    const directionX = toFixed(view.getFloat32(index));
    index += 4;
    const directionY = toFixed(view.getFloat32(index));
    index += 4;
    const dt = toFixed(view.getFloat32(index));
    index += 4;
    const input:IActorMove = {
      id,
      type:InputTypeEnum.ActorMove,
      direction: {
        x: directionX,
        y: directionY,
      },
      dt
    }
    console.log("decodeActorMove", input);
    return input;
  }


const decodeWeaponShoot = (view: DataView, index: number) => {
    const owner = view.getUint8(index++);
    const positionX = toFixed(view.getFloat32(index));
    index += 4;
    const positionY = toFixed(view.getFloat32(index));
    index += 4;
    const directionX = toFixed(view.getFloat32(index));
    index += 4;
    const directionY = toFixed(view.getFloat32(index));
    index += 4;
    const input:IWeaponShoot = {
      owner,
      type: InputTypeEnum.WeaponShoot,
      position: {
        x: positionX,
        y: positionY,
      },
      direction: {
        x: directionX,
        y: directionY,
      },
    }
    return input
  }
  
  const decodeTimePast = (view: DataView, index: number) => {
    const dt = toFixed(view.getFloat32(index))
    index += 4
    const input:ITimePast = {
      type:InputTypeEnum.TimePast,
      dt,
    }
    return input;
  }
  

export const binaryDecode = (buffer:ArrayBuffer)=>{
    let index = 0;
    const view = new DataView(buffer);
    const head = view.getUint8(index++);

    if (head === ApiMsgEnum.MsgClientSync) {
        const frameId = view.getUint32(index);
        index += 4;
        const inputType = view.getUint8(index++);
        if (inputType === InputTypeEnum.ActorMove) {
            const input = decodeActorMove(view, index);
            return {
                head: head,
                data: {
                  frameId,
                  input
                }
            }
        } 
        else if (inputType === InputTypeEnum.WeaponShoot) {
            const input = decodeWeaponShoot(view, index);
            return {
                head: head,
                data: {
                    frameId,
                    input
                }
        }
        } 
        else {
            const input = decodeTimePast(view, index);
                return {
                    head: head,
                    data: {
                        frameId,
                        input
                    }
                }
        }
    } 
    else if (head === ApiMsgEnum.MsgServerSync) {
        const lastFrameId = view.getUint32(index);
        index += 4;
        const len = view.getUint8(index++);
        const inputs:IClientInput[] = [];
        for (let i = 0; i < len; i ++) {
            const inputType = view.getUint8(index++);
            if (inputType === InputTypeEnum.ActorMove) {
                inputs.push(decodeActorMove(view, index));
                index += 13;
            } 
            else if (inputType === InputTypeEnum.WeaponShoot) {
                inputs.push(decodeWeaponShoot(view, index));
                index += 17;
            } 
            else {
                inputs.push(decodeTimePast(view, index));
                index += 4;
            }
        }
        return {
            head: ApiMsgEnum.MsgServerSync,
            data: {
                lastFrameId,
                inputs
            }
        }
    } 
    else {
        return {
            head: head,
            data: JSON.parse(strDecode(new Uint8Array(buffer.slice(1))))
        }
    }
}