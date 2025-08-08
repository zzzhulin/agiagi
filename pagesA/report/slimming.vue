<template>
	<view class="report-slimming-page" v-if="report">
		<Navbar title="减肥活动健康调查"></Navbar>
		<Flexbox direction="column" gap="24">
			<Flexbox align="justify">
				<Flexbox direction="column" gap="4">
					<Typography fontSize="22" :bold="true">减肥调查报告</Typography>
					<Typography font-size="12" color="gray2">
						调查对象：{{ from ? report.member_name : member.member_name }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;调查时间：{{
							report.created_at.slice(0, 10).replace(/-/g, '.')
						}}
					</Typography>
				</Flexbox>
				<Icon :src="from ? report.avatar : member.avatar" size="44" :circle="true" type="remote"></Icon>
			</Flexbox>
			<Flexbox gap="12">
				<Flexbox align="center" direction="column" gap="12" className="body-data">
					<Flexbox align="center" direction="column" gap="4">
						<Typography>基础代谢</Typography>
						<Typography fontSize="22" color="#000000" :bold="true">{{ report.bmr }}</Typography>
					</Flexbox>
					<Flexbox align="center" direction="column">
						<Typography fontSize="12" color="gray2">浮动区间</Typography>
						<Typography fontSize="12" color="gray1">{{ (report.bmr - report.bmr * 0.15).toFixed(2) }}~{{ (report.bmr + report.bmr * 0.15).toFixed(2) }}</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="center" direction="column" gap="12" className="body-data">
					<Flexbox align="center" direction="column" gap="4">
						<Typography>体重调定点</Typography>
						<Typography fontSize="22" color="#000000" :bold="true">{{ report.weight_set_point }}</Typography>
					</Flexbox>
					<Flexbox align="center" direction="column">
						<Typography fontSize="12" color="gray2">浮动区间</Typography>
						<Typography fontSize="12" color="gray1">
							{{ (report.weight_set_point - report.weight_set_point * 0.15).toFixed(2) }}~{{ (report.weight_set_point + report.weight_set_point * 0.15).toFixed(2) }}
						</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="center" direction="column" gap="12" className="body-data">
					<Flexbox align="center" direction="column" gap="4">
						<Typography>体温调定点</Typography>
						<Typography fontSize="22" color="#000000" :bold="true">{{ report.thermoregulatory_set_point }}</Typography>
					</Flexbox>
					<Flexbox align="center" direction="column">
						<Typography fontSize="12" color="gray2">浮动区间</Typography>
						<Typography fontSize="12" color="gray1">
							{{ (report.thermoregulatory_set_point - report.thermoregulatory_set_point * 0.15).toFixed(2) }}~{{
								(report.thermoregulatory_set_point + report.thermoregulatory_set_point * 0.15).toFixed(2)
							}}
						</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<Flexbox direction="column" gap="8">
					<Typography fontSize="16" :bold="true">你体重增长的主要因素是：</Typography>
					<Typography color="gray1">{{ report.comment.weight_gain_reason }}</Typography>
				</Flexbox>
				<Flexbox direction="column" gap="8">
					<Typography fontSize="16" :bold="true">你减肥的主要困难是：</Typography>
					<Typography color="gray1">{{ report.comment.weight_loss_difficulty_reson }}</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="20" className="description-content">
				<view class="summary-text">
					<text>
						人体是一个动态平衡的系统，以体系化的思路，让每一个减肥者与自己的本能和谐相处。人类减肥本质是与我们的进化防御系统、代谢反扑机制、神经可塑性的和谐自洽。需采用
					</text>
					<text class="bold">⌈代谢优化-神经生物重塑-行为认知⌋</text>
					<text>三位一体策略进行突破并通过减肥5关，而非单纯依赖意志力。</text>
				</view>
				<block v-if="!isCollapse">
					<Flexbox direction="column" gap="12">
						<Flexbox direction="column" v-for="(item, index) in description" :key="index">
							<Typography className="description-text">{{ item.title }}</Typography>
							<Typography color="gray2" className="description-text">{{ item.content }}</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column">
						<Typography color="gray1" className="description-text">当您顺利的通过这五关后，您会惊喜的发现您找到了打开减肥法门的金钥匙，成功收获6降：</Typography>
						<Flexbox v-for="(item, index) in fallText" :key="index">
							<Flexbox align="center" className="dot"></Flexbox>
							<view class="fall-text">
								<Typography>{{ item.text }}</Typography>
								<Typography color="gray2">{{ item.content }}</Typography>
							</view>
						</Flexbox>
					</Flexbox>
				</block>
				<Flexbox align="left" className="collapse-btn" @tap="isCollapse = !isCollapse">
					<Typography color="gray2">{{ isCollapse ? '展开全部' : '收起' }}</Typography>
					<Icon src="icon_arrow-down-gray2.png" size="16" v-if="isCollapse"></Icon>
					<Icon src="icon_arrow-down-gray2.png" size="16" className="rotate" v-else></Icon>
				</Flexbox>
			</Flexbox>
			<Typography color="gray1">
				我们为您准备了有20年理论和实战经验的，服务过超百万人的体重管理专家组，医生，注册营养师，专业教练等组成的专业支持团队，结合我们核心营养干预技术FLG(弹性低血糖负荷饮食法）和国家专利系列功能营养食品，让您本次减肥的成功率达95％以上，并让您的减重过程科学安全，高效可持续...
			</Typography>
			<Flexbox direction="column" gap="17">
				<Flexbox direction="column" gap="24" className="scheme-item" v-for="scheme in schemes" :key="scheme.id">
					<Flexbox align="justify">
						<Flexbox direction="column" gap="4">
							<Typography fontSize="18" :bold="true">{{ scheme.scheme_name }}</Typography>
							<Typography fontSize="16" color="primary" :bold="true">{{ scheme.description }}</Typography>
						</Flexbox>
						<Flexbox align="center" className="clock-btn" @tap="selectScheme(scheme.id)">
							<Typography fontSize="16" color="white" :bold="true">去打卡执行</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox direction="column" gap="16">
						<Flexbox direction="column">
							<Flexbox align="left">
								<Flexbox align="center" className="dot"></Flexbox>
								<Typography :bold="true">特点/优劣势</Typography>
							</Flexbox>
							<Typography color="gray1">{{ scheme.advantages }}；{{ scheme.drawbacks }}</Typography>
						</Flexbox>
						<Flexbox direction="column">
							<Flexbox align="left">
								<Flexbox align="center" className="dot"></Flexbox>
								<Typography :bold="true">适应人群</Typography>
							</Flexbox>
							<Typography color="gray1">{{ scheme.suitable_population }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>

		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			from: '',
			appId: '',
			memberId: '',
			recordId: '',
			summary: '',
			isCollapse: true,
			report: null,
			description: [
				{
					title: '1. 营养关',
					content: '要健康膳食，健康才是减肥的首要目标和最终目的；要热量赤字，这个是减重的基础；脂肪高效氧化的营养结构，高效减重是最好的激励。'
				},
				{
					title: '2. 食欲关',
					content:
						'90%的减肥者失败就败在食欲关，不管是生理上的饥饿还得心理上的馋，我们都要用神经生物学的方法，用更加巧妙的营养结构设计来增加饱腹感和饱腹持久度，管理食欲如果用简单对抗的方法最终都会不持久，被反噬，终究失败'
				},
				{
					title: '3. 代谢关',
					content: '代谢的优化才能启动减重快并具备持久的健康效应，通过科学地调理，40岁一样可以有25岁的代谢力。'
				},
				{
					title: '4. 行为认知关',
					content:
						'现代中国美食诱惑无处不在、人情往来、压力、情绪波动、饮酒应酬等都是减肥的拦路虎，适应环境不是被动妥协，而是主动创造属于你的“瘦身生态圈”，让减肥从刻意坚持逐渐过渡到潜移默化，成功将变得自然而然。'
				},
				{
					title: '5. 意志力关',
					content:
						'减肥至今仍是世界级难题，具备艰巨性和复杂性，一个人减肥会很孤单，失败率95%以上，专业的服务引导将减肥从“意志力比拼”转化为“系统性健康工程”，通过科学干预降低风险、提升效率，并建立可持续的生活方式。'
				}
			],
			fallText: [
				{
					text: '体重降',
					content: ''
				},
				{
					text: '围度降',
					content: '(腰围，臀围，腿围，臂围等)'
				},
				{
					text: '体龄降',
					content: '(身体年龄，自由基等)'
				},
				{
					text: '食欲波动降',
					content: '(不容易馋，不容易饿，快乐小鸟胃）'
				},
				{
					text: '生化指标降',
					content: '(血糖、血脂、尿酸、血压、超敏c反应蛋白、炎症指标等)'
				},
				{
					text: '体重调定点降',
					content: '(大吃大喝体重也不容易涨，终生都不容易胖)'
				}
			],
			schemes: []
		};
	},
	onLoad(options) {
		this.from = options.from;
		this.appId = options.appId;
		this.memberId = options.memberId;
		this.recordId = options.recordId;
		if (options.from) {
			this.getRecordDetail();
		} else {
			this.getLatestSurvey();
			this.getSchemes();
		}
	},
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		...mapMutations(['setTaskInfo']),
		getRecordDetail() {
			request({
				url: '/api/v2/take-a-test/record-detail',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId,
					app_id: this.appId,
					record_id: this.recordId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.report = res;
					}
				}
			});
		},
		selectScheme(diet_scheme_id) {
			uni.showLoading({
				title: '创建任务中...',
				mask: true
			});
			request({
				url: '/api/v2/weight-loss/select-scheme-and-create-task',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id,
					diet_scheme_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getTask();
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getTask() {
			request({
				url: '/api/v2/weight-loss-tracking/get-user-task',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.setTaskInfo(res);
						uni.redirectTo({
							url: '/pagesC/clock/start'
						});
					}
				}
			});
		},
		getLatestSurvey() {
			request({
				url: '/api/v2/weight-loss/latest_survey',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.report = res;
					}
				}
			});
		},
		getSchemes() {
			request({
				url: '/api/v2/weight-loss/diet-schemes',
				isRobot: true,
				success: (res) => {
					if (res) {
						this.schemes = res;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.report-slimming-page {
	padding: 34rpx 32rpx 104rpx 32rpx;

	.body-data {
		flex: 1;
		padding: 24rpx 0 16rpx 0;
		background-color: $uni-bg-color-2;
		border-radius: 16rpx;
	}

	.description-content {
		position: relative;
		padding: 40rpx 0;
		&:before,
		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			height: 2rpx;
			background-color: $uni-border-color;
		}

		&:before {
			top: 0;
		}

		&::after {
			bottom: 0;
		}
	}

	.summary-text text {
		font-size: 28rpx;
		line-height: 48rpx;
		color: $uni-text-color-gray2;
	}

	.summary-text text.bold {
		color: $uni-text-color;
		font-weight: 600;
	}

	.description-text.text {
		line-height: 48rpx;
	}

	.fall-text {
		line-height: 1;
	}

	.fall-text .text {
		display: inline;
		line-height: 48rpx;
	}

	.dot {
		width: 40rpx;
		height: 48rpx;
		&::after {
			content: '';
			width: 10rpx;
			height: 10rpx;
			background-color: $uni-text-color;
			border-radius: 50%;
		}
	}

	.collapse-btn {
		margin-left: auto;
	}

	.rotate {
		transform: rotate(180deg);
	}

	.scheme-item {
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;

		.dot {
			height: 40rpx;
		}
	}

	.clock-btn {
		width: 200rpx;
		height: 72rpx;
		background-color: $uni-color-primary;
		border-radius: 80rpx;
	}
}
</style>
