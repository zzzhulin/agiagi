<template>
	<view class="report-diet-page" v-if="report">
		<Navbar title="膳食调查"></Navbar>
		<Flexbox direction="column" gap="20">
			<Flexbox align="justify">
				<Flexbox direction="column" gap="4">
					<Typography fontSize="22" :bold="true">膳食调查报告</Typography>
					<Typography fontSize="12" color="gray2">
						调查对象：{{ from ? report.member_name : member.member_name }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;调查时间：{{
							(from ? report.created_at : report.submit_time).slice(0, 10).replace(/-/g, '.')
						}}
					</Typography>
				</Flexbox>
				<Icon :src="from ? report.avatar : member.avatar" size="44" :circle="true" type="remote"></Icon>
			</Flexbox>
			<Flexbox align="justify" className="gl-container">
				<Flexbox direction="column" gap="4">
					<Typography color="gray1">早餐GL</Typography>
					<Typography fontSize="16" :bold="true">{{ report.result_data.meal_gl_values.breakfast_gl }}</Typography>
				</Flexbox>
				<Flexbox direction="column" gap="4">
					<Typography color="gray1">午餐GL</Typography>
					<Typography fontSize="16" :bold="true">{{ report.result_data.meal_gl_values.lunch_gl }}</Typography>
				</Flexbox>
				<Flexbox direction="column" gap="4">
					<Typography color="gray1">晚餐GL</Typography>
					<Typography fontSize="16" :bold="true">{{ report.result_data.meal_gl_values.dinner_gl }}</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Typography fontSize="16" :bold="true">供能比分析</Typography>
				<Flexbox direction="column">
					<view class="chart-container">
						<l-echart ref="chart"></l-echart>
					</view>
					<Flexbox direction="column" className="table">
						<Flexbox className="table-row">
							<Flexbox className="table-col">
								<Typography fontSize="12" color="gray2" :bold="true">营养类型</Typography>
							</Flexbox>
							<Flexbox className="table-col">
								<Typography fontSize="12" color="gray2" :bold="true">摄入量</Typography>
							</Flexbox>
							<Flexbox className="table-col">
								<Typography fontSize="12" color="gray2" :bold="true">总热量</Typography>
							</Flexbox>
							<Flexbox className="table-col">
								<Typography fontSize="12" color="gray2" :bold="true">小分类与含量</Typography>
							</Flexbox>
						</Flexbox>
						<Flexbox className="table-row">
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12" :bold="true">碳水化合物</Typography>
							</Flexbox>
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12">{{ report.result_data.nutrient_intakes.carbohydrates.amount }}g</Typography>
							</Flexbox>
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12">{{ report.result_data.nutrient_intakes.carbohydrates.energy }}卡</Typography>
							</Flexbox>
							<Flexbox className="table-col">
								<Flexbox direction="column" gap="4" className="full-width">
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">葡萄糖</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.carbohydrates.components.glucose }}g</Typography>
									</Flexbox>
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">果糖</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.carbohydrates.components.fructose }}g</Typography>
									</Flexbox>
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">半乳糖</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.carbohydrates.components.galactose }}g</Typography>
									</Flexbox>
								</Flexbox>
							</Flexbox>
						</Flexbox>
						<Flexbox className="table-row">
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12" :bold="true">脂肪</Typography>
							</Flexbox>
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12">{{ report.result_data.nutrient_intakes.fats.amount }}g</Typography>
							</Flexbox>
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12">{{ report.result_data.nutrient_intakes.fats.energy }}卡</Typography>
							</Flexbox>
							<Flexbox className="table-col">
								<Flexbox direction="column" gap="4" className="full-width">
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">ω-6系列</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.fats.types.omega_6 }}g</Typography>
									</Flexbox>
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">ω-3系列</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.fats.types.omega_3 }}g</Typography>
									</Flexbox>
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">反式脂肪</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.fats.types.trans_fats }}g</Typography>
									</Flexbox>
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">过度氧化脂肪</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.fats.types.overoxidized_fats }}g</Typography>
									</Flexbox>
								</Flexbox>
							</Flexbox>
						</Flexbox>
						<Flexbox className="table-row">
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12" :bold="true">蛋白质</Typography>
							</Flexbox>
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12">{{ report.result_data.nutrient_intakes.proteins.amount }}g</Typography>
							</Flexbox>
							<Flexbox align="left" className="table-col">
								<Typography fontSize="12">{{ report.result_data.nutrient_intakes.proteins.energy }}卡</Typography>
							</Flexbox>
							<Flexbox className="table-col">
								<Flexbox direction="column" gap="4" className="full-width">
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">优质蛋白</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.proteins.quality.high_quality }}g</Typography>
									</Flexbox>
									<Flexbox align="justify">
										<Typography fontSize="12" color="gray1">低质蛋白</Typography>
										<Typography fontSize="12" color="gray1">{{ report.result_data.nutrient_intakes.proteins.quality.low_quality }}g</Typography>
									</Flexbox>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Typography fontSize="16" :bold="true">营养明细分析</Typography>
				<Flexbox direction="column" className="nutrition-table">
					<Flexbox className="table-row">
						<Flexbox className="table-col">
							<Typography fontSize="12" color="gray2" :bold="true">营养类型</Typography>
						</Flexbox>
						<Flexbox className="table-col">
							<Typography fontSize="12" color="gray2" :bold="true">摄入量</Typography>
						</Flexbox>
						<Flexbox className="table-col">
							<Typography fontSize="12" color="gray2" :bold="true">摄入比</Typography>
						</Flexbox>
						<Flexbox className="table-col">
							<Typography fontSize="12" color="gray2" :bold="true">长期偏多或偏少</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox className="table-row" v-for="item in report.result_data.nutrition_analysis" :key="item.nutrient_type">
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12" :bold="true">{{ item.nutrient_type }}</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12">{{ item.intake_amount }}</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Flexbox align="center">
								<Typography fontSize="12">{{ item.intake_percentage }}</Typography>
								<Icon src="icon_rise.png" size="16" v-if="isGreaterThan100(item.intake_percentage) > 0"></Icon>
								<Icon src="icon_fall.png" size="16" v-else-if="isGreaterThan100(item.intake_percentage) < 0"></Icon>
							</Flexbox>
						</Flexbox>
						<Flexbox className="table-col">
							<Typography fontSize="12" color="gray1">{{ item.long_term_effect }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import * as echarts from '@/utils/echarts.min';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			from: '',
			userId: '',
			appId: '',
			memberId: '',
			recordId: '',
			report: null,
			option: {
				color: ['#54B0AA', '#4EF08C', '#FF8B39'],
				legend: {
					orient: 'vertical',
					top: 'middle',
					icon: 'circle',
					left: 152,
					itemWidth: 8,
					itemHeight: 8,
					itemGap: 8,
					padding: 0,
					textStyle: {
						lineHeight: 17,
						padding: [0, 0, 0, 3]
					}
				},
				series: [
					{
						name: 'Access From',
						type: 'pie',
						left: 24,
						top: 24,
						radius: [36, 52],
						startAngle: 270,
						avoidLabelOverlap: false,
						width: 88,
						height: 88,
						label: {
							show: false,
							position: 'center'
						},
						labelLine: {
							show: false
						},
						data: [
							{ value: '', name: '碳水化合物' },
							{ value: '', name: '蛋白质' },
							{ value: '', name: '脂肪' }
						]
					}
				]
			}
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
	// 		title: '膳食调查报告',
	// 		path: `/pagesA/report/diet?from=${this.from}&appId=${this.appId}&memberId=${this.memberId}&recordId=${this.recordId}&userId=${this.userId || this.userInfo.member_id}`
	// 	};
	// },
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		getRecordDetail() {
			request({
				url: '/api/v2/take-a-test/record-detail',
				method: 'POST',
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
						this.initChart(res.result_data.energy_ratio);
					}
				}
			});
		},
		isGreaterThan100(value) {
			const num = parseFloat(value.replace('%', ''));
			if (num > 100) {
				return 1;
			} else if (num === 100) {
				return 0;
			} else {
				return -1;
			}
		},
		initChart(data) {
			this.$nextTick(() => {
				this.$refs.chart.init(echarts, (chart) => {
					this.option.series[0].data[0].value = data.carbohydrates;
					this.option.series[0].data[1].value = data.proteins;
					this.option.series[0].data[2].value = data.fats;
					this.option.legend.formatter = (name) => {
						var dataItem = this.option.series[0].data.find((item) => {
							return item.name === name;
						});
						if (dataItem) {
							var total = this.option.series[0].data.reduce((sum, item) => {
								return sum + item.value;
							}, 0);
							var percent = total ? (dataItem.value / total) * 100 : 0;
							if (percent % 1 === 0) {
								return name + ' ' + percent + '%';
							} else {
								return name + ' ' + percent.toFixed(2) + '%';
							}
						}
						return name;
					};
					chart.setOption(this.option);
				});
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
						this.initChart(res.result_data.energy_ratio);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.report-diet-page {
	padding: 34rpx 32rpx 96rpx 32rpx;

	.gl-container {
		padding: 34rpx 32rpx;
		border-radius: 8rpx;
		background-color: $uni-bg-color-2;
	}

	.chart-container {
		width: 100%;
		height: 272rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		overflow: hidden;
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
			width: 166rpx;
			border-left: 2rpx solid $uni-border-color;
		}

		&:nth-child(2),
		&:nth-child(3) {
			width: 128rpx;
		}
		&:nth-child(4) {
			width: 264rpx;
		}
	}

	.nutrition-table .table-row {
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
}
</style>
