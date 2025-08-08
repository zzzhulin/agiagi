<template>
	<view class="clock-success-page">
		<Navbar title="打卡日历"></Navbar>
		<Flexbox direction="column" gap="32">
			<Flexbox align="center" direction="column" gap="16">
				<Icon src="icon_success.png" size="128" />
				<Flexbox align="center" direction="column" gap="12">
					<Typography fontSize="18" color="#000000" :bold="true">Day {{ clockInfo.date_count }}&nbsp;&nbsp;&nbsp;{{ task[clockInfo.checkin_type] }}打卡成功</Typography>
					<Typography color="gray1">“{{ clockInfo.tracking_text }}”</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="analysis-container">
				<Flexbox direction="column">
					<Flexbox direction="column" className="analysis-content">
						<Flexbox direction="column" gap="4" className="table" v-if="clockInfo.checkin_type === 'morning'">
							<Flexbox className="table-header">
								<Typography fontSize="16" :bold="true">进度分析</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">体重变化</Typography>
								<Typography color="gray1">{{ clockInfo.progress_info.weight_change_from_last }}kg</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">腰围变化</Typography>
								<Typography color="gray1">{{ clockInfo.progress_info.waistline_change_from_last }}cm</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">BMI</Typography>
								<Typography color="gray1">{{ clockInfo.progress_info.bmi_change_from_last }}</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">体脂率</Typography>
								<Typography color="gray1">{{ clockInfo.progress_info.body_fat_rate_change_from_last }}%</Typography>
							</Flexbox>
						</Flexbox>
						<Flexbox direction="column" gap="4" className="table" v-else>
							<Flexbox className="table-header">
								<Typography fontSize="16" :bold="true">营养成分分析</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">热量</Typography>
								<Typography color="gray1">{{ clockInfo.nutrition_info.calories }}</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">GL</Typography>
								<Typography color="gray1">{{ clockInfo.nutrition_info.glycemic_load }}</Typography>
							</Flexbox>
							<Flexbox align="justify" className="table-row">
								<Typography color="gray1">蛋白质 : 脂肪 : 碳水</Typography>
								<Typography color="gray1">{{ clockInfo.nutrition_info.protein_fat_carb_ratio }}</Typography>
							</Flexbox>
						</Flexbox>
						<Typography className="table-footer">{{ clockInfo.ai_comment }}</Typography>
					</Flexbox>
					<Icon src="triangle.png" width="50" height="12"></Icon>
				</Flexbox>
				<Icon src="logo.png" size="40" align="left" label="来自阿济的评价" fontSize="16" :bold="true" gap="8"></Icon>
			</Flexbox>
		</Flexbox>
		<!-- <Flexbox direction="column" gap="32">
			<Flexbox align="center" direction="column" gap="16">
				<Icon src="icon_success.png" size="128" />
				<Flexbox align="center" direction="column" gap="12">
					<Typography fontSize="18" color="#000000" :bold="true">Day 1&nbsp;&nbsp;&nbsp;晨起打卡成功</Typography>
					<Typography color="gray1">“今天起不来”</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="analysis-container">
				<Flexbox direction="column">
					<Flexbox direction="column" gap="17" className="analysis-content">
						<Typography className="table-footer">
							现在势头挺猛，说明代谢还不错噢，腰围减的挺多，说明内脏脂肪下降很多，这样的减肥方式是很好的，对你的身体健康非常有益！
						</Typography>
					</Flexbox>
					<Icon src="triangle.png" width="50" height="12"></Icon>
				</Flexbox>
				<Icon src="logo.png" size="40" align="left" label="来自阿济的评价" fontSize="16" :bold="true" gap="8"></Icon>
			</Flexbox>
		</Flexbox> -->
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="back-btn" @tap="onBack">
				<Typography fontSize="18" color="white" :bold="true">返回首页</Typography>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			task: {
				morning: '起床',
				breakfast: '早餐',
				lunch: '午餐',
				snack: '加餐',
				dinner: '晚餐'
			}
		};
	},
	computed: {
		...mapState(['clockInfo'])
	},
	methods: {
		onBack() {
			uni.reLaunch({
				url: '/pages/home/home'
			});
		}
	}
};
</script>

<style lang="scss">
.clock-success-page {
	padding-top: 64rpx;
	padding-bottom: 172rpx;
	.analysis-container {
		width: 622rpx;
		margin: auto;
	}

	.analysis-content {
		border-radius: 32rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray3;
		overflow: hidden;
	}

	.table {
		position: relative;
		padding-bottom: 34rpx;
		&::after {
			content: '';
			position: absolute;
			left: 32rpx;
			right: 32rpx;
			bottom: 0;
			height: 2rpx;
			background-color: $uni-border-color;
		}
	}

	.table-header {
		padding: 24rpx 32rpx;
		height: 92rpx;
		background-color: $uni-color-accent2;
	}

	.table-row {
		height: 56rpx;
		padding: 8rpx 32rpx;
	}

	.table-footer {
		padding: 34rpx 32rpx 40rpx 32rpx;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.back-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
