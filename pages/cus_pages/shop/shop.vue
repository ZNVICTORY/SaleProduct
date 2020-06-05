<template>
	<view>
		<nav-bar
		  leftIcon="back"
		  leftText="返回"
		  title="店铺"
		  backgroundColor="#ed1c24"
		  color="#FFFFFF"
		  :rightText="isHeart? '已关注':'关注'"
		  @click-right="heartShops"
		  ></nav-bar>
	    <Category 
		  :categoryList="categoryList" 
		  :subCategoryList="subCategoryList"
		  activeTextColor="#ffffff"
		  activeBackgroundColor="#ed1c24"
		  @categoryMainClick="categoryMain" 
		  @categorySubClick="categorySub"></Category>
	</view>
</template>

<script>
	import Category from "@/components/qiyue-category/qiyue-category.vue"
	import NavBar from '@/components/zolysoft-nav-bar/zolysoft-nav-bar.vue'
	
	export default {
		components: {
			Category,
			NavBar
		},
		onLoad(options) {
			// console.log(options)
			this.shop_id = options.shop_id
			this.init()
			
		},
		data() {
			return {
				shop_id : "",
				heartColor: "#ed1c24",
				isHeart: false,
				categoryList:[],
				subCategoryList: []
			}
		},
		methods: {
			// 页面初始化
			init() {
				this.getGoodsByShop()
				this.enterShop()
				this.getIsHeartShop()
			},
			categoryMain(category){
				this.subCategoryList = category.subCategoryList;
			},
			categorySub(category){
				// console.log(category);
			},
			// 根据商店获取商品信息
			async getGoodsByShop() {
				const data = { shop_id: this.shop_id  }
				const result = await this.$apis.getGoodsByShopId(data)
				if(result.code === "000000") {
					// console.log(result)
					this.categoryList.push({ "name": "全部", "subCategoryList": result.data})
					this.subCategoryList = this.categoryList[0].subCategoryList;
				}
			},
			// 判断用户是否关注该店铺
			async getIsHeartShop() {
				const data =  { shop_id: this.shop_id, uid: this.$store.state.info.uid }
				const result = await this.$apis.getIsHeart(data)
				if(result.code === "000000") {
					this.isHeart = result.data
					// console.log(result)
				}
			},
			//关注店铺或者取消关注
			async heartShops() {
				const data = {isHeart: this.isHeart, shop_id: this.shop_id, uid: this.$store.state.info.uid }
				const result = await this.$apis.heartShop(data)
				console.log(result)
				if(result.code === "000000") {
					!this.isHeart ? this.$apis.msg('您已关注了该商店') : this.$apis.msg('您取消关注了该商店')
					this.getIsHeartShop()
				}
			},
			// 进入店铺
			async enterShop() {
				const data = { shop_id: this.shop_id }
				const result = await this.$apis.updateView(data)
				if(result.code === "000000") {
					this.$apis.msg('您进入该商店')
				}
			}
		}
	}
</script>

<style>

</style>
