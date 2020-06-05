<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item">
						<view class="i-top b-b">
							<view class="shop-info">
								<image class="shop-avatar" :src="item.shop_avatar" mode="aspectFit"></image>
								<text class="shop-name">{{item.shop_name}}</text>
							</view>
							<text v-if="item.order_state === '1' " class="state" style="color:#ed1c24">待付款</text>
							<text v-if="item.order_state === '2' " class="state" style="color:#ed1c24">待发货</text>
							<text v-if="item.order_state === '3' " class="state" style="color:#ed1c24">待收货</text>
							<text v-if="item.order_state === '4' " class="state" style="color:#ed1c24">待评价</text>
						</view>
						
						<view class="goods-box">
							<view 
							    class="goods-item"
							    v-for="(goodsItem, goodsIndex) in item.goodsInfo" 
							    :key="goodsIndex"	
							>
								<image class="goods-img" :src="goodsItem.goods_avatar" mode="aspectFill"></image>
								<view class="right">
									<view class="title">{{goodsItem.goods_name}}</view>
									<view class="attr-box">{{goodsItem.net_weight}},{{goodsItem.specification}}</view>
									<view class="price">{{goodsItem.goods_price}}X{{goodsItem.goods_num}}</view>
								</view>
							</view>
						</view>
						<view class="price-box">
							共
							<text class="num">{{item.goodsInfo.length}}</text>
							件商品 实付款
							<text class="price">{{getPrice(item.goodsInfo)}}</text>
						</view>
						<view class="action-box b-t" v-if="item.order_state === '0'">
							<button class="action-btn" @click="deleteOrder(item)">删除订单</button>
						</view>
						<view class="action-box b-t" v-if="item.order_state === '1'">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom" @click="toPay(item.order_id)">立即支付</button>
						</view>
						<view class="action-box b-t" v-if="item.order_state === '2'">
							<button class="action-btn recom" @click="remind">提醒发货</button>
						</view>
						<view class="action-box b-t" v-if="item.order_state === '3'">
							<button class="action-btn recom" @click="confirmOrder(item)">确认收货</button>
						</view>
						<view class="action-box b-t" v-else-if="item.order_state === '4'">
							<button class="action-btn" @click="deleteOrder(item)">删除订单</button>
							<button class="action-btn recom" @click="appraise(item)">去评价</button>
						</view>
					</view> 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	
	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return {
				tabCurrentIndex: 0,
				offset: 0,
				limit: 10,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		
		onLoad(options){
			this.tabCurrentIndex = +options.state;
			this.loadData()
			if(options.state == 0){
				this.loadData()
			}
		},
		 
		methods: {
			async getOrderByState(data) {
				const result = await this.$apis.getOrderList(data)
				if(result.code === "000000" && result.data) {
					let orderList = this.dealData(result.data.orderList, result.data.orderGoods)
					this.navList[this.tabCurrentIndex].orderList = orderList
				} else {
					this.navList[this.tabCurrentIndex].orderList = []
				}
			},
			//获取订单列表
			async loadData(source){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				navItem.loadingType = "loading"
				let state = navItem.state;
				const data = { 
					order_state: this.tabCurrentIndex, 
					uid: this.$store.state.info.uid, 
					offset: this.offset, 
					limit: this.limit,
				}
				await this.getOrderByState(data)
				if(this.navList[index].orderList.length === 0) {
					navItem.loadingType = "noMore"
					return;
				}
				if(source === 'tabChange' && navItem.loaded === true){
					return;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				navItem.loadingType = 'noMore';
			
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//删除订单
			async deleteOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
			    const data = { 
					order_id: item.order_id,
					shop_id: item.shop_id,
					uid: this.$store.state.info.uid,
				}
			    const result = await this.$apis.deleteOrder(data)
			    if(result.code === "000000") {
			    	uni.hideLoading()
					this.loadData()
					this.$apis.msg('删除成功')
			    }
			},
			//取消订单
			async cancelOrder(item){
				// console.log(item)
				uni.showLoading({
					title: '请稍后'
				})
				const data = { 
					order_id: item.order_id,
					shop_id: item.shop_id,
					uid: this.$store.state.info.uid, 
					order_state: item.order_state}
				const result = await this.$apis.cancelOrder(data)
				if(result.code === "000000") {
					uni.hideLoading()
					this.loadData()
					this.$apis.msg('取消成功')
				}
			},
			//确认收货
			async confirmOrder(item) {
				uni.showLoading({
					title: '请稍后'
				})
				const data = { 
					order_id: item.order_id, 
					uid: this.$store.state.info.uid,
					shop_id: item.shop_id,
					}
				const result = await this.$apis.confirmOrder(data)
				if(result.code === "000000") {
					uni.hideLoading()
					this.loadData()
					this.$apis.msg('确认成功')
				}
			},
			// 订单评价
			appraise(item) {
				// console.log(item)
				const order_id = item.order_id
				uni.navigateTo({
					url: "/pages/cus_pages/order/order-issue?"+
					       "order_id="+item.order_id+
						   "&shop_id="+item.shop_id+
						   "&goods_id="+item.goodsInfo[0].goods_id+
						   "&net_weight="+item.goodsInfo[0].net_weight+
						   "&specification="+item.goodsInfo[0].specification
				})
			},
			// 提醒发货
			remind() {
				this.$apis.msg('提醒商家发货')
			},
			/** 
			 *  @param {Array} shopInfo 
			 *  @param {Array} goodsInfo 
			 * 整合订单数据 
			*/
			dealData(shopInfo, goodsInfo) {
				// console.log(shopInfo, goodsInfo)
				shopInfo.forEach(item => item["goodsInfo"] = [])
				shopInfo.forEach(item => {
					goodsInfo.forEach(iitem => {
						if(item.shop_id === iitem.shop_id  && item.order_id === iitem.order_id) {
							item["goodsInfo"].push(iitem)
						}
					})
				})
				return shopInfo
			},
			// 计算订单总价
		   getPrice(item) {
			   let price = 0
			   item.forEach(i => {
				   price += Number(i.goods_price) * Number(i.goods_num)
			   })
			   return price.toFixed(2)
		   },
		   // 立即支付
		   toPay(id) {
			   this.$apis.msg('立即支付')
			   uni.redirectTo({
			   	url: '../money/pay?order_id='+id
			   })
		   }
		},
		onReachBottom() {
			this.offset +=10
			this.$apis.debounce(this.loadData())
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
		width: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid ;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding:15upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			flex-direction: row;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			border-bottom: 1upx solid #EEEEEE;
			justify-content: space-between;
			.shop-info{
				flex: 1;
				height: 80upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				.shop-avatar{
					width: 60upx;
					height: 60upx;
					border-radius: 10upx;
					margin-right: 25upx;
				}
				.shop-name{
					font-size: $font-lg;
					line-height:80upx;
					font-weight: bold;
				}
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.goods-box{
			padding: 20upx 40upx;
			display: flex;
			margin-bottom: 15upx;
			flex-direction: column;
			justify-content: flex-start;
			.goods-item{
				height: 160upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 10upx;
				border-bottom: 1upx solid #EEEEEE;
				&:nth-last-of-type(1) {
					border-bottom: 0;
				}
				.goods-img{
					width: 140upx;
					height: 140upx;
				}
				.right {
					flex: 1;
					display: flex;
					padding: 20upx 30upx;
					flex-direction: column;
					overflow: hidden;
					
					.title {
						font-size: $font-base + 2upx;
						color: $font-color-dark;
						line-height: 1;
					}
					.attr-box{
						font-size: $font-sm + 2upx;
						color: $font-color-light;
						padding: 10upx 12upx;
					}
					.price{
						font-size: $font-base + 2upx;
						color: $font-color-dark;
						&:before{
							content: '￥';
							font-size: $font-sm;
							margin: 0 2upx 0 8upx;
						}
					}
				}
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
			border-top: 1upx solid #EEEEEE;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
