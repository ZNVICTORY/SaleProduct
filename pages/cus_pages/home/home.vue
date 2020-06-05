<template>
	<view >
		<nav-bar 
		    title="首页"
			color="#FFFFFF"
			backgroundColor="#ed1c24"
			></nav-bar>
		<view class="main-content">
			<!-- 轮播图展示 -->
			<cuswiper />
			<!-- 商品分类 -->
			<category />
		</view>
		<view class="title">
			<image src="../../../static/category/recommend.png" mode="aspectFill"></image>
			<text>精品推荐</text>
		</view>
		<view class="live-content">
			<!-- 直播列表展示 -->
			<live-list :liveList="liveList"></live-list>
		</view>
		<!-- 上拉加载 -->
		<uni-load-more :status="status" :showIcon="showIcon" :iconType="'circle'"></uni-load-more>
	</view>
</template>

<script>
	import Category    from '@/components/category/category.vue'
	import Cuswiper      from '@/components/swiper/cus-swiper.vue'
	import LiveList    from '@/components/livelist/livelist.vue'
	import SearchVideo from '@/components/searvideo/searvideo.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniIcon     from "@/components/uni-icons/uni-icons.vue"
	import NavBar      from "@/components/zolysoft-nav-bar/zolysoft-nav-bar.vue"

	export default {
		mounted() {
			this.init()
		},
		data() {
			return {
				liveList: [],   // 直播列表数据
				offset: 0,      // 偏移量
				limit: 10,      // 获取数据量
				status: 'loading',
				showIcon: true,
				cache: { }, // 缓存数据
			}
		},
		methods: {
			// 页面初始化
			init() {
				this.status = 'loading'
				this.showIcon = true
				this.offset = 0      // 偏移量
				this.limit = 10      // 获取数据量
				const data = { 
					offset: this.offset, 
					limit: this.limit, 
					uid: this.$store.state.info.uid ,
				}
				if(this.whetherCache(data)) {
					// console.log(this.whetherCache(data))
					this.liveList = this.cache[`${params.limit}_${params.offset}`]
					return;
				}
				this.getLiveList(data)
			},
			/**
			 * 判断是否有缓存， 若有 则直接从缓存中取数据 
			 * @return { Boolean } result
			 * */
			whetherCache(params) {
				let result;
				this.cache = uni.getStorageSync("cacheData")
				this.cache[`${params.limit}_${params.offset}`] ? result = true : result = false
				return result
			}, 
			// 加载更多
			async getLiveList(params) {
                const result = await this.$apis.getLiveList(params)
				if(result.code === "000000") {
					if(result.data.length === 0) {
						this.status = 'noMore'
						this.showIcon = false
						return;
					}
					// console.log(result.data)
					this.liveList = Array.prototype.concat.apply([], result.data)
				}
				uni.setStorageSync("cacheData",this.cache)
			},
		},
		components: {
			Cuswiper,
			SearchVideo,
			LiveList,
			Category,
			uniLoadMore,
			uniIcon,
			NavBar
		},
		onPullDownRefresh() {
			this.$apis.debounce(this.init())
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			this.offset +=10
			const params = { offset: this.offset, limit: this.limit }
			this.$apis.debounce(this.getLiveList(params))
		},
	}
</script>

<style lang="scss">
	.live-content {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 0 10upx;
	}
	.title {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		margin: 10px 0;
		image {
			width: 50upx;
			height: 50upx;
		}
	}
</style>
