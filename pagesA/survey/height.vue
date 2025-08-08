<template>
	<Flexbox direction="column" gap="16" className="survey-height-page">
		<Navbar title="儿童成长调查"></Navbar>
		<Flexbox align="left" className="banner-container">
			<Flexbox direction="column" className="full-width">
				<Typography color="gray2">请使用文字或语音回复，</Typography>
				<Typography color="gray2">共{{ questions.length }}个问题，</Typography>
				<Typography color="gray2">用时约3分钟</Typography>
			</Flexbox>
			<Icon src="height.png" width="186" height="108" mode="heightFix" className="banner-image"></Icon>
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
		<Flexbox align="center" direction="column" gap="24" className="tabbar-container" v-else>
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
import { groupBy, mapValues, omit } from 'lodash';
import { request } from '@/utils/request';

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
		console.log('减肥调查页面卸载');
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
			const groupData = groupBy(this.surveys, 'name');
			const data = mapValues(groupData, (group) => group.map((item) => omit(item, 'name')));
			request({
				url: '/api/v2/growth/analyze_survey',
				method: 'POST',
				data: {
					member_id: this.member.member_id,
					user_id: this.userInfo.member_id,
					template_id: this.templateId,
					tenant_id: this.userInfo.card_info.first_agent_id,
					notification_id: this.notificationId,
					basic_data: this.basicInfo,
					...data
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.redirectTo(`/pagesA/report/height?recordId=${res.record_id}&from=survey`);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		navigateTo(url) {
			uni.navigateTo({
				url
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
			// 编辑模式下替换对应答案
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
			// 非编辑状态逻辑
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
					this.surveys.push(this.questions[this.current]);
				}
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 9999,
						duration: 300
					});
				});
			}, 1000);
		},
		transferData(arr, name) {
			return arr.map((item) => ({ ...item, name, answer: item.type === 'multi-select' ? [] : '' }));
		},
		getQuestions() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			request({
				url: '/api/v2/growth/get_template',
				isRobot: true,
				success: (res) => {
					console.log(res);
					if (res) {
						this.loaded = true;
						this.templateId = res.template_id;
						for (let key in res) {
							if (!['template_id', 'basic_template'].includes(key)) {
								this.questions = this.questions.concat(this.transferData(res[key], 'survey_data'));
							}
						}
						if (this.questions.length) {
							this.surveys.push(this.questions[0]);
						}
						console.log(this.surveys);
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
.survey-height-page {
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
		min-height: 44rpx;
		line-height: 44rpx;
		font-size: 32rpx;
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

	.survey-message {
		width: 510rpx;
		background-color: $uni-bg-color-2;
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
		background-color: #fff;
	}

	.survey-type {
		width: 100%;
		height: 64rpx;
		border-top: 2rpx solid $uni-text-color-gray4;
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
