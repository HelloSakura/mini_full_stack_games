# 帧同步

**封装成input来改变一个个state**
>简单概括就是上面这句话
>当用户操作摇杆发生有效交互时，
>为了达到帧同步，在battle manager完成对每一个实体的渲染
***注意一下避免update里面出现异步加载的技巧， 设置标志位，load完资源后在置位，没有置位前update无法执行render***


# 状态机
***需要理清状态机的设计思路和实现方式***
单个state是最基础的，决定了该状态要做的事情，譬如播放某段动画
角色manager存有对应全部的statMachine（这里用的map<k,v>）的结构，会对外面状态进行响应，进行相应的状态切换
到了这一步状态处理就交给了StateMachine内部进行处理，譬如例子里面的
ActorManager -> State = xxx
StateMachine -> setParams(xxx, true), 表示跳转到该状态, 同时修改curState
    StateMachine -> run(), 根据状态进行状态切换
        CurrentState -> StateMachine.get(xxx), 获得具体状态or子状态机的句柄
        CurrentState -> run(), 运行该状态对应的操作
    StateMachine -> resetTrigger(), 重置状态切换标志位
利用继承和组合关系实现的状态切换，stateMachine会记录当前状态，记录状态机接受的参数，每次状态改变时根据参数从自己的状态集取出状态，进行切换


# 子弹
同控制移动一样，需要一整套的封装操作
通过事件监听，ShootManager发送事件
WeaponManager里面监听事件，进行相应处理，

