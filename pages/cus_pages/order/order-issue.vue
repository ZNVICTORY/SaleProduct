<template>
	<view>
		<issue 
		    :headPicValue="avatar"
		    @submit="submit" >
		</issue>
	</view>
</template>

<script>
	import Issue from '@/components/issue/myIssue.vue'
	export default {
		data() {
			return {
				avatar: "",
				order_id: "",
				shop_id: "",
				goods_id: "",
				goods_attr: ""
			}
		},
		onLoad(options) {
			this.avatar = 'http://' + this.$store.state.info.userInfo.avatar
			this.order_id = options.order_id
			this.shop_id = options.shop_id
			this.goods_id = options.goods_id
			this.goods_attr = `${options.net_weight}  ${options.specification}`
		},
		methods: {
			// 发布评论
			async submit(options) {
				// console.log(options.score, options.text)
				if(!options.score || !options.text) {
					this.$apis.msg("评论不能为空")
					return
				}
				// this.comment_date = this.dealTime()
				const data = { 
				    uid: this.$store.state.info.uid,
					user_name: this.$store.state.info.userInfo.name,
					user_avatar: this.avatar ,
					order_id: this.order_id,
					shop_id: this.shop_id,
					goods_id: this.goods_id,
					star_num: options.score,
					content: options.text,
					goods_attr:this.goods_attr,
				 }
				 const result = await this.$apis.finishAssess(data)
				 if(result.code === "000000") {
					 await this.$apis.msg('评论完成')
					 this.$apis.prePage().loadData()
					 uni.navigateBack()
				 }
			},
			//监听分数
			scoreChange(score) {
				// console.log(score)
				this.score = score
			}
		},
		components: {
			Issue
		}
	}
</script>

<style lang="scss">
  .avatar {
	  width: 60px;
	  height: 60upx;
	  border-radius: 50%;
  }
</style>
