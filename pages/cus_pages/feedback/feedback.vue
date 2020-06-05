<template>
	<view>
		<nav-bar
		  leftIcon="back"
		  leftText="返回"
		  title="我要反馈"
		  backgroundColor="#ed1c24"
		  color="#FFFFFF"></nav-bar>
		  <view>
			  <view class="type-title">
			  	 <text>请选择反馈问题的类型</text>
			  </view>
			  <radio-group @change="radioChange" class="radio-group">
				  <label v-for="(item, index) in feedTitle" :key="item.value">
					  <view class="radio-item">
					    <text>{{item.name}}</text>
						<input type="text" disabled="true" :placeholder="item.place" placeholder-class="radio-place"/>
						<radio class="item-radio" color="#ed1c24" :value="item.value" :checked="index === current" />
					  </view> 
				  </label>
			  </radio-group>
			  	<view class="type-title">
			  		<text>问题和意见</text>
			  	</view>
				<textarea 
				  class="content" 
				  style=" height: 200upx;"
				  @blur="getAdvices"  
				  v-model="content" 
				  placeholder="请描述您在使用时遇到的问题和意见." />
		  </view>
		  <button class="add-btn" @click="submitAdvice">提交</button>
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
				feedTitle: [
					{ type: 0,  value: 'Abnormal', name: '功能异常', place: "不能使用现有功能"},
					{ type: 1,  value: 'Other', name: '其他问题', place: "用的不爽功能建议都提过来"}
				],
				current: null,
				content: ''
			}
		},
		methods: {
			radioChange(e) {
				// console.log(e.target.value)
				for( var i = 0; i < this.feedTitle.length; i++) {
					if(this.feedTitle[i].value === e.target.value) {
						 this.current = i;
						 break;
					}
				}
			},
			getAdvices(e) {
				this.content = e.detail.value
				uni.hideKeyboard()
			},
			async submitAdvice() {
				// console.log(this.current)
				if(this.current === null) { 
					this.$apis.msg('请选择反馈类型')
					return
				}
				if(!this.content) {
					this.$apis.msg('请输入反馈意见')
					return
				}
				const data = { 
					uid: this.$store.state.info.uid,
					type: this.current, 
					content: this.content	
				}
				const result = await this.$apis.submitAdvices(data)
				if(result.code === "000000") {
					this.$apis.msg('提交成功')
					uni.navigateBack()
				} else {
					this.$apis.msg('提交失败')
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.type-title {
		color: #000000;
		margin: auto 0;
		font-size: 25upx;
		height: 50upx;
		padding: 10upx 15upx;
	}
	.radio-group {
		padding: 10upx 15upx;
		font-size: 30upx;
		background: #FFFFFF;
		.radio-item {
			display: flex;
			flex-direction: row;
			height: 80upx;
			justify-content: space-between;
			align-items: center;
			// border-bottom: 1upx solid #EEEEEE;
		    .radio-place {
				font-size: 25upx;
			}
			.item-radio {
				transform: scale(0.8);
			}
		}
	}
	.content {
		background: #FFFFFF;
		width: 100%;
		padding: 15upx 20upx;
	}
	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $color-primary;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);	
	}

</style>
