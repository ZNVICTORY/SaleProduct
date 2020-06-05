<template>
	<view class="main">
		<template v-if="likeLive.length === 0">
			<view>
				您没有关注的用户
			</view>
		</template>
		<template v-else>
			<live-list :liveList="likeLive"></live-list>
		</template>	
	</view>
</template>

<script>
	import LiveList from '@/components/livelist/livelist.vue'
	
	export default {
		components: {
			LiveList
		},
		mounted() {
			this.init()
		},
		data() {
			return {
				likeLive: []
			}
		},
		methods:{
			// 页面初始化
			async init() {
				uni.showLoading({
					title: "正在加载"
				})
				const uid = this.$store.state.info.uid
				const result = await this.$apis.getLikelive({uid})
				if(result.data) {
					uni.hideLoading()
					this.likeLive = result.data
				}
			},
		},
		async onPullDownRefresh() {
			await this.init()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			
		}
	}
</script>

<style lang="scss">
	.main {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 6upx;
	}
</style>
