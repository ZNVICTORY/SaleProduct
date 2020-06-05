const CONFIG = {
	// 开发环境配置
	development: {
		// baseURL: 'http://192.168.43.118:3000/api/v1'
		baseURL: 'http://49.235.51.111:3000/api/v1'
	},
	// 生产环境配置
	production: {
		baseURL: 'http://49.235.51.111:3000/api/v1'
	}
}
export default CONFIG[process.env.NODE_ENV]