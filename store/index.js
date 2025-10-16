import Vue from 'vue';
import Vuex from 'vuex';
import {
	request
} from '@/utils/request';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		statusBarHeight: 0,
		safeAreaInsetBottom: 0,
		contractCount: 0,
		familyCount: 0,
		token: '',
		userInfo: null,
		tongueInfo: {
			images: [],
			description: '',
			image_analysis: [],
			constitution_type: '',
			constitution_features: []
		},
		AKID: '',
		AKKEY: '',
		APPKEY: '',
		voiceToken: '',
		member: {
			member_id: '',
			member_name: ''
		},
		basicInfo: [],
		aiDocterResult: {
			constitution_type: '',
			constitution_features: []
		},
		clockInfo: null,
		taskInfo: null,
		loss: '',
		socketTask: null,
		recommendScheme: null,
		addressInfo: null,
		nutritionData: null,
	},
	mutations: {
		setStatusBarHeight(state, height) {
			state.statusBarHeight = height;
		},
		setSafeAreaInsetBottom(state, height) {
			state.safeAreaInsetBottom = height;
		},
		setContractCount(state, contractCount) {
			state.contractCount = contractCount
		},
		setFamilyCount(state, familyCount) {
			state.familyCount = familyCount
		},
		setToken(state, token) {
			state.token = token;
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		},
		setTongueInfo(state, tongueInfo) {
			state.tongueInfo = tongueInfo;
		},
		setAKID(state, AKID) {
			state.AKID = AKID;
		},
		setAKKEY(state, AKKEY) {
			state.AKKEY = AKKEY;
		},
		setAPPKEY(state, APPKEY) {
			state.APPKEY = APPKEY;
		},
		setVoiceToken(state, voiceToken) {
			state.voiceToken = voiceToken;
		},
		setMember(state, member) {
			state.member = member;
		},
		setBasicInfo(state, basicInfo) {
			state.basicInfo = basicInfo;
		},
		setAiDocterResult(state, aiDocterResult) {
			state.aiDocterResult = aiDocterResult;
		},
		setTaskInfo(state, taskInfo) {
			state.taskInfo = taskInfo
		},
		setClockInfo(state, clockInfo) {
			state.clockInfo = clockInfo;
		},
		setLoss(state, loss) {
			state.loss = loss
		},
		setSocketTask(state, socketTask) {
			state.socketTask = socketTask
		},
		setRecommendScheme(state, recommendScheme) {
			state.recommendScheme = recommendScheme
		},
		setAddressInfo(state, addressInfo) {
			state.addressInfo = addressInfo
		},
		setNutritionData(state, nutritionData) {
			state.nutritionData = nutritionData;
		},
	},
	actions: {
		getSystemInfo({
			commit
		}) {
			uni.getSystemInfo({
				success: (res) => {
					commit('setStatusBarHeight', res.statusBarHeight);
					commit('setSafeAreaInsetBottom', res.safeAreaInsets.bottom);
				}
			});
		},
		getUserInfo({
			commit
		}) {
			request({
				url: '/api/member/info',
				method: 'POST',
				success: (res) => {
					if (res) {
						commit('setUserInfo', res);
					}
				}
			});
		},
		login({
			commit,
			dispatch
		}, params) {
			request({
				url: '/api/login/auth',
				method: 'POST',
				data: params,
				success: (res) => {
					if (res) {
						commit('setToken', res.token);
						dispatch('getUserInfo')
					}
				}
			});
		},
		logout({
			commit,
			state
		}) {
			state.statusBarHeight = 0;
			state.safeAreaInsetBottom = 0;
			state.contractCount = 0;
			state.familyCount = 0;
			state.token = '';
			state.userInfo = null;
			state.tongueInfo = {
				images: [],
				description: '',
				image_analysis: [],
				constitution_type: '',
				constitution_features: []
			};
			state.AKID = '';
			state.AKKEY = '';
			state.APPKEY = '';
			state.voiceToken = '';
			state.member = {
				member_id: '',
				member_name: ''
			};
			state.basicInfo = [];
			state.aiDocterResult = {
				constitution_type: '',
				constitution_features: []
			};
			state.clockInfo = null;
			state.taskInfo = null;
			state.loss = '';
			state.socketTask = null;
			state.nutritionData = null;
			uni.removeStorageSync('vuex');
		}
	},
	plugins: [createPersistedState({
		storage: {
			getItem: (key) => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
			removeItem: (key) => uni.removeStorageSync(key),
		}
	})]
});