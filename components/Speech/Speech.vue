<template>
	<uni-popup ref="speech" type="bottom" :isMaskClick="false" backgroundColor="#ffffff" borderRadius="32rpx 32rpx 0 0">
		<Flexbox align="center" direction="column" gap="24" className="speech-popup">
			<Flexbox align="center" gap="4" className="close-btn" @tap="close('cancel')">
				<Icon src="icon_close.png" size="24"></Icon>
				<Typography fontSize="16" color="gray1">取消</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<Flexbox className="result-container" v-if="transcriptionText || currentTranscriptionText">
					<Typography fontSize="18">{{ transcriptionText }}{{ currentTranscriptionText }}</Typography>
				</Flexbox>
				<Flexbox align="center" className="empty-container" v-else>
					<Typography fontSize="22" :bold="true">我在听，您请说</Typography>
				</Flexbox>
				<Flexbox align="center" direction="column" gap="8">
					<Typography color="gray2">点击下方立即停止</Typography>
					<Flexbox align="center" gap="4" className="wave-btn" @tap="close('confirm')">
						<view :class="['bar', { recording: isRecording }]" v-for="n in 18" :key="n" :style="{ animationDelay: (n - 1) * 0.1 + 's' }"></view>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
	</uni-popup>
</template>

<script>
import { mapState } from 'vuex';
import { getToken } from '@/utils/token';
import SpeechTranscription from '@/utils/st';
import { parseMsg, sleep } from '@/utils/util';
import { aliyunWss } from '@/utils/constant';

const recorder = uni.getRecorderManager();

export default {
	data() {
		return {
			isRecording: false,
			transcriptionActive: false,
			transcriptionText: '',
			currentTranscriptionText: '',
			accessToken: '',
			transcriptionClient: null,
			inactivityTimer: null // 用于“无新消息”计时器
		};
	},
	async mounted() {
		if (!this.AKID) {
			return;
		}
		// 录音数据推送
		recorder.onFrameRecorded(({ frameBuffer, isLastFrame }) => {
			if (isLastFrame) console.log('录音已结束');
			if (this.transcriptionClient && this.transcriptionActive) {
				console.log(`发送音频数据，长度：${frameBuffer.byteLength}`);
				this.transcriptionClient.sendAudio(frameBuffer);
			}
		});
		recorder.onStart(() => console.log('录音开始'));
		recorder.onStop(() => console.log('录音停止'));
		recorder.onError((err) => console.error('录音错误：', err));

		// 获取 Token
		try {
			this.accessToken = await getToken(this.AKID, this.AKKEY);
		} catch (error) {
			console.error('获取访问 Token 失败：', error);
			return;
		}

		// 初始化转写客户端
		const client = new SpeechTranscription({
			url: aliyunWss,
			appkey: this.APPKEY,
			token: this.accessToken
		});

		client.on('started', () => console.log('转写服务启动'));

		client.on('changed', (msg) => {
			console.log('实时转写中：', msg);
			const parsed = parseMsg(msg);
			if (parsed?.payload?.result) {
				this.isRecording = true;
				this.currentTranscriptionText = parsed.payload.result;
				this.startInactivityTimer(); // 重置计时器
			}
		});

		client.on('begin', (msg) => console.log('句子解析开始：', msg));

		client.on('end', (msg) => {
			console.log('句子解析结束：', msg);
			const parsed = parseMsg(msg);
			if (parsed?.payload?.result) {
				this.isRecording = false;
				this.currentTranscriptionText = parsed.payload.result;
			}
			this.transcriptionText += this.currentTranscriptionText + ' ';
			this.currentTranscriptionText = '';
			this.startInactivityTimer(); // 重置计时器
		});

		client.on('completed', (msg) => console.log('转写完成：', msg));
		client.on('closed', () => console.log('转写连接已关闭'));
		client.on('failed', (msg) => console.error('转写失败：', msg));

		this.transcriptionClient = client;
		if (['robot', 'chat'].includes(this.from)) {
			this.open();
		}
	},
	destroyed() {
		console.log('页面卸载，关闭转写');
		this.transcriptionActive = false;
		recorder.stop();
		if (this.transcriptionClient) {
			this.transcriptionClient.shutdown();
		}
		this.clearInactivityTimer(); // 清理计时器
	},
	props: {
		from: {
			type: String,
			default: undefined
		}
	},
	computed: {
		...mapState(['AKID', 'AKKEY', 'APPKEY'])
	},
	methods: {
		// 启动或重置 3 秒无新消息自动关闭
		startInactivityTimer() {
			this.clearInactivityTimer();
			this.inactivityTimer = setTimeout(() => {
				if (this.transcriptionActive) {
					this.close('confirm');
				}
			}, 5000);
		},
		clearInactivityTimer() {
			if (this.inactivityTimer) {
				clearTimeout(this.inactivityTimer);
				this.inactivityTimer = null;
			}
		},

		async open() {
			this.$refs.speech.open();
			if (!this.transcriptionText) {
				this.startInactivityTimer();
			}
			if (!this.transcriptionClient) {
				console.warn('转写客户端未初始化');
				return;
			}
			if (this.transcriptionActive) {
				console.warn('转写已在进行中');
				return;
			}
			try {
				await this.transcriptionClient.start(this.transcriptionClient.defaultStartParams());
				this.transcriptionActive = true;
			} catch (error) {
				console.error('启动转写失败：', error);
				return;
			}
			recorder.start({
				duration: 600000,
				numberOfChannels: 1,
				sampleRate: 16000,
				format: 'PCM',
				frameSize: 4
			});
		},
		async close(type) {
			this.$refs.speech.close();
			this.clearInactivityTimer(); // 关闭时清理计时
			if (this.transcriptionText && type === 'confirm') {
				this.$emit('confirm', this.transcriptionText);
			}
			recorder.stop();
			await sleep(500);
			if (this.transcriptionActive && this.transcriptionClient) {
				try {
					console.log('关闭转写服务');
					await this.transcriptionClient.close();
					this.transcriptionActive = false;
					this.transcriptionText = '';
					this.currentTranscriptionText = '';
				} catch (error) {
					console.error('关闭转写失败：', error);
				}
			}
		}
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	}
};
</script>

<style lang="scss">
.speech-popup {
	position: relative;
	padding: 88rpx 32rpx 0 32rpx;
	min-height: 588rpx;

	.close-btn {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}

	.result-container {
		min-height: 300rpx;
	}

	.empty-container {
		height: 300rpx;
		margin-top: 24rpx;
	}

	.wave-btn {
		width: 560rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-accent2;

		.bar {
			width: 8rpx;
			height: 24rpx;
			border-radius: 4rpx;
			background-color: $uni-color-primary;
		}

		.bar.recording {
			transform-origin: bottom center;
			animation: wave 1s infinite ease-in-out;
		}
	}

	@keyframes wave {
		0%,
		100% {
			transform: scaleY(0.5);
		}
		50% {
			transform: scaleY(1);
		}
	}
}
</style>
