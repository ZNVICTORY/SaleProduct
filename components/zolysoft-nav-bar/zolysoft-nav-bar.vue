<template>
	<view :style="{'height':statusBarHeight}" class="zindex10">
		<view :class="{'zolysoft_navbar':'zolysoft_navbar','border':border,'shadow':shadow,'fixed':fixed}" 
		:style="{'height':statusBarHeight,'background-color':backgroundColor,'color':color}">
			<view class="zolysoft_navbar_box">
				<view class="zolysoft_navbar_content">
					<view class="zolysoft_navbar_left" 
						@tap="onClickLeft" >
						<view style="margin-left: 5px;font-size: 0.8rem;" >
							<uni-icons 
								v-if="leftIcon!=''"
								:type="leftIcon"
								:color="color"
								size="30" />
							<text v-if="leftText!=''">{{leftText}}</text>
						</view>
					</view>
					
					<view class="zolysoft_navbar_title">
						<text v-if="title">
							{{title}}
						</text>
					</view>
					
					<view class="zolysoft_navbar_right"
					v-if="isShowRight"
					@tap="onClickRight" >
						<view style="margin-right: 5px;font-size: 0.8rem;" >
							<uni-icons
								v-if="rightIcon!=''"
								:type="rightIcon"
								:color="color"
								:size="parseInt(rightIconSize)" />
							<text v-if="rightText!=''">{{rightText}} </text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcons from '../uni-icons/uni-icons.vue'
export default {
	data() {
		return {
			statusBarHeight: '50px;'
		};
	},
	components: {
		uniIcons
	},
	props:{
		title: {
		  type: String,
		  default: ''
		},
		leftText: {
		  type: String,
		  default: ''
		},
		rightText: {
		  type: String,
		  default: ''
		},
		leftIcon: {
		  type: String,
		  default: ''
		},
		rightIcon: {
		  type: String,
		  default: ''
		},
		fixed: {
		  type: [Boolean, String],
		  default: true
		},
		color: {
		  type: String,
		  default: '#000000'
		},
		backgroundColor: {
		  type: String,
		  default: '#FFFFFF'
		},
		shadow: {
		  type: [String, Boolean],
		  default: true
		},
		border: {
		  type: [String, Boolean],
		  default: false
		},
		rightIconSize: {
			type: Number | String,
			default: 24
		},
		isShowRight: {
			type: Boolean,
			default: true
		}
	},
	mounted() {
		var statusBarHeight = uni.getSystemInfoSync().statusBarHeight+50;
		this.statusBarHeight = statusBarHeight+'px';
	},
	methods: {
		onClickLeft () {
			if(this.leftIcon == "back"){
				uni.navigateBack({
				    delta: 1,
				    animationType: 'pop-out',
				    animationDuration: 200
				});
			}else{
				this.$emit('click-left')
			}
		},
		onClickRight () {
			this.$emit('click-right')
		}
	}
}
</script>

<style>
	.zolysoft_navbar{
		width: 100%;
		z-index: 1000;
	}
	.zolysoft_navbar_box{
		position: relative;
		height: 100%;
	}
	.zolysoft_navbar_content{
		width: 100%;
		height: 50px;
		line-height: 50px;
		position: absolute;
		bottom: 0px;
	}
	.zolysoft_navbar_left{
		width: 25%;
		float: left;
		text-align: left;
		height: 100%;
	}
	.zolysoft_navbar_title{
		width: 50%;
		float: left;
		text-align: center;
		height: 100%;
	}
	.zolysoft_navbar_right{
		width: 25%;
		float: right;
		height: 100%;
		text-align: right;
	}
	
	.border{
		border-bottom: 1px solid #F3F3F3;
	}
	.shadow{
		box-shadow: 0 1px 6px #ccc;
	}
	.fixed{
		position: fixed;
	}
	.zindex10{
		z-index: 10;
	}
	
</style>
