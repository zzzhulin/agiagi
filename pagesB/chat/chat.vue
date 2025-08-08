<template>
	<Flexbox direction="column" className="chat-page">
		<Navbar>
			<Flexbox align="left" gap="6" className="chat-title">
				<image :src="friend.avatar" class="chat-icon"></image>
				<Typography fontSize="16" :bold="600">{{ friendName }}</Typography>
			</Flexbox>
		</Navbar>
		<Flexbox direction="column" :style="{ height: `calc(100vh - ${(statusBarHeight + 44) * 2}rpx - 196rpx)` }">
			<!-- 	<Flexbox align="justify" className="strategy-container">
				<Typography color="gray1">为我定制的策略：</Typography>
				<Flexbox gap="24">
					<Flexbox align="center" gap="2" @tap="navigateToPlan">
						<image src="https://cdn.agiagi.cc/images/icon_scheme.png" class="strategy-icon"></image>
						<Flexbox>
							<Typography>方案(</Typography>
							<Typography color="primary" :bold="true">0</Typography>
							<Typography>)</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox align="center" gap="2" @tap="navigateToSurvey">
						<image src="https://cdn.agiagi.cc/images/icon_scheme.png" class="strategy-icon"></image>
						<Flexbox>
							<Typography>评估(</Typography>
							<Typography color="primary" :bold="true">0</Typography>
							<Typography>)</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox> -->
			<scroll-view :scroll-y="true" :scroll-top="scrollTop" :scroll-with-animation="true" class="message-container" @scrolltoupper="scrollToTop">
				<view class="message-list">
					<Flexbox direction="column" className="message-item" v-for="(message, index) in messages" :key="message.id">
						<Typography color="gray2" fontSize="12" className="message-time" v-if="message.showTime">{{ message.newTime }}</Typography>
						<Flexbox :direction="message.is_me ? 'reverse' : ''" gap="8">
							<image :src="message.is_me ? userInfo.headimg : friend.avatar" class="user-avatar"></image>
							<Flexbox direction="column" gap="4">
								<Typography color="gray2" v-if="!message.is_me">{{ friend.name }}</Typography>
								<view :class="['message-dialog', { friend: !message.is_me }]" v-if="message.is_mold === 1">
									<view :class="['message-content', { loading: isWaiting && !message.content }]" v-if="isRobot">
										<mp-html
											:content="message.content"
											:markdown="true"
											:highlight="true"
											container-style="padding:0;line-height:initial;font-size:initial;white-space:pre-line;"
										/>
									</view>
									<Typography fontSize="16" className="message-content" v-else>
										<mp-html
											:content="message.content"
											:markdown="true"
											:highlight="true"
											container-style="padding:0;line-height:initial;font-size:initial;white-space:pre-line;"
										/>
									</Typography>
								</view>
								<image :src="message.content" mode="widthFix" class="message-image" v-else-if="message.is_mold === 2"></image>
								<video :src="message.content" class="message-video" v-else-if="message.is_mold === 3"></video>
								<!-- 语音消息部分：根据当前是否为正在播放的消息，显示动画效果 -->
								<Flexbox gap="10" className="message-dialog message-voice" v-else-if="message.is_mold === 5" @tap="togglePlay(message.content.url, message.id)">
									<Typography>{{ Math.floor(message.content.duration / 1000) }}''</Typography>
									<Icon :src="currentPlayingVoiceMessageId === message.id ? voiceIcon : 'voice-3.png'" size="20"></Icon>
								</Flexbox>
								<Flexbox direction="column" gap="12" className="survey-message" v-else-if="message.is_mold === 6">
									<Flexbox direction="column" gap="8" className="full-width">
										<Typography fontSize="16">{{ message.content.name }}</Typography>
										<Flexbox gap="8" className="full-width">
											<view class="survey-description">
												<Typography color="gray1">[问答聊天]</Typography>
												<Typography color="gray2">{{ message.content.description }}</Typography>
											</view>
											<Flexbox className="survey-cover">
												<Icon src="survey.png" width="57" height="41" />
											</Flexbox>
										</Flexbox>
									</Flexbox>
									<Flexbox align="left" className="survey-type">
										<Typography fontSize="12" color="gray1">{{ message.content.type }}</Typography>
									</Flexbox>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</view>
			</scroll-view>
		</Flexbox>
		<Tabbar :canChat="true" :canSend="!isWaiting && isFinished" from="chat" @confirm="sendMessage"></Tabbar>
		<Login></Login>
	</Flexbox>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { formatDate } from '@/utils/util';
