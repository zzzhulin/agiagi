<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { getToken } from '@/utils/token';
import { initVoice } from '@/utils/voice';

export default {
	onLaunch: function () {
		this.getSystemInfo();
		console.log('App onLaunch');
		if (this.token) {
			this.getAliyunConfig();
			this.getUserInfo();
		} else {
			uni.reLaunch({
				url: '/pagesA/contract/sign'
			});
		}
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	},
	computed: {
		...mapState(['token'])
	},
	watch: {
		token() {
			this.getAliyunConfig();
		}
	},
	methods: {
		...mapActions(['login', 'getUserInfo', 'getSystemInfo']),
		...mapMutations(['setAKID', 'setAKKEY', 'setAPPKEY', 'setVoiceToken']),
		getAliyunConfig() {
			request({
				url: '/api/v3/aliyun/aliyun_voice_config',
				isRobot: true,
				success: async (res) => {
					// 获取 token 等配置
					const token = await getToken(res.AKID, res.AKKEY);
					this.setVoiceToken(token);
					this.setAKID(res.AKID);
					this.setAKKEY(res.AKKEY);
					this.setAPPKEY(res.appKey);
					initVoice(res.appKey, token);
				}
			});
		}
	}
};
</script>

<style lang="scss">
text,
input,
textarea,
view {
	box-sizing: border-box;
}

input,
textarea {
	height: 44rpx;
	line-height: 44rpx;
	font-size: 32rpx;
	padding: 0;
	background-color: transparent;
	color: $uni-text-color;
}

textarea {
	height: auto;
	min-height: 44rpx;
}

.md-p {
	font-size: 32rpx;
	line-height: 44rpx;
	-webkit-margin-before: 0 !important;
	margin-block-start: 0 !important;
	-webkit-margin-after: 0 !important;
	margin-block-end: 0 !important;
}

._block text {
	display: none !important;
}

.placeholder {
	font-size: 28rpx;
	color: $uni-text-color-placeholder;
}

.assistant-btn {
	flex: none;
	height: 48rpx;
	padding: 0 16rpx;
	box-shadow: 0 0 0 2rpx $uni-text-color-gray4 inset;
	border-radius: 28rpx;
	background-color: $uni-bg-color-2;
}

.assistant-icon {
	width: 32rpx;
	height: 32rpx;
}

.full-width {
	width: 100%;
}
</style>
