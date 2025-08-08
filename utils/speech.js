import SpeechTranscription from '@/utils/st';
import { aliyunWss } from '@/utils/constant';
import { sleep } from '@/utils/util';

const recorderManager = uni.getRecorderManager();

class Speech {
  constructor({ appKey, token, eventHandlers = {} }) {
    this.appKey = appKey;
    this.token = token;
    this.eventHandlers = eventHandlers; // { onStarted, onChanged, onCompleted, onSentenceBegin, onSentenceEnd, onClosed, onFailed }
    this.speechTranscriber = null;
    this.isRecording = false;
  }

  // 初始化语音转写模块并注册事件
  init() {
    this.speechTranscriber = new SpeechTranscription({
      url: aliyunWss,
      appkey: this.appKey,
      token: this.token
    });

    // 注册事件
    this.speechTranscriber.on('started', (msg) => {
      this.eventHandlers.onStarted && this.eventHandlers.onStarted(msg);
    });
    this.speechTranscriber.on('changed', (msg) => {
      this.eventHandlers.onChanged && this.eventHandlers.onChanged(msg);
    });
    this.speechTranscriber.on('completed', (msg) => {
      this.eventHandlers.onCompleted && this.eventHandlers.onCompleted(msg);
    });
    this.speechTranscriber.on('begin', (msg) => {
      this.eventHandlers.onSentenceBegin && this.eventHandlers.onSentenceBegin(msg);
    });
    this.speechTranscriber.on('end', (msg) => {
      this.eventHandlers.onSentenceEnd && this.eventHandlers.onSentenceEnd(msg);
    });
    this.speechTranscriber.on('closed', () => {
      this.eventHandlers.onClosed && this.eventHandlers.onClosed();
    });
    this.speechTranscriber.on('failed', (msg) => {
      this.eventHandlers.onFailed && this.eventHandlers.onFailed(msg);
    });
  }

  // 启动语音转写和录音
  start() {
    if (!this.speechTranscriber) {
      console.error('Speech: 未初始化语音转写模块');
      return;
    }
    if (this.isRecording) {
      console.log('Speech: 正在录音中');
      return;
    }
    this.speechTranscriber.start(this.speechTranscriber.defaultStartParams())
      .then(() => {
        this.isRecording = true;
        recorderManager.start({
          duration: 600000,
          numberOfChannels: 1,
          sampleRate: 16000,
          format: 'PCM',
          frameSize: 4
        });
        // 录音帧回调
        recorderManager.onFrameRecorded((res) => {
          if (this.isRecording && this.speechTranscriber) {
            this.speechTranscriber.sendAudio(res.frameBuffer);
          }
        });
      })
      .catch(err => {
        console.error('Speech: 启动失败', err);
      });
  }

  // 停止录音和语音转写
  async stop() {
    recorderManager.stop();
    await sleep(500);
    if (this.isRecording && this.speechTranscriber) {
      try {
        await this.speechTranscriber.close();
      } catch (e) {
        console.error('Speech: 关闭失败', e);
      }
      this.isRecording = false;
    }
  }

  // 完全销毁语音服务
  shutdown() {
    this.stop();
    if (this.speechTranscriber) {
      this.speechTranscriber.shutdown();
    }
  }
}

export default Speech;
