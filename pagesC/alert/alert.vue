<template>
	<view class="alert-page">
		<Navbar title="提醒我" backgroundColor="transparent"></Navbar>
		<Typography className="text-container" color="gray1" v-if="text">{{ text }}</Typography>
		<Flexbox direction="column" :gap="!text ? 16 : 24" className="form-container">
			<Typography color="warning" v-if="!text">为保障您能及时收到提醒，请检查手机“设置--通知--日历”是否允许通知。</Typography>
			<Typography fontSize="22" :bold="true" v-if="text">生成提醒如下：</Typography>
			<Typography fontSize="22" color="gray1" :bold="true" v-else>提醒示例：</Typography>
			<Flexbox direction="column" gap="16">
				<Flexbox align="justify" gap="15" v-for="field in fields" :key="field.value">
					<Typography color="gray1">{{ field.label }}</Typography>
					<block v-if="!text">
						<input v-model="formData[field.value]" :placeholder="field.placeholder" :disabled="true" placeholder-class="placeholder" class="form-content" />
					</block>
					<block v-else>
						<input
							v-model="formData[field.value]"
							:placeholder="field.placeholder"
							placeholder-class="placeholder"
							class="form-content"
							v-if="['title', 'description'].includes(field.value)"
						/>
						<picker
							mode="date"
							:value="formData[field.value]"
							start="1900-01-01"
							:end="endDate"
							@change="selectDate($event, field.value)"
							v-else-if="['repeat_start_time', 'repeat_end_time'].includes(field.value)"
						>
							<Flexbox align="center" className="form-content">
								<input v-model="formData[field.value]" :disabled="true" :placeholder="field.placeholder" placeholder-class="placeholder" class="form-input" />
								<Icon src="icon_arrow-right.png" size="24"></Icon>
							</Flexbox>
						</picker>
						<picker
							mode="time"
							:value="formData[field.value]"
							start="00:00"
							end="23:59"
							@change="selectDate($event, field.value)"
							v-else-if="['start_date'].includes(field.value)"
						>
							<Flexbox align="center" className="form-content">
								<input v-model="formData[field.value]" :disabled="true" :placeholder="field.placeholder" placeholder-class="placeholder" class="form-input" />
								<Icon src="icon_arrow-right.png" size="24"></Icon>
							</Flexbox>
						</picker>
						<picker
							mode="selector"
							:value="repeatIndex"
							:range="repeatData"
							range-key="label"
							@change="selectRepeat"
							v-else-if="['repeat_interval'].includes(field.value)"
						>
							<Flexbox align="center" className="form-content">
								<input
									v-model="repeatData[repeatIndex].label"
									:disabled="true"
									:placeholder="field.placeholder"
									placeholder-class="placeholder"
									class="form-input"
								/>
								<Icon src="icon_arrow-right.png" size="24"></Icon>
							</Flexbox>
						</picker>
					</block>
				</Flexbox>
			</Flexbox>
			<Flexbox align="center" className="add-btn" v-if="text" @tap="onAdd">
				<Typography fontSize="18" color="primary" :bold="true">添加到我的日历</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="tabbar-container">
			<Flexbox direction="column" gap="4" v-if="!text">
				<Typography fontSize="16" color="primary" :bold="true">比如，你可以这样说：</Typography>
				<Typography className="speech-text">“从明天起，每天6点半提醒我跑步，直到6月30号”</Typography>
			</Flexbox>
			<Flexbox align="center" className="speech-btn" @tap="openPopup">
				<Flexbox align="center" gap="4">
					<Icon src="icon_microphone-light.png" size="24"></Icon>
					<Typography fontSize="18" color="white" :bold="true">按住直接告诉我</Typography>
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
import { formatDate } from '@/utils/util';
import CryptoJS from 'crypto-js';

