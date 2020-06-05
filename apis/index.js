import http from './http.js'
// import goEasy from '@/common/GoEasy.js'
/****************************用户模块*******************************/
// 用户登陆
export const postLogin = (data) => http.POST('/user/login', data)
// 更新登陆状态
export const updateLogin = (data) => http.POST('/user/updateLogin', data)
// 用户注册
export const postRegister = (data) => http.POST('/user/register', data)
// 获取验证码图片
export const getImageCaptcha = (data) => http.GET('/user/login/captcha', data)
// 获取短信验证码
export const getMsgCode = (data) => http.GET('/user/register/sendMsg', data)
// 找回密码
export const resizePass = (data) => http.POST('/user/modifyPass', data)
// 修改密码
export const updatePassword = (data) => http.POST('/user/updatePassword', data)
// 获取用户信息
export const getUserInfo = (data) => http.GET('/user/userInfo', data)
// 提交用户信息
export const perfectUserInfo =(data) => http.POST('/user/perfect', data)
export const getUserName = (data) => http.GET('/user/username', data)
// 意见反馈
export const submitAdvices = (data) => http.POST('/user/advice', data)

/****************************直播室模块*********************** *******/
// 创建直播室
export const createLive = (data) => http.POST('/live/create', data)
// 获取直播室信息
export const getLiveByShop = (data) => http.GET('/live/livebyshop', data)
// 根据直播id 获取直播地址
export const getLiveById = (data) => http.GET('/live/liveItem', data)
// 开始直播
export const startById = (data) => http.GET('/live/liveStart', data)
// 获取直播列表
export const getLiveList = (data) => http.GET('/live/liveList', data)
// 根据live_id 获取拉流信息
export const getLivePlay = (data) => http.GET('/live/livePlay', data)
// 根据live_id 结束直播
export const endLiveById = (data) => http.GET('/live/liveEnd', data)
// 关注直播间 或取消直播
export const attentionLive = (data) => http.POST('/live/attention', data)
// 获取关注直播间
export const getLikelive = (data) => http.GET('/live/attentionList', data)
// 根据sort_id, range_id 获取直播间
export const getLiveByshopClass = (data) => http.GET('/live/shopclass', data)
/**
 * 更新直播间观众人数
 * data: { live_id: string, type: 'enter' | 'out' }
 * */
export const updateViewMount = (data) => http.POST('/live/view', data)

/*****************************购物车模块******************************/
export const getCartList = (data) => http.GET('/cart/cartList', data)
// 加入购物车
export const increaseCart = (data) => http.POST('/cart/increase', data)
// 删除购物车中的商品
export const deleteByLiveid = (data) => http.POST('/cart/delete', data)
// 改变购物车中的状态
export const changeCartStatus = (data) => http.GET('/cart/status', data)
// 改变购物车中商品的数量
export const changCartNum = (data) => http.GET('/cart/goods_num', data)
// 清空购物车
export const deleteCartByuid = (data) => http.POST('/cart/deleteAll', data)

/*****************************商店模块*******************************/
export const createShop = (data) => http.POST('/shop/create', data)
// 商家接口
export const getShopList = (data) => http.GET('/shop/list', data)
// 顾客接口
export const getShopInfobyShopId = (data) => http.GET('/shop/shopInfo', data)
/*****************************商品模块*******************************/
// 根据shop_id获取商品信息
export const getGoodsByShopId = (data) => http.GET('/goods/goodsbyshop', data)
// 关注商店
export const heartShop = (data) => http.POST('/shop/heart', data)
// 进入店铺
export const updateView = (data) => http.POST('/shop/updateViews', data)
// 判断用户是否已关注过
export const getIsHeart = (data) => http.POST('/shop/isheart', data)
// 根据商品id 获取商品详情
export const getGoodsByGoodsId = (data) => http.GET('/goods/goodsInfo', data)
export const getGoodsById = (data) => http.GET('/goods/goodsSimpleinfo', data)

/**************************订单模块***********************/
// 根据获取购物车选中的商品创建订单
export const getCartGoodsByuid = (data) => http.GET('/order/orderModal', data)
// 创建订单
export const creatOrderList = (data) => http.POST('/order/createOrder', data)
// 获取支付订单
export const getPayMoney = (data) => http.GET('/order/payorder', data)
// 确认支付
export const confirmPay = (data) => http.POST('/order/payconfirm', data)
// 根据state 获取orderList
export const getOrderList = (data) => http.GET('/order/orderList', data)
// 取消订单
export const cancelOrder = (data) => http.POST('/order/cancelOrder', data)
// 删除订单
export const deleteOrder = (data) => http.POST('/order/deleteOrder', data)
// 确认收货订单
export const confirmOrder = (data) => http.POST('/order/confirmOrder', data)
// 订单评论
export const finishAssess = (data) => http.POST('/order/assess', data)
/***************************评论模块************************************/

// 根据商品ID获取评论内容
export const getCommentByGoodsId = (data) => http.GET('/comment/content', data)
/***************************地址管理模块 ********************************/
export const getAddressData = (data) => http.GET('/address/addressList', data)
// 更新或创建地址
export const updateOrCreate = (data) => http.POST('/address/createOrupdate', data)
// 获取默认地址
export const getDefaultAddress = (data) => http.GET('/address/default', data)
// 修改默认地址
export const changedefault = (data) => http.GET('/address/changeDefault', data)
// 删除地址
export const deleteAddressById = (data) => http.POST('/address/deletebyid', data)

/*****************************直播分类模块**********************************/
// 获取某个范围的类型
export const getTabInfo = (data) => http.GET('/shop/goodsclass', data)
// export const getAllRange = (data) => http.GET('/sort/range', data)
// export const getAllSortByRangeId = (data) => http.GET('/sort/sortByrangeId', data)
/*****************************搜索模块**************************************/
export const search = data => http.GET('/search/key', data)
/******************************埋点*******************************/
export const enterLive = data => http.POST('/live/buried/enter', data)
export const outLive = data => http.POST('/live/buried/out', data)


// 获取上一页实例
export const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
export const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
export function debounce(fn, interval = 600) {
	let timeout = null
	return function() {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			fn.apply(this, arguments)
		}, interval)
	}
}
export function modal (content = null, succCallback = null, failCallback = null) {
	uni.showModal({
		content: content,
		success: succCallback,
		fail: failCallback
	})
}
/**
 * @param {String} channel 
 * @return { String} msgContent
 * 订阅消息, 接收消息
 * **/
//  export const subscribeMsg = (channel) => {
// 	console.log(channel, 'sub')
//  	goEasy.subscribe({
//  		// channel: String(channel),
// 		channel: '111',
//  		onMessage: (message) => {
// 			console.log(message)
//  			const info = { msg: message.content }
// 			console.log(typeof message,"ok")
//  		}
//  	})
// }
 /**
   * 发布消息
   * @param {String} msg 
   * @param {String} channel 
   * ***/
 // export const publishMsg = (msg, channel) => {
	//  console.log(msg, channel)
 // 	goEasy.publish({
 // 		channel: String(channel),
 // 		message: msg
 // 	})
 // }
/***********************使用测试数据**********************/
