/**
* @author Lucida
* @description: 工具类
* @date: 2025/04/14
*/

/**
 * 
 * @param value 值
 * @param digits 保留位数
 * @returns 浮点数同步，截断为digits指定的位数
 */
export const toFixed = (value: number, digits: number = 3) => {
    const scale = Math.pow(10, digits);
    return Math.floor(value * scale) / scale;
}


/**
 * 字符串编码
 */
export const strEncode = (str: string) => {
    let byteArray:number[] = [];
    for(let i = 0; i < str.length; i++){
        let charCode = str.charCodeAt(i);
        if(charCode < 0x7f){
            byteArray.push(charCode);
        }
        else if(charCode < 0x7ff){
            byteArray.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
        }
        else if(charCode < 0xffff){
            byteArray.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0xfc0), 0x80 | (charCode & 0x3f));
        }
        else{
            byteArray.push(0xf0 | (charCode >> 18), 0x80 | ((charCode >> 12) & 0x3f0000), 0x80 | ((charCode >> 6) & 0xfc0), 0x80 | (charCode & 0x3f));
        }
    }
    return new Uint8Array(byteArray);
}


/**
 * 字符串解码
 */
export const strDecode = (bytes:Uint8Array) => {
    let array:number[] = [];
    let offset = 0;
    let charCode = 0;
    let end = bytes.length;
    while(offset < end){
        if(bytes[offset] < 128){    //[0x00, 0x80)
            charCode = bytes[offset];
            offset += 1;
        }
        else if(bytes[offset] < 224){ //[0x80, 0x800) head 0x110xxxxx
            charCode = ((bytes[offset] & 0x3f) << 6) | (bytes[offset + 1] & 0x3f);
            offset += 2;
        }
        else if(bytes[offset] < 240){ //[0x800, 0x10000) head 0x1110xxxx
            charCode = ((bytes[offset] & 0x3f) << 12) | ((bytes[offset + 1] & 0x3f) << 6) | (bytes[offset + 2] & 0x3f);
            offset += 3;
        }
        else{ //[0x10000, 0x110000) head 0x11110xxx
            charCode = ((bytes[offset] & 0x3f) << 18) | ((bytes[offset + 1] & 0x3f) << 12) | ((bytes[offset + 2] & 0x3f) << 6) | (bytes[offset + 3] & 0x3f);
            offset += 4;
        }
        array.push(charCode);
    }
    return String.fromCharCode.apply(null, array);
}