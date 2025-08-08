<template>
	<view class="clock-page">
		<Navbar title="减肥打卡" :backgroundColor="navbarBgColor"></Navbar>
		<Flexbox direction="column" gap="20">
			<Flexbox align="justify">
				<Flexbox direction="column" gap="4">
					<Typography fontSize="28" :bold="true">Day&nbsp;{{ dateCount }}</Typography>
					<Flexbox gap="24">
						<Typography fontSize="12" color="gray1">{{ date }}&nbsp;|&nbsp;打卡目标-{{ loss }}kg</Typography>
						<Flexbox className="left" @tap="navigateTo('/pagesC/clock/calendar')">
							<Typography fontSize="12">打卡日历</Typography>
							<Icon src="icon_arrow-right.png" size="16"></Icon>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Icon :src="member.avatar" size="60" :circle="true" type="remote"></Icon>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Flexbox direction="column" gap="8">
					<Flexbox gap="12" className="task-list">
						<Flexbox align="center" direction="column" v-for="item in calendars" :key="item.id" @tap="selectCalendar(item)">
							<Flexbox align="center" :className="['task-item', { active: calendar.id === item.id }]">
								<Typography :color="calendar.id === item.id ? '' : 'gray1'" :bold="calendar.id === item.id">{{ task[item.checkin_type] }}</Typography>
							</Flexbox>
							<Icon src="checkbox-filled.png" size="16" className="checkbox" v-if="item.status === 'pending'"></Icon>
							<Icon src="checkbox-filled-active.png" size="16" className="checkbox" v-else></Icon>
						</Flexbox>
						<Flexbox align="center" direction="column" className="alert-btn" @tap="navigateTo('/pagesC/clock/setting')">
							<Icon src="icon_clock-primary.png" size="20"></Icon>
							<Typography fontSize="12" color="gray2">提醒设置</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column" gap="20" className="task-content" v-if="calendar && calendar.tracking_content">
						<Typography fontSize="16" color="#000000">{{ task[calendar.checkin_type] }}</Typography>
						<Flexbox direction="column" gap="12" className="clock-content">
							<Typography fontSize="16">{{ calendar.tracking_content.tracking_text }}</Typography>
							<Flexbox gap="8" className="clock-images">
								<Icon
									:src="image"
									size="98"
									mode="aspectFit"
									type="remote"
									className="clock-image"
									v-for="(image, index) in calendar.tracking_content.images"
									:key="image"
									@tap="onPreview(calendar.tracking_content.images, index)"
								></Icon>
							</Flexbox>
							<Typography fontSize="12" color="primary">{{ formatDate(calendar.tracking_content.created_at, 'MM月DD日 hh:mm') }} 完成打卡</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column" gap="24" className="task-content" v-else>
						<Flexbox direction="column" gap="12">
							<Typography fontSize="16" color="#000000">{{ task[calendar.checkin_type] }}</Typography>
							<Typography color="gray2">{{ calendar.tracking_advice }}</Typography>
						</Flexbox>
						<Flexbox align="center" className="clock-btn" @tap="openPopup">
							<Typography fontSize="16" color="white" :bold="true">打卡</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox direction="column" gap="8" className="advice-content">
					<Typography fontSize="18" :bold="true">食疗方-膳食建议</Typography>
					<Typography color="gray1">{{ taskInfo.diet_therapy_scheme }}</Typography>
				</Flexbox>
				<Flexbox direction="column" gap="16" className="log-content">
					<Flexbox align="justify">
						<Typography fontSize="18" :bold="true">打卡成绩</Typography>
						<Typography fontSize="16" color="primary" :bold="true">累计减了{{ totalWeightLoss }}kg</Typography>
					</Flexbox>
					<Flexbox direction="column" gap="4" className="record-list">
						<Flexbox align="justify" className="record-item" v-for="(value, key) in trackingData" :key="key">
							<Typography color="gray1">{{ key }}</Typography>
							<Typography color="gray1">{{ value.weight }}kg</Typography>
							<Typography color="gray1">BMI{{ value.bmi }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<popup-clock ref="clockPopup" :calendarId="calendar.id" :dateCount="dateCount" @confirm="getCalendars"></popup-clock>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { formatDate, formatNumber } from '@/utils/util';
import { upload } from '@/utils/upload';
export default {
	data() {
		return {
			formatDate,
			navbarBgColor: 'transparent',
			dateCount: '',
			taskId: '',
			date: '',
			totalWeightLoss: '',
			task: {
				morning: '起床',
				breakfast: '早餐',
				lunch: '午餐',
				snack: '加餐',
				dinner: '晚餐'
			},
			trackingData: null,
			calendar: null,
			calendars: []
		};
	},
	onShow() {
		this.date = formatDate(new Date(), 'MM月DD日');
		this.getCalendars();
	},
	onPageScroll(e) {
		if (e.scrollTop >= 50) {
			this.navbarBgColor = '#ffffff';
		} else {
			this.navbarBgColor = 'transparent';
		}
	},
	computed: {
		...mapState(['member', 'taskInfo', 'loss'])
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		openPopup() {
			this.$refs.clockPopup.open();
		},
		selectCalendar(calendar) {
			this.calendar = calendar;
		},
		getCurrentCalendar() {
			let type = '';
			const hour = new Date().getHours();
			if (hour >= 0 && hour < 7) {
				type = 'morning';
			} else if (hour >= 7 && hour < 11) {
				type = 'breakfast';
			} else if (hour >= 11 && hour < 14) {
				type = 'lunch';
			} else if (hour >= 14 && hour < 17) {
				type = 'snack';
			} else if (hour >= 17 && hour < 24) {
				type = 'dinner';
			}
			this.calendar = this.calendars.find((item) => item.checkin_type === type);
		},
		getCalendars() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			const date = formatDate(new Date(), 'YYYY-MM-DD');
			request({
				url: '/api/v2/weight-loss-tracking/task-all-calendars',
				data: {
					tracking_task_id: this.taskInfo.id,
					date
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.dateCount = res.date_count;
						this.taskId = res.task_id;
						if (res.calendars[date]) {
							this.calendars = res.calendars[date];
						}
						this.getCurrentCalendar();
						this.getLogs();
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getLogs() {
			request({
				url: '/api/v2/weight-loss-tracking/get-tracking-logs',
				data: {
					task_id: this.taskId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.totalWeightLoss = res.total_weight_loss;
						this.trackingData = res.tracking_data;
					}
				}
			});
		},
		onPreview(urls, current) {
			uni.previewImage({
				urls,
				current
			});
		}
	}
};
</script>

<style lang="scss">
.clock-page {
	min-height: 100vh;
	padding: 48rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	background-color: $uni-bg-color;

	.task-list {
		padding: 0 0 0 16rpx;
	}

	.task-item {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #fff;
	}

	.task-item.active {
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}

	.checkbox {
		margin-top: -20rpx;
	}

	.alert-btn {
		margin-left: auto;
	}

	.task-content {
		padding: 32rpx;
		background: linear-gradient(180deg, #f6fff8 0%, #ffffff 100%);
		border-radius: 24rpx;
		box-shadow: 0 0 0 4rpx #fff inset;
	}

	.clock-btn {
		width: 320rpx;
		height: 72rpx;
		border-radius: 80rpx;
		margin: 0 auto;
		background-color: $uni-color-primary;
	}

	.advice-content,
	.log-content {
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.record-list {
		box-shadow: 0 0 0 2rpx $uni-bg-color inset;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.record-item {
		height: 56rpx;
		padding: 0 16rpx;
		&:first-child {
			height: 72rpx;
			background-color: $uni-bg-color;
		}
	}

	.clock-content {
		position: relative;
		padding-top: 40rpx;
	}

	.clock-content:before {
		content: '';
		position: absolute;
		top: 0;
		width: 100%;
		height: 2rpx;
		background-color: $uni-border-color;
	}

	.clock-images {
		flex-wrap: wrap;
	}

	.clock-image {
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		border-radius: 16rpx;
		overflow: hidden;
	}
}
</style>
