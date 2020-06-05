<template>
	<view class='issue'>
		<view class="issue-head">
			<image v-if="headPicShow" :src="headPicValue" class="issue-pic" mode=""></image>
			<text v-if="headTitleShow" class="issue-title">{{headTitleValue.slice(0,5)}}</text>
			
			<view class="issue-star-box" >
				<image v-for="(item,index) in starsMax" 
				    :key="index" 
				    :src="(index+1) <= recciveScore?  starActive : starDefault " 
					:class="recciveScore == index+1?'active':''" 
					@click="setScore(index+1)"></image>
			</view>
		</view>
		 <textarea v-if="textareaShow" @blur="blur" v-model="textareaValue" :placeholder="textareaPlaceholder"/>
		 <view class="issue-btn-box">
		 	<button v-if="submitShow" class="submit-btn" @click="doSubmit">{{submitText}}</button>
		 </view>
	</view>
</template>
<script>
	export default {
		props:{
			headPicShow:{ //图片
				type:[String,Boolean],
				default:true,
			},
			headPicValue:{
				type:String,
				default:'../../../static/imgs/st_pic.png'
			},
			
			headTitleShow:{ //标题
				type:[String,Boolean],
				default:true,
			},
			headTitleValue:{
				type:String,
				default:"描述相符"
			},
			
			starsShow:{
				type:[String,Boolean],
				default:true,
			},
			starsMax:{ // 星星最大个数
				type:[String,Number],
				default:5,
			},
			starDefault:{ //未选中
				type:String,
				default:'../../../static/imgs/st_star.png',
			},
			starActive:{
				type:String,
				default:'../../../static/imgs/st_star_active.png',
			},
			score:{  //默认分数
				type:[Number,String],
				default:0
			},
			starsDisabled:{ //是否禁用star
				type:[Boolean],
				default:false
			},
			
			textareaShow:{ // 多行文本显示
				type:[String,Boolean],
				default:true,
			},
			textareaPlaceholder:{
				type:[String],
				default:"宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧"
			},
			
			
			submitShow:{ // 发布按钮
				type:[String,Boolean],
				default:true,
			},
			submitText:{
				type:String,
				default:"发布",
			}
		},
		data() {
			return {
				recciveScore: 0,
				textareaValue:""
			}
		},
		onLoad() {
			this.headPicValue
		},
		methods: {
			/**
			 * @name 设置分数
			 */
			setScore(score){
				if(this.starsDisabled!==false)return
				this.recciveScore = score
				this.$emit("scoreChange",score)
			},
			
			/**
			 * @name 获取textarea内容
			 */
			
			blur(e){
				this.textareaValue = e.detail.value
			},
			
			/**
			 * @name 提交
			 */
			doSubmit(){
				this.$emit('submit',{ score: this.recciveScore, text: this.textareaValue})
			}
		}
	}
</script>
<style scoped>
	.issue {
		background:#f9f9f9;
	}
    .issue-head{
		background: #ffffff;
		height: 100upx;
		border: 1upx solid #f5f5f5;
		padding: 0 25upx;
	}
	.issue-pic {
		width: 70upx;
		height: 70upx;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: 17upx;
	}
	.issue-title{
		line-height: 100upx;
		font-size: 30upx;
		vertical-align: middle;
		margin-right: 35upx;
	}
			
	.issue-star-box{
		display: inline-block;
	}
	.issue-star-box image{
		width: 42upx;
		height: 42upx;
		vertical-align: middle;
		margin-right: 24upx;
	}
	.issue-star-box image.active{
		animation: star_move ease-in 1 1s,star_rotate ease 1.5s infinite 1s;
	}
	.issue textarea{
		width: 100%;
		height: 420upx;
		background-color: #FFFFFF;
		font-size: 28upx;
		color: #898989;
		padding: 24upx;
		box-sizing: border-box;
		line-height: 40upx
	}
	.issue-btn-box{
		padding: 54upx 30upx;
	}
	.issue-btn-box	button{
		width: 100%;
		height: 80upx;
		border-radius: 10upx;
		font-size: 26upx;
		background: #ed1c24;
		line-height: 80upx
	}
	button:hover {
		background: #f81d28;
	}
	
	@keyframes star_move{
		from{
			width: 50upx;
			height: 50upx;
			transform: rotate(180deg)
		}
		to{
			width: 32upx;
			height: 32upx;
			transform: rotate(0)
		}
	}
	@keyframes star_rotate{
		0%{
			transform: rotateY(360deg)
		}
		100%{
			transform: rotateY(180deg)
		}
	}
</style>
