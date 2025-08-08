<template>
	<view class="scheme-nutrition-page">
		<Navbar title="营养分析"></Navbar>
		<Flexbox align="justify" className="gl-container">
			<Flexbox direction="column" gap="4">
				<Typography color="gray1">早餐GL</Typography>
				<Typography fontSize="16" :bold="true">{{ nutritionData.meal_gl_values.breakfast_gl }}</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="4">
				<Typography color="gray1">午餐GL</Typography>
				<Typography fontSize="16" :bold="true">{{ nutritionData.meal_gl_values.lunch_gl }}</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="4">
				<Typography color="gray1">晚餐GL</Typography>
				<Typography fontSize="16" :bold="true">{{ nutritionData.meal_gl_values.dinner_gl }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="12" className="analysis-container">
			<Typography fontSize="16" :bold="true">供能比分析</Typography>
			<Flexbox direction="column">
				<view class="chart-content">
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
							<Typography fontSize="12">{{ nutritionData.nutrient_intakes.carbohydrates.amount }}g</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12">{{ nutritionData.nutrient_intakes.carbohydrates.energy }}卡</Typography>
						</Flexbox>
						<Flexbox className="table-col">
							<Flexbox direction="column" gap="4" className="full-width">
								<Flexbox align="justify" v-for="item in nutritionData.nutrient_intakes.carbohydrates.breakdown" :key="item.name">
									<Typography fontSize="12" color="gray1">{{ item.name }}</Typography>
									<Typography fontSize="12" color="gray1">{{ item.value }}{{ item.unit }}</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
					<Flexbox className="table-row">
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12" :bold="true">脂肪</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12">{{ nutritionData.nutrient_intakes.fats.amount }}g</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12">{{ nutritionData.nutrient_intakes.fats.energy }}卡</Typography>
						</Flexbox>
						<Flexbox className="table-col">
							<Flexbox direction="column" gap="4" className="full-width">
								<Flexbox align="justify" v-for="item in nutritionData.nutrient_intakes.fats.breakdown" :key="item.name">
									<Typography fontSize="12" color="gray1">{{ item.name }}</Typography>
									<Typography fontSize="12" color="gray1">{{ item.value }}{{ item.unit }}</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
					<Flexbox className="table-row">
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12" :bold="true">蛋白质</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12">{{ nutritionData.nutrient_intakes.proteins.amount }}g</Typography>
						</Flexbox>
						<Flexbox align="left" className="table-col">
							<Typography fontSize="12">{{ nutritionData.nutrient_intakes.proteins.energy }}卡</Typography>
						</Flexbox>
						<Flexbox className="table-col">
							<Flexbox direction="column" gap="4" className="full-width">
								<Flexbox align="justify" v-for="item in nutritionData.nutrient_intakes.proteins.breakdown" :key="item.name">
									<Typography fontSize="12" color="gray1">{{ item.name }}</Typography>
									<Typography fontSize="12" color="gray1">{{ item.value }}{{ item.unit }}</Typography>
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
				<Flexbox className="table-row" v-for="item in nutritionData.nutrition_analysis" :key="item.nutrient_type">
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
	</view>
</template>

<script>
import { mapState } from 'vuex';
import * as echarts from '@/utils/echarts.min';
export default {
	data() {
		return {
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
	onLoad() {
		this.initChart(this.nutritionData.energy_ratio);
	},
	computed: {
		...mapState(['nutritionData'])
	},
	methods: {
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
		}
	}
};
</script>

<style lang="scss">
.scheme-nutrition-page {
	min-height: 100vh;
	padding: 20rpx 32rpx 138rpx 32rpx;
	.gl-container {
		padding: 34rpx 32rpx;
		border-radius: 8rpx;
		background-color: $uni-bg-color-2;
	}

	.analysis-container {
		margin: 40rpx 0 58rpx 0;
	}

	.chart-content {
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
