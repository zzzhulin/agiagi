import {
	baseUrl,
	robotUrl,
	whiteList
} from "./constant";
import {
	arrayBufferToString,
	filterParams
} from "./util";
import store from '@/store';

// 全局重试队列，用于保存需要重试的请求参数
const retryQueue = [];

export const request = (options) => {
	options.header = options.header || {};
	options.data = options.data || {};
	const storage = JSON.parse(uni.getStorageSync('vuex'))
	const token = storage.token;

	// 如果 token 存在且接口不在白名单中，则携带 token
	if (token && !whiteList.includes(options.url)) {
		options.header.token = token;
		// 同时也更新数据中的 token 字段（如有需要后端校验）
		options.data.token = token;
	}

	// 针对机器人相关请求，加入租户 id
	const userInfo = storage.userInfo;
	if (options.isRobot && userInfo && userInfo.card_info && !Array.isArray(userInfo.card_info)) {
		options.header['tenant-id'] = userInfo.card_info.first_agent_id || 0;
	}

	const requestTask = uni.request({
		url: options.isRobot ? robotUrl + options.url : baseUrl + options.url,
		method: options.method || 'GET',
		data: {
			app_type: 'weapp',
			app_type_name: '微信小程序',
			token: token && !whiteList.includes(options.url) ? token : '',
			...filterParams(options.data)
		},
		header: options.header,
		timeout: 1200000,
		enableChunked: !!options.data.stream,
		success: (res) => {
			// 针对非流式返回的数据处理
			if (!options.data.stream) {
				// 请求成功
				if (res.data.code === 0 || res.data.code === 200) {
					typeof options.success === 'function' &&
						options.success(
							!['', undefined].includes(res.data.data) ? res.data.data : true
						);
				}
				// token 无效或未登录，缓存当前请求并触发登录弹窗
				else if (res.data.code === -10010) {
					retryQueue.push(options);
					store.dispatch('logout').then(() => {
						uni.$emit('openLoginPopup');
					});
				}
				// 其他错误情况，显示提示信息
				else {
					setTimeout(() => {
						uni.showToast({
							title: res.data.message || '请求出错',
							icon: 'none',
						});
					}, 100);
					console.log(res.data);
					typeof options.fail === 'function' && options.fail(res.data);
				}
			}
			// 针对流式请求的处理
			else {
				typeof options.success === 'function' && options.success();
			}
		},
		fail: (error) => {
			setTimeout(() => {
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'none',
				});
			}, 100)
			typeof options.fail === 'function' && options.fail(error);
		},
		complete: () => {
			typeof options.complete === 'function' && options.complete();
		}
	});

	// 针对流式请求的处理逻辑
	if (options.data.stream) {
		requestTask.onChunkReceived((chunk) => {
			const data = arrayBufferToString(chunk.data);
			const jsonStrings = data.match(/{[^}]+}/g);
			if (jsonStrings && jsonStrings.length) {
				jsonStrings.forEach(jsonStr => {
					try {
						const parsed = JSON.parse(jsonStr);
						uni.$emit('chunkReceived', parsed);
					} catch (e) {
						const defaultData = {
							role: 'assistant',
							content: '',
							id: `assistant_${new Date().getTime()}`,
						};
						uni.$emit('chunkReceived', defaultData);
					}
				});
			}
		});
	}
};

// 监听登录成功事件，重试之前未通过的请求并更新token
uni.$on('loginSuccess', () => {
	const newToken = store.state.token;
	while (retryQueue.length > 0) {
		const options = retryQueue.shift();
		if (newToken && !whiteList.includes(options.url)) {
			options.header.token = newToken;
			options.data.token = newToken;
		}
		request(options);
	}
});