export default {
	data() {
		return {
			fields: [
				{
					label: '开始时间',
					value: 'repeat_start_time',
					placeholder: '什么时候开始？'
				},
				{
					label: '结束时间',
					value: 'repeat_end_time',
					placeholder: '什么时候结束？（非必填）'
				},
				{
					label: '提醒时间',
					value: 'start_date',
					placeholder: '几点提醒我？'
				},
				{
					label: '提醒频率',
					value: 'repeat_interval',
					placeholder: '每天'
				},
				{
					label: '日历标题',
					value: 'title',
					placeholder: '(默认) 阿济阿济的提醒'
				},
				{
					label: '提醒内容',
					value: 'description',
					placeholder: '需要做什么？'
				}
			],
			repeatIndex: 0,
			repeatData: [
				{
					label: '每天',
					value: 'day'
				},
				{
					label: '每周',
					value: 'week'
				},
				{
					label: '每月',
					value: 'month'
				},
				{
					label: '每年',
					value: 'year'
				}
			],
			formData: {
				title: '',
				description: '',
				start_date: '',
				start_date_timestamp: '',
				end_date: '',
				end_date_timestamp: '',
				repeat_interval: '',
				repeat_start_time: '',
				repeat_start_time_timestamp: '',
				repeat_end_time: '',
				repeat_end_time_timestamp: ''
			},
			text: '',
			path: '/pages/home/home',
			sessionKey: ''
		};
	},
	computed: {
		...mapState(['userInfo', 'taskInfo', 'token']),
		endDate() {
			const date = new Date();
			date.setFullYear(date.getFullYear() + 1);
			return formatDate(date, 'YYYY-MM-DD');
		}
	},
	methods: {
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.text += text;
			this.analysisText();
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
		onAdd() {
			wx.addPhoneRepeatCalendar({
				title: this.formData.title,
				description: this.formData.description,
				startTime: this.formData.start_date_timestamp,
				endTime: this.formData.end_date_timestamp,
				repeatInterval: this.formData.repeat_interval || 'day',
				repeatEndTime: this.formData.repeat_end_time_timestamp || this.formData.end_date_timestamp,
				alarm: true,
				path: this.path,
				signature: this.calculateSignature(this.sessionKey, this.path),
				success: (res) => {
					console.log('添加日历事件成功', res);
					this.addCalendar();
				},
				fail: (err) => {
					console.error('添加日历事件失败', err);
					if (!err.errMsg.includes('cancel')) {
						uni.showToast({
							title: err.errMsg,
							icon: 'none'
						});
					}
				}
			});
		},
		addCalendar() {
			uni.showLoading({
				mask: true,
				title: '正在添加...'
			});
			request({
				url: '/api/v2/calendar_reminders/save-calendar-reminder',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.taskInfo.member_id,
					reminder_type: 'other',
					title: this.formData.title,
					start_time: this.formData.start_date_timestamp,
					end_time: this.formData.end_date_timestamp,
					all_day: false,
					description: this.formData.description,
					location: '',
					alarm_enabled: true,
					alarm_offset: 0,
					repeat_interval: this.formData.repeat_interval || 'day',
					repeat_end_time: this.formData.repeat_end_time_timestamp || this.formData.end_date_timestamp,
					wx_path: '',
					open_status: true
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						});
						this.text = '';
						for (let key in this.formData) {
							this.formData[key] = '';
						}
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		selectDate(e, field) {
			this.formData[field] = e.detail.value;
		},
		selectRepeat(e) {
			this.repeatIndex = e.detail.value;
			this.formData.repeat_interval = this.repeatData[this.repeatIndex].value;
		},
		analysisText() {
			uni.showLoading({
				mask: true,
				title: '正在解析...'
			});
			request({
				url: '/api/v2/calendar_reminders/ai-extract',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					text: this.text
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.formData = res;
						this.getSessionKey();
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.alert-page {
	min-height: 100vh;
	padding: 24rpx 32rpx 396rpx 32rpx;
	background-color: $uni-bg-color;

	.text-container {
		margin-bottom: 28rpx;
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.form-container {
		background-color: #fff;
		border-radius: 24rpx;
		padding: 32rpx;
	}

	.form-content {
		position: relative;
		width: 480rpx;
		min-height: auto;
		height: auto;
		padding: 20rpx 16rpx 20rpx 24rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
		font-size: 28rpx;
		line-height: 40rpx;

		.icon {
			position: absolute;
			top: 20rpx;
			right: 16rpx;
		}
	}

	.form-input {
		flex: 1;
		min-height: auto;
		height: auto;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.add-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 32rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
		&:before {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			content: '';
			height: 2rpx;
			background-color: $uni-border-color;
		}
	}

	.speech-text {
		line-height: 56rpx;
	}

	.speech-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
