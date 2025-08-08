import {
	formatTime,
	sleep
} from '@/utils/util';
import {
	aliyunWss
} from '@/utils/constant';
import SpeechSynthesizer from '@/utils/tts';
const fs = uni.getFileSystemManager();

class Voice {
	constructor(appkey, token) {
		this.tts = new SpeechSynthesizer({
			url: aliyunWss,
			appkey,
			token
		});
		this.ctx = null;
		this.onEndedCallback = null;
		this.onPlayCallback = null;
		this.initListeners();
	}

	initListeners() {
		this.tts.on('meta', (msg) => {
			console.log('客户端收到元信息:', msg);
		});

		this.tts.on('data', (msg) => {
			console.log(`接收数据大小:${msg.byteLength}`);
			if (this.saveFile) {
				try {
					fs.appendFileSync(this.saveFile, msg, 'binary');
				} catch (e) {
					console.error(e);
				}
			}
		});

		this.tts.on('completed', async (msg) => {
			console.log('客户端收到完成事件:', msg);
			await sleep(500);
			fs.close({
				fd: this.saveFd,
				success: () => {
					this.ctx = wx.createInnerAudioContext();
					this.ctx.autoplay = true;
					this.ctx.src = this.saveFile;
					uni.hideLoading();
					this.ctx.onPlay(() => {
						console.log('开始播放音频...');

						if (this.onPlayCallback) {
							this.onPlayCallback(); // 播放开始回调
						}
					});

					this.ctx.onError((res) => {
						console.error(res.errMsg, res.errCode);
						fs.unlink({
							filePath: this.saveFile,
							success: () => {
								this.saveFile = null;
								this.saveFd = null;
							}
						});
					});

					this.ctx.onEnded(() => {
						console.log('播放结束');
						if (this.onEndedCallback) {
							this.onEndedCallback();
						}
						fs.unlink({
							filePath: this.saveFile,
							success: () => {
								console.log(`删除文件${this.saveFile}成功`);
								this.saveFile = null;
								this.saveFd = null;
							},
							failed: (err) => {
								console.error('删除文件失败: ' + err.errMsg);
							}
						});
					});
				},
				fail: (err) => {
					console.error('文件关闭错误: ' + err.errMsg);
				}
			});
		});

		this.tts.on('closed', () => {
			console.log('客户端收到连接关闭事件');
		});

		this.tts.on('failed', (msg) => {
			console.error('客户端收到错误事件:', msg);
		});
	}

	async play(content) {
		uni.showLoading({
			title: '阿济分析中...',
			mask: true
		});
		const save = formatTime(new Date()) + '.wav';
		const savePath = wx.env.USER_DATA_PATH + '/' + save;

		fs.open({
			filePath: savePath,
			flag: 'a+',
			success: async (res) => {
				this.saveFd = res.fd;
				this.saveFile = savePath;
				let param = this.tts.defaultStartParams();
				param.text = content.replace(/#/g, '');
				param.voice = 'zhitian_emo';
				try {
					await this.tts.start(param);
				} catch (e) {
					console.error('语音合成启动错误: ' + e);
				}
			},
			fail: (err) => {
				console.error(`打开文件${savePath}失败:${err.errMsg}`);
			}
		});
	}

	onEnded(callback) {
		this.onEndedCallback = callback;
	}

	onPlay(callback) {
		this.onPlayCallback = callback;
	}

	pause() {
		if (this.ctx && this.ctx.pause) {
			this.ctx.pause();
			console.log('音频已暂停');
		}
	}

	resume() {
		if (this.ctx && this.ctx.play) {
			this.ctx.play();
			console.log('音频恢复播放');
		}
	}
}

// 单例及方法暴露

let voiceInstance = null;

export function initVoice(appkey, token) {
	if (!voiceInstance) {
		voiceInstance = new Voice(appkey, token);
	}
	return voiceInstance;
}

export function playVoice(content) {
	if (voiceInstance) {
		voiceInstance.play(content);
	} else {
		console.error("Voice 模块尚未初始化，请先调用 initVoice。");
	}
}

export function pauseVoice() {
	if (voiceInstance) {
		voiceInstance.pause();
	}
}

export function resumeVoice() {
	if (voiceInstance) {
		voiceInstance.resume();
	}
}

export function onVoiceEnded(callback) {
	if (voiceInstance) {
		voiceInstance.onEnded(callback);
	}
}

export function onVoicePlay(callback) {
	if (voiceInstance) {
		voiceInstance.onPlay(callback);
	}
}