<template>
	<view class="survey-slimming-page">
		<Navbar :fixed="false" :title="title" backgroundColor="transparent"></Navbar>
		<Icon :src="background" width="375" height="375" className="background"></Icon>
		<Flexbox direction="column" gap="24" className="survey-container">
			<Flexbox direction="column" gap="8">
				<Flexbox align="justify">
					<Flexbox align="left" gap="8">
						<Icon :src="member.avatar" size="32" type="remote" :circle="true"></Icon>
						<Typography fontSize="18" color="#000000" :bold="true">Hi，{{ member.member_name }}</Typography>
					</Flexbox>
					<picker :value="index" :range="family" range-key="member_name" @change="selectMember">
						<Flexbox align="left">
							<Typography color="primary" :bold="true">切换对象</Typography>
							<Icon src="icon_transfer.png" size="20"></Icon>
						</Flexbox>
					</picker>
				</Flexbox>
				<Flexbox direction="column">
					<Typography v-for="(item, index) in description" :key="index">{{ item }}</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<Flexbox align="left" gap="15" v-for="(item, index) in questions" :key="item.question">
					<Typography color="gray1" className="form-label">{{ label[item.question] }}</Typography>
					<Flexbox align="justify" className="form-input">
						<picker
							mode="date"
							:value="item.answer"
							start="1900-01-01"
							:end="endDate"
							@change="selectAnswer($event, item.question, index)"
							v-if="item.question === 'birthdate'"
						>
							<view class="uni-input" v-if="item.answer">{{ item.answer }}</view>
							<view class="placeholder" v-else>{{ placeholder[item.question] }}</view>
							<Icon src="icon_arrow-right.png" size="24"></Icon>
						</picker>
						<picker
							:value="item.options.indexOf(item.answer)"
							:range="item.options"
							@change="selectAnswer($event, item.question, index)"
							v-else-if="item.type === 'select'"
						>
							<view class="uni-input" v-if="item.answer">{{ item.answer }}</view>
							<view class="placeholder" v-else>{{ placeholder[item.question] }}</view>
							<Icon src="icon_arrow-right.png" size="24"></Icon>
						</picker>
						<block v-else>
							<input
								type="digit"
								v-model="item.answer"
								:placeholder="placeholder[item.question]"
								:disabled="item.type === 'select'"
								placeholder-class="placeholder"
							/>
							<Typography v-if="item.type === 'fill'" :bold="true">{{ unit[item.question] }}</Typography>
							<Icon src="icon_arrow-right.png" size="24" v-else></Icon>
						</block>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="survey-btn" @tap="onSurvey">
				<Typography fontSize="18" color="white" :bold="true">开始调查</Typography>
			</Flexbox>
		</Flexbox>
		<uni-popup ref="popup" type="center">
			<Flexbox align="center" direction="column" gap="24" className="popup-content">
				<Typography fontSize="16" align="center">为了确定调查的准确性，请完善Ta的基础资料后再进行。</Typography>
				<Flexbox gap="14">
					<Flexbox align="center" className="cancel-btn" @tap="closePopup">
						<Typography fontSize="18" color="gray2" :bold="true">取消</Typography>
					</Flexbox>
					<Flexbox align="center" className="confirm-btn" @tap="navigateTo(`/pagesA/profile/profile?memberId=${memberId}&tab=base`)">
						<Typography fontSize="18" color="white" :bold="true">先完善资料</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { formatDate } from '@/utils/util';
