<template>
	<uni-popup ref="popup" type="bottom" backgroundColor="#fff" border-radius="32rpx 32rpx 0 0">
		<Flexbox direction="column" gap="32" className="clock-popup">
			<Flexbox direction="column" gap="20">
				<Flexbox direction="column" gap="11">
					<textarea v-model="trackingText" placeholder="起床后记录一下体重、腰围等，饭后记录一下吃了些什么..." placeholder-class="placeholder"></textarea>
					<Flexbox align="center" className="speech-btn" @tap="openPopup">
						<Icon src="icon_microphone-light.png" size="24"></Icon>
					</Flexbox>
				</Flexbox>
				<Flexbox gap="12" className="image-list">
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
			<Flexbox align="center" className="confirm-btn" @tap="onConfirm">
				<Typography fontSize="18" color="white" :bold="true">确认打卡</Typography>
			</Flexbox>
		</Flexbox>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
	</uni-popup>
</template>

<script>
import { mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { upload } from '@/utils/upload';

export default {
	data() {
		return {
			trackingText: '',
			images: []
		};
	},
	props: {
		calendarId: String,
		dateCount: String
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	},
	methods: {
		...mapMutations(['setClockInfo']),
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.trackingText += text;
		},
		open() {
			this.$refs.popup.open();
		},
		close() {
			this.$refs.popup.close();
		},
		onPreview(index) {
			uni.previewImage({
				urls: this.images,
				current: this.images[index]
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
		onConfirm() {
			if (!this.trackingText) {
				uni.showToast({
					title: '请输入打卡内容',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在打卡...',
				mask: true
			});
			request({
				url: '/api/v2/weight-loss-tracking/submit-tracking-log',
				method: 'POST',
				data: {
					calendar_id: parseInt(this.calendarId),
					images: this.images,
					tracking_text: this.trackingText
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.setClockInfo({ ...res, date_count: this.dateCount });
						this.$emit('confirm');
						this.trackingText = '';
						this.images = [];
						this.close();
						uni.navigateTo({
							url: '/pagesC/clock/success'
						});
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
.clock-popup {
	height: 738rpx;
	padding: 48rpx 32rpx 0 32rpx;
	textarea {
		width: 100%;
		height: 160rpx;
		font-size: 32rpx;
		line-height: 44rpx;
	}
	.placeholder {
		font-size: 32rpx;
		line-height: 44rpx;
	}
	.speech-btn {
		width: 72rpx;
		height: 72rpx;
		margin-left: auto;
		border-radius: 50%;
		background-color: $uni-color-primary;
	}
	.image-list {
		position: relative;
		padding-top: 32rpx;
		flex-wrap: wrap;
		&:before {
			content: '';
			position: absolute;
			top: 0;
			width: 100%;
			height: 2rpx;
			background-color: $uni-border-color;
		}
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
	.confirm-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		margin: 0 auto;
		background-color: $uni-color-primary;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
