<template>
	<view class="clock-start-page">
		<Navbar title="减肥打卡"></Navbar>
		<Flexbox align="center" direction="column" gap="32">
			<Icon src="clock_banner.png" size="300"></Icon>
			<Flexbox align="center" direction="column" gap="8">
				<Typography color="#000000">
					体重{{ initData.weight }}kg&nbsp;&nbsp;|&nbsp;&nbsp;腰围{{ initData.waist_circumference }}cm&nbsp;&nbsp;|&nbsp;&nbsp;身高{{ initData.height }}cm
				</Typography>
				<Typography fontSize="12" color="gray2">减肥活动健康调查数据</Typography>
			</Flexbox>
			<Flexbox align="center" direction="column" gap="24">
				<Typography fontSize="18" :bold="true">拍照留底-见证自己的变化</Typography>
				<Flexbox gap="8" className="image-list">
					<Flexbox v-for="(image, index) in images" :key="image" className="image-item">
						<Icon :src="image" size="106" type="remote" mode="aspectFit" @tap="onPreview(index)"></Icon>
						<Icon src="icon_delete.png" size="24" className="delete-btn" @tap="onDelete(index)"></Icon>
					</Flexbox>
					<Flexbox align="center" direction="column" className="upload-btn" @tap="onUpload">
						<Icon src="icon_upload.png" size="32"></Icon>
						<Typography color="gray2">添加照片</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="start-btn" @tap="onStart">
				<Typography fontSize="18" color="white" :bold="true">开启减肥打卡之旅</Typography>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { upload } from '@/utils/upload';
import CryptoJS from 'crypto-js';
export default {
	data() {
		return {
			initData: null,
			images: [],
			path: '/pagesC/clock/clock',
			sessionKey: ''
		};
	},
	onLoad() {
		this.getInitData();
	},
	computed: {
		...mapState(['taskInfo', 'token'])
	},
	methods: {
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
		// 修改后的 onStart 方法：等待日历添加完成后再跳转
		onStart() {
			if (!this.images.length) {
				uni.showToast({
					title: '请拍照留底',
					icon: 'none'
				});
				return;
			}
			request({
				url: '/api/v2/weight-loss-tracking/start-task',
				method: 'POST',
				data: {
					tracking_task_id: this.taskInfo.id,
					images: this.images
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getCalendar(res.user_id, res.member_id, res.id);
					}
				}
			});
		},
		getCalendar(user_id, member_id, task_id) {
			request({
				url: '/api/v2/calendar_reminders/get-calendar-reminders',
				method: 'POST',
				data: {
					user_id,
					member_id,
					task_id
				},
				isRobot: true,
				success: (res) => {
					if (res && res.length) {
						const item = res[0];
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
								this.updateStatus(item);
								uni.redirectTo({
									url: '/pagesC/clock/setting'
								});
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
					}
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
		},
		onPreview(current) {
			uni.previewImage({
				urls: this.images,
				current
			});
		},
		onDelete(index) {
			this.images.splice(index, 1);
		},
		onUpload() {
			uni.chooseImage({
				count: 9,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					res.tempFiles.forEach(async (file) => {
						const result = await upload(file.path, 'image');
						if (result) {
							this.images.push(result);
						}
					});
				}
			});
		},
		getInitData() {
			request({
				url: '/api/v2/weight-loss-tracking/get_memeber_init_data',
				data: {
					member_id: this.taskInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.initData = res;
						this.getSessionKey();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.clock-start-page {
	padding-top: 48rpx;

	.image-list {
		flex-wrap: wrap;
	}

	.upload-btn,
	.image-item {
		width: 212rpx;
		height: 212rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		border-radius: 16rpx;
	}

	.image-item {
		position: relative;
		overflow: hidden;
	}

	.delete-btn {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.start-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
