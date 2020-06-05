<template>
    <view class="main-content">
	    <template  v-if="cartList.length == 0">
			 <image  src="../../../static/cart/emptyCart.jpg" mode="aspectFit"></image>
			 <view style="font-size: 30upx;color:#999999;margin-left: 30upx;">空空如也</view>
	    </template>
		<view  v-else>
			<!-- 列表 -->
			<view class="cart-list">
					<view class="cart-item" v-for="(item, index) in cartList" :key="item.id">
						<view class="image-wrapper">
							<image 
							    class="image-wrapper"
							    :src="item.goods_avatar" 
								mode="aspectFill" 
								lazy-load 
							></image>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.goods_name}}</text>
							<text class="attr">{{item.net_weight}}, {{item.specification}}</text>
							<text class="price">¥{{item.goods_price}}</text>
							<number-box 
								class="step"
								:min="1" 
								:max="parseInt(item.goods_stock)"
								:value="item.goods_num>parseInt(item.goods_stock)?parseInt(item.goods_stock):item.goods_num"
								:isMax="item.goods_num>=parseInt(item.goods_stock)?true:false"
								:isMin="item.goods_num===1"
								:index="index"
								@change="numberChange"
							></number-box>
						</view>
						<view class="operate">
							<switch :checked="item.goods_checked === '1' " @change="changStatus(index)" color="#ed1c24" class="swit"/>
							<uni-icon class="del-btn" type="trash" size="24" @click="delItem(index)"></uni-icon>
						</view>
					</view>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<switch :checked="allChecked" color="#ed1c24" @change="changAll" class="swit-btn" />
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text style="color: #ff9700">合计：</text>
					<text class="price">¥{{ alltotal }}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>
