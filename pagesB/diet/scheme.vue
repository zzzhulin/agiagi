<template>
	<view class="diet-scheme-page">
		<Navbar title="更换方案" :backgroundColor="navbarBgColor"></Navbar>
		<Flexbox direction="column" gap="24">
			<Flexbox className="description">
				<textarea v-model="question" placeholder="请描述你是否购买相关产品，我们将根据产品为您推荐适配的方案" placeholder-class="placeholder"></textarea>
				<Flexbox align="center" className="speech-btn" @tap="openPopup">
					<Icon src="icon_microphone-primary.png" size="18" />
				</Flexbox>
			</Flexbox>
			<Flexbox align="center" className="recommend-btn" @tap="onRecommend">
				<Typography fontSize="18" color="white" :bold="true">为我推荐方案</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<Typography fontSize="18" color="primary" :bold="true">当前可选方案</Typography>
				<Flexbox direction="column" gap="12">
					<Flexbox direction="column" gap="19" className="scheme-item" v-for="scheme in schemes" :key="scheme.id">
						<Typography fontSize="18" :bold="true">{{ scheme.scheme_name }}</Typography>
						<Flexbox align="justify">
							<Flexbox direction="column" gap="4">
								<Typography color="gray2">方案周期：</Typography>
								<Flexbox>
									<Typography>{{ scheme.duration_description }}</Typography>
									<!-- <Typography>{{ scheme.duration_days }}天能量减肥套餐</Typography>
									<Typography color="primary">（￥{{ scheme.price }}）</Typography> -->
								</Flexbox>
							</Flexbox>
							<Flexbox align="center" className="use-btn active" v-if="scheme.is_selected">
								<Typography fontSize="16" color="primary">正在使用</Typography>
							</Flexbox>
							<Flexbox align="center" className="use-btn" v-else @tap="onSelect(scheme)">
								<Typography fontSize="16" color="white" :bold="true">选用</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			navbarBgColor: 'transparent',
			sessionId: '',
			memberId: '',
			question: '',
			schemes: []
		};
	},
	onLoad(option) {
		this.memberId = option.memberId;
		this.getSchemes();
		this.getSessionId();
	},
	onPageScroll(e) {
		if (e.scrollTop >= 50) {
			this.navbarBgColor = '#ffffff';
		} else {
			this.navbarBgColor = 'transparent';
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['setRecommendScheme']),
		onRecommend() {
			if (!this.question) {
				uni.showToast({
					title: '请描述你是否购买相关产品',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在推荐...',
				mask: true
			});
			request({
				url: '/api/v2/diet-scheme/recommend-diet-scheme',
				method: 'POST',
				data: {
					question: this.question,
					member_id: this.memberId,
					user_id: this.userInfo.member_id,
					session_id: this.sessionId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.setRecommendScheme(res);
						uni.redirectTo({
							url: `/pagesB/diet/recommend?memberId=${this.memberId}`
						});
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		onSelect(scheme) {
			if (scheme.is_selected) {
				return;
			}
			uni.showModal({
				title: '温馨提示',
				content: `确定选用${scheme.scheme_name}吗？`,
				success: (res) => {
					if (res.confirm) {
						this.selectScheme(scheme);
					}
				}
			});
		},
		selectScheme(scheme) {
			request({
				url: '/api/v2/diet-scheme/switch-diet-scheme',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId,
					diet_scheme_id: scheme.id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						uni.navigateBack();
					}
				}
			});
		},
		getSessionId() {
			request({
				url: '/api/v1/chat/sessions',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id.toString()
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.sessionId = res.session_id;
					}
				}
			});
		},
		getSchemes() {
			request({
				url: '/api/v2/diet-scheme/diet-schemes-status',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.schemes = res.schemes;
					}
				}
			});
		},
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.question += text;
		}
	}
};
</script>

<style lang="scss">
.diet-scheme-page {
	min-height: 100vh;
	padding: 32rpx 32rpx 110rpx 32rpx;
	background-color: $uni-bg-color;

	.description {
		position: relative;
		width: 100%;
		height: 272rpx;
		padding: 26rpx 32rpx;
		border-radius: 24rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		font-size: 32rpx;
		line-height: 44rpx;
		color: $uni-text-color;
		background-color: #fff;
	}

	.speech-btn {
		position: absolute;
		right: 16rpx;
		bottom: 16rpx;
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background-color: $uni-bg-color;
		z-index: 9;
	}

	.recommend-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.scheme-item {
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.use-btn {
		width: 160rpx;
		height: 72rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.use-btn.active {
		background-color: $uni-color-accent2;
	}
}
</style>
