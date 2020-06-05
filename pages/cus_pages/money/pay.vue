<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{totalPrice}}</text>
		</view>
		<view class="pay-type-list">
			<view class="type-item b-b" @click="changePayType(1)">
				<image src="../../../static/imgs/weixin.png" style="width: 25px;height: 25px; margin-right: 10upx;" mode="aspectFill"></image>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(2)">
				<image src="../../../static/imgs/zhifubao.png" style="width: 28px;height: 28px;margin-right: 10upx;" mode="aspectFill"></image>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
		</view>	
		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
	export default {
		components:{
			uniIcons
		},
		data() {
			return {
				payType: 1,
				totalPrice: 0,
				order_id: ""
			};
		},
		onLoad(options) {
			// console.log(options.order_id)
			this.order_id = options.order_id
			this.init()
		},
		methods: {
			// 页面初始化
			init() {
				this.getPayMoney()
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: function() {
				this.confirmPay()
				uni.redirectTo({
					url: './paySuccess'
				})
			},
			// 获取支付金额
			async getPayMoney() {
				const uid = this.$store.state.info.uid
				const result = await this.$apis.getPayMoney({uid: uid, order_id: this.order_id})
				if(result.code === "000000") {
					result.data.forEach(item => {
						this.totalPrice = this.totalPrice + Number(item.total_price)
					})
				}
			},
			// 确认支付
			async confirmPay() {
				const uid = this.$store.state.info.uid
				const data = { pay_type: this.payType, uid: uid, order_id: this.order_id }
				const result = await this.$apis.confirmPay(data)
				if(result.code === "000000") {
					uni.showToast({
						title: "支付成功"
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color:$color-primary;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
