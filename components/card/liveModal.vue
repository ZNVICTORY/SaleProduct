<template>
	<view class="live-card" @click="onClick(status)">
		<view class="cardimg" :style="{backgroundImage: 'url('+live_avatar+')'}" >
			<view class="live-status">
				<template v-if="status">
					<view class="status"></view>直播中
				</template>
				<template v-else>
					<view class="status" :style=" {borderColor: '#DDDDDD' }" ></view>未上线
				</template>
			</view>
		</view>
		<view class="view-num">
			<view class="view-num-pic"></view>
			<text>{{view_amount}}人在观看</text>
		</view>
		<view class="live-follow">
			<view class="follow"></view>
			<text>{{att_amount}}</text>
		</view>
		<view class="live-info">
			<view class="left">
				<view class="info">{{introduction}}</view>
				<view class="title">
					<image :src="shop_avatar" mode="aspectFit" lazy-load="true"></image>
					<text>{{user_name}}</text>
				</view>
			</view>
			<view class="right">
				<image alt="商品为空" :src="goods_avatar" mode="aspectFill" lazy-load="true" ></image>
				<text>¥{{goods_price}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniCard',
		props: {
			live_id: {
				type: String | Number,
				default: ''
			},
			goods_avatar: {
				type: String,
				default: ''
			},
			status: {
				type: Boolean,
				default: false
			},
			live_avatar: {
				type: String,
				default: ''
			},
			user_name: {
				type: String,
				default: ''
			},
			introduction: {
				type: String,
				default: ''
			},
			goods_price: {
				type: String ,
				default: ''
			},
			shop_avatar:{
				type: String,
				default:''
			},
			att_amount: {
				type: String | Number
			},
			view_amount: {
				type: String | Number
			}
		},
		onLoad() {
			// console.log(this.goods_id)
		},
		methods: {
			async onClick(status) {
				// console.log(status, this.live_id)
				if(!status) {
					this.$apis.msg('主播不再线')
					return;
				}
				this.$apis.msg('进入直播间')
				await this.$apis.updateViewMount({ live_id: this.live_id, type: 'enter' })
				uni.navigateTo({
					url: '/pages/cus_pages/livePlayer/livePlayer?live_id='+this.live_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.live-card {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		width: 160px;
		border: none;
		margin: 10upx 0;
		.cardimg {
			position: relative;
			height: 200px;
			border-top-right-radius: 5px;
			border-top-left-radius: 5px;
			background-size: 160px 205px;
			background-origin: content-box;
			.live-status {
				position: absolute;
				margin: 20upx 0 0 20upx;
				padding: 0 5px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				height: 20px;
				line-height: 20px;
				border-radius: 5px;
				background: $color-primary;
				color: #FFFFFF;
				font-size: 24upx;
				letter-spacing: .5upx;
				.status {
					display: inline-block;
					vertical-align: middle;
					margin-right: 5px;
					width: 0;
					height: 0;
					border: 3px solid #4CD964;
					border-radius: 50%;
				}
			}
		}
		.live-follow {
				position: absolute;
				display: flex;
				flex-direction: row;
				width: 100upx;
				height: 50upx;
				right: 5upx;
				bottom: 80px;
				padding-right: 3upx;
				justify-content: flex-end;
				color: #FFFFFF;
				.follow {
					display: block;
					margin: 0 5upx;
					width: 50upx;
					height: 50upx;
					background-image: url(../../static/imgs/follow.png);
					background-position: center;
					background-size: 48upx 48upx;
					background-repeat: no-repeat;
				}
				text {
					color: $color-primary;
					margin-top: 15upx;
					font-size: 25upx;
				}
		}
		.view-num {
			position: absolute;
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 50upx;
			color: #FFFFFF;
			top: 20upx;
			right: 5upx;
			.view-num-pic {
				display: block;
				margin: 0 3upx;
				width: 38upx;
				height: 38upx;
				background-image: url(../../static/imgs/view_num_pic.png);
				background-position: center;
				background-size: 38upx 38upx;
				background-repeat: no-repeat;	
			}
			text {
				line-height: 20upx;
				font-size: 20upx;
				color: $color-primary;
			}
		}
		.live-info {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			border-bottom-right-radius: 5px;
			border-bottom-left-radius: 5px;
			height: 65px;
			background: #FFFFFF;
			padding: 10upx 10upx;
			.left {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: flex-start;
				flex: 1;
				height: 60px;
				.info {
					height: 30px;
					padding: 5upx 10upx;
					word-wrap: break-word;
					font-size: 24upx;
					letter-spacing: .5px;
				}
				.title {
					display: flex;
					// height: 30px;
					flex-direction: row;
					align-items: flex-start;
					image {
						width: 40upx;
						height: 40upx;
						border-radius: 50%;
						margin-right: 5upx;
					}
					text {
						font-size: 20upx;
						letter-spacing:.5px;
					}
				}
			}
			.right {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				width: 90upx;
				height: 130upx;
				background: #EFEFF4;
				border-radius: 10upx;
				image {
					width: 90upx;
					height: 90upx;
					border-radius: 10upx;
				}
				text{
					font-size: 24upx;
				}
			}
		}
	}
</style>