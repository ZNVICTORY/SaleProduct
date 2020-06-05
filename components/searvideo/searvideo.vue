<template>
	<view class="content">
		<view class="search-box" @click="searchTopage">
			 <uni-icon class="search-icon" color="#eeeeee" size="27" type="search"></uni-icon>
		</view>
		<view class="videocam" @click="tovideomanage">
			 <uni-icon color="#eeeeee" size="40" type="videocam"></uni-icon>
		</view>		
	</view>			
</template>

<script>
	import uniIcon from '@/components/uni-icons/uni-icons.vue'
	
	export default {
		name:'Search',
		components:{
			uniIcon
		},
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				sealchValue: ""
			}
		},
		methods: {
			searchTopage() {
				uni.navigateTo({
					url:'/pages/cus_pages/search/search'
				})
			},
			tovideomanage() {
				uni.navigateTo({
					url:'/pages/bus_pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		width: 100%;
		height: 100upx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: #EEEEEE;
		.search-box {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 80%;
			height: 80upx;
			background: #FFFFFF;
			border-radius: 20upx;
			border: 1upx solid #EEEEEE;
			.search-icon {
				position: absolute;
			}
		}
		.videocam {
			flex: 1;
			background: #FFFFFF;
			border: 1upx solid #EEEEEE;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			height: 80upx;
			margin-left:15upx;
			border-radius: 20upx;
		}
	.placeholder-class {color:#9e9e9e;}
	}
</style>
