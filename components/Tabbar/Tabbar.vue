<template>
	<Flexbox direction="column" gap="12" className="tabbar-container">
		<slot></slot>
		<Flexbox :align="align" :className="['tabbar-content', { empty: !message }]">
			<Icon src="icon_microphone.png" size="24" v-if="showInput" @tap="toggleInput(false)"></Icon>
			<Icon src="icon_keyboard.png" size="24" v-else @tap="toggleInput(true)"></Icon>
			<!-- <image src="https://cdn.agiagi.cc/images/icon_camera.png" class="tabbar-icon" @tap="chooseMedia(['camera'])"></image> -->
			<textarea
				v-if="showInput"
				v-model="message"
				placeholder="陛下，请吩咐..."
				class="tabbar-input"
				:auto-height="true"
				:disabled="!canChat"
				:show-confirm-bar="false"
				:confirm-hold="true"
				:disable-default-padding="true"
				cursor-spacing="20"
				placeholder-class="placeholder"
				confirm-type="send"
				@focus="isFocus = true"
				@blur="isFocus = false"
				@linechange="onLineChange"
				@confirm="() => onConfirm()"
			/>
			<Typography fontSize="16" color="gray2" align="center" className="tabbar-input" v-else @tap="openPopup">点击说话</Typography>
			<Flexbox align="center" className="send-btn" v-if="isFocus" @tap="() => onConfirm()">
				<Typography color="white">发送</Typography>
			</Flexbox>
			<Flexbox gap="16" v-else>
				<!-- <image src="https://cdn.agiagi.cc/images/icon_microphone.png" class="tabbar-icon" @tap="openPopup"></image> -->
				<Icon src="icon_plus-circle.png" size="24" @tap="toggleAction"></Icon>
				<!-- <image src="https://cdn.agiagi.cc/images/icon_plus-circle.png" class="tabbar-icon" @tap="toggleAction"></image> -->
			</Flexbox>
		</Flexbox>
		<Flexbox align="justify" className="action-content" v-if="showAction">
			<Flexbox align="center" direction="column" gap="4" className="action-btn" @tap="chooseMedia(['album'])">
				<Flexbox align="center" className="action-icon-wrapper">
					<image src="https://cdn.agiagi.cc/images/icon_image-filled.png" class="action-icon"></image>
				</Flexbox>
				<Typography color="gray2">照片</Typography>
			</Flexbox>
			<Flexbox align="center" direction="column" gap="4" className="action-btn" @tap="chooseMedia(['camera'])">
				<Flexbox align="center" className="action-icon-wrapper">
					<image src="https://cdn.agiagi.cc/images/icon_camera-filled.png" class="action-icon"></image>
				</Flexbox>
				<Typography color="gray2">相机</Typography>
			</Flexbox>
			<Flexbox align="center" direction="column" gap="4" className="action-btn" @tap="navigateTo('/pagesC/test/test')">
				<Flexbox align="center" className="action-icon-wrapper">
					<image src="https://cdn.agiagi.cc/images/icon_file-filled.png" class="action-icon"></image>
				</Flexbox>
				<Typography color="gray2">体检报告</Typography>
			</Flexbox>
			<Flexbox align="center" direction="column" gap="4" className="action-btn" @tap="navigateTo('/pagesA/profile/profile?tab=base')">
				<Flexbox align="center" className="action-icon-wrapper">
					<image src="https://cdn.agiagi.cc/images/icon_record-filled.png" class="action-icon"></image>
				</Flexbox>
				<Typography color="gray2">健康档案</Typography>
			</Flexbox>
			<Flexbox align="center" direction="column" gap="4" className="action-btn" @tap="navigateTo('/pagesA/contract/contract')">
				<Flexbox align="center" className="action-icon-wrapper">
					<image src="https://cdn.agiagi.cc/images/icon_money-filled.png" class="action-icon"></image>
				</Flexbox>
				<Typography color="gray2">续费</Typography>
			</Flexbox>
		</Flexbox>
		<Speech ref="speechPopup" :from="from" @confirm="onConfirm"></Speech>
	</Flexbox>
</template>

<script>
import { mapState } from 'vuex';
import { upload } from '@/utils/upload';
import { isAudioFile } from '@/utils/util';