export default {
	data() {
		return {
			title: '',
			url: '',
			description: [],
			background: 'survey-background.png',
			label: {
				height: '身高',
				weight: '体重',
				birthdate: '出生日期',
				gender: '性别'
			},
			gender: {
				M: '男',
				F: '女'
			},
			unit: {
				height: 'cm',
				weight: 'kg'
			},
			placeholder: {
				height: '请输入身高',
				weight: '请输入体重',
				birthdate: '请选择出生日期',
				gender: '请选择性别'
			},
			family: [],
			height: '',
			weight: ''
		};
	},
	onLoad(option) {
		// this.getQuestions();
		this.getFamily();
		this.background = `${option.type}_survey-background.png`;
		this.url = `/pagesA/survey/${option.type}`;
		switch (option.type) {
			case 'diet':
				this.title = '膳食调查';
				this.description = ['说出你常吃的食物，即可立刻揪出营养过剩或不足！打理好自己的健康！'];
				break;
			case 'slimming':
				this.title = '减肥活动健康调查';
				this.description = ['不同体质有不同的减肥难点，十分钟，从基因，代谢，生活方式等全面评估，科学减肥。', '我们将做一个简短的问卷，以便给你制作1V1 服务'];
				break;
			case 'height':
				this.title = '儿童成长';
				this.description = ['科学管理身高，从参与调查开始！'];
				break;
			case 'emotion':
				this.title = 'PHQ－9抑郁量表测评';
				this.description = ['简单几道题目，看看自己的开心的能力值怎么样，量化观测自己的情绪状况'];
				break;
			case 'sleep':
				this.title = '匹兹堡睡眠调查';
				this.description = ['对自己的睡眠质量进行下体系化评估吧'];
				break;
			case 'age':
				this.title = '身体年龄测评';
				this.description = ['请准备一把尺子（30cm直尺），中等大小的气球，腰围尺与另一部手机用作计时等工具。'];
				break;
			case 'metabolism':
				this.title = '代谢情况调查';
				this.description = ['代谢异常，一定要多做调查观测身体变化，并记录异常指标~~~'];
				break;
			default:
				break;
		}
	},
	computed: {
		...mapState(['userInfo', 'member']),
		index() {
			return this.family.findIndex((item) => item.member_id === this.member.member_id);
		},
		endDate() {
			const date = new Date();
			return formatDate(date, 'YYYY-MM-DD');
		},
		questions() {
			return [
				{
					type: 'fill',
					answer: this.height,
					question: 'height'
				},
				{
					type: 'fill',
					answer: this.weight,
					question: 'weight'
				},
				{
					type: 'fill',
					answer: this.member.birthdate,
					question: 'birthdate'
				},
				{
					type: 'select',
					answer: this.gender[this.member.gender],
					options: ['男', '女'],
					question: 'gender'
				}
			];
		}
	},
	methods: {
		...mapMutations(['setBasicInfo', 'setMember']),
		onSurvey() {
			let isValid = true;
			for (let i = 0; i < this.questions.length; i++) {
				const item = this.questions[i];
				if (!item.answer) {
					uni.showToast({
						title: this.placeholder[item.question],
						icon: 'none'
					});
					isValid = false;
					break;
				}
			}
			if (this.member.health_record_status !== 'N') {
				this.$refs.popup.open();
				return;
			}
			if (isValid) {
				this.redirectTo(this.url);
				this.setBasicInfo(this.questions);
			}
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
		selectAnswer(e, question, index) {
			if (question === 'birthdate') {
				this.questions[index].answer = e.detail.value;
			} else {
				this.questions[index].answer = this.questions[index].options[e.detail.value];
			}
		},
		// getQuestions() {
		// 	request({
		// 		url: '/api/v2/weight-loss/get_weight_loss_survey_template',
		// 		isRobot: true,
		// 		success: (res) => {
		// 			if (res) {
		// 				this.questions = res.basicinfo.map((item) => ({
		// 					...item,
		// 					options: item.question === 'gender' ? ['男', '女'] : item.options,
		// 					answer: item.question === 'gender' ? this.gender[this.member[item.question]] : item.question === 'birthdate' ? this.member[item.question] : ''
		// 				}));
		// 			}
		// 		}
		// 	});
		// },
		selectMember(e) {
			const member = this.family[e.detail.value];
			this.setMember(member);
			this.getBaseInfo();
		},
		getBaseInfo() {
			request({
				url: '/api/v2/health_record/basic_info',
				data: {
					family_member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.height = res.height;
						this.weight = res.weight;
					}
				}
			});
		},
		getFamily() {
			request({
				url: '/api/v2/survey/family-members',
				data: {
					user_id: this.userInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res && res.length) {
						this.family = res;
						this.getBaseInfo();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.survey-slimming-page {
	min-height: 100vh;
	padding-top: 670rpx;
	background-color: $uni-bg-color;

	.background {
		position: absolute;
		top: 0;
	}

	.survey-container {
		position: relative;
		margin: 0 32rpx 76rpx 32rpx;
		padding: 48rpx 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.form-label {
		flex: none;
		width: 112rpx;
	}

	.form-input {
		position: relative;
		flex: 1;
		height: 80rpx;
		padding: 20rpx 24rpx;
		background-color: $uni-bg-color-2;
		border-radius: 16rpx;
	}

	.form-input input,
	.form-input picker,
	.uni-input {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
	}

	.form-input .icon {
		position: absolute;
		right: 24rpx;
		top: 0;
		bottom: 0;
		width: 48rpx;
		height: 48rpx;
		margin: auto;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.survey-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