export default {
	data() {
		return {
			isRobot: false,
			sessionId: '',
			lastChunkContent: '',
			animationBuffer: '',
			animationTimer: null,
			typingSpeed: 100,
			messageIndex: 0, // 当前助手消息所在下标
			isWaiting: false, // 正在等待流数据
			isFinished: true, // 对话是否完成
			friendName: '',
			friendId: '',
			roomId: '',
			isAgent: '',
			previousPageLastMessageTime: '',
			scrollTop: 0,
			pageNo: 1,
			pageSize: 20,
			count: 0,
			isPlaying: false,
			// 初始状态下的 icon 修改为 voice-3.png
			voiceIcon: 'voice-3.png',
			voiceInterval: null, // 切换 icon 的定时器
			currentPlayingVoiceMessageId: null, // 当前正在播放的语音消息 id
			friend: null,
			socketTask: null,
			messages: []
		};
	},
	onLoad(option) {
		uni.$on('chunkReceived', this.handleChunk);
		this.friendName = decodeURIComponent(option.friendName);
		this.friendId = option.friendId;
		this.getRoomId(option.friendId);
		this.getSessionId();
		this.audio = uni.createInnerAudioContext();
		this.audio.onEnded(() => {
			this.clearVoiceInterval();
			this.isPlaying = false;
			this.currentPlayingVoiceMessageId = null;
		});
	},
	onUnload() {
		// 页面卸载时移除事件监听，并清除定时器防止内存泄漏
		uni.$off('chunkReceived', this.handleChunk);
		if (this.animationTimer) {
			clearInterval(this.animationTimer);
			this.animationTimer = null;
		}
	},
	computed: {
		...mapState(['userInfo', 'statusBarHeight'])
	},
	methods: {
		getSessionId() {
			request({
				url: '/api/v1/chat/sessions',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id.toString()
				},
				isRobot: true,
				success: (result) => {
					if (result) {
						this.sessionId = result.session_id;
					}
				}
			});
		},
		handleChunk(chunk) {
			console.log('收到流式数据：', chunk);
			const newContent = chunk.content.replace(/\s*##\d+\$\$/g, '');
			const diff = newContent.slice(this.lastChunkContent.length);
			this.lastChunkContent = newContent;
			this.animationBuffer += diff;
			if (!this.animationTimer) {
				this.animationTimer = setInterval(() => {
					if (this.animationBuffer.length > 0) {
						// 取出缓冲区第一个字符追加到助手消息中
						this.messages[this.messageIndex].content += this.animationBuffer[0];
						this.animationBuffer = this.animationBuffer.slice(1);
						this.messages[this.messageIndex].content = this.messages[this.messageIndex].content;
						this.scrollToBottom();
					} else {
						clearInterval(this.animationTimer);
						this.animationTimer = null;
					}
				}, this.typingSpeed);
			}
		},
		getAIResponse(question) {
			this.isWaiting = true;
			// 发起流式请求，流数据会通过 uni.$emit('chunkReceived', parsed) 逐块返回
			request({
				url: '/api/v1/chat/stream',
				method: 'POST',
				data: {
					question,
					session_id: this.sessionId,
					user_id: this.userInfo.member_id.toString(),
					stream: true
				},
				isRobot: true,
				success: (res) => {
					// 当流式请求结束时，启动定时器等待动画缓冲区清空
					const checkBuffer = setInterval(() => {
						if (this.animationBuffer.length === 0) {
							clearInterval(checkBuffer);
							if (this.animationTimer) {
								clearInterval(this.animationTimer);
								this.animationTimer = null;
							}
							this.isWaiting = false;
							this.isFinished = true;
							if (this.messages[this.messageIndex]) {
								this.messages[this.messageIndex].time = formatDate(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss');
							}
							this.saveMessage(this.messages[this.messageIndex]);
							this.scrollToBottom();
						}
					}, this.typingSpeed);
				},
				complete: () => {
					this.isWaiting = false;
				}
			});
		},
		togglePlay(src, msgId) {
			// 如果点击的语音消息正处于播放状态，则暂停播放
			if (this.currentPlayingVoiceMessageId === msgId && this.isPlaying) {
				this.audio.pause();
				this.clearVoiceInterval();
				this.isPlaying = false;
				this.currentPlayingVoiceMessageId = null;
			} else {
				// 如果已有其他语音在播放，先暂停它
				if (this.currentPlayingVoiceMessageId && this.isPlaying) {
					this.audio.pause();
					this.clearVoiceInterval();
				}
				// 播放当前语音消息
				this.audio.src = src;
				this.audio.play();
				this.isPlaying = true;
				this.currentPlayingVoiceMessageId = msgId;
				// 开始切换 icon，每300ms切换一次，循环顺序：voice-3 -> voice-1 -> voice-2 -> voice-3
				this.voiceInterval = setInterval(() => {
					if (this.voiceIcon === 'voice-3.png') {
						this.voiceIcon = 'voice-1.png';
					} else if (this.voiceIcon === 'voice-1.png') {
						this.voiceIcon = 'voice-2.png';
					} else {
						this.voiceIcon = 'voice-3.png';
					}
				}, 300);
			}
		},
		clearVoiceInterval() {
			if (this.voiceInterval) {
				clearInterval(this.voiceInterval);
				this.voiceInterval = null;
			}
			// 重置 icon 为初始状态 voice-3.png
			this.voiceIcon = 'voice-3.png';
		},
		navigateToPlan() {
			uni.navigateTo({
				url: '/pagesB/plan/plan'
			});
		},
		navigateToSurvey() {
			uni.navigateTo({
				url: '/pagesB/survey/survey'
			});
		},
		formatTime(time) {
			const now = new Date();
			const messageDate = new Date(time.replace(/-/g, '/'));
			const diffInMilliseconds = now - messageDate;
			const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
			const hours = String(messageDate.getHours()).padStart(2, '0');
			const minutes = String(messageDate.getMinutes()).padStart(2, '0');
			if (diffInDays === 0) {
				return `${hours}:${minutes}`;
			} else if (diffInDays === 1) {
				return `昨天 ${hours}:${minutes}`;
			} else if (diffInDays <= 7) {
				const weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
				return `${weekdays[messageDate.getDay()]} ${hours}:${minutes}`;
			} else if (messageDate.getFullYear() === now.getFullYear()) {
				return `${messageDate.getMonth() + 1}月${messageDate.getDate()}日 ${hours}:${minutes}`;
			} else {
				return `${messageDate.getFullYear()}年${messageDate.getMonth() + 1}月${messageDate.getDate()}日 ${hours}:${minutes}`;
			}
		},
		showTime(index) {
			const message = this.messages[index];
			if (index === 0) {
				return true;
			}
			const previousMessage = this.messages[index - 1];
			const currentTime = new Date(message.time.replace(/-/g, '/')).getTime();
			const previousTime = new Date(previousMessage.time.replace(/-/g, '/')).getTime();
			const timeDiff = Math.floor((currentTime - previousTime) / (1000 * 60));
			return timeDiff >= 5;
		},
		scrollToBottom() {
			setTimeout(() => {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query
						.select('.message-list')
						.boundingClientRect((data) => {
							this.scrollTop = data.height;
						})
						.exec();
				});
			}, 100);
		},
		scrollToTop() {
			if (this.count > this.messages.length) {
				this.pageNo++;
				this.previousPageLastMessageTime = this.messages[this.messages.length - 1].time;
				this.getChat();
			}
		},
		sendMessage(content, is_mold, duration) {
			let message = {
				user_id: this.userInfo.member_id,
				type: 'say',
				to_friend_id: this.friend.user_id,
				room_id: this.roomId,
				friend_name: this.friend.name,
				user_name: this.userInfo.nickname,
				is_mold,
				id: this.friend.id
			};
			if (is_mold === 5) {
				message.content = {};
				message.content.url = content;
				message.content.duration = duration;
			} else {
				message.content = content;
			}
			this.socketTask.send({ data: JSON.stringify(message) });
		},
		saveMessage(data) {
			request({
				url: '/api/chat/save_message',
				method: 'POST',
				data,
				success: (res) => {}
			});
		},
		getRoomId(to_friend_id) {
			request({
				url: '/api/chat/get_room_id',
				data: {
					to_friend_id
				},
				success: (res) => {
					if (res) {
						this.roomId = res.room_id;
						this.initChat(res.room_id, to_friend_id);
					}
				}
			});
		},
		initChat(room_num, to_friend_id) {
			request({
				url: '/api/chat/chat_index',
				method: 'POST',
				data: {
					room_num,
					to_friend_id,
					type: 'friend'
				},
				success: (res) => {
					if (res) {
						this.count = res.count;
						this.isAgent = res.is_agent;
						this.friend = res.to_friend;
						this.getChat();
						this.initSocket();
					}
				}
			});
		},
		getChat() {
			request({
				url: '/api/chat/chat_record',
				method: 'POST',
				data: {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					room_num: this.roomId,
					to_friend_id: this.friendId,
					type: 'friend'
				},
				success: (res) => {
					if (res) {
						let scrollTop = 0;
						const query = uni.createSelectorQuery().in(this);
						query
							.select('.message-list')
							.boundingClientRect((data) => {
								scrollTop = data.height;
							})
							.exec();
						this.messages = [...res.data.reverse(), ...this.messages];
						this.messages = this.messages.map((item, index) => {
							return {
								newTime: this.formatTime(item.time),
								showTime: this.showTime(index),
								...item
							};
						});
						setTimeout(() => {
							this.$nextTick(() => {
								const query = uni.createSelectorQuery().in(this);
								query
									.select('.message-list')
									.boundingClientRect((data) => {
										this.scrollTop = data.height - scrollTop;
									})
									.exec();
							});
						}, 500);
					}
				}
			});
		},
		initSocket() {
			this.socketTask = uni.connectSocket({
				url: 'wss://niushop.yulongtianzi.com/ws',
				success: () => {
					console.log('WebSocket 连接成功');
				},
				fail: () => {
					console.log('WebSocket 连接失败');
				}
			});
			this.socketTask.onOpen(() => {
				const message = {
					user_id: this.userInfo.member_id,
					type: 'login',
					room_id: this.roomId,
					user_name: this.userInfo.nickname,
					is_agent: this.isAgent
				};
				this.socketTask.send({ data: JSON.stringify(message) });
			});
			this.socketTask.onMessage((res) => {
				const data = JSON.parse(res.data);
				switch (data.type) {
					case 'login':
						const message = {
							user_id: this.userInfo.member_id,
							type: 'bild',
							room_id: this.roomId,
							user_name: this.userInfo.nickname,
							is_agent: this.isAgent
						};
						this.socketTask.send({ data: JSON.stringify(message) });
						break;
					case 'say':
						this.messages.push({ ...data, is_me: 0 });
						this.count++;
						this.scrollToBottom();
						break;
					case 'save':
						this.saveMessage(data);
						this.messages.push({ ...data, is_me: 1 });
						if (!data.isonline && !data.is_agent) {
							this.isRobot = true;
							this.animationBuffer = '';
							if (this.animationTimer) {
								clearInterval(this.animationTimer);
								this.animationTimer = null;
							}
							this.isFinished = false;
							this.lastChunkContent = '';
							this.messages.push({
								...data,
								is_me: 0,
								is_agent: 1,
								friend_name: this.userInfo.nickname,
								to_friend_id: data.user_id,
								user_id: data.to_friend_id,
								content: ''
							});
							this.messageIndex = this.messages.length - 1;
							this.count += 2;
							this.scrollToBottom();
							const content = data.is_mold === 5 ? data.content.url : data.content;
							this.getAIResponse(content);
						} else {
							this.count++;
							this.scrollToBottom();
							this.isRobot = false;
						}

						break;
				}
				console.log('WebSocket 收到消息:', res.data);
			});
			this.socketTask.onError((err) => {
				console.log('WebSocket 发生错误:', err);
			});
			// 监听 WebSocket 关闭事件
			this.socketTask.onClose(() => {
				console.log('WebSocket 连接关闭');
				this.initSocket();
			});
		}
	}
};
</script>

