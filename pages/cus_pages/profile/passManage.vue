<template>
	<view class="main-content">
		<input type="text" class="input-item"  disabled="true" v-model="cphone" />
		<input type="password" class="input-item"  v-model="cpassword" placeholder="请输入原密码"/>
		<input type="password" class="input-item" v-model="newPassword" placeholder="请输入新密码" />
		<button class="btn-sub" @click="submit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cphone: "",
				cpassword: "",
				newPassword: ""
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			// 页面初始化
			init() {
				this.cphone = this.$store.state.info.cphone
			},
			// 提交新密码
			async submit() {
				if(!this.cpassword) {
					this.$apis.msg("原密码为空")
					return;
				}
				if(!this.newPassword) {
					this.$apis.msg("新密码为空")
					return;
				}
				const data = { 
					uid: this.$store.state.info.uid, 
					cphone: this.cphone,
					oldPassword: this.cpassword,
					newPassword: this.newPassword
				}
				const result = await this.$apis.updatePassword(data)
				if(result.code === "000000") {
					this.$apis.msg(result.msg+',请重新登陆')
					uni.reLaunch({
						url:"/pages/public/login"
					})
				} else {
					this.$apis.msg(result.msg)
				}
			}
		}
	}
</script>

<style lang="scss">
	.main-content {
		width: 94%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.input-item {
			height: 80upx;
			width: 80%;
			line-height: 80upx;
			padding: 10upx 20upx;
			background: #FFFFFF;
			font-size: 30upx;
			letter-spacing: .6px;
			border-radius: 10upx;
			color: #8d8d8d;
			margin-bottom: 20upx;
		}
		.btn-sub {
			width: 85%;
			background: $color-primary;
			padding: 10upx 20upx;
			height: 80upx;
			color: #FFFFFF;
			font-size: 30upx;
			line-height: 80upx;
		}
	}
</style>
