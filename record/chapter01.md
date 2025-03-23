# 一些记录
    [monorepo项目](#monorepo项目)
    [Promise](#promise)
    [Cocos动画](#cocos动画)
    [WebSocket通信](#WebSocket通信)


## monorepo项目
安装yarn包管理，安装依赖包，为什么要安装依赖包，这些东西是干什么的;
**就是一个包管理工具，负责安装依赖模块，可以自己构建一些脚本来完成部署和同步的工作**

package.json脚本的玩法
类似于makefile，k-v的方式层层解析，yarn xx来执行命令，关系及命令有package.json中定义


## Promise
熟悉了Promise的用法，resolve和reject与then和catch之间的关系，对于一个Promise
```typescript
return new Promise((resolve, reject) => {
    if(flag){
        resolve(1);
    }
    reject(2);
});
```
要拿到数据的话，还是有问题
通过resolve返回的succeed的结果，被then捕获，resolve即then后面包装的方法
通过reject返回的failed的结果，被catch捕获，reject即即catch后面包装的方法

Promise.all是一个好东西，避免一个又一个await

## Cocos动画

### 什么是轨道Track

[程序化编辑轨道](https://docs.cocos.com/creator/3.8/manual/zh/animation/use-animation-curve.html#%E7%A8%8B%E5%BA%8F%E5%8C%96%E7%BC%96%E8%BE%91%E5%8A%A8%E7%94%BB%E5%89%AA%E8%BE%91)

### Cocos动画轨道

简单来讲就是通过动画剪辑添加多个属性轨道来控制不同的属性


## WebSocket通信

使用webSoceket和WebSocketServer对象，绑定同一地址来建立连接
Ws对象中绑定各个事件来处理响应，尤其是ws.onMessage事件，注意try...catch处理转换过程中的报错
以及定义的结构在前后端解析的过程中保持一致
```typescript
//客户端
    this._ws = new WebSocket(`ws://localhost:${this._port}`);
    this._ws.onmessage = (msg)=>{
        try{
            let json = JSON.parse(msg.data);
            //解构，head和data前后端约定的结构
            const {head, data} = json;
            this._emit(head, data);
        }
        catch(e){
            console.log("ws onmessage error:", e);
        }

    }

//服务端
    wss.on("connection", (socket) => {
    socket.on("message", (buffer) => {
        const str = buffer.toString();
        try{
            const msg = JSON.parse(str);
            const {head, data} = msg;
            const {frameID, input} = data;
            inputs.push(input);
        }
        catch(e){
            console.log("ws onmessage error:", e);
        }
    });
```


## 帧同步

简单来讲，拿移动距离，客户端移动摇杆产生的数据，先封装好发给服务器，在由服务器回给客户端，客户端根据服务器的数据去更新实体状态