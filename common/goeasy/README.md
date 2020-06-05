#goeasy.io
快速打造您的web实时通讯体系，GoEasy API，让websocket更简单。   
系统提醒、聊天、用户上下线提醒、客户端同步。  

#特点
1. 消息必达     
2. 傻瓜式集成   
3. 高速稳定     
4. 安全可靠 

#使用方法
####1. 获取您的appkey   
先注册一个账号，登录后，创建一个应用，就能得到您的appkey。[点击注册](https://www.goeasy.io/cn/signup.html)
####2. 客户端与GoEasy建立连接   
用之前获取的appkey与GoEasy建立长连接，如果您的客户端需要发送消息，请使用common key。如果您的客户端只需要接收消息，不需要发送消息，可以使用subscriber key。
```js
    //创建GoEasy对象
    var goEasy = new GoEasy({
      host: "hangzhou.goeasy.io",//应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
      appkey: "my_appkey",//替换为您的应用appkey
      onConnected: function() {
        console.log('连接成功！')
      },
      onDisconnected: function() {
        console.log('连接断开！')
      },
      onConnectFailed: function(error) {
        console.log('连接失败或错误！')
      }
    });
```
####3. 订阅消息（接收） 
在下一步发送消息之前，您需要先完成订阅操作来准备接收消息，channel可以是英文和数字组成的任意字符串，但不能包含空格。
```js
    goEasy.subscribe({
        channel: "my_channel",//替换为您自己的channel
        onMessage: function (message) {
            alert("Channel:" + message.channel + " content:" + message.content);
        }
    });
```
####4. 发送消息 
发送时，您的channel必须和上一步订阅的channel一致，才可以成功的接收消息。
```js
    goEasy.publish({
        channel: "my_channel", //替换为您自己的channel
        message: "Hello, GoEasy!" //替换为您想要发送的消息内容
    });
```

[更多>>](https://www.goeasy.io/cn/get-start.html)