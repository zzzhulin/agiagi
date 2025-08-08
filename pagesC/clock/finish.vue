<template>
	<view class="clock-finish-page" v-if="taskInfo">
		<Navbar title="打卡日历" />
		<Flexbox align="center" direction="column" gap="30">
			<Flexbox align="center" direction="column" gap="4">
				<Icon src="clock-finish.png" size="128" />
				<Typography fontSize="22" :bold="true">{{ taskInfo.checkin_days }}天打卡结束</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="16" className="clock-score">
				<Flexbox direction="column" gap="4" className="table">
					<Flexbox className="table-header">
						<Typography fontSize="16" :bold="true">打卡成绩</Typography>
					</Flexbox>
					<Flexbox align="justify" className="table-row">
						<Typography color="gray1">体重变化</Typography>
						<Typography color="gray1">{{ taskInfo.body_changes.weight_change }}kg</Typography>
					</Flexbox>
					<Flexbox align="justify" className="table-row">
						<Typography color="gray1">BMI</Typography>
						<Typography color="gray1">{{ taskInfo.body_changes.bmi_change }}</Typography>
					</Flexbox>
					<Flexbox align="justify" className="table-row">
						<Typography color="gray1">腰围</Typography>
						<Typography color="gray1">{{ taskInfo.body_changes.waistline_change }}cm</Typography>
					</Flexbox>
					<Flexbox align="justify" className="table-row">
						<Typography color="gray1">体脂率</Typography>
						<Typography color="gray1">{{ taskInfo.body_changes.body_fat_rate_change }}%</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox direction="column" gap="12" className="clock-comparison">
					<Typography fontSize="16" color="#000000" :bold="true">前后照片对比</Typography>
					<Flexbox direction="column" gap="8">
						<Typography color="gray1">打卡开始前</Typography>
						<Flexbox gap="11" className="image-list">
							<Icon :src="image" size="96" type="remote" v-for="image in taskInfo.before_after_images.before" :key="image" />
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column" gap="8">
						<Typography color="gray1">打卡结束后</Typography>
						<Flexbox gap="11" className="image-list">
							<Icon :src="image" size="96" type="remote" v-for="image in taskInfo.before_after_images.after" :key="image" />
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>

		<Flexbox align="center" gap="13" className="tabbar-container">
			<Flexbox align="center" className="start-btn" @tap="openPopup('dayPopup')">
				<Typography fontSize="18" color="primary" :bold="true">继续打卡</Typography>
			</Flexbox>
			<Flexbox align="center" className="back-btn" @tap="onBack">
				<Typography fontSize="18" color="white" :bold="true">返回首页</Typography>
			</Flexbox>
		</Flexbox>

		<uni-popup ref="dayPopup" type="bottom" :safeArea="false">
			<view class="select-days-popup">
				<Flexbox align="right" className="select-title">
					<Icon src="icon_close.png" size="24" @tap="closePopup('dayPopup')"></Icon>
				</Flexbox>
				<view class="scroll-area" @touchmove.stop="moveFn" @touchstart.stop="moveStartFn" @touchend.stop="moveEndFn">
					<view class="scroll-mask"></view>

					<view class="scroll-content" :style="{ top: dayScrollTop + 'rpx' }">
						<view v-for="(day, index) in dayOptions" :key="day" class="day-item" :class="{ current: index === selectedDayIndex }">{{ day }}天</view>
					</view>
				</view>
				<Flexbox align="center" className="start-btn" @tap="openPopup('weightPopup')">
					<Typography fontSize="18" color="white" :bold="true">继续打卡</Typography>
				</Flexbox>
			</view>
		</uni-popup>
		<uni-popup ref="weightPopup" type="center" :safeArea="false">
			<Flexbox direction="column" gap="24" className="weight-popup">
				<Flexbox direction="column" gap="12">
					<Typography fontSize="16">继续打卡{{ dayOptions[selectedDayIndex] }}天，设置新的目标体重</Typography>
					<Flexbox align="justify" className="weight-input-content">
						<input v-model="target_weight" placeholder="请输入目标体重" class="weight-input" />
						<Typography fontSize="18" color="gray2">kg</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox gap="14">
					<Flexbox align="center" className="cancel-btn" @tap="closePopup('weightPopup')">
						<Typography fontSize="18" color="gray2" :bold="true">取消</Typography>
					</Flexbox>
					<Flexbox align="center" className="confirm-btn" @tap="onStart">
						<Typography fontSize="18" color="white" :bold="true">确定</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<Login />
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';

