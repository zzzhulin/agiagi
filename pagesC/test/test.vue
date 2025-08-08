<template>
	<view class="test-page">
		<Navbar :fixed="false" backgroundColor="transparent"></Navbar>
		<Icon src="test-background.png" width="375" height="375" className="background"></Icon>
		<Flexbox className="description">
			<textarea v-model="description" placeholder="把你的健康困惑告诉我，我将为您推荐测量评估方法指导或调查..." placeholder-class="placeholder"></textarea>
			<Flexbox align="center" className="speech-btn" @tap="openPopup">
				<Icon src="icon_microphone-primary.png" size="18" />
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="test-btn" @tap="onTest">
			<Typography fontSize="18" color="white" :bold="true">测一测</Typography>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="history-container">
			<Flexbox align="justify" className="title">
				<Typography fontSize="16" color="gray2" :bold="true">曾经测过</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Flexbox align="justify" className="test-item" v-for="test in tests" :key="test.app_id">
					<Flexbox direction="column" gap="12">
						<Typography fontSize="16" :bold="true">{{ test.app_name }}</Typography>
						<Flexbox align="left" gap="4" @tap="() => navigateTo(`/pagesC/test/list?appId=${test.app_id}&appName=${test.app_name}`)">
							<Icon src="icon_file.png" size="16"></Icon>
							<Typography color="gray1">历史报告</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox align="center" className="again-btn" @tap="() => redirectTo(test.wx_app_path)">
						<Typography color="primary">再测一次</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			sessionId: '',
			description: '',
			tests: []
		};
	},
	onLoad() {
		this.getTests();
		this.getSessionId();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.description += text;
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		redirectTo(url) {
			uni.redirectTo({
				url
			});
		},
		onTest() {
			if (!this.description) {
				uni.showToast({
					title: '请输入您的健康困惑',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在分析...',
				mask: true
			});
			request({
				url: '/api/v2/take-a-test/analyze',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					health_question: this.description,
					session_id: this.sessionId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.redirectTo('/pagesB/robot/robot');
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getTests() {
			request({
				url: '/api/v2/take-a-test/user-test-history',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.tests = res;
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
		}
	}
};
</script>

<style lang="scss">
.test-page {
	min-height: 100vh;
	padding-top: 656rpx;
	background-color: $uni-bg-color;
	padding-bottom: env(safe-area-inset-bottom);

	.background {
		position: absolute;
		top: 0;
	}

	.description {
		position: relative;
		height: 272rpx;
		padding: 24rpx 32rpx;
		margin: 0 32rpx;
		border-radius: 24rpx;
		background-color: #ffffff;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		font-size: 32rpx;
		line-height: 44rpx;
		color: $uni-text-color;
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

	.test-btn {
		height: 88rpx;
		margin: 48rpx 32rpx 64rpx 32rpx;
		background-color: $uni-color-primary;
		border-radius: 44rpx;
		margin-top: 64rpx;
	}

	.history-container {
		margin: 0 32rpx;

		.title {
			padding: 0 32rpx;
			&:before,
			&::after {
				content: '';
				width: 220rpx;
				height: 2rpx;
				background-color: $uni-border-color;
			}
		}
	}

	.test-item {
		padding: 34rpx 32rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
	}

	.again-btn {
		width: 144rpx;
		height: 56rpx;
		border-radius: 28rpx;
		background-color: $uni-color-accent2;
	}
}
</style>
