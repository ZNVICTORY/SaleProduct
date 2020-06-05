<template>
	<view class="content">
		<nav-bar
		  leftIcon="back"
		  leftText="返回"
		  :title="Title"
		  color="#FFFFFF"
		  backgroundColor="#ed1c24"
		></nav-bar>
		<wuc-tab :tab-list="tabList" :tabCur.sync="tabCurrentIndex" @change="tabChange"></wuc-tab>
		<swiper
			:indicator-dots="false"
			:autoplay="false"
			:current="tabCurrentIndex"
			:duration="300"
			class="swiper-box"
			@change="changeTab">
				<swiper-item class="item" v-for="(item, index) in tabList" :key="item.id">
					<scroll-view scroll-y>
						<live-list :liveList="liveList"></live-list>
						<uni-load-more :status="loadStatus" :showIcon="showIcon" iconType="circle"></uni-load-more>
					</scroll-view>
				</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import NavBar      from '@/components/zolysoft-nav-bar/zolysoft-nav-bar.vue'
	import LiveList    from '@/components/livelist/livelist.vue'
	import WucTab      from '@/components/wuc-tab/wuc-tab.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	
	export default {
		data() {
			return {
				  Title: '',
				  tabCurrentIndex: 0,
				  tabList: [],
				  shop_class: "",
				  sort_id: 0,
				  liveList: [],
				  showIcon: true,
				  loadStatus: "noMore"
			}
		},
		onLoad(options) {
			const data = JSON.parse(options.data)
			this.Title = data.type
		    this.shop_class = data.class
		},
		mounted() {
			this.init()
		},
		methods: {
			// 页面初始化
			init() {
	            this.getRangeTabInfo()
				this.getLive()
			},
			// 点击某个种类
			tabChange(index) {
				this.tabCurrentIndex = index
				this.getLive()
			},
			// 滑动屏幕，改变某个类别
			changeTab(e) {
				this.tabCurrentIndex = e.detail.current
				// console.log(this.tabList[this.tabCurrentIndex])
				if(this.tabList[this.tabCurrentIndex].goods_id === "000") {
					this.getLive()
					return
				}
				this.getLive(this.tabList[this.tabCurrentIndex].goods_class)
			},
			// 获取某个范围的类型
			async getRangeTabInfo() {
				const data = { shop_class: this.Title }
				const result = await this.$apis.getTabInfo(data)
				if(result.code === "000000" && result.data) {
					this.tabList = result.data.goods
					this.tabList.unshift({goods_class: "全部", goods_id: "000"})
				}
			},
			// 获取某个类别的直播间
			async getLive(goods_class) {
				const data = { shop_class: this.Title , goods_class}
				const result = await this.$apis.getLiveByshopClass(data)
				if(result.code === "000000") {
					this.liveList = result.data
				}
			},
		},
		components: {
			NavBar,
			LiveList,
			WucTab,
			uniLoadMore
		}
	}
</script>

<style lang="scss">
	page, .content{
		position: relative;
		height: 100%;
		.swiper-box {
			height: calc(100% - 120px);
			.item {
				height: auto;
			}
		}
	}
</style>
