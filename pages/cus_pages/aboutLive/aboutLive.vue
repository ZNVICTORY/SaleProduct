<template>
	<view>
		<nav-bar
		  leftIcon="back"
		  leftText="返回"
		  title="关于直播"
		  backgroundColor="#ed1c24"
		  color="#FFFFFF"></nav-bar>
		<view class="center_menu">
		  	<view class="menu_item" v-for="item in menus" :key="item.key" @click="navToPage(item)">
		  		<image :src="item.icon" mode="aspectFill"></image>
		  		<text>{{item.name}}</text>
		  	</view>
			<view class="menu_item">
				<image :src="ver.icon" mode="aspectFill"></image>
				<text>{{ver.name}}</text>
				<text style="margin-left: 200px;">{{ver.content}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import NavBar from '@/components/zolysoft-nav-bar/zolysoft-nav-bar.vue'
	
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				ver: {
					icon: '../../../static/imgs/4.png',
					name: '版本号',
					content: '1.1.1'
				},
				menus: [{
					    name: "法律声明及隐私政策",
						icon:'../../../static/imgs/1.png',
						key: 0
				    }, {
					    name: "软件许可协议",
						icon:'../../../static/imgs/2.png',
						key: 1
				    }, {
					    name: "用户协议",
						icon:'../../../static/imgs/3.png',
						key: 2
				    }]   
			}
		},
		methods: {
			navToPage(item) {
				this.$apis.msg(`暂无此${item.name}`)
			}
		}
	}
</script>

<style lang="scss">
.center_menu {
	width: 100%;
	display: inline-block;
	.menu_item {
		font-size: 28upx;
		letter-spacing: 1px;
		padding: 14px 5%;
		background: #FEFEFE;
		color: #DDDDDD;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: relative;
		border-bottom: 1px solid #EFEFEF;
		&:hover {
			background: #F6F6F6 !important;
		}

		&::after {
			content: '';
			width: 30upx;
			height: 30upx;
			position: absolute;
			right: 5%;
			background: url('../../../static/center/right.png') no-repeat;
			background-size: 100%;
		}
        &:nth-last-of-type(1) {
			
		}
		text:nth-of-type(1) {
			margin-left: 10px;
		}
		image {
			width: 40upx;
			height: 40upx;
		}
	}
}
</style>