export default {
	data() {
		return {
			align: 'center',
			message: '',
			showInput: false,
			showAction: false,
			isFocus: false
		};
	},
	mounted() {
		uni.onKeyboardHeightChange((res) => {
			if (res.height > 0) {
				this.$emit('setHeight', res.height - this.safeAreaInsetBottom);
			} else {
				this.$emit('setHeight', 0);
				this.isFocus = false;
			}
		});
	},
	props: {
		canChat: {
			type: Boolean,
			default: false
		},
		canSend: {
			type: Boolean,
			default: false
		},
		from: {
			type: String,
			default: undefined
		}
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	},
	computed: {
		...mapState(['safeAreaInsetBottom'])
	},
	methods: {
		toggleInput(flag) {
			if (this.canChat) {
				this.showInput = flag;
			}
		},
		openPopup() {
			if (this.canChat) {
				this.$refs.speechPopup.open();
			}
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		uploadFile(file, type) {
			console.log(file, type);
			const filePath = file.tempFilePath || file.path;
			const fileType = file.type || file.fileType || 'file';
			upload(filePath, fileType).then((result) => {
				this.$emit('confirm', result, type, file.duration);
			});
		},
		chooseFile() {
			uni.chooseMessageFile({
				count: 1,
				type: 'file',
				extension: ['.xlsx', '.xls', '.doc', 'docx', '.ppt'],
				success: (res) => {
					res.tempFiles.forEach((file) => {
						const type = file.type === 'image' ? 2 : file.type === 'video' ? 3 : isAudioFile(file.path) ? 5 : 4;
						this.uploadFile(file, type);
					});
				}
			});
		},
		chooseMedia(sourceType) {
			if (!this.canChat) return;
			uni.chooseMedia({
				count: 9,
				mediaType: ['image', 'video'],
				sourceType,
				maxDuration: 30,
				camera: 'back',
				success: (res) => {
					res.tempFiles.forEach((file) => {
						const type = file.fileType === 'image' ? 2 : file.fileType === 'video' ? 3 : isAudioFile(file.tempFilePath) ? 5 : 4;
						this.uploadFile(file, type);
					});
				}
			});
		},
		onLineChange(event) {
			this.align = event.detail.lineCount > 1 ? 'end' : 'center';
		},
		toggleAction() {
			if (!this.canChat) return;
			this.showAction = !this.showAction;
		},
		onConfirm(message) {
			console.log(message);
			if (!this.canSend) {
				uni.showToast({
					title: '阿济正在思考，请稍等片刻',
					icon: 'none'
				});
				return;
			}
			if (message) {
				this.$emit('confirm', message, 1);
				return;
			}
			if (!this.message) {
				uni.showToast({
					title: '陛下，请吩咐...',
					icon: 'none'
				});
				return;
			}
			this.$emit('confirm', this.message, 1);
			this.message = '';
		}
	}
};
</script>

<style lang="scss">
.tabbar-container {
	width: 100%;
	padding: 16rpx 32rpx 0 32rpx;
	background-color: inherit;
	.tabbar-content {
		position: relative;
		padding: 20rpx 24rpx;
		background: #ffffff;
		border-radius: 48rpx;
		box-shadow: 0rpx 0rpx 0rpx 2rpx $uni-bg-color inset;
	}
	.tabbar-content.empty {
		height: 88rpx;
	}
	.tabbar-content::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 48rpx;
		box-shadow: 0rpx 4rpx 20rpx 0rpx #0000000d;
		z-index: -1;
	}
	.tabbar-input {
		flex: 1;
		width: auto;
		min-height: 44rpx;
		margin: 2rpx 32rpx 2rpx 16rpx;
		line-height: 44rpx;
		font-size: 32rpx;
	}
	.send-btn {
		position: absolute;
		bottom: 12rpx;
		right: 24rpx;
		width: 120rpx;
		height: 60rpx;
		background-color: $uni-color-primary;
		border-radius: 48rpx;
		z-index: 99;
	}
	.flexbox-end {
		padding-right: 128rpx;
	}
	.tabbar-icon {
		position: relative;
		width: 48rpx;
		height: 48rpx;
		z-index: 99;
	}
	.action-content {
		flex-wrap: wrap;
		row-gap: 16rpx;
		column-gap: 48rpx;
		padding: 0 31rpx;
	}
	.action-icon-wrapper {
		width: 120rpx;
		height: 120rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
	}
	.action-icon {
		width: 48rpx;
		height: 48rpx;
	}
}
</style>