export default {
	data() {
		return {
			target_weight: '',
			dayScrollTop: 0,
			selectedDayIndex: 0,
			dayOptions: [5, 10, 15],
			touchStart: []
		};
	},
	computed: {
		...mapState(['userInfo', 'member', 'taskInfo'])
	},
	methods: {
		...mapMutations(['setTaskInfo']),
		openPopup(popup) {
			if (popup === 'weightPopup') {
				this.closePopup('dayPopup');
			}
			this.$refs[popup].open();
		},
		closePopup(popup) {
			this.$refs[popup].close();
		},
		moveStartFn(e) {
			const { pageX, pageY } = e.touches[0];
			this.touchStart = [pageX, pageY];
		},
		moveFn(e) {
			const deltaY = e.touches[0].pageY - this.touchStart[1];
			this.touchStart[1] = e.touches[0].pageY;
			const minTop = -96 * (this.dayOptions.length - 1);
			this.dayScrollTop = Math.min(0, Math.max(minTop, this.dayScrollTop + deltaY));
		},
		moveEndFn() {
			this.dayScrollTop = Math.round(this.dayScrollTop / 96) * 96;
			this.selectedDayIndex = Math.abs(this.dayScrollTop / 96);
		},

		onBack() {
			uni.reLaunch({
				url: '/pages/home/home'
			});
		},
		onStart() {
			uni.showLoading({
				title: '创建任务中...',
				mask: true
			});

			const selectedDays = this.dayOptions[this.selectedDayIndex];

			request({
				url: '/api/v2/weight-loss-tracking/continue-tracking',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.taskInfo.member_id,
					add_days: selectedDays,
					target_weight: this.target_weight,
					tracking_task_id: this.taskInfo.id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getTask();
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getTask() {
			request({
				url: '/api/v2/weight-loss-tracking/get-user-task',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.taskInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.setTaskInfo(res);
						uni.redirectTo({
							url: '/pagesC/clock/start'
						});
					}
				}
			});
		}
	}
};
</script>
<style lang="scss">
.clock-finish-page {
	min-height: 100vh;
	padding: 64rpx 32rpx 172rpx 32rpx;

	.clock-score {
		width: 100%;
		padding-bottom: 32rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
		overflow: hidden;
	}

	.table {
		position: relative;
		padding-bottom: 32rpx;
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

	.clock-comparison {
		padding: 0 32rpx;
	}

	.image-list {
		flex-wrap: wrap;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.start-btn,
	.back-btn {
		width: 330rpx;
		height: 88rpx;
		border-radius: 44rpx;
	}

	.start-btn {
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}

	.back-btn {
		background-color: $uni-color-primary;
	}
}

.select-days-popup {
	width: 100%;
	height: 556rpx;
	background-color: #fff;
	border-radius: 32rpx 32rpx 0 0;

	.select-title {
		height: 80rpx;
		padding-right: 32rpx;
		align-items: center;
	}

	.scroll-area {
		height: 288rpx;
		position: relative;
		overflow: hidden;
	}

	.scroll-mask {
		position: absolute;
		top: 0;
		left: 32rpx;
		width: 686rpx;
		height: 96rpx;
		border-top: 2rpx solid $uni-bg-color;
		border-bottom: 2rpx solid $uni-bg-color;
	}

	.scroll-content {
		position: absolute;
		width: 100%;
	}

	.day-item {
		height: 96rpx;
		text-align: center;
		line-height: 96rpx;
		font-size: 32rpx;
		color: $uni-text-color-gray2;
		transition: all 0.2s;
	}

	.day-item.current {
		font-size: 36rpx;
		color: $uni-text-color;
		font-weight: 600;
	}

	.start-btn {
		margin: 32rpx 32rpx 0 32rpx;
		width: auto;
		background-color: $uni-color-primary;
	}
}

.weight-popup {
	width: 588rpx;
	height: 380rpx;
	padding: 40rpx;
	border-radius: 32rpx;
	background-color: #fff;

	.weight-input-content {
		padding-right: 26rpx;
		height: 96rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		border-radius: 16rpx;
	}

	.weight-input {
		padding: 0 32rpx;
		flex: 1;
	}

	.cancel-btn,
	.confirm-btn {
		width: 240rpx;
		height: 88rpx;
		border-radius: 44rpx;
	}

	.cancel-btn {
		background-color: $uni-bg-color;
	}

	.confirm-btn {
		background-color: $uni-color-primary;
	}
}
</style>
