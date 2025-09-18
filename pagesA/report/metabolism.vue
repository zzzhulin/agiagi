<template>
	<view class="report-metabolism-page" v-if="report">
		<Navbar title="代谢情况调查"></Navbar>
		<Flexbox direction="column" gap="20">
			<Flexbox align="justify">
				<Flexbox direction="column" gap="4">
					<Typography fontSize="22" :bold="true">代谢情况调查报告</Typography>
					<Typography fontSize="12" color="gray2">
						调查对象：{{ from ? report.survey_info.name : member.member_name }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;调查时间：{{ report.survey_info.survey_date }}
					</Typography>
				</Flexbox>
				<Icon :src="from ? report.survey_info.avatar : member.avatar" size="44" :circle="true" type="remote"></Icon>
			</Flexbox>
			<Flexbox direction="column" gap="24">
				<Flexbox direction="column" gap="12">
					<Flexbox>
						<Typography fontSize="16" :bold="true">空腹血糖</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>{{ report.report_data.fpg.value }}{{ report.report_data.fpg.unit }}</Typography>
							<Typography :color="report.report_data.fpg.risk_level_color">{{ report.report_data.fpg.risk_level }}</Typography>
						</Flexbox>
					</Flexbox>
					<Icon src="blood-fpg.png" width="343" mode="widthFix"></Icon>
				</Flexbox>
				<Flexbox direction="column" gap="12">
					<Flexbox>
						<Typography fontSize="16" :bold="true">血压</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>收缩压{{ report.report_data.blood_pressure.systolic }}mmHg / 舒张压{{ report.report_data.blood_pressure.diastolic }}mmHg</Typography>
							<Typography :color="report.report_data.blood_pressure.risk_level_color">{{ report.report_data.blood_pressure.risk_level }}</Typography>
						</Flexbox>
					</Flexbox>
					<Icon src="blood-pressure.png" width="343" mode="widthFix"></Icon>
				</Flexbox>
				<Flexbox direction="column" gap="12">
					<Typography fontSize="16" :bold="true">血脂四项</Typography>
					<Flexbox>
						<Typography>总胆固醇（TC）</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>{{ report.report_data.lipid_profile.total_cholesterol.value }}{{ report.report_data.lipid_profile.total_cholesterol.unit }}</Typography>
							<Typography :color="report.report_data.lipid_profile.total_cholesterol.risk_level_color">
								{{ report.report_data.lipid_profile.total_cholesterol.risk_level }}
							</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox>
						<Typography>甘油三酯（TG）</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>{{ report.report_data.lipid_profile.triglycerides.value }}{{ report.report_data.lipid_profile.triglycerides.unit }}</Typography>
							<Typography :color="report.report_data.lipid_profile.triglycerides.risk_level_color">
								{{ report.report_data.lipid_profile.triglycerides.risk_level }}
							</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox>
						<Typography>低密度脂蛋白胆固醇（LDL-C）</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>{{ report.report_data.lipid_profile.ldl_c.value }}{{ report.report_data.lipid_profile.ldl_c.unit }}</Typography>
							<Typography :color="report.report_data.lipid_profile.ldl_c.risk_level_color">
								{{ report.report_data.lipid_profile.ldl_c.risk_level }}
							</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox>
						<Typography>高密度脂蛋白胆固醇（HDL-C）</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>{{ report.report_data.lipid_profile.hdl_c.value }}{{ report.report_data.lipid_profile.hdl_c.unit }}</Typography>
							<Typography :color="report.report_data.lipid_profile.hdl_c.risk_level_color">
								{{ report.report_data.lipid_profile.hdl_c.risk_level }}
							</Typography>
						</Flexbox>
					</Flexbox>
					<Icon src="blood-fat.png" width="343" mode="widthFix"></Icon>
				</Flexbox>
				<Flexbox direction="column" gap="12">
					<Flexbox>
						<Typography fontSize="16" :bold="true">血清尿酸</Typography>
						<Flexbox direction="column" className="blood-info">
							<Typography>{{ report.report_data.sua.value }}{{ report.report_data.sua.unit }}</Typography>
							<Typography :color="report.report_data.sua.risk_level_color">{{ report.report_data.sua.risk_level }}</Typography>
						</Flexbox>
					</Flexbox>
					<Icon src="blood-serum.png" width="343" mode="widthFix"></Icon>
				</Flexbox>
			</Flexbox>
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
	// 		title: '代谢情况调查报告',
	// 		path: `/pagesA/report/metabolism?from=${this.from}&appId=${this.appId}&memberId=${this.memberId}&recordId=${this.recordId}&userId=${
	// 			this.userId || this.userInfo.member_id
	// 		}`
	// 	};
	// },
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		getRecordDetail() {
			request({
				url: '/api/v2/metabolic/get_record_detail',
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
.report-metabolism-page {
	padding: 34rpx 32rpx 96rpx 32rpx;

	.blood-info {
		margin-left: auto;
		align-items: flex-end;
	}
}
</style>
