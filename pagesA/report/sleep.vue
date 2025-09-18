<template>
	<view class="report-sleep-page" v-if="report">
		<Navbar title="匹兹堡睡眠质量调查"></Navbar>
		<Flexbox align="justify">
			<Flexbox direction="column" gap="4">
				<Typography fontSize="22" :bold="true">匹兹堡睡眠质量调查报告</Typography>
				<Typography fontSize="12" color="gray2">
					调查对象：{{ from ? report.survey_info.name : member.member_name }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;调查时间：{{ report.survey_info.survey_date }}
				</Typography>
			</Flexbox>
			<Icon :src="from ? report.survey_info.avatar : member.avatar" size="44" :circle="true" type="remote"></Icon>
		</Flexbox>
		<Flexbox direction="column" gap="3" className="scale-container">
			<Flexbox align="justify" gap="2">
				<Flexbox
					direction="column"
					align="center"
					gap="6"
					:className="['scale-item', { active: report.report_data.total_score >= 0 && report.report_data.total_score < 10 }]"
				>
					<Typography color="gray1">良好</Typography>
					<view class="bar"></view>
				</Flexbox>
				<Flexbox
					direction="column"
					align="center"
					gap="6"
					:className="['scale-item', { active: report.report_data.total_score >= 10 && report.report_data.total_score < 15 }]"
				>
					<Typography color="gray1">一般</Typography>
					<view class="bar"></view>
				</Flexbox>
				<Flexbox
					direction="column"
					align="center"
					gap="6"
					:className="['scale-item', { active: report.report_data.total_score >= 15 && report.report_data.total_score < 30 }]"
				>
					<Typography color="gray1">较差</Typography>
					<view class="bar"></view>
				</Flexbox>
			</Flexbox>
			<Flexbox className="scale-list">
				<Typography color="gray3">0</Typography>
				<Typography color="gray3">10</Typography>
				<Typography color="gray3">15</Typography>
				<Typography color="gray3">30</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="8">
			<Typography fontSize="16" :bold="true">综合评分{{ report.report_data.total_score }}分，{{ report.report_data.evaluation }}</Typography>
			<Typography color="gray1">{{ report.report_data.description }}</Typography>
		</Flexbox>
		<Flexbox direction="column" gap="12" className="standard-container">
			<Typography color="#000000" :bold="true">评估依据/标准</Typography>
			<Typography color="gray2">{{ report.assessment_basis }}</Typography>
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
	// 		title: '匹兹堡睡眠质量调查报告',
	// 		path: `/pagesA/report/sleep?from=${this.from}&appId=${this.appId}&memberId=${this.memberId}&recordId=${this.recordId}&userId=${this.userId || this.userInfo.member_id}`
	// 	};
	// },
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		getRecordDetail() {
			request({
				url: '/api/v2/scale/pzb_get_record_detail',
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
.report-sleep-page {
	padding: 34rpx 32rpx 96rpx 32rpx;

	.bar {
		width: 224rpx;
		height: 8rpx;
		background-color: $uni-text-color-gray4;
		border-radius: 4rpx;
	}

	.scale-item.active .bar {
		background-color: $uni-color-primary;
	}

	.scale-item.active .text {
		color: $uni-color-primary;
	}

	.scale-container {
		margin: 70rpx 0 40rpx 0;
	}

	.scale-list .text:nth-child(1) {
		width: 18rpx;
	}

	.scale-list .text:nth-child(2) {
		width: 30rpx;
		margin-left: 198rpx;
	}
	.scale-list .text:nth-child(3) {
		width: 30rpx;
		margin-left: 198rpx;
	}
	.scale-list .text:nth-child(4) {
		width: 34rpx;
		margin-left: 178rpx;
	}

	.standard-container {
		margin-top: 40rpx;
		border-radius: 16rpx;
		padding: 24rpx;
		background-color: $uni-bg-color-2;
		white-space: pre-wrap;
	}
}
</style>
