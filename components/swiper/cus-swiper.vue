<template>
	<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<template v-for="(item) in liveData">
			<swiper-item  
			  :key="item.live.live_id" 
			  class="swiper-item" 
			  :style="{ backgroundImage: 'url('+ item.live.live_avatar +')'}" 
			  @click="onClickInLive(item.live)">
				<view class="live-status">
					<template v-if="item.live.status=== true ">
						<view class="status"></view>直播中
					</template>
					<template v-else-if="item.live.status=== false">
						<view class="status" :style="{borderColor: '#DDDDDD'}" ></view>未上线
					</template>
				</view>
			</swiper-item>
		</template>
	</swiper>
</template>

<script>
	export default {
		name: 'cus-swiper',
		data() {
			return {
				liveData: []
			};
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.getHighestPriority()
			},
			async getHighestPriority() {
				const data = { limit: 3, offset: 0}
				const result = await this.$apis.getLiveList(data)
				if(result.code === "000000") {
					this.liveData = result.data
				}
			},
			onClickInLive(item) {
			  if(!item.status) {
				this.$apis.msg('主播不再线')
			  	return;
			  }
			  this.$apis.msg('进入直播间')
			  uni.navigateTo({
			  	url: '/pages/cus_pages/livePlayer/livePlayer?live_id='+item.live_id
			  })
			}
		}
	}
</script>

<style lang="scss">
  .swiper {
	  height: 160px;
	  margin: 10px 3px;
	  border: none;
	  .swiper-item {
		  position: relative;
		  background-size: 350px 160px;
		  background-repeat: no-repeat;
		  .live-status {
		  	position: absolute;
		  	margin: 20upx 0 0 20upx;
			padding: 0 8px;
			display: flex;
			justify-content: space-around;
			align-items: center;
		  	height: 20px;
		  	line-height: 20px;
			border-radius: 5px;
		  	background: $color-primary;
		  	color: #FFFFFF;
		  	font-size: 24upx;
		  	letter-spacing: .5upx;
		  	.status {
		  		display: inline-block;
		  		vertical-align: middle;
		  		margin-right: 5px;
		  		width: 0;
		  		height: 0;
		  		border: 3px solid #4CD964;
		  		border-radius: 50%;
		  	}
		  }
	  }
  }
</style>
