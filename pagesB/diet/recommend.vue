<template>
	<view class="diet-recommend-scheme-page">
		<Navbar title="推荐方案" backgroundColor="transparent"></Navbar>
		<Flexbox direction="column" gap="16" v-if="recommendScheme">
			<Typography color="gray1">{{ recommendScheme.recommendation_reason }}</Typography>
			<Typography fontSize="16" color="primary" :bold="true">分析后，为你推荐以下方案</Typography>
			<Flexbox direction="column" gap="12">
				<Flexbox direction="column" gap="19" className="scheme-item" v-for="scheme in recommendScheme.recommendations" :key="scheme.id">
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
						<Flexbox align="center" className="use-btn" @tap="onSelect(scheme)">
							<Typography fontSize="16" color="white" :bold="true">选用</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			memberId: ''
		};
	},
	onLoad(option) {
		this.memberId = option.memberId;
	},
	computed: {
		...mapState(['userInfo', 'recommendScheme'])
	},
	methods: {
		onSelect(scheme) {
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
		}
	}
};
</script>

<style lang="scss">
.diet-recommend-scheme-page {
	min-height: 100vh;
	padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	background-color: $uni-bg-color;

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
}
</style>
