# 文件目录结构

## Scripts

### Base
>1. EntityManager.ts
>2. Singleton.ts  单例

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


