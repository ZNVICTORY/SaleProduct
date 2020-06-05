<template>
	<view id="play"></view>
</template>

<script>
	
	export default {
		data() {
			return {
				currentWebView: null,    //容器存放当前页面
				player: null,            // 放置播放器
				isShowProduct: false,    // 商品子窗口默认不展示
				isDetail: false,         // 商品详细页面默认不展示
				livePlay: {
					live_id: '',         // 直播间ID	
					live_url: '',        // 直播地址
					live_avatar: '',     // 拉流图片
					shop: {},
					isfollow: false
				}
			}
		},
		onLoad(data) {
			this.livePlay.live_id = data.live_id
			console.log(data)
			// 页面初始化
			this.monitor()
			// 监听窗体消息
			// this.init()
		},
		mounted() {
			this.init()
		},
		methods: {
			async getLivePlay() {
				const result = await this.$apis.getLivePlay({live_id: String(this.livePlay.live_id)})
				if(result.code === "000000" && result.data) {
					const data  = { ...result.data }
					this.livePlay.live_url = data.live_url
					this.livePlay.live_avatar = data.live_avatar
					this.livePlay.isfollow = data.isfollow
					console.log(data.shop_id)
					uni.$emit("shop_id", data)
					uni.$emit('head', data)
				}
			},
			/*
			 *  页面初始化
			 */
			async init() {
				await this.getLivePlay()
				this.getwebView()
				this.getSubNvue()
				this.enterLive()
			},
			/**
			 * 监听窗体消息
			 * */
			monitor() {
				// 接收弹幕
				this.receiveMsg(this.livePlay.live_id)
				// 发送弹幕
				uni.$on("barrage", (data) => {
					const channel = this.livePlay.live_id
					const content = {
						name: this.$store.state.info.userInfo.name,
						message: data.msg
					}
					this.sendMsg(this.livePlay.live_id, JSON.stringify(content))
				})
				// 用户是否关注该直播间
				uni.$on("heart", (data) => {
					// console.log(data)
					this.sendMsg(this.livePlay.live_id, JSON.stringify(data))
				})
			},
			/**
			 *  获取当前显示的 webview 实例，方便操作
			 */
			getwebView() {
				const pages = getCurrentPages()       //获取所有页面对象,数组的最后一个是当前页面
				const page = pages[pages.length - 1]  // 获取当前页面
				//#ifdef APP-PLUS
				const webView = page.$getAppWebview() // 得到当前页面的对象实例
				this.currentWebView = webView
				//#endif
				this.plusPlay()                       //创建Liveplay 对象
			},
			/**
			 * 创建播放器，即拉流对象
			 */
			plusPlay() {
				const styles = {
					'src': this.livePlay.live_url,                              // 视频地址                                       // 播放器距屏幕上方的像素
					'width': uni.getSystemInfoSync().windowWidth + 'px',        // 播放器的宽度
					'height': uni.getSystemInfoSync().windowHeight + 'px',      // 播放器的高度
					'position': 'static',                                       // 播放器的布局模式
					'objectFit': 'fill',                                        // 视频的表现形式
					'show-fullscreen-btn': false,                               // 播放器的是否显示全屏按钮
					'show-play-btn': false,                                     // 播放器底部控制按钮
					'autoplay': true,                                           // 视频是否自动播放
					'enable-danmu': false,                                      // 是否展示弹幕
					'danmu-btn': false,                                         // 是否显示弹幕按钮
					'show-progress': false,                                     // 不显示播放进度
					'direction': 0,                                             // 设置全屏时的视频方向
					'poster': this.livePlay.live_avatar,                        // 视频封面图片地址
				}
				//  #ifdef APP-PLUS
				this.player = new plus.video.VideoPlayer('play', styles)
				// #endif
				this.currentWebView.append(this.player)
				this.player.addEventListener('waiting', () => {
					this.$apis.msg("视频加载中")
				}, false)
				this.player.addEventListener('error', (err) => {
					// console.log(JSON.stringify(err), "error")
					this.$apis.msg('主播已下线')
				}, false)
			},
			/**
			 * 获取子窗口
			 */
			getSubNvue() {
				const barrage = uni.getSubNVueById('liveBarrage')
				barrage.show()
				const liveFooter = uni.getSubNVueById('liveFooter')
				liveFooter.show()
				const liveHeader = uni.getSubNVueById('liveHeader')
				liveHeader.show()
				const product = uni.getSubNVueById('liveProduct')
				product.hide()
				const detail = uni.getSubNVueById('prodDetail')
				detail.hide()
			},
			/**
			 * 离开直播间弹幕提示
			 * */
			 async outLive() {
				 const channel = this.livePlay.live_id
				 const content = {
					name: this.$store.state.info.userInfo.name,
					message: '已离开直播间'
				 }
				 this.sendMsg(this.livePlay.live_id, JSON.stringify(content))
				 const data = {
				 	uid: this.$store.state.info.uid,
				 	out_time: parseInt(Date.now() / 1000),
				 	live_id: this.livePlay.live_id
				 }
				 await this.$apis.outLive(data)
				 await this.$apis.updateViewMount({type: 'out', live_id:this.livePlay.live_id })
			 },
			 /**
			  * 进入直播间弹幕提示
			  * */
			 async enterLive() {
				 const channel = this.livePlay.live_id
				 const content = {
				 	name: this.$store.state.info.userInfo.name,
				 	message: `已进入直播间`
				 }
				 this.sendMsg(this.livePlay.live_id, JSON.stringify(content))
				 const data = {
				 	uid: this.$store.state.info.uid,
				 	enter_time: parseInt(Date.now() / 1000),
				 	live_id: this.livePlay.live_id
				 }
				 await this.$apis.enterLive(data)
			 },
			 /**
			  * 接收弹幕
			  * */
			  receiveMsg(channel) {
				console.log(channel)
				this.$goEasy.subscribe({
					  channel: String(channel),
					  onMessage: (message) => {
						  uni.$emit("showBarrage", message)
					  }
				  })
			  },
			  // 发送弹幕
			  sendMsg(channel, msg) {
				  console.log(channel ,msg)
				  this.$goEasy.publish({
					  channel: String(channel),
					  message: msg
				  })
			  }
		},
		onBackPress(e) {
			this.currentWebView = null;
		},
		async onUnload() {
			uni.$off("barrage")
			uni.$off("showBarrage")
			uni.$off("shop_id")
			uni.$off("head")
			uni.$off("heart")
			this.outLive()
		}
	}
</script>

