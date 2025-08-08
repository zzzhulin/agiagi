<template>
	<uni-popup ref="login" type="center" :isMaskClick="false">
		<Flexbox align="center" direction="column" gap="24" className="login-popup">
			<Flexbox align="center" direction="column" gap="12">
				<Icon src="undraw-login.png" width="156" height="93" mode="widthFix"></Icon>
				<Typography fontSize="18" :bold="true">您还未登录</Typography>
				<Typography color="gray2">您尚未登录，请先进行登录</Typography>
			</Flexbox>
			<Flexbox align="center" className="login-btn" @tap="onLogin">
				<Typography fontSize="16" color="white" :bold="true">立即登录</Typography>
			</Flexbox>
		</Flexbox>
	</uni-popup>
</template>

<script>
import { mapActions } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {};
	},
	created() {
		uni.$on('openLoginPopup', this.open);
		uni.$on('loginSuccess', this.close);
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	},
	methods: {
		...mapActions(['login']),
		onLogin() {
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					if (loginRes.code) {
						request({
							url: '/weapp/api/weapp/authCodeToOpenid',
							method: 'POST',
							data: { code: loginRes.code },
							success: (res) => {
								if (res) {
									this.login({ weapp_openid: res.openid });
									uni.$emit('loginSuccess');
									this.close();
								}
							}
						});
					} else {
						console.log(loginRes.errMsg);
					}
				},
				fail: (err) => {
					console.error('登录失败', err);
				}
			});
		},
		open() {
			this.$refs.login.open();
		},
		close() {
			this.$refs.login.close();
		}
	}
};
</script>

<style lang="scss">
.login-popup {
	width: 600rpx;
	padding: 40rpx;
	border-radius: 32rpx;
	background-color: #fff;
	.login-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
