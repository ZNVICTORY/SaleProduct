<template>
	<view class="content">
		<view class="header" >
			<view class="userinfo">
				<view class="face">
					<template v-if="userInfo.avatar && userInfo.avatar!== null">
						<image :src="'http://'+userInfo.avatar" mode="aspectFill" lazy-load="true"></image>
					</template>
					<template v-else>
						<image src="../../../static/imgs/st_pic.png" mode="aspectFill" lazy-load="true"></image>
					</template>
				</view>
				<view class="info">
					<template v-if="userInfo.name && userInfo.name !== null">
						<view class="username">{{userInfo.name}}</view>
					</template>
					<template v-else>
						<view class="username">未设置用户名</view> 
					</template>
				</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="order_status">
			<view class="status" v-for="item in status" :key="item.key" @click="navToPage(item.to_page, item.name)">
				<image class="icon" :src="item.url" lazy-load="true"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<!--center-menu -->
		<view class="center_menu">
			<view class="menu_item" v-for="item in menus" :key="item.key" @click="navToPage(item.url , item.name)">
				<image :src="item.icon" mode="aspectFill"></image>
				<text>{{item.name}}</text>
			</view>
			<view class="menu_item"  @click="checkUpdate">
				<image :src="checkVersion.icon" mode="aspectFill"></image>
				<text>{{checkVersion.name}}</text>
			</view>
		</view>
		<!-- loginout  -->
		<view class="login-out">
			<button class="log-out-btn" type="default" @click="toLogout">退出登陆</button>
		</view>
	</view>
</template>
<script>
	import { mapMutations, mapState } from 'vuex'
	
	export default {
		data() {
			return {
				status: [{
						key: 1,
						name: '待付款',
						to_page: '../order/order?state=1',
						url: '../../../static/center/one.png'
					},
					{
						key: 2,
						name: '待发货',
						to_page: '../order/order?state=2',
						url: '../../../static/center/2.png'
					},
					{
						key: 3,
						name: '待收货',
						to_page: '../order/order?state=3',
						url: '../../../static/center/2.png'
					},
					{
						key: 4,
						name: '待评价',
						to_page: '../order/order?state=4',
						url: '../../../static/center/3.png'
					},
					{
						key: 5,
						name: '全部订单',
						to_page: '../order/order?state=0',
						url: '../../../static/center/4.png'
					}
				],
				menus: [{
					    name: "密码管理",
						icon:'../../../static/center/1.png',
						url: "../profile/passManage",
						key: 0
				    },
					{
						name: '信息管理',
						icon: '../../../static/center/5.png',
						url: '../profile/profile',
						key: 1,
					},
					{
						name: '地址管理',
						icon: '../../../static/center/6.png',
						url: '../address/address',
						key: 2,
					},
					{
						name: '意见反馈',
						icon: '../../../static/center/9.png',
						url: "../feedback/feedback",
						key: 5,
					},
					{
						name: '关于我们',
						icon: '../../../static/center/10.png',
						url: "../aboutLive/aboutLive",
						key: 6,
					}
				],
				checkVersion: {
					name: '检查更新',
					icon: '../../../static/center/10.png',
				}
			};
		},
		onLoad() {
			// this.init()
		},
		computed: mapState({
			userInfo: state => state.info.userInfo
		}),
		methods: {
			...mapMutations(["setLogoutState"]),
		    //退出登录
		    toLogout(){
		    	uni.showModal({
		    	    content: '确定要退出登录么',
		    	    success: (e)=>{
		    	    	if(e.confirm){
							this.setLogoutState()
		    				uni.reLaunch({
		    					url: "/pages/public/login"
		    				})
		    	    	} else if(e.cancel) {
							this.$apis.msg('取消登陆')
						}
		    	    }
		    	})
		    },
			// 跳转目标页面
			navToPage(url, name) {
				this.$apis.msg(name)
				uni.navigateTo({
					url: url
				})
			},
			// 检查软件是否更新
			async checkUpdate() {
				uni.showLoading({
					title: '正在检查'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.$apis.msg('当前已是最新版本')
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		width: 100%;
	}
.content {
	position: absolute;
	z-index: 0;
	margin: 0 0;
	display: block;
	width: 100%;
	.header{
		padding:0 4%;
		&.status{
			padding-top:var(--status-bar-height);}
		    background:#ed1c24;
			width:92%;
			height:30vw;
			display:flex;
			align-items:center;
			justify-content: center;
		.userinfo{
			width:90%;display:flex;
			flex-direction: row;
			align-items: flex-end;
			.face{flex-shrink:0;width:20vw;height:20vw;
				image{width:100%;height:100%;border-radius:100%;border: 2px solid #FFFFFF;background: #FFFFFF;}
			}
			.info{
				display:flex;flex-flow:wrap;padding-left:30upx;
				.username{width:100%;color:#fff;font-size:38upx;letter-spacing:.5px;}
			}
		}
	}
	
	.order_status {
		display: flex;
		justify-content: space-between;
		margin: 35upx 35upx;
		background: #FFFFFF;
		border-radius: 10px;
		.status {
			// padding: 30upx 0;
			width: 140upx;
			height: 140upx;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			align-items: center;
			flex-direction: column;
			.icon {
				width: 50upx;
				height: 50upx;
				margin: 30upx auto;
				margin-bottom: 5px;	
			}
			&:hover {
				background: #F6F6F6 !important;
			}
		}
	}
	
	
	.center_menu {
			width: 100%;
			display: inline-block;
			.menu_item {
				font-size: 28upx;
				letter-spacing: 1px;
				padding: 14px 5%;
				background: #FEFEFE;
				overflow: hidden;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				position: relative;
				border-bottom: 1px solid #EFEFEF;
				&:hover {
					background: #F6F6F6 !important;
				}
	
				&::after {
					content: '';
					width: 30upx;
					height: 30upx;
					position: absolute;
					right: 5%;
					background: url('../../../static/center/right.png') no-repeat;
					background-size: 100%;
				}
	            &:nth-of-type(1) {
					border-top: 1px solid #EFEFEF;
				}
				text:nth-of-type(1) {
					margin-left: 10px;
				}
				image {
					width: 40upx;
					height: 40upx;
				}
			}
		}
	.login-out {
		margin-top: 30px;
		.log-out-btn {
			color: #FFFFFF;
			width: 75% ;
			border: 0;
			background-color: $color-primary;
		}
		.hover {
			
		}
	}
}
.hover{background-color:#eee}
</style>
