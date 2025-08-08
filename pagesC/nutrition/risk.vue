<template>
	<view class="nutrition-risk-page">
		<Navbar title="本命营养地图" backgroundColor="transparent"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox direction="column" gap="16" className="risk-container">
				<Typography fontSize="16" color="gray1">根据大数据判断您可能存在以下健康风险问题：</Typography>
				<Flexbox direction="column" gap="8">
					<view class="risk-item" v-for="(risk, index) in risks" :key="index">
						<Typography fontSize="16" :bold="true">{{ risk.risk_name }}：</Typography>
						<Typography fontSize="16">{{ risk.description }}</Typography>
					</view>
				</Flexbox>
			</Flexbox>
			<Flexbox className="description">
				<textarea v-model="description" placeholder="请把你经常容易出现的问题告诉我们..." placeholder-class="placeholder"></textarea>
				<Flexbox align="center" className="speech-btn" @tap="openPopup">
					<Icon src="icon_microphone-primary.png" size="18" />
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="confirm-btn" @tap="onConfirm">
			<Typography fontSize="18" color="white" :bold="true">确认</Typography>
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
			risks: [],
			description: ''
		};
	},
	onLoad() {
		this.getRisks();
	},
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.description += text;
		},
		onConfirm() {
			if (!this.description) {
				uni.showToast({
					title: '请输入您经常容易出现的问题',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在分析...',
				mask: true
			});
			request({
				url: '/api/v2/nutrition_maps/analyze_health_issue',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id,
					user_health_risks: this.description
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						uni.redirectTo({
							url: '/pagesC/nutrition/map'
						});
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getRisks() {
			request({
				url: '/api/v2/nutrition_maps/get_nutrition_map',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.risks = res.ai_health_risks;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.nutrition-risk-page {
	padding: 32rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	.risk-container {
		padding: 32rpx 24rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
	}
	.risk-item .text {
		display: inline;
	}
	.description {
		position: relative;
		width: 100%;
		height: 272rpx;
		padding: 24rpx 32rpx;
		border-radius: 24rpx;
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
	.confirm-btn {
		width: 100%;
		height: 88rpx;
		background-color: $uni-color-primary;
		border-radius: 44rpx;
		margin-top: 64rpx;
	}
}
</style>
