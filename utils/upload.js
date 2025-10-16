import {
	baseUrl
} from "./constant";
import {
	request
} from "./request";

export const upload = (filePath, type) => {
	console.log('上传文件的type', type);
	const storage = JSON.parse(uni.getStorageSync('vuex'))
	const token = storage.token;
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '正在上传...',
			mask: true
		})
		uni.uploadFile({
			url: baseUrl + '/api/upload/file',
			filePath,
			name: 'file',
			header: {
				'token': token || '',
			},
			formData: {
				type
			},
			success: (res) => {
				const result = JSON.parse(res.data);
				console.log('上传成功:', JSON.parse(res.data));
				if (result.code === 10067 && (result.data.pic_path || result.data.path)) {
					resolve(result.data.pic_path || result.data.path)
				}
			},
			fail: (err) => {
				console.error('上传失败:', err);
			},
			complete: () => {
				uni.hideLoading()
			}
		});
	});
}