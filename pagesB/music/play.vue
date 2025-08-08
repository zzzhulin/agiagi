<template>
	<view class="music-play-page">
		<Navbar></Navbar>
		<Flexbox align="center" direction="column" gap="40" className="music-container">
			<Flexbox align="center" className="music-content">
				<Flexbox align="center" className="music-cover" :style="{ animationPlayState: isPlay ? 'running' : 'paused' }">
					<Icon src="music_cover.png" size="260" className="cover" align="center"></Icon>
					<view class="music-center"></view>
				</Flexbox>
			</Flexbox>
			<Flexbox align="center" direction="column" gap="12">
				<Typography fontSize="22" :bold="true">{{ name }}</Typography>
				<Typography color="gray1">阿济推荐</Typography>
			</Flexbox>

			<!-- 定时播放选择 -->
			<Flexbox align="center" gap="12">
				<Typography color="gray1">定时播放</Typography>
				<picker mode="selector" :range="timerOptions" :value="selectedTimerIndex" @change="onTimerChange">
					<view class="picker">
						<Typography fontSize="16" :bold="true">{{ timerText }}</Typography>
						<Icon src="icon_arrow-down.png" size="20"></Icon>
					</view>
				</picker>
			</Flexbox>

			<Icon src="icon_pause-btn.png" size="88" className="pause-btn" v-if="isPlay" @tap="togglePlay"></Icon>
			<Icon src="icon_play-btn.png" size="88" className="play-btn" v-else @tap="togglePlay"></Icon>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			isPlay: false,
			audio: null,
			timer: null,
			timerOptions: ['5分钟', '10分钟', '15分钟', '30分钟'], // 定时播放选项
			selectedTimerIndex: 0, // 默认选择 5分钟
			timerText: '5分钟', // 显示的定时文本
			timerDuration: 5 // 默认定时播放为 5 分钟
		};
	},
	onLoad(option) {
		this.name = option.name;

		// 创建音频对象
		this.audio = uni.getBackgroundAudioManager();
		this.audio.src = option.src;
		this.audio.title = option.name;

		// 播放音频
		this.audio.play();

		// 设置定时器，定时停止播放
		this.startTimer();

		// 音频播放和暂停监听
		this.audio.onPlay(() => {
			console.log('播放');
			this.isPlay = true;
		});
		this.audio.onPause(() => {
			console.log('暂停');
			this.isPlay = false;
		});
		this.audio.onStop(() => {
			console.log('停止');
			this.isPlay = false;
		});
	},
	methods: {
		// 切换播放状态
		togglePlay() {
			if (this.isPlay) {
				this.audio.pause();
			} else {
				this.audio.play();
			}
		},
		// 启动定时器
		startTimer() {
			// 清除之前的定时器（如果有的话）
			if (this.timer) {
				clearTimeout(this.timer);
			}
			// 将定时器设置为用户选择的时间，单位为分钟
			this.timer = setTimeout(() => {
				this.stopAudio();
			}, this.timerDuration * 60000); // 60000毫秒 = 1分钟
		},
		// 停止音频播放
		stopAudio() {
			this.audio.stop();
			this.isPlay = false;
		},
		// 处理定时播放的选择
		onTimerChange(event) {
			const selectedIndex = event.detail.value;
			this.selectedTimerIndex = selectedIndex;
			this.timerText = this.timerOptions[selectedIndex]; // 更新显示的文本
			this.timerDuration = parseInt(this.timerText); // 更新定时播放时间（分钟）
			this.startTimer(); // 更新定时器
		}
	},
	beforeDestroy() {
		// 清除定时器并销毁音频对象
		if (this.timer) {
			clearTimeout(this.timer);
		}
		if (this.audio) {
			this.audio.stop();
			this.audio.destroy();
		}
	}
};
</script>

<style lang="scss">
.music-play-page {
	.music-content {
		width: 600rpx;
		height: 600rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		border-radius: 50%;
	}

	.music-cover {
		position: relative;
		width: 520rpx;
		height: 520rpx;
		border-radius: 50%;
		animation: rotate 8s linear infinite;
		animation-play-state: paused;
	}

	.cover {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}

	.music-center {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		box-shadow: 0 0 0 16rpx $uni-text-color inset;
		background-color: #ffffff;
		border-radius: 50%;
	}

	.pause-btn,
	.play-btn {
		margin-top: 132rpx;
	}

	.picker {
		display: flex;
		align-items: center;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
}
</style>
