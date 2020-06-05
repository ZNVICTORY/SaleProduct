<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item">
					<view class="image-wrapper">
						<image
							:src="goodsInfo.goods_avatar" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="introduce-section">
			<text class="title">{{goodsInfo.goods_name}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{specSelected.goods_price}}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{goodsInfo.goods_sales === null ? "0" :  goodsInfo.goods_sales}}</text>
				<text>库存: {{goodsInfo.goods_stock === null ? "0" : goodsInfo.goods_stock}}</text>
				<text>浏览量: {{goodsInfo.goods_views === null ? "0" : goodsInfo.goods_views}}</text>
			</view>
		</view>
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-model="specSelected">
						{{specSelected.net_weight   }} {{specSelected.specification}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>

			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>（{{comment.length}})</text>
				<text class="tip">好评率 {{goodsRate}}%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box" v-for="(item, index) in comment" :key="item.id">
				<image class="portrait" :src="item.user_avatar" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{item.user_name}}</text>
					<text class="con">{{item.content}}</text>
					<view class="bot">
						<text class="attr">购买类型：{{item.goods_attr}}</text>
						<text class="time">{{item.comment_date}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="desc"></rich-text>
		</view> -->
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/cus_pages/home/home" open-type="switchTab" class="p-b-btn">
				<uni-icons type="home" size="24"></uni-icons>
				<text>首页</text>
			</navigator>
			<navigator :url=" '/pages/cus_pages/shop/shop?shop_id='+shop_id " open-type="redirect" class="p-b-btn">
				<uni-icons type="shop" size="24"></uni-icons>
				<text>店铺</text>
			</navigator>
			<navigator url="/pages/cus_pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<uni-icons type="cart" size="24"></uni-icons>
				<text>购物车</text>
			</navigator>
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="cartAddGoods">加入购物车</button>
			</view>
		</view>
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@click="toggleSpec"
			@touchmove.stop.prevent="stopPrevent"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content"  @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="goodsInfo.goods_avatar"></image>
					<view class="right">
						<text class="price">¥{{specSelected.goods_price}}</text>
						<text class="stock">库存：{{goodsInfo.goods_stock}}</text>
						<view class="selected">
							已选：
							<text class="selected-text">
								{{specSelected.net_weight ,}} {{specSelected.specification}}
							</text>
						</view>
					</view>
				</view>
				<view  class="attr-list">
					<text>净含量</text>
					<view class="item-list">
						<text 
							v-for="(Item, childIndex) in specList.net_weight" 
							class="tit"
							:key="childIndex"
							:class="{selected:specSelected.net_weight === Item }"
							@click.stop="selectSpec('net_weight', Item)" >
							{{Item}}
						</text>
					</view>
				</view>
				<view  class="attr-list">
					<text>规格</text>
					<view class="item-list">
						<text 
							v-for="(Item, childIndex) in specList.specification" 
							class="tit"
							:key="childIndex" 
							:class="{selected: specSelected.specification === Item}"
							@click.stop="selectSpec('specification', Item)" >
							{{Item}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
	
	export default{
		components: {
			uniIcons
		},
		data() {
			return {
				goods_id: "",
				live_id: "",
				shop_id: "",
				specClass: 'none',
				specSelected:{
					"net_weight": "",
					"specification": "",
					"goods_price": ""
				},
				goodsRate: "",
				goodsInfo: {},
				comment: [],
				favorite: true,
				imgList: [
					{
						src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg'
					},
					{
						src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg'
					},
					{
						src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg'
					}
				],
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg" />
						<img style="width:100%;display:block;" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg" />
						<img style="width:100%;display:block;" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg" />
						<img style="width:100%;display:block;" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg" />
						<img style="width:100%;display:block;" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2882524788,1139118180&fm=26&gp=0.jpg" />
					</div>
				`,
				specList: {},
			};
		},
		onLoad(options){	
			this.goods_id = options.goods_id
		},
		mounted() {
			this.init()	
		},
		methods:{
			// 页面初始化
			async init() {
				await this.getGoodsInfo()
				this.defaultSelected()
				this.getCommentByGoodsId()
				let allStar = 0;  
				this.comment.forEach(item => {
					allStar = allStar + parseInt(item.star_num)
				})
				this.goodsRate = this.comment.length !== 0 ?(allStar / (this.comment.length * 5)).toFixed(2) * 100 : '0'
			},
			// 默认选择商品属性
			defaultSelected() {
				this.specSelected.net_weight = this.specList.net_weight[0]
				this.specSelected.specification = this.specList.specification[0]
				this.specSelected.goods_price = this.specList.goods_price[0]
			},
			//规格弹窗开关
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			/**
			 * 选择规格
			 * @param { String } type 
			 * @param { String } content
			 * */
			selectSpec(type, content){
				// console.log(type, content)
				this.specSelected[type] = content
			},
			//收藏
			toFavorite(){
				this.favorite = !this.favorite;
			},
			// 直接下单
			buy(){
				const data = {
					live_id: this.live_id,
					shop_id: this.goodsInfo.shop_id,
					goods_id: this.goods_id,
					goods_num: 1,
					goods_price: this.specSelected.goods_price,
					net_weight: this.specSelected.net_weight,
					specification: this.specSelected.specification
				}
				uni.navigateTo({
					url: "/pages/cus_pages/order/createOrder?data="+JSON.stringify(data)
				})
			},
			/**
			 * 添加购物车,
			 * @param {Object} data 
			 * */
		    async cartAddGoods() {
				const data = {
					uid: this.$store.state.info.uid,
					...this.goodsInfo,
					goods_stock: undefined,
					goods_sales: undefined,
					goods_views: undefined,
					goods_num: 1,
					net_weight: this.specSelected.net_weight,
					specification: this.specSelected.specification
				}
				const result = await this.$apis.increaseCart(data)
				if (result.code === "000000") {
					this.$apis.msg('添加成功')
				}
			},
			// 获取商品信息
			async getGoodsInfo() {
				const params = { goods_id: this.goods_id }
				const result = await this.$apis.getGoodsByGoodsId(params)
				if(result.code === "000000") {
					console.log(result)
					this.live_id = result.data.live_id
					this.shop_id = result.data.result.shop_id
					this.goodsInfo = result.data.result
					this.specList = this.dealGoodsAttributes(result.data.result.goods_infos)
				}
			},
			/**
			 * 处理商品的属性
			 * @param { Array } detail
			 * @return List
			 * */
			dealGoodsAttributes(params) {
				let List = {
					"net_weight": [],
					"specification": [],
					"goods_price": []
				}
				params.forEach(item => {
					List.net_weight.push(item.net_weight)
					List.specification.push(item.specification)
					List.goods_price.push(item.goods_price)
				})
				return List
			},
			//获取商品评论
			async getCommentByGoodsId() {
				const data = { goods_id: this.goods_id }
				const result = await this.$apis.getCommentByGoodsId(data)
				if(result.code === "000000" && result.data) {
					this.comment = result.data
				}
			},
			stopPrevent() {
				return;
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		border-bottom: 1upx solid #EEEEEE;
		&:nth-last-of-type(1) {
			border: none;
		}
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;	
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 10upx 10upx 10upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			/* border-top: 1upx solid #DDDDDD; */
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				width: 80%;
				line-height: 66upx;
				border-radius: 100upx;
				background: $color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
                margin: 30px auto;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient( to left, #ffac30,#fa436a,#ed1c24);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
