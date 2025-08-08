// services/speech.js
import Speech from '@/utils/speech';

const speech = {
  speechInstance: null,

  /**
   * 初始化语音实例
   * @param {String} appKey - 阿里云 appKey
   * @param {String} token - 调用 token
   * @param {Object} eventHandlers - 事件处理函数对象，如 { onStarted, onChanged, ... }
   * @returns {Object} speechInstance
   */
  init(appKey, token, eventHandlers = {}) {
    if (!this.speechInstance) {
      this.speechInstance = new Speech({
        appKey,
        token,
        eventHandlers
      });
      this.speechInstance.init();
    }
    return this.speechInstance;
  },

  /**
   * 获取当前的 speech 实例
   * @returns {Object|null}
   */
  getInstance() {
    return this.speechInstance;
  },

  /**
   * 销毁语音服务实例
   */
  shutdown() {
    if (this.speechInstance) {
      this.speechInstance.shutdown();
      this.speechInstance = null;
    }
  }
};

export default speech;
