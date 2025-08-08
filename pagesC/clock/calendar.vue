<template>
	<view class="clock-calendar-page">
		<Navbar title="打卡日历" :backgroundColor="navbarBgColor"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox direction="column" gap="12" className="clock-item" v-for="(item, index) in calendars" :key="key">
				<Flexbox align="justify" className="clock-day">
					<Typography fontSize="22" color="#000000" :bold="true">Day {{ Object.keys(calendars).length - index }}</Typography>
					<Typography color="gray1">{{ formatDate(item.key, 'MM月DD日') }}</Typography>
				</Flexbox>
				<block v-for="calendar in item.value" :key="calendar.id">
					<Flexbox direction="column" gap="12" className="clock-container" v-if="calendar.tracking_content">
						<Typography fontSize="16">{{ task[calendar.checkin_type] }}</Typography>
						<Flexbox direction="column" gap="12" className="clock-content">
							<Typography>{{ calendar.tracking_content.tracking_text }}</Typography>
							<Flexbox gap="8" className="clock-images">
								<Icon
									:src="image"
									size="88"
									mode="aspectFit"
									className="clock-image"
									type="remote"
									v-for="(image, index) in calendar.tracking_content.images"
									:key="image"
									@tap="() => onPreview(calendar.tracking_content.images, index)"
								></Icon>
							</Flexbox>
							<Typography fontSize="12" color="gray2">{{ formatDate(calendar.tracking_content.created_at, 'MM月DD日 hh:mm') }} 完成打卡</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column" gap="8" className="clock-container" v-else>
						<Flexbox align="justify">
							<Typography fontSize="16">{{ task[calendar.checkin_type] }}</Typography>
							<Flexbox align="center" className="clock-btn" @tap="() => openPopup(calendar.id, item.key, Object.keys(calendars).length - index)">
								<Typography color="primary">打卡</Typography>
							</Flexbox>
						</Flexbox>
						<Typography color="gray2">{{ calendar.tracking_advice }}</Typography>
					</Flexbox>
				</block>
			</Flexbox>
		</Flexbox>
		<popup-clock ref="clockPopup" :calendarId="calendarId" :dateCount="dateCount" @confirm="getCalendars"></popup-clock>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { formatDate } from '@/utils/util';
export default {
	data() {
		return {
			formatDate,
			navbarBgColor: 'transparent',
			calendarId: '',
			dateCount: '',
			task: {
				morning: '起床',
				breakfast: '早餐',
				lunch: '午餐',
				snack: '加餐',
				dinner: '晚餐'
			},
			calendars: []
		};
	},
	onLoad() {
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
		...mapState(['taskInfo'])
	},
	methods: {
		onPreview(urls, current) {
			uni.previewImage({
				urls,
				current
			});
		},
		openPopup(calendarId, calendarDate, dateCount) {
			const now = new Date();
			const today = this.formatDate(now, 'YYYY-MM-DD');
			const clockDate = this.formatDate(calendarDate, 'YYYY-MM-DD');
			if (today !== clockDate) {
				uni.showToast({
					title: '只能打今天的卡',
					icon: 'none'
				});
				return;
			}
			this.dateCount = dateCount;
			this.calendarId = calendarId;
			this.$refs.clockPopup.open();
		},
		getCalendars() {
			request({
				url: '/api/v2/weight-loss-tracking/task-all-calendars',
				data: {
					tracking_task_id: this.taskInfo.id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						for (const key in res.calendars) {
							this.calendars.push({
								key,
								value: res.calendars[key]
							});
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.clock-calendar-page {
	min-height: 100vh;
	padding: 32rpx 32rpx 124rpx 32rpx;
	background-color: $uni-bg-color;

	.clock-item {
		position: relative;
		padding-left: 48rpx;
		&:before {
			content: '';
			position: absolute;
			top: 32rpx;
			left: 12rpx;
			width: 2rpx;
			height: calc(100% + 68rpx);
			background-color: $uni-border-color;
		}
	}

	.clock-day {
		position: relative;
		height: 72rpx;
		&:before {
			content: '';
			position: absolute;
			left: -48rpx;
			top: 0;
			bottom: 0;
			width: 24rpx;
			height: 24rpx;
			margin: auto;
			border-radius: 50%;
			background-color: $uni-color-accent1;
			box-shadow: 0 0 0 4rpx $uni-color-accent2 inset;
		}
	}

	.clock-container {
		padding: 24rpx;
		background: #fff;
		border-radius: 24rpx;
	}

	.clock-content {
		position: relative;
		padding-top: 24rpx;
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

	.clock-btn {
		width: 142rpx;
		height: 48rpx;
		border-radius: 28rpx;
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}
}
</style>
