import Vue from 'vue'
import store from '@/store/index.js'

// 定义一个handle 类
class handle {
	constructor(arg) {
	    return arg
	}
	/* 获取当前网络状态 */
	getNetWorkStatus() {
		let networkType;
		uni.getNetworkType({
			success:(res) => {
				networkType = res.networkType
				if( networkType === "none") {
					// 响应修改网络状态
					store.commit("changeNetWork", false)
				}
				Vue.prototype.networkType = networkType
			}
		})
	}
	/* 网络状态变化检测 */
	netWorkChange() {
		let status;
		uni.onNetworkStatusChange((res) => {
			/*
			 * isConnected:当前是否有网络连接,
			 * networkType:网络类型
			 */
			status = res.isConnected
			if(res.isConnected) {
				switch(res.networkType) {
					case 'unknown':
						this.showToast('未知的网络状态')
						break;
					case 'wifi':
						this.showToast('已切换至wifi网络')
						break;
					case '4g':
						this.showToast('已切换至4g网络')
						break;
					case '3g':
						this.showToast('已切换至3g网络')
						break;
					case '2g':
						this.showToast('已切换至2g网络')
						break;
					case 'none':
						this.showToast('当前无网络连接,请检查网络')
						break;
				}
			} else {
				this.showToast('网络连接不可用,请检查网络');
			}
			/* 响应网络修改状态*/
			store.commit('changeNetWork', status)
		})
	}
	showToast(message, position = 'bottom', icon = 'none') {
		// #ifdef APP-PLUS
		const styles = {
			verticalAlign: String(position)
		}
		plus.nativeUI.toast(message, styles);
		// #endif
		// #ifdef MP || H5
		uni.showToast({
			title: String(message),
			icon: String(icon),
			position: String(position),
		})
		// #endif
	}
	
}
export default new handle()