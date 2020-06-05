<template>
	<view class="content">
		<view v-for="(item, index) in categoryList1" :key="item.name" >
			<view class="item" @click="navTo(item)">
				<image :src="(item.img_url)" mode="aspectFill" lazy-load="true"></image>
				<text >{{item.name}}</text>
			</view>	
		</view>
		<view v-for="(item, index) in categoryList2" :key="item.name" >
			<view class="item" @click="navTo(item)">
				<image :src="(item.img_url)" mode="aspectFill" lazy-load="true"></image>
				<text >{{item.name}}</text>
			</view>	
		</view>
	</view>
</template>

<script>
	
	export default {
		name: 'Category',
		data() {
			return {
				categoryList1: [
					{ key: 0,  name: '品质水果', img_url: '../../../static/category/fruit.jpg'},
					{ key: 1, name: '新鲜蔬菜', img_url: '../../../static/category/vegetables.jpg'},
					{ key: 2, name: '粮油米面', img_url: '../../../static/category/oilnoodles.jpg'},
					{ key: 3, name: '水产品',   img_url: '../../../static/category/aquatic.jpg'}	
				],
				categoryList2: [
					{ key: 4, name: '农副加工', img_url: '../../../static/category/agricultural.jpeg'},
					{ key: 5, name: '肉禽蛋品', img_url: '../../../static/category/egg.jpeg'},
					{ key: 6, name: '苗木花草', 'img_url': '../../../static/category/plant.jpg'},
					{ key: 7, name: '更多', 'img_url': '../../../static/category/more.png'}
				]
			}
		},
		props:{
			
		},
		methods: {
			checkbtn(e) {
				console.log(e.detail.index)
			},
			navTo(item) {
				// console.log(item)
				this.$apis.msg(`前往${item.name}分类`)
				const data = { type:item.name, class: item.key }
				uni.navigateTo({
					url: '/pages/cus_pages/category/category?data='+JSON.stringify(data)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		margin: 0 0 ;
		padding: 0 0;
	}
	.content {
		background: #FFFFFF;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:space-around;
		align-items: center;
		align-content: center;
			.item {
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				width: 25vw;
				font-size: 11px;
				flex: 1;
				image {
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
				}
				text {
					letter-spacing: .5px;
					font-size: 24upx;
				}
				&:hover {
					background: #EEEEEE !important;
				}
			}
			
	}	
</style>