<style lang="scss">
.chat-page {
	height: 100vh;
	background-color: $uni-bg-color;
	.chat-title {
		margin-left: 100rpx;
	}
	.chat-icon {
		width: 64rpx;
		height: 64rpx;
	}
	.strategy-container {
		flex: none;
		height: 80rpx;
		padding: 0 32rpx;
		border-bottom: 2rpx solid $uni-text-color-gray4;
	}
	.strategy-icon {
		width: 40rpx;
		height: 40rpx;
	}
	.message-container {
		width: auto;
		padding: 32rpx 24rpx 0 24rpx;
		overflow: auto;
	}
	.message-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	.message-item:last-child {
		margin-bottom: 24rpx;
	}
	.message-time {
		margin: 8rpx 0 20rpx 0;
		text-align: center;
	}
	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.message-dialog {
		max-width: 510rpx;
		margin: auto;
		border-radius: 16rpx;
		padding: 16rpx 24rpx;
		background-color: $uni-color-accent1;
	}
	.message-dialog.friend {
		background-color: #fff;
	}
	.message-content {
		font-size: 32rpx;
		line-height: 44rpx;
		color: $uni-text-color;
		white-space: pre-line;
		word-break: break-all;
		text-align: justify;
	}
	.message-content.loading {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.message-content.loading:before {
		flex: none;
		display: block;
		content: '';
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		border: 4rpx solid $uni-text-color-gray4;
		border-top: 4rpx solid $uni-text-color-gray1;
		animation: spin 1s linear infinite;
		box-sizing: border-box;
	}

	.message-content.loading::after {
		content: '阿济正在努力思考中，可能需要几分钟';
		font-size: 32rpx;
		color: $uni-text-color;
		line-height: 44rpx;
	}

	.message-content text {
		display: none;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.message-image {
		width: 240rpx;
		border-radius: 16rpx;
	}
	.message-video {
		width: 510rpx;
		height: 284rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}
	.survey-message {
		width: 510rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 16rpx 24rpx 0 24rpx;
	}
	.survey-description {
		flex: 1;
	}
	.survey-description .text {
		display: inline;
	}
	.survey-cover {
		width: 120rpx;
		height: 120rpx;
		background-color: $uni-bg-color-2;
	}
	.survey-type {
		width: 100%;
		height: 64rpx;
		border-top: 2rpx solid $uni-text-color-gray4;
	}
	.message-voice {
		padding-left: 60rpx;
		.icon {
			transform: rotate(180deg);
		}
	}
}
</style>
