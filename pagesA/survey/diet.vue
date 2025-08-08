<template>
	<Flexbox direction="column" gap="16" className="survey-diet-page">
		<Navbar title="膳食调查"></Navbar>
		<Flexbox align="left" className="banner-container">
			<Flexbox direction="column" className="full-width">
				<Typography color="gray2">请使用文字或语音回复，</Typography>
				<Typography color="gray2">共{{ questions.length }}个问题，</Typography>
				<Typography color="gray2">用时约3分钟</Typography>
			</Flexbox>
			<Icon src="meal.png" width="186" height="111" className="banner-image"></Icon>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="survey-list">
			<Flexbox direction="column" gap="16" className="survey-item" v-for="(survey, surveyIndex) in surveys" :key="surveyIndex">
				<Flexbox direction="column" gap="16" className="question-content">
					<Typography fontSize="16" :bold="true">{{ survey.question }}</Typography>
					<Flexbox direction="column" gap="8" v-if="questions[surveyIndex].type !== 'fill'">
						<template v-if="questions[surveyIndex].type === 'select'">
							<radio-group @change="radioChange">
								<label v-for="(option, optionIndex) in questions[surveyIndex].options" :key="optionIndex" class="option-item">
									<radio
										:value="order[optionIndex]"
										:disabled="isEdit ? editingIndex !== surveyIndex : current !== surveyIndex"
										color="#30A375"
										style="transform: scale(0.7)"
									/>
									<Typography>{{ order[optionIndex] }}.&nbsp;{{ option }}</Typography>
								</label>
							</radio-group>
						</template>
						<template v-else-if="questions[surveyIndex].type === 'multi-select'">
							<checkbox-group @change="checkboxChange">
								<label v-for="(option, optionIndex) in questions[surveyIndex].options" :key="optionIndex" class="option-item">
									<checkbox
										:value="order[optionIndex]"
										:disabled="isEdit ? editingIndex !== surveyIndex : current !== surveyIndex"
										color="#30A375"
										style="transform: scale(0.7)"
									/>
									<Typography>{{ order[optionIndex] }}.&nbsp;{{ option }}</Typography>
								</label>
							</checkbox-group>
						</template>
					</Flexbox>
				</Flexbox>
				<Flexbox className="answer-content" v-if="answers[surveyIndex]" @longpress="onLongTap($event, surveyIndex, answers[surveyIndex])">
					<Typography fontSize="16">{{ answers[surveyIndex] }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" gap="8" className="analysis-container" v-if="current === questions.length && loaded">
			<Typography fontSize="16" color="#000000">本次调查评估已结束，如需修改，请长按你的答案。</Typography>
			<Flexbox align="center" className="analysis-btn" @tap="onAnalysis">
				<Typography fontSize="16" color="white" :bold="true">直接生成分析报告</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container" v-else>
			<Flexbox direction="column" gap="12" :className="['tabbar-content', { editing: isEdit }]">
				<Flexbox align="left" className="old-answer" v-if="isEdit">
					<Typography color="gray2">修改：{{ oldAnswer }}</Typography>
				</Flexbox>
				<Flexbox :align="align">
					<Icon src="icon_keyboard.png" size="24" v-if="!showInput && !answer" @tap="toggleInput(true)"></Icon>
					<textarea
						v-if="showInput || answer"
						v-model="answer"
						type="text"
						:auto-height="true"
						:show-confirm-bar="false"
						:disable-default-padding="true"
						:disabled="current === questions.length && loaded"
						cursor-spacing="20"
						class="answer-input"
						placeholder="输入答案..."
						confirm-type="send"
						@linechange="onLineChange"
						@confirm="onAnswer"
					></textarea>
					<Typography fontSize="16" color="gray2" align="center" className="answer-input" v-else @tap="openPopup">点击说话</Typography>
					<Icon src="icon_send.png" size="24" v-if="answer" @tap="onAnswer"></Icon>
					<Icon src="icon_microphone.png" size="24" v-if="showInput && !answer" @tap="toggleInput(false)"></Icon>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<view class="edit-popup" v-if="showEdit">
			<view class="popup-mask" @tap="showEdit = false"></view>
			<Flexbox align="center" className="popup-content" :style="{ top: `${top * 2}rpx` }" @tap="onEdit">
				<Icon src="icon_edit.png" size="20" gap="12" align="center" label="修改" fontSize="16" color="#000000"></Icon>
			</Flexbox>
		</view>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
		<Login></Login>
	</Flexbox>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { map, omit } from 'lodash';

export default {
	data() {
		return {
			align: 'center',
			notificationId: 0,
			templateId: '',
			answer: '',
			oldAnswer: '',
			top: 0,
			current: 0,
			editingIndex: -1,
			loaded: false,
			showEdit: false,
			showInput: false,
			isEdit: false,
			answers: [],
			surveys: [],
			questions: [],
			order: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
		};
	},
	onLoad() {
		this.getQuestions();
	},
	onUnload() {
		this.loaded = false;
		console.log('膳食调查页面卸载');
	},
	computed: {
		...mapState(['userInfo', 'member', 'basicInfo'])
	},
	methods: {
		toggleInput(flag) {
			this.showInput = flag;
		},
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.answer += text;
		},
		radioChange(e) {
			this.answer = e.detail.value;
		},
		checkboxChange(e) {
			this.answer = e.detail.value.join(',');
		},
		onAnalysis() {
			uni.showLoading({
				title: '开始分析...',
				mask: true
			});
			request({
				url: '/api/v2/survey/diet-survey/analyze',
				method: 'POST',
				data: {
					member_id: this.member.member_id,
					user_id: this.userInfo.member_id,
					tenant_id: this.userInfo.card_info.first_agent_id,
					notification_id: this.notificationId,
					template_id: this.templateId,
					survey_data: this.surveys,
					basic_data: map(this.basicInfo, item => omit(item,  ['type', 'options']))
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.redirectTo('/pagesA/report/diet');
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		redirectTo(url) {
			uni.redirectTo({
				url
			});
		},
		onLineChange(event) {
			this.align = event.detail.lineCount > 1 ? 'end' : 'center';
		},
		onEdit() {
			this.showEdit = false;
			this.isEdit = true;
		},
		onLongTap(event, surveyIndex, answer) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.answer-content')
				.boundingClientRect((data) => {
					console.log(data);
				})
				.exec();
			this.top = event.y - 40 - 38 + 19;
			this.showEdit = true;
			this.isEdit = false;
			this.editingIndex = surveyIndex;
			this.oldAnswer = answer;
		},
		onAnswer() {
			const answerInput = this.answer.trim();
			if (!answerInput) {
				uni.showToast({
					title: '请输入答案',
					icon: 'none'
				});
				return;
			}
			// 编辑模式下替换答案
			if (this.isEdit && this.editingIndex !== -1) {
				const question = this.questions[this.editingIndex];
				if (question.type !== 'fill') {
					if (question.type === 'multi-select') {
						let inputLetters = [];
						if (answerInput.includes(',') || answerInput.includes('，')) {
							inputLetters = answerInput.split(/,|，/).map((item) => item.trim().toUpperCase());
						} else {
							inputLetters = answerInput.toUpperCase().split('');
						}
						let selectedAnswers = [];
						for (let letter of inputLetters) {
							const index = this.order.indexOf(letter);
							if (index === -1 || index >= question.options.length) {
								uni.showToast({
									title: '请输入正确的答案序号',
									icon: 'none'
								});
								return;
							}
							if (!selectedAnswers.includes(question.options[index])) {
								selectedAnswers.push(question.options[index]);
							}
						}
						this.surveys[this.editingIndex].answer = selectedAnswers;
					} else if (question.type === 'select') {
						const letter = answerInput.toUpperCase();
						const index = this.order.indexOf(letter);
						if (index === -1 || index >= question.options.length) {
							uni.showToast({
								title: '请输入正确的答案序号',
								icon: 'none'
							});
							return;
						}
						this.surveys[this.editingIndex].answer = question.options[index];
					}
				} else {
					this.surveys[this.editingIndex].answer = answerInput;
				}
				this.answers[this.editingIndex] = answerInput;
				this.isEdit = false;
				this.editingIndex = -1;
				this.answer = '';
				this.showEdit = false;
				return;
			}
			// 非编辑状态下原有逻辑
			const question = this.questions[this.current];
			if (question.type !== 'fill') {
				if (!answerInput) {
					uni.showToast({
						title: '请输入答案序号',
						icon: 'none'
					});
					return;
				}
				if (question.type === 'multi-select') {
					let inputLetters = [];
					if (answerInput.includes(',') || answerInput.includes('，')) {
						inputLetters = answerInput.split(/,|，/).map((item) => item.trim().toUpperCase());
					} else {
						inputLetters = answerInput.toUpperCase().split('');
					}
					let selectedAnswers = [];
					for (let letter of inputLetters) {
						const index = this.order.indexOf(letter);
						if (index === -1 || index >= question.options.length) {
							uni.showToast({
								title: '请输入正确的答案序号',
								icon: 'none'
							});
							return;
						}
						if (!selectedAnswers.includes(question.options[index])) {
							selectedAnswers.push(question.options[index]);
						}
					}
					this.surveys[this.current].answer = selectedAnswers;
				} else if (question.type === 'select') {
					const letter = answerInput.toUpperCase();
					const index = this.order.indexOf(letter);
					if (index === -1 || index >= question.options.length) {
						uni.showToast({
							title: '请输入正确的答案序号',
							icon: 'none'
						});
						return;
					}
					this.surveys[this.current].answer = question.options[index];
				}
			} else {
				this.surveys[this.current].answer = answerInput;
			}
			this.answers[this.current] = answerInput;
			this.answer = '';
			setTimeout(() => {
				this.current++;
				if (this.current < this.questions.length) {
					this.surveys.push({
						question: this.questions[this.current].question,
						answer: this.questions[this.current].type === 'multi-select' ? [] : '',
						data_tag: this.questions[this.current].data_tag
					});
				}
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 9999,
						duration: 300
					});
				});
			}, 1000);
		},
		getQuestions() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			request({
				url: `/api/v2/survey/diet-survey/template?member_id=${this.member.member_id}&user_id=${this.userInfo.member_id}&notification_id=${this.notificationId}&tenant_id=${this.userInfo.card_info.first_agent_id}`,
				method: 'POST',
				isRobot: true,
				success: (res) => {
					if (res && res.template_id) {
						this.loaded = true;
						this.templateId = res.template_id;
						this.questions = res.template_data;
						this.surveys.push({
							question: res.template_data[0].question,
							answer: res.template_data[0].type === 'multi-select' ? [] : '',
							data_tag: res.template_data[0].data_tag
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
.survey-diet-page {
	min-height: 100vh;
	padding: 0 32rpx 516rpx 32rpx;
	background-color: #fff;

	.banner-container {
		position: relative;
		background-color: $uni-bg-color-2;
		border-radius: 24rpx;
		padding-left: 22rpx;
		height: 242rpx;
	}

	.banner-image {
		position: absolute;
		right: 20rpx;
		bottom: 0;
	}

	.question-content {
		width: fit-content;
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
	}

	.answer-content {
		width: fit-content;
		padding: 16rpx 24rpx;
		margin-left: auto;
		border-radius: 16rpx;
		background-color: $uni-color-accent1;
	}

	.analysis-container {
		position: fixed;
		bottom: env(safe-area-inset-bottom);
		width: 686rpx;
		height: 240rpx;
		padding: 32rpx;
		margin: 0 auto;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		z-index: 9999;
	}

	.analysis-btn {
		width: 432rpx;
		height: 72rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: $uni-bg-color;
	}

	.tabbar-content {
		width: 100%;
		padding: 22rpx 32rpx;
		border-radius: 48rpx;
		box-shadow: 0rpx 4rpx 20rpx 0rpx #0000001a;
		background-color: #fff;
	}

	.tabbar-content.editing {
		padding: 0 24rpx 24rpx 24rpx;
		border-radius: 24rpx;
	}

	.answer-input {
		flex: 1;
	}

	.old-answer {
		height: 80rpx;
		border-bottom: 2rpx solid $uni-border-color;
	}

	checkbox-group,
	radio-group {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	label {
		display: flex;
		align-items: center;
	}

	.popup-content {
		position: absolute;
		right: 34rpx;
		width: 200rpx;
		height: 80rpx;
		background-color: #fff;
		border-radius: 16rpx;
	}

	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.speech-btn {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: $uni-color-primary;
	}
}
</style>
