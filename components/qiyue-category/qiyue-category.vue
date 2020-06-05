<template>
	<view>
		<view class="nav">
			<view class="nav-left">
				<scroll-view scroll-y :style="'height:'+height+'px'">
					<view class="nav-left-item" v-for="(item,index) in categoryList" @click="categoryClickMain(item,index)" :key="index"
					 :style="index==categoryActive?'color:'+activeTextColor+';background-color:'+activeBackgroundColor:''">
						{{item.name}}
					</view>
				</scroll-view>
			</view>
			<view class="nav-right">
				<scroll-view scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
					<view class="nav-right-item" v-for="(item,index2) in subCategoryList" :key="index2" >
						<image :src="item.goods_avatar" mode="aspectFill" />
						<view class="item-right">
							<text class="item-title">商品:{{item.goods_name}}</text>
							<text class="item-stock">库存:{{item.goods_stock}}</text>
							<text class="item-sales">销量:{{item.goods_sales}}</text>
							<text class="item-views">浏览量:{{item.goods_views}}</text>
							<view class="item-buy">
								<text class="item-price">¥{{item.goods_infos && item.goods_infos[0].goods_price }}</text>
							    <navigator :url="'/pages/cus_pages/product/product?goods_id='+item.goods_id" open-type="redirect">
									<text style="color: #ed1c24; font-size: 25upx;">去购买>></text>
								</navigator>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		name: "category",
		data() {
			return {
				height: 0,
				scrollTop: 0,
				scrollHeight: 0,
				categoryActive: 0,
				activeStyle: {
					color: this.activeTextColor,
					backgroundColor: this.activeBackgroundColor
				}
			}
		},
		props: {
			//主分类激活索引
			defaultActive: {
				type: Number,
				default: 0
			},
			//主分类List
			categoryList: {
				type: Array,
				default: () => {
					return null;
				}
			},
			//侧边分类List
			subCategoryList: {
				type: Array,
				default: () => {
					return null;
				}
			},
			activeTextColor: {
				type: String,
				default: '#F24544'
			},
			activeBackgroundColor: {
				type: String,
				default: '#e5e5e5'
			},
			label: {
				type: String,
				default: 'name'
			},
			imgSrc: {
				type: String,
				default: 'goods_avatar'
			},
			//主分类点击事件
			categoryMainClick: {},
			//子分类点击事件
			categorySubClick: {}
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(category, index) {
				this.$emit('categoryMainClick',category)
				this.categoryActive = index;
				this.scrollTop = -this.scrollHeight * index;
			},
			categoryClickSub(category) {
				this.$emit('categorySubClick',category)
			}
		},
		mounted() {
			this.categoryActive = this.defaultActive
			uni.getSystemInfo({
				success: res => {
					this.height = res.screenHeight;
				}
			})
		},
	}
</script>

<style lang="scss">
	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 25%;
		border-right:solid 1upx #EEEEEE;
	}

	.nav-left-item {
		height: 50px;
		border-right: solid 1upx #EEEEEE;
		border-bottom: solid 1upx #EEEEEE;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.nav-right {
		width: 75%;
		padding-top: 5upx;
	}
	.nav-right-item {
		width: 100%;
		height: 230upx;
		float: left;
		padding: 0 15upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		border: 1px solid #EEEEEE;
		border-top: 1upx solid #EEEEEE;
		background: #FFFFFF;
		border-radius: $uni-border-radius-lg;
		image {
			width: 130upx;
			height: 130upx;
			border-radius: 50%;
			margin: auto 0;
			margin-right: 30upx;
		}
		.item-right {
			display: flex;
			flex-direction: column;
			height: 184upx;
			width: 60%;
			padding: 20upx 15upx;
			justify-content: space-between;
			.item-title {
				font-size: 30upx;
				color: #000000;
				text-overflow: ellipsis;
			}
			.item-stock, .item-sales, .item-views {
				color: #D8D8D8;
				font-size: 25upx;
				margin-bottom: 3upx;
			}
			.item-buy {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.item-price {
					color: $color-primary;
					font-size: 30upx;
				}	
			}
		}
	}
	.active {
		color: #F24544;
	}
	.padding {
		height: var(--status-bar-height);
		width: 100%;
		top: 0;
		position: fixed;
		background-color: #F24544;
	}
</style>
