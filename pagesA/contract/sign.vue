<template>
	<Flexbox direction="column" className="sign-up">
		<Flexbox direction="column" className="sign-up-body">
			<Flexbox align="center" gap="4" className="logo-content">
				<Icon src="logo.png" size="40" :circle="true"></Icon>
				<Flexbox direction="column" gap="4">
					<Icon src="slogan.png" width="144" height="17"></Icon>
					<Typography fontSize="12" color="gray1">健康要在便宜的时候买哟~~</Typography>
				</Flexbox>
			</Flexbox>
			<swiper :autoplay="true" :circular="true" :duration="1000" class="banner-swipper" @change="onChange">
				<swiper-item>
					<Icon src="brand.png" width="375" height="667" mode="widthFix" className="banner-image"></Icon>
				</swiper-item>
				<swiper-item v-for="officer in officers" :key="officer.agent_id">
					<Icon :src="officer.cover_path" width="375" height="667" mode="widthFix" type="remote" className="banner-image"></Icon>
				</swiper-item>
			</swiper>
			<Flexbox align="center" className="recruit-btn" @tap="navigateToSign">
				<Typography color="white" fontSize="18" :bold="true">立即招募</Typography>
			</Flexbox>
		</Flexbox>
		<button open-type="getPhoneNumber" class="auth-btn" v-if="!userInfo.mobile" @getphonenumber="getPhoneNumber"></button>
		<uni-popup type="center" ref="popup" :safe-area="false">
			<Flexbox align="center" direction="column" gap="24" className="user-popup">
				<button open-type="chooseAvatar" class="avatar-btn" @chooseavatar="chooseAvatar">
					<Icon :src="avatar" size="60" :circle="true" type="remote"></Icon>
				</button>
				<input v-model="nickname" type="nickname" class="nickname-input" placeholder="请输入昵称" />
				<Flexbox align="center" className="save-btn" @tap="saveUserInfo">
					<Typography fontSize="18" color="white" :bold="true">保存</Typography>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<Tabbar @tap="navigateTo('/pagesB/robot/robot')">
			<Flexbox gap="8" v-if="current">
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_happy.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">开心解压</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_meal.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">代谢调理</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_sleep.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">睡眠改善</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_face.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">减龄抗衰</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox gap="8" v-else>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_body.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">减肥增肌</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_height.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">增高成和</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_happy.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">开心解压</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn">
					<Icon src="icon_meal.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">代谢调理</Typography>
				</Flexbox>
			</Flexbox>
		</Tabbar>
	</Flexbox>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { upload } from '@/utils/upload';
export default {
	data() {
		return {
			avatar: '',
			nickname: '',
			current: 0,
			officers: []
		};
	},
	onLoad() {
		if (this.token) {
			if (!this.userInfo) {
				this.getUserInfo();
			}
			this.getOfficers();
		}
	},
	computed: {
		...mapState(['token', 'userInfo'])
	},
	watch: {
		userInfo() {
			this.avatar = this.userInfo.headimg;
			this.nickname = this.userInfo.nickname;
			if (this.avatar === 'https://niushop.yulongtianzi.com/public/static/img/tx.png') {
				this.$refs.popup.open();
			}
		}
	},
	methods: {
		...mapMutations(['setToken']),
		...mapActions(['getUserInfo']),
		saveUserInfo() {
			this.setAvatar();
			this.setNickname();
			this.getUserInfo();
			this.getOfficers();
			this.$refs.popup.close();
			this.redirectTo('/pagesA/overview/overview');
		},
		setAvatar() {
			request({
				url: '/api/member/modifyheadimg',
				method: 'POST',
				data: {
					headimg: this.avatar
				},
				success: () => {}
			});
		},
		setNickname() {
			request({
				url: '/api/member/modifynickname',
				method: 'POST',
				data: {
					nickname: this.nickname
				},
				success: () => {}
			});
		},
		chooseAvatar(e) {
			const { avatarUrl } = e.detail;
			upload(avatarUrl, 'image').then((result) => {
				this.avatar = result;
			});
		},
		getPhoneNumber(e) {
			uni.showLoading({
				title: '正在授权',
				mask: true
			});
			request({
				url: '/api/member/authorize_mobile',
				method: 'POST',
				data: {
					code: e.detail.code
				},
				success: (res) => {
					if (res) {
						this.loginByMobile(res.phoneNumber);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		loginByMobile(mobile) {
			request({
				url: '/api/login/authMobile',
				method: 'POST',
				data: {
					mobile
				},
				success: (res) => {
					if (res) {
						this.bindOpenId(res.token);
					}
				}
			});
		},
		bindOpenId(token) {
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					if (loginRes.code) {
						// console.log(loginRes.code);
						// return;
						request({
							url: '/weapp/api/weapp/getAuthCodeToOpenId',
							method: 'POST',
							data: {
								code: loginRes.code,
								token
							},
							success: (res) => {
								if (res) {
									this.setToken(token);
									this.getUserInfo();
									this.redirectTo('/pagesA/overview/overview');
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
		getOfficers() {
			request({
				url: '/api/contract.agency/lists',
				method: 'POST',
				success: (res) => {
					if (res) {
						this.officers = res.list;
					}
				}
			});
		},
		onChange(event) {
			this.current = event.detail.current;
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		redirectTo(url) {
			setTimeout(() => {
				uni.redirectTo({
					url
				});
			}, 100);
		},
		navigateToSign() {
			const agentId = this.current ? this.officers[this.current - 1].agent_id : '';
			if (this.current) {
				this.navigateTo(`/pagesA/sign/officer?agentId=${agentId}`);
			} else {
				this.navigateTo('/pagesA/sign/robot');
			}
		}
	}
};
</script>

<style lang="scss">
.sign-up {
	width: 100%;
	height: 100vh;

	.sign-up-body {
		position: relative;
		height: calc(100vh - 244rpx);
	}

	.logo-content {
		position: absolute;
		top: 96rpx;
		left: 24rpx;
		z-index: 9;
	}

	.banner-swipper {
		height: 100%;
	}

	.banner-image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.recruit-btn {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 48rpx;
		width: 480rpx;
		height: 88rpx;
		margin: auto;
		border-radius: 44rpx;
		background-color: $uni-color-warning;
		box-shadow: 0rpx 8rpx 20rpx 0rpx #f77f364d;
	}

	.btn-badge {
		position: absolute;
		top: -10rpx;
		right: 0;
	}

	.btn-badge-text {
		position: relative;
		width: 176rpx;
		margin-top: 2rpx;
		text-align: center;
	}

	.btn-badge-background {
		position: absolute;
		right: 0;
		width: 196rpx;
		height: 40rpx;
	}

	.auth-btn {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		z-index: 9999;
	}

	.save-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}

.user-popup {
	width: 600rpx;
	padding: 40rpx;
	border-radius: 32rpx;
	background-color: #fff;

	.avatar-btn {
		width: 120rpx;
		height: 120rpx;
		padding: 0;
		border-radius: 50%;
		background-color: transparent;
	}

	.nickname-input {
		display: flex;
		align-items: center;
		width: 100%;
		height: 88rpx;
		padding: 20rpx 24rpx;
		border-radius: 16rpx;
		border: 2rpx solid $uni-border-color;
	}
}
</style>
