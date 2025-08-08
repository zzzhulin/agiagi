<template>
	<view class="plan-page">
		<Navbar backgroundColor="transparent" title="方案"></Navbar>
		<Flexbox direction="column" className="plan-list">
			<Flexbox direction="column" gap="12" className="plan-item">
				<Flexbox direction="column" gap="8" className="plan-content">
					<Typography fontSize="16">轻断食疗法（2天/3人餐）</Typography>
					<Flexbox gap="8">
						<Typography color="gray2" className="plan-description">加强补充Va，增大蔬菜供给，优先选择红萝卜加强补充Va，增大蔬菜供给...</Typography>
						<Icon size="60" className="plan-cover"></Icon>
					</Flexbox>
				</Flexbox>
				<Flexbox align="justify" className="plan-category">
					<Typography fontSize="12" color="gray1">饮食处方</Typography>
					<Typography fontSize="12" color="gray2">2025.02.12 12:23</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			plans: []
		};
	},
	onLoad() {
		this.getLatestDietPrescription();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		getLatestDietPrescription() {
			request({
				url: '/api/v2/diet-prescription/history',
				data: {
					user_id: this.userInfo.member_id,
					tenant_id: this.userInfo.card_info.first_agent_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.plans = res;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.plan-page {
	height: 100vh;
	padding: 24rpx 40rpx env(safe-area-inset-bottom) 40rpx;
	background-color: $uni-bg-color;

	.plan-item {
		padding: 16rpx 24rpx 0 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.plan-description {
		flex: 1;
	}

	.plan-cover {
		flex: none;
	}

	.plan-category {
		height: 64rpx;
		border-top: 2rpx solid $uni-text-color-gray4;
	}
}
</style>
