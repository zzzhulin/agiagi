<template>
	<view class="clock-setting-page">
		<Navbar title="打卡提醒设置" backgroundColor="#F4F6F9"></Navbar>
		<Flexbox direction="column" gap="16">
			<Typography fontSize="17" color="#000000">开启{{ diffDay }}天的打卡提醒</Typography>
			<Flexbox direction="column" gap="12">
				<Flexbox direction="column" gap="8" className="alert-item" v-for="item in list" :key="item.id">
					<Flexbox align="justify" className="alert-time">
						<Typography fontSize="24" :bold="true">{{ getTime(item.start_time) }}</Typography>
						<Flexbox align="center" className="alert-status disabled" v-if="item.open_status">
							<Typography color="gray2">已开启</Typography>
						</Flexbox>
						<Flexbox align="center" className="alert-status" v-else @tap="onAdd(item)">
							<Typography color="white">开启</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column">
						<Typography color="gray2">{{ item.title }}</Typography>
						<Typography fontSize="16" v-if="item.description">{{ item.description }}</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { getTime } from '@/utils/util';
import CryptoJS from 'crypto-js';
export default {
	data() {
		return {
			getTime,
			diffDay: 0,
			list: [],
			path: '/pagesC/clock/clock',
			sessionKey: ''
		};
	},
	onShow() {
		this.getList();
		const d1 = new Date(this.taskInfo.start_date);
		const d2 = new Date(this.taskInfo.end_date);
		this.diffDay = this.getDaysDifference(d1, d2);
	},
	computed: {
		...mapState(['taskInfo'])
	},
	methods: {
		getDaysDifference(date1, date2) {
			// 定义一天的毫秒数
			const oneDay = 24 * 60 * 60 * 1000;
			// 计算两个日期的时间差（毫秒）
			const diffInMs = Math.abs(date2.getTime() - date1.getTime());
			// 计算相差天数并向下取整
			return Math.floor(diffInMs / oneDay);
		},
		getSessionKey() {
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
								token: this.token
							},
							success: (res) => {
								if (res) {
									this.sessionKey = res.session_key;
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
		calculateSignature(sessionKey, path) {
			return CryptoJS.HmacSHA256(path, sessionKey).toString(CryptoJS.enc.Hex);
		},
		getList() {
			request({
				url: '/api/v2/calendar_reminders/get-calendar-reminders',
				method: 'POST',
				data: {
					user_id: this.taskInfo.user_id,
					member_id: this.taskInfo.member_id,
					task_id: this.taskInfo.id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.list = res;
						this.getSessionKey();
					}
				}
			});
		},
		onAdd(item) {
			wx.addPhoneRepeatCalendar({
				title: item.title,
				description: item.description,
				startTime: item.start_time,
				endTime: item.end_time,
				repeatInterval: item.repeat_interval,
				repeatEndTime: item.repeat_end_time,
				alarm: true,
				path: this.path,
				signature: this.calculateSignature(this.sessionKey, this.path),
				success: (calendarRes) => {
					console.log('添加日历事件成功', calendarRes);
					item.open_status = true;
					this.updateStatus(item);
				},
				fail: (err) => {
					if (!err.errMsg.includes('cancel')) {
						uni.showToast({
							title: err.errMsg,
							icon: 'none'
						});
					}
					console.error('添加日历事件失败', err);
				}
			});
		},
		updateStatus(item) {
			request({
				url: '/api/v2/calendar_reminders/update-reminder-status',
				method: 'POST',
				data: {
					user_id: item.user_id,
					reminder_id: item.id,
					open_status: true
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						uni.showToast({
							title: '开启成功',
							icon: 'none'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.clock-setting-page {
	min-height: 100vh;
	padding: 24rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	background-color: $uni-bg-color;

	.alert-item {
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.alert-time {
		height: 68rpx;
	}

	.alert-status {
		width: 120rpx;
		height: 56rpx;
		background-color: $uni-color-primary;
		border-radius: 28rpx;
	}

	.alert-status.disabled {
		background-color: $uni-bg-color;
	}
}
</style>
