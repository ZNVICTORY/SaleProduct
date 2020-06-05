import GoEasy from './goeasy/index.js'

export default new GoEasy({
	 host: "hangzhou.goeasy.io",//应用所在的区域地址
	 appkey: "BC-316435b98694446e8707a97395679aae",
	 onConnected: function() {
         console.log('连接成功！')
	 },
	 onDisconnected: function() {
		console.log('连接断开')
	 },
	 onConnectFailed: function(error) {
	    console.log('连接失败或错误', error)
	 }
})