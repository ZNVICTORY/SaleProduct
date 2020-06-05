<template>
	<view class="content">
	   <view v-if="!changSuccess">
		   <view class="uni-form-item">
		      <input 
				 class="uni-input" 
				 placeholder="请输入手机号" 
				 :disabled="!disableCodeBtn"
				 type="number"
				 @blur="checkTel"
				 v-model="userInfo.cphone"
		   	 />
		   </view>
		   <view class="uni-form-item">
		   	<input 
		   	  type="password" 
		   	  class="uni-input"
			  :disabled="!disableCodeBtn"
		   	  placeholder="请输入新密码"
		   	  v-model="userInfo.cpassword"
		   	  />
		   </view>
		   <view class="uni-form-item">
		   	<input 
		   	  type="password" 
		   	  class="uni-input"
			  :disabled="!disableCodeBtn"
			  placeholder-class="placeholder"
		   	  placeholder="再次确认密码"
		   	  v-model="repassword"
		   	 />
		   </view>
		  <view class="column-with-btn">
		  	<view class="uni-form-item checkinput">
		  		<input 
		  		  type="number" 
		  		  class="uni-input" 
		  		  placeholder="请输入验证码" 
		  		  v-model="userInfo.mobileCode">
		  	</view>
		  	<button 
		  	  :class="{ active: disableCodeBtn }" 
		  	  :disabled="!disableCodeBtn" 
		  	  @click="sendCode"
		  	 >{{ codeBtn.text }}</button>
		  </view>
		  <button class="submit" @click="modifyPass">提交</button>
	   </view>
	   <view v-if="changSuccess">
		   <view class="text-reset">重置成功，新密码已生效！</view>
		   <button class="submit" @click="gotoLogin">立即登陆</button>
	   </view>
	</view>
</template>

<script>
    import md5 from '@/common/js-md5/src/md5.js'
	export default {
		data() {
			return {
				userInfo: {
					cphone: '',
					mobileCode: '',
					cpassword: ''
				},
				mobileFormat: false,         //手机格式
				changSuccess: false,         // 修改密码是否成功
				repassword: '',              // 确认密码
				seconds: 60, 
				codeBtn: {
					text: '获取验证码',
					waitingCode: true,
					count: this.seconds
				}
			}
		},
		methods:{
			/**
			 * 发送短信验证码
			 */
			sendCode: async function() {
				this.checkTel()
				if(!this.mobileFormat) {
				   this.$apis.msg('手机格式不正确')
				   return 
				}
				this.codeBtn.waitingCode = false
				this.codeBtn.count = this.seconds
				this.codeBtn.text = this.codeBtn.count + 's'
				let countdown = setInterval(() => {
					this.codeBtn.count--
					this.codeBtn.text = this.codeBtn.count + 's'
					if(this.codeBtn.count === 0) {
						clearInterval(countdown)
						this.codeBtn.waitingCode = true
						this.codeBtn.text = '重新发送'
					}
				}, 1000)
				const result = await this.$apis.getMsgCode({
					cphone: this.userInfo.cphone
				})
				if(result.code === '000000') {
					this.$apis.msg('发送成功')
				} else {
					this.$apis.msg('发送失败')
				}
			},
			/**
			 * 跳转登陆界面
			 */
			gotoLogin: function() {
				uni.redirectTo({ url: 'login'})
			},
			/**
			 * 重置密码
			 */
			modifyPass: async function() {
				if(this.repassword !== this.userInfo.cpassword) {
					this.$apis.msg('密码不一致')
					this.repassword = ''
					this.userInfo.cpassword = ''
					return;
				}
				const userInfo = JSON.parse(JSON.stringify(this.userInfo))
				const result = await this.$apis.resizePass(userInfo)
				if(result.code === '000000') {
					this.changSuccess = true
				} else {
					this.$apis.msg(result.msg)
				}
			},
			/**
			 * 检测手机号是否合法
			 */
			checkTel: function() {
				const pattern =  new RegExp(/^1[3456789]\d{9}/)
				if(!pattern.test(this.userInfo.cphone )){
					this.$apis.msg('手机号不合法')
					this.mobileFormat = false
					return 
				} else {
					this.mobileFormat = true
				}
			}
		},
		computed: {
			/**
			 * 控制验证码按钮
			 */
			disableCodeBtn: function() {
				return this.codeBtn.waitingCode
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $color-login;
	}
	.content {
		padding:100upx;
		margin: 20% 20upx;
		background: #FFFFFF;
		border-radius: 10upx;
	}
	.uni-form-item {
		margin-bottom: 40upx;
		padding: 0;
		border: 1px solid #e3e3e3;
		box-shadow: 0 0 10upx #e3e3e3;
		border-radius: 10upx;
		.uni-input {
			font-size: 30upx;
			padding: 7px 20upx;
			background: #E5E5E5;
			color: #000000;
		}
	}
	.column-with-btn {
		display: flex;
		flex: row;
		justify-content: space-between;
		align-content: center;
		.checkinput {
				  width: 250upx;
				  margin-right: 50upx;
		}
		button {
			padding: 0;
			font-size: 30upx;
			margin: 0;
			width: 180upx;
			height: 80upx;
			text-align: center;
			&:after {
				border: none;
			}
			&.active {
				background: $color-login;
				color: $uni-text-color-inverse;
			}
		}
	}
	.submit{
		background: $color-login;
		// border-radius: 60upx;
		font-size: 34upx;
		margin-top: 60upx;
	}
	.text-reset {
		text-align: center;
		margin-bottom: 100upx;
		font-size: 36upx;
	}
</style>
