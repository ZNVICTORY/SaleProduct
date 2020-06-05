import config from '../config/index.config.js'
import { msg } from './index.js'

function fetch(options) {
	const token = uni.getStorageSync('token') || ""
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	}
	return new Promise((resolve, reject) => {
		// console.log(config.baseURL + options.url)
		uni.request({
			url: config.baseURL + options.url,
			header: headers,
			method: options.method,
			data: options.data || null,
			success:(res) => {
				const result = res.data
				// console.log(result)
				// if( result.code === "000004") {
				// 	msg('您未登陆, 请先登陆')
				// 	uni.redirectTo({
				// 		url:'/pages/public/login.vue'
				// 	})
				// }
				  resolve(result)
				},
			fail: (err) => { reject(err)}
		})
	}) 
}

export default {
	GET(url, data = {}) {
		return fetch({url, data, method: 'GET'})
	},
	POST(url, data = {}) {
		return fetch({url, data, method: 'POST'})
	}
}