<script>
	import NumberBox from '@/components/uni-number-box/uni-number-box.vue'
	import uniIcon   from '@/components/uni-icons/uni-icons.vue'
	
	export default {
		components: {
			NumberBox,
			uniIcon
		},
		onLoad() {
			if(!this.cartList) {
				uni.showLoading({
					title:"加载中"
				})
			} else {
				uni.hideLoading()
			}
		},
		mounted() {
			this.init()
		},
		data() {
			return {
				allChecked: false,
				total: 0,
				cartList: [],
				emptyCart: '../../../static/cart/emptyCart.jpg'
		}
	},
	computed:{
		alltotal() {
			let sum = 0
			this.cartList.forEach((item) => {
				if(item.goods_checked === "1") {
					sum += item.goods_price * item.goods_num
				}
			})
			return sum.toFixed(2)
		},
		orderList() {
			return this.cartList.filter(item => {
				return item.goods_checked === "1" 
			})
		}
	},
	methods: {
		// 页面初始化
		init() {
			this.getCart()
		},
		// 监听商品数量的变化
		async numberChange(value, index) {
			this.cartList[index].goods_num = value
			const goods_num = value
			const cart_id = this.cartList[index].cart_id
			const data = { cart_id: cart_id, goods_num: goods_num }
			const result = await this.$apis.changCartNum(data)
			if(result.code === "000000") {
				this.cartList[index].goods_num = value
			}
		},
		// 改变商品的状态
		async changStatus(index) {
			const cart_id = this.cartList[index].cart_id
			const status = this.cartList[index].goods_checked === "1" ? "0" : "1"
			const result = await this.$apis.changeCartStatus({cart_id: cart_id, status: status})
			if(result.code === "000000") {
				this.cartList[index].goods_checked = status
			}
		},
		// 删除购物车中的产品
		 delItem(index) {
		  this.$apis.modal("确认删除吗", async (res) => {
			  if(res.confirm) {
			  		const data = { cart_id: this.cartList[index].cart_id, uid: this.cartList[index].uid }
			  		const result = await this.$apis.deleteByLiveid(data)
			  		if(result.code === "000000") {
			  			this.init()
			  			this.$apis.msg("删除成功")
			  		}
			  	}  else if(res.cancel) {
			  		this.$apis.msg("取消删除")
			  }
		  })
		},
		// 全选操作
		changAll() {
			if(!this.allChecked) {
				this.cartList.forEach(item => {
					item.goods_checked = "1"
				})
			}
			else {
				this.cartList.forEach(item => {
					item.goods_checked = "0"
				})
			}
			this.allChecked = !this.allChecked
		},
		// 清空购物车
		clearCart() {
			if(this.allChecked) {
				this.$apis.modal("确定清空购物车吗", (res) => {
					if(res.confirm) {
						this.deleteCartDataAll()
					}
					else if(res.cancel) {
						this.$apis.msg("取消清空")
					}
				})
			}
		},
		// 清空购物车接口
		async deleteCartDataAll() {
			const uid = this.$store.state.info.uid
			const result = await this.$apis.deleteCartByuid({ uid })
			if(result.code === "000000") {
				this.$apis.msg('删除成功')
				this.init()
				return
			}
			this.$apis.msg('删除失败')
		},
		// 获取所有购物车数据
		async getCart() {
			const uid = this.$store.state.info.uid
			const result = await this.$apis.getCartList({uid})
			if(result.code === "000000" && result.data) {
				this.cartList = result.data
			} else {
				this.cartList = []
			}
		},
		// 计算结账
		createOrder(){ 
			// console.log(this.orderList)
			if(this.orderList.length !== 0) {
				this.$apis.msg('跳转结账页面')
				const uid = this.$store.state.info.uid
				uni.navigateTo({
					url: '/pages/cus_pages/order/createOrder?uid='+uid,
					success: ()=>{
						this.$apis.msg('跳转创建订单页面')
					}
		       })
			} else {
				this.$apis.msg('请选购商品')
			}
		}
	},
	// 下拉刷新
	async onPullDownRefresh() {
		await this.$apis.debounce(this.init())
		uni.stopPullDownRefresh();
	}
}
</script>
<style lang="scss" >
    page {
		width: 100%;
		height: 100%;
		display: flex;
		background: #FFFFFF;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		image {
			width: 300upx;
			height: 300upx;
		}
	}
	
    .cart-list {
		position: relative;
	    width: 700upx;
		.cart-item{
			display:flex;
			justify-content: space-between;
			padding:20upx 20upx;
			background: #EEEEEE;
			left: 0;
			border-radius: 8px ;
			margin-bottom: 8px;
			box-shadow: 0 0 10px #FFFFFF;
			.image-wrapper{
				width: 230upx;
				height: 230upx;
				flex-shrink: 1;
				position:relative;
				border-radius: 8px;
			}
			.item-right{
				display:flex;
				flex-direction: column;
				flex: 1;
				align-items: flex-start;
				overflow: hidden;
				position:relative;
				padding-left: 30upx;
				.title,.price{
					font-size:28upx;
					letter-spacing: .5px;
					color: #000000;
					height: 40upx;
					line-height: 40upx;
				}
				.attr{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					height: 50upx;
					line-height: 50upx;
				}
				.price{
					height: 50upx;
					line-height:50upx;
				}
				.step {
					border-radius: 8px;
				}
			}
			.operate {
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-bottom: 30upx;
				.del-btn{
					display: flex;
					flex-direction: row;
					justify-content: center;
					padding:4upx 10upx;
					font-size:34upx; 
					height: 50upx;
					color: $font-color-light;
				}
				.swit {
					transform: scale(0.7);
				}
			}
			
			
		}
	}
	/* 底部栏 */
	.action-section{
		position:fixed;
		bottom: 20upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 700upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.swit-btn {
			height:52upx;
			position:relative;
			width: 52upx;
			margin-left: 10px;
			position:relative;
			z-index: 5;
			transform: scale(0.8);
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 13px;
			z-index: 4;
			width: 0;
			height: 55upx;
			line-height: 52upx;
			padding-left: 100upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:50px 50px 50px 50px;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin-right: 20px;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $color-primary;
			box-shadow: 0 0 10px rgba(0,0,0,.5);
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $color-primary;
	}
</style>