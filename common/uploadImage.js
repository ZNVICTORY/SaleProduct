var COS = require('./cos-wx-sdk-v5/index.js');

const cos = new COS({
  SecretId:'AKIDg0A5oIyrdB2fCXpQLp5SaTFnSr7BDdz5',
  SecretKey:'0LdlfKSLRKzQcdR5SZUAdrcBWdiz1pSs'
})
// export default cos
const BucketConfig = {
  Bucket: 'prodlive-1300616667',
  Region: 'ap-shanghai'
}
/**
 * @param {String} fileName
 * @param {String} filePath
 * @param {String} Dir
 * @return {String} imgURL
 * */
export function upImg(fileName, filePath, dir) {
	if(!dir) {
		dir = 'img/'
	}
	return new Promise((resolve, reject) => {
		cos.postObject({
			Bucket: BucketConfig.Bucket,
			Region: BucketConfig.Region,    
			Key: dir+fileName,
			FilePath: filePath,            
			onProgress: function(progressData) {
			    console.log(JSON.stringify(progressData));
			}
		}, (err, data) => {
			// console.log(err || data)
			if(err) { reject(err) }
			resolve(data)
		})
	})
}
/**
 * 压缩图片
 * @param {String} imgurl
 * @return {type}
 * */
export function compressImage(imgurl) {
	console.log(imgurl)
	const options = {
		src: imgurl,
		dst: imgurl,
		overwrite:true,
		quality: 100,
		format: "jpg",
		width: "100px",
		height:"100px"
	}
    return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		plus.zip.compressImage(options, async (success) => {
			console.log(success)
			const urlArray = success.target.split("/")
			const fileName = urlArray[urlArray.length - 1]
			const result = await upImg(fileName, success.target)
			console.log(result)
			resolve(result)
		}, (error) => {
			reject(error)
			console.log(error)
		})
		// #endif
	})	
	
}
