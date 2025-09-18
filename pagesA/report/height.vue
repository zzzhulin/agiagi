<template>
	<view class="report-height-page" v-if="report">
		<Navbar title="儿童成长"></Navbar>
		<Flexbox direction="column" gap="24">
			<Flexbox align="justify">
				<Flexbox direction="column" gap="4">
					<Typography fontSize="22" :bold="true">儿童成长调查报告</Typography>
					<Typography fontSize="12" color="gray2">
						调查对象：{{ from ? report.survey_info.name : member.member_name }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;调查时间：{{ report.survey_info.survey_date }}
					</Typography>
				</Flexbox>
				<Icon :src="from ? report.survey_info.avatar : member.avatar" size="44" :circle="true" type="remote"></Icon>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<view class="body-type">
					<Typography>孩子目前{{ report.child_info.age }}，体形为{{ report.body_analysis.body_type }}</Typography>
					<Typography color="gray2">（{{ report.body_analysis.body_type_analysis }}）</Typography>
				</view>
				<Flexbox direction="column" className="table">
					<Flexbox className="table-row">
						<Flexbox align="center" className="table-col">
							<Typography color="gray2">当前身高</Typography>
						</Flexbox>
						<Flexbox align="center" className="table-col">
							<Typography>{{ report.current_metrics.height.value }}</Typography>
						</Flexbox>
						<Flexbox align="center" className="table-col">
							<Typography>处于{{ report.current_metrics.height.percentile }}分位</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox className="table-row">
						<Flexbox align="center" className="table-col">
							<Typography color="gray2">当前体重</Typography>
						</Flexbox>
						<Flexbox align="center" className="table-col">
							<Typography>{{ report.current_metrics.weight.value }}</Typography>
						</Flexbox>
						<Flexbox align="center" className="table-col">
							<Typography>处于{{ report.current_metrics.weight.percentile }}分位</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<view class="height-analysis">
					<Typography>根据遗传因素推测，您孩子的</Typography>
					<Typography :bold="true">靶身高为{{ report.predicted_growth.predicted_adult_height }}cm</Typography>
					<Typography color="gray2">（浮动空间{{ report.predicted_growth.height_range }}）</Typography>
					<Typography>，</Typography>
					<Typography :bold="true">预测处于54％分位</Typography>
					<Typography>。</Typography>
					<br />
					<Typography>{{ report.expected_growth.analysis }}</Typography>
				</view>
			</Flexbox>
			<Flexbox direction="column" gap="6" className="risk-content">
				<Typography fontSize="16" :bold="true">风险提示</Typography>
				<Flexbox direction="column">
					<Typography v-for="(item, index) in report.recommendations.growth_risks" :key="index">{{ item }}</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="6" className="medical-content">
				<Typography fontSize="16" :bold="true">医学建议</Typography>
				<Flexbox direction="column">
					<Typography v-for="(item, index) in report.recommendations.medical_advice" :key="index">{{ item }}</Typography>
				</Flexbox>
			</Flexbox>
			<Icon src="height-measure-method.png" width="343" mode="widthFix"></Icon>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			from: '',
			appId: '',
			memberId: '',
			recordId: '',
			userId: '',
			report: null
		};
	},
	onLoad(options) {
		this.from = options.from;
		this.userId = options.userId;
		this.appId = options.appId;
		this.memberId = options.memberId;
		this.recordId = options.recordId;
		if (options.from) {
			this.getRecordDetail();
		} else {
			this.getLatestSurvey();
		}
	},
	// onShareAppMessage() {
	// 	return {
	// 		title: '儿童成长调查报告',
	// 		path: `/pagesA/report/height?from=${this.from}&appId=${this.appId}&memberId=${this.memberId}&recordId=${this.recordId}&userId=${this.userId || this.userInfo.member_id}`
	// 	};
	// },
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		getRecordDetail() {
			request({
				url: '/api/v2/growth/get_record_detail',
				data: {
					user_id: this.userId || this.userInfo.member_id,
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
		getLatestSurvey() {
			request({
				url: '/api/v2/survey/diet-survey/latest',
				data: {
					user_id: this.userId || this.userInfo.member_id,
					member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.report = res;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.report-height-page {
	padding: 34rpx 32rpx 96rpx 32rpx;

	.body-type {
		line-height: 1;
	}

	.body-type .text {
		display: inline;
	}

	.table-row {
		position: relative;
		height: auto;
		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: 2rpx;
			background-color: $uni-border-color;
		}
	}

	.table-col {
		position: relative;
		padding: 16rpx;
		&::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			width: 2rpx;
			background-color: $uni-border-color;
		}
		&:first-child {
			width: 176rpx;
			border-left: 2rpx solid $uni-border-color;
		}

		&:nth-child(2) {
			width: 232rpx;
		}
		&:nth-child(3) {
			width: 278rpx;
		}
	}

	.table .table-row {
		&:first-child {
			&:before {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				height: 2rpx;
				background-color: $uni-border-color;
			}
		}
	}

	.height-analysis {
		line-height: 1;
		.text {
			display: inline;
		}
	}

	.medical-content {
		position: relative;
		padding-bottom: 48rpx;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 2rpx;
			background-color: $uni-border-color;
		}
	}
}
</style>
