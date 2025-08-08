<template>
	<Flexbox direction="column" className="robot-page">
		<Navbar title="阿济阿济为您服务"></Navbar>
		<Flexbox align="left" className="user-container" :style="{ top: `${(statusBarHeight + 44) * 2}rpx`, gap: '24rpx' }">
			<Flexbox align="left" gap="4" className="robot-content">
				<Icon src="logo.png" size="32"></Icon>
				<Typography fontSize="12">阿济阿济</Typography>
			</Flexbox>
			<Flexbox align="center" className="friend-item" v-for="friend in friends" :key="friend.user_id">
				<Icon :src="friend.avatar" size="40" type="remote" @tap="navigateTo(`/pagesB/chat/chat?friendName=${friend.name}&friendId=${friend.user_id}`)"></Icon>
				<Flexbox align="center" className="message-count" v-if="friend.unread_count">
					<Typography fontSize="10" color="white">{{ friend.unread_count }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>

		<!-- <Navbar backgroundColor="transparent">
			<Flexbox align="left" gap="6" className="robot-title">
				<Icon src="logo.png" size="32"></Icon>
				<Typography fontSize="16" :bold="600">阿济阿济</Typography>
			</Flexbox>
		</Navbar> -->

		<scroll-view
			:scroll-y="true"
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			class="message-container"
			:style="{ height: `calc(100vh - ${(statusBarHeight + 44) * 2}rpx - 244rpx)` }"
			@scrolltoupper="scrollToTop"
		>
			<view class="message-list">
				<view class="placeholder" :style="{ height: `${height}px` }"></view>
				<view
					:id="message.id"
					:class="['message-item', { robot: message.role === 'assistant', test: message.content.includes('health_analysis') }]"
					v-for="(message, index) in messages"
					:key="message.id"
				>
					<block v-if="message.role === 'user'">
						<Icon :src="message.content" :preview="true" type="remote" width="140" mode="widthFix" v-if="isImageLink(message.content)"></Icon>
						<view class="message-content" v-else>{{ message.content }}</view>
					</block>
					<Flexbox direction="column" gap="16" v-else>
						<view :class="['message-content', { loading: isWaiting && !message.content }]">
							<Flexbox direction="column" gap="16" v-if="message.content.includes('health_analysis')">
								<Typography fontSize="16" className="test-result">{{ JSON.parse(message.content).health_analysis }}</Typography>
								<Flexbox
									direction="column"
									gap="12"
									className="survey-message"
									v-for="app in JSON.parse(message.content).recommended_apps"
									:key="app.id"
									@tap="navigateTo(app.wx_app_path)"
								>
									<Flexbox direction="column" gap="8">
										<Typography fontSize="16">{{ app.name }}</Typography>
										<Flexbox gap="8">
											<view class="survey-description">
												<Typography color="gray1">[问答聊天]</Typography>
												<Typography color="gray2">{{ app.description }}</Typography>
											</view>
											<Flexbox align="center" className="survey-cover">
												<Icon src="survey.png" size="60" mode="widthFix" />
											</Flexbox>
										</Flexbox>
									</Flexbox>
									<Flexbox align="justify" className="survey-type">
										<Typography fontSize="12" color="gray1">调查评估</Typography>
										<Typography fontSize="12" color="gray2">{{ formatDate(message.created_at, 'YYYY.MM.DD hh:mm') }}</Typography>
									</Flexbox>
								</Flexbox>
							</Flexbox>
							<mp-html
								:content="message.content"
								:markdown="true"
								:highlight="true"
								container-style="padding:0;line-height:initial;font-size:initial;white-space:pre-line;"
								v-else
							/>
						</view>
						<Flexbox align="justify" className="message-actions" v-if="message.created_at && !message.content.includes('health_analysis')">
							<Flexbox gap="9">
								<Flexbox align="center" className="message-icon-wrapper" v-if="index === messages.length - 1" @tap="reloadMessage(index)">
									<image src="https://cdn.agiagi.cc/images/icon_refresh.png" class="message-icon"></image>
								</Flexbox>
								<Flexbox align="center" className="message-icon-wrapper" @tap="copyMessage(message.content)">
									<image src="https://cdn.agiagi.cc/images/icon_copy.png" class="message-icon"></image>
								</Flexbox>
								<!-- <Flexbox align="center" className="message-icon-wrapper" @tap="opposeMessage">
									<image src="https://cdn.agiagi.cc/images/icon_oppose.png" class="message-icon"></image>
								</Flexbox> -->
								<Flexbox align="center" className="message-icon-wrapper" @tap="readMessage(message.content)">
									<image src="https://cdn.agiagi.cc/images/icon_play-voice.png" class="message-icon"></image>
								</Flexbox>
								<!-- <Flexbox align="center" className="message-icon-wrapper" @tap="shareMessage">
									<image src="https://cdn.agiagi.cc/images/icon_share.png" class="message-icon"></image>
								</Flexbox> -->
							</Flexbox>
							<Flexbox align="center" gap="4" v-if="goodsCount && index === messages.length - 1" @tap="navigateTo(`/pagesD/cart/list?text=${message.content}`)">
								<Icon src="AI.png" width="57" height="24"></Icon>
								<Typography color="primary" :bold="true">({{ goodsCount }})</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</view>
			</view>
		</scroll-view>
		<Tabbar :canChat="true" :canSend="!isWaiting && isFinished" from="robot" @confirm="sendMessage" @setHeight="setHeight">
			<Flexbox gap="8">
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo(nutritionUrl)">
					<Icon src="icon_diet.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">营养地图</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo('/pagesC/tongue/diagnosis')">
					<Icon src="icon_tongue.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">察颜观舌</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo('/pagesC/alert/alert')">
					<Icon src="icon_clock.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">提醒我</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo('/pagesC/test/test')">
					<Icon src="icon_test.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">测一测</Typography>
				</Flexbox>
			</Flexbox>
		</Tabbar>
		<Login></Login>
	</Flexbox>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { isImageLink, formatDate } from '@/utils/util';
import { playVoice } from '@/utils/voice';
export default {
	data() {
		return {
			nutritionUrl: '',
			formatDate,
			isImageLink,
			question: '',
			sessionId: '',
			animationBuffer: '',
			lastChunkContent: '', // 记录上一次收到的流数据完整内容
			height: 0,
			page: 1,
			pageSize: 20,
			total: 0,
			scrollTop: 0,
			messageIndex: 0, // 当前助手消息所在下标
			typingSpeed: 100, // 每个字符显示的间隔（毫秒）
			isWaiting: false, // 正在等待流数据
			isFinished: true, // 对话是否完成
			animationTimer: null,
			messages: [],
			friends: [],
			goodsCount: 0
		};
	},
	async onLoad() {
		this.getSessionId();
		this.getRecords();
		this.getFriends();
		uni.$on('chunkReceived', this.handleChunk);
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
		...mapState(['userInfo', 'statusBarHeight', 'member'])
	},
	methods: {
		getGoods(text) {
			request({
				url: '/api/v2/product-ai-recommend/recommend',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id.toString(),
					text
				},
				isRobot: true,
				success: (res) => {
					this.goodsCount = res.recommended_products.length;
				}
			});
		},
		getFriends() {
			request({
				url: '/api/chat/get_fans_list',
				method: 'POST',
				success: (res) => {
					this.friends = [...res.list, ...res.lately_chat_fans];
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
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		copyMessage(data) {
			uni.setClipboardData({
				data,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'none'
					});
				}
			});
		},
		opposeMessage() {
			uni.showToast({
				title: '敬请期待',
				icon: 'none'
			});
		},
		readMessage(content) {
			playVoice(content);
		},
		shareMessage() {
			uni.showToast({
				title: '敬请期待',
				icon: 'none'
			});
		},
		reloadMessage(index) {
			const prevIndex = index - 1;
			this.messages.splice(prevIndex, 2);
			this.sendMessage(this.question);
		},
		setHeight(height) {
			this.height = height;
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.message-container')
					.boundingClientRect((data) => {
						if (this.scrollTop > data.height) {
							this.height = 0;
						}
					})
					.exec();
			});
		},
		scrollToTop() {
			if (this.total > this.messages.length) {
				this.page++;
				this.getMessages();
			}
		},
		scrollToBottom() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.message-list')
					.boundingClientRect((data) => {
						this.scrollTop = data.height;
					})
					.exec();
			});
		},
		/**
		 * 获取 AI 回答（流式请求）
		 */
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
							if (this.messages[this.messageIndex]) {
								this.messages[this.messageIndex].created_at = new Date().toISOString();
							}
							this.isWaiting = false;
							this.isFinished = true;
							this.getGoods(this.messages[this.messageIndex].content);
							this.scrollToBottom();
						}
					}, this.typingSpeed);
				},
				complete: () => {
					this.isWaiting = false;
				}
			});
		},
		sendMessage(content) {
			this.question = content;
			this.animationBuffer = '';
			if (this.animationTimer) {
				clearInterval(this.animationTimer);
				this.animationTimer = null;
			}
			this.isFinished = false;
			this.lastChunkContent = '';
			// 添加用户消息
			this.messages.push({ role: 'user', content, id: `user_${new Date().getTime()}` });
			// 添加助手占位消息（后续将通过流数据逐步更新内容）
			this.messages.push({ role: 'assistant', content: '', id: `assistant_${new Date().getTime()}` });
			// 记录助手消息下标
			this.messageIndex = this.messages.length - 1;
			this.total += 2;
			this.scrollToBottom();
			// 发起 AI 流式请求（回调方式）
			this.getAIResponse(content);
		},
		/**
		 * 获取历史消息
		 */
		getMessages() {
			request({
				url: '/api/v1/chat/history',
				method: 'POST',
				data: {
					session_id: this.sessionId,
					page: this.page,
					page_size: this.pageSize
				},
				isRobot: true,
				success: (res) => {
					if (res && res.total) {
						this.messages = [...res.messages.reverse(), ...this.messages].map((item) => {
							return { ...item, content: item.content.replace(/ \s*##\d+\$\$/g, '') };
						});
						this.total = res.total;
						this.$nextTick(() => {
							const query = uni.createSelectorQuery().in(this);
							query
								.select('.message-list')
								.boundingClientRect((data) => {
									if (data) {
										if (this.page === 1) {
											this.scrollToBottom();
										} else {
											this.scrollTop = data.height - this.scrollTop;
										}
									}
								})
								.exec();
						});
					}
				}
			});
		},
		/**
		 * 获取会话 ID，并在成功后拉取历史消息
		 */
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
						this.getMessages();
					}
				}
			});
		},
		getRecords() {
			request({
				url: '/api/v2/nutrition_maps/get_nutrition_map',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					this.nutritionUrl = res ? '/pagesC/nutrition/map' : '/pagesC/nutrition/nutrition';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.robot-page {
	height: 100vh;
	background-color: $uni-bg-color;

	.user-container {
		position: fixed;
		left: 0;
		right: 0;
		height: 128rpx;
		padding: 24rpx 32rpx 16rpx 32rpx;
		background-color: #ffffff;
		border-radius: 0 0 32rpx 32rpx;
		z-index: 99;
	}

	.friend-item {
		position: relative;
		width: 88rpx;
		height: 88rpx;
	}

	.message-count {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0 8rpx;
		min-width: 32rpx;
		height: 28rpx;
		background-color: $uni-color-danger;
		border-radius: 20rpx;
	}

	.robot-content {
		padding: 8rpx 24rpx 8rpx 8rpx;
		box-shadow: 0 0 0 3rpx $uni-color-primary inset;
		border-radius: 40rpx;
		background-color: $uni-color-accent2;
	}

	.robot-title {
		margin-left: 100rpx;
	}

	.message-container {
		width: auto;
		padding: 0 32rpx;
		// flex: 1;
		overflow: auto;
		overflow-anchor: none;
	}

	.message-list {
		display: flex;
		flex-direction: column;
		gap: 40rpx;
		padding: 40rpx 0;
	}

	.message-item {
		display: flex;
		flex-direction: column;
		gap: 32rpx;
		width: fit-content;
		padding: 16rpx 24rpx;
		margin-left: auto;
		border-radius: 16rpx;
		background-color: $uni-color-accent1;
	}

	.message-item.robot:not(.test) {
		width: auto;
		margin: 0;
		min-height: 92rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: #ffffff;
	}

	.message-item.test {
		padding: 0;
		background: none;

		.test-result {
			padding: 24rpx;
			border-radius: 24rpx;
			background-color: #ffffff;
		}

		.survey-message {
			width: 510rpx;
			padding: 16rpx 24rpx 0 24rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
		}

		.survey-description .text {
			display: inline;
		}

		.survey-cover {
			width: 120rpx;
			height: 120rpx;
			background-color: $uni-bg-color-2;
			flex: none;
			margin-left: auto;
		}

		.survey-type {
			height: 64rpx;
			border-top: 2rpx solid $uni-text-color-gray4;
		}
	}

	.message-content {
		font-size: 32rpx;
		line-height: 44rpx;
		color: $uni-text-color;
		white-space: pre-line;
		word-break: break-all;
		text-align: justify;
	}

	.message-actions {
		height: 96rpx;
		padding: 0 28rpx 0 12rpx;
		border-top: 2rpx solid $uni-text-color-gray4;
	}

	.message-icon-wrapper {
		width: 56rpx;
		height: 56rpx;
		border-radius: 18rpx;
		background-color: $uni-bg-color;
	}

	.message-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.message-content.loading {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.message-content.loading:before {
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
}
</style>
