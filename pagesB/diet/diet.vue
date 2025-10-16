<template>
	<view class="diet-page">
		<Navbar :fixed="false" :backgroundColor="navbarBgColor"></Navbar>
		<Icon src="plan_diet-background.png" width="375" height="281" mode="widthFix" className="background"></Icon>
		<Flexbox align="left" gap="12" className="family-list">
			<Flexbox align="center" :className="['family-item', { active: item.member_id === memberId }]" v-for="item in family" :key="item.member_id" @tap="selectMember(item)">
				<Icon :src="item.avatar" :size="item.member_id === memberId ? 36 : 32" type="remote" :circle="true" align="center" />
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="24" className="diet-container">
			<Flexbox direction="column" gap="24">
				<Flexbox direction="column" gap="8">
					<Flexbox align="justify">
						<Flexbox>
							<Typography color="gray2">年龄：</Typography>
							<Typography>{{ memberInfo.age }}岁</Typography>
						</Flexbox>
						<view class="line"></view>
						<Flexbox>
							<Typography color="gray2">身高：</Typography>
							<Typography v-if="memberInfo.height">{{ memberInfo.height }}cm</Typography>
							<Typography v-else>无</Typography>
						</Flexbox>
						<view class="line"></view>
						<Flexbox>
							<Typography color="gray2">体重：</Typography>
							<Typography v-if="memberInfo.weight">{{ memberInfo.weight }}kg</Typography>
							<Typography v-else>无</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox>
						<Typography color="gray2">工作属性：</Typography>
						<Typography>{{ memberInfo.activity_level || '无' }}</Typography>
					</Flexbox>
				</Flexbox>
				<block v-if="scheme">
					<Flexbox direction="column" gap="8" className="scheme-point-content">
						<Typography fontSize="18" :bold="true">方案定制要点</Typography>
						<Typography color="gray1">{{ scheme.diet_scheme_customized || '无' }}</Typography>
					</Flexbox>
					<Flexbox direction="column" gap="20">
						<Flexbox direction="column" gap="12">
							<Flexbox align="justify">
								<Flexbox align="center" className="recommend-title">
									<Typography color="white" :bold="true">推荐方案</Typography>
								</Flexbox>
								<Flexbox align="left" @tap="navigateTo(`/pagesB/diet/scheme?memberId=${memberId}`)">
									<Typography color="primary" :bold="true">更换方案</Typography>
									<Icon src="icon_transfer.png" size="20"></Icon>
								</Flexbox>
							</Flexbox>
							<Typography fontSize="24" color="primary" :bold="true" className="scheme-name">{{ scheme.scheme_name }}</Typography>
						</Flexbox>
						<Flexbox direction="column" gap="16" className="cookbook-content">
							<Typography fontSize="18" :bold="true">方案食谱模型</Typography>
							<Flexbox direction="column" gap="12">
								<Flexbox direction="column" gap="8">
									<Typography fontSize="16" color="primary" :bold="true">早餐</Typography>
									<Flexbox className="food-list">
										<Flexbox align="center" className="food-item" v-for="food in scheme.diet_schemes.morning.food" :key="food.name">
											<Typography color="primary">{{ food.name + food.quantity }}</Typography>
										</Flexbox>
										<Flexbox align="center" className="food-item" v-for="food in scheme.diet_schemes.breakfast.food" :key="food.name">
											<Typography color="primary">{{ food.name + food.quantity }}</Typography>
										</Flexbox>
									</Flexbox>
								</Flexbox>
								<Flexbox direction="column" gap="8">
									<Typography fontSize="16" color="primary" :bold="true">午餐</Typography>
									<Flexbox className="food-list">
										<Flexbox align="center" className="food-item" v-for="food in scheme.diet_schemes.lunch.food" :key="food.name">
											<Typography color="primary">{{ food.name + food.quantity }}</Typography>
										</Flexbox>
									</Flexbox>
								</Flexbox>
								<Flexbox direction="column" gap="8">
									<Typography fontSize="16" color="primary" :bold="true">下午茶</Typography>
									<Flexbox className="food-list">
										<Flexbox align="center" className="food-item" v-for="food in scheme.diet_schemes.snack.food" :key="food.name">
											<Typography color="primary">{{ food.name + food.quantity }}</Typography>
										</Flexbox>
									</Flexbox>
								</Flexbox>
								<Flexbox direction="column" gap="8">
									<Typography fontSize="16" color="primary" :bold="true">晚餐</Typography>
									<Flexbox className="food-list">
										<Flexbox align="center" className="food-item" v-for="food in scheme.diet_schemes.dinner.food" :key="food.name">
											<Typography color="primary">{{ food.name + food.quantity }}</Typography>
										</Flexbox>
									</Flexbox>
								</Flexbox>
							</Flexbox>
							<Flexbox direction="column">
								<Typography color="gray1">本方案适应人群：{{ scheme.suitable_population }}。</Typography>
								<Typography color="gray1">本方案{{ scheme.advantages }}；{{ scheme.drawbacks }}。</Typography>
							</Flexbox>
						</Flexbox>
						<Flexbox direction="column" gap="16">
							<Typography fontSize="18" :bold="true">方案食谱解析</Typography>
							<view class="chart-content">
								<Flexbox direction="column" gap="16" className="pie-legend" v-if="pieResult && chartIndex === 1">
									<Flexbox align="baseline" gap="5">
										<view class="dot primary-dot"></view>
										<Flexbox direction="column" gap="4">
											<Typography fontSize="12" :bold="true">
												碳水
												{{
													pieResult.percentage['碳水化合物'] % 1 === 0
														? pieResult.percentage['碳水化合物']
														: pieResult.percentage['碳水化合物'].toFixed(2)
												}}%
											</Typography>
											<Typography fontSize="12" color="gray1">{{ pieResult.weight['碳水化合物'] }}g / {{ pieResult.energy['碳水化合物'] }}kcal</Typography>
										</Flexbox>
									</Flexbox>
									<Flexbox align="baseline" gap="5">
										<view class="dot accent-dot"></view>
										<Flexbox direction="column" gap="4">
											<Typography fontSize="12" :bold="true">
												蛋白质
												{{ pieResult.percentage['蛋白质'] % 1 === 0 ? pieResult.percentage['蛋白质'] : pieResult.percentage['蛋白质'].toFixed(2) }}%
											</Typography>
											<Typography fontSize="12" color="gray1">{{ pieResult.weight['蛋白质'] }}g / {{ pieResult.energy['蛋白质'] }}kcal</Typography>
										</Flexbox>
									</Flexbox>
									<Flexbox align="baseline" gap="5">
										<view class="dot warning-dot"></view>
										<Flexbox direction="column" gap="4">
											<Typography fontSize="12" :bold="true">
												脂肪
												{{ pieResult.percentage['脂肪'] % 1 === 0 ? pieResult.percentage['脂肪'] : pieResult.percentage['脂肪'].toFixed(2) }}%
											</Typography>
											<Typography fontSize="12" color="gray1">{{ pieResult.weight['脂肪'] }}g / {{ pieResult.energy['脂肪'] }}kcal</Typography>
										</Flexbox>
									</Flexbox>
								</Flexbox>
								<Flexbox align="center" gap="16" className="chart-tab">
									<Typography :color="chartIndex === 0 ? 'primary' : 'gray2'" :bold="chartIndex === 0" @tap="selectChart(0)">NRV分析</Typography>
									<Typography :color="chartIndex === 1 ? 'primary' : 'gray2'" :bold="chartIndex === 1" @tap="selectChart(1)">供能比分析</Typography>
								</Flexbox>
								<l-echart ref="chart"></l-echart>
								<Typography fontSize="12" color="primary" className="chart-title">* 选用中国人膳食推荐标准 *</Typography>
							</view>
							<Typography color="gray1">{{ recipeSummary }}</Typography>
						</Flexbox>
					</Flexbox>
				</block>
				<Flexbox align="center" direction="column" className="empty-content" v-if="loaded && !scheme">
					<Icon src="empty-scheme.png" size="128"></Icon>
					<Flexbox align="center" direction="column" gap="12">
						<Typography color="gray2">当前还没有制定专属方案</Typography>
						<Flexbox align="center" className="scheme-btn" @tap="navigateTo(`/pagesB/diet/scheme?memberId=${memberId}`)">
							<Typography fontSize="16" color="white" :bold="true">制定方案</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="12" className="advice-container" v-if="scheme">
			<Typography fontSize="22" color="#000000" :bold="true">关于饮食的建议</Typography>
			<Flexbox direction="column" gap="12" className="advice-content">
				<Typography fontSize="18" :bold="true">食物选择优化</Typography>
				<view class="advice-item" v-for="(advice, index) in scheme.food_selection_advice" :key="index">
					<Typography color="primary" :bold="true">{{ advice.title }}：</Typography>
					<Typography color="gray1">{{ advice.description }}</Typography>
				</view>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="advice-content" v-for="advice in advices" :key="advice.id">
				<Typography fontSize="18" :bold="true">{{ advice.disease_type }}</Typography>
				<Typography color="gray1" v-for="(text, index) in advice.advice_content" :key="index">{{ index + 1 }}、{{ text }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="cookbook-btn" @tap="navigateTo('/pagesB/cookbook/detail')" v-if="scheme">
			<Typography fontSize="18" color="white" :bold="true">查看食谱</Typography>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import * as echarts from '@/utils/echarts.min';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			navbarBgColor: 'transparent',
			chartIndex: 0,
			memberId: '',
			recipeSummary: '',
			family: [],
			advices: [],
			memberInfo: null,
			scheme: null,
			pieResult: null,
			loaded: false,
			radarOption: {
				title: {
					text: '* 选用中国人膳食推荐标准 *',
					bottom: 5,
					left: 'center',
					textStyle: {
						fontSize: 12,
						lineHeight: 17,
						fontWeight: 'normal',
						color: '#30A375',
						opacity: 0.8
					}
				},
				legend: {
					show: false,
					top: 16,
					padding: 0,
					type: 'scroll',
					icon: 'none',
					left: 15,
					itemGap: 12,
					itemWidth: 0,
					itemHeight: 0,
					data: ['NRV分析', '供能比分析', '膳食结构分析', '食疗方案分析'],
					textStyle: {
						color: '#88888A',
						fontSize: 14,
						rich: {
							selected: {
								color: '#30A375',
								fontWeight: '600',
								fontSize: 14
							},
							normal: {
								color: '#88888A',
								fontSize: 14
							}
						}
					},
					selectedMode: 'single'
				},
				radar: {
					center: [160, 174],
					radius: 94,
					nameGap: 6,
					indicator: [
						{ name: '碳水', max: 100 },
						{ name: '蛋白质', max: 100 },
						{ name: '脂肪', max: 100 },
						{ name: '矿物质', max: 100 },
						{ name: '维生素', max: 100 },
						{ name: '膳食纤维', max: 100 },
						{ name: '水', max: 100 },
						{ name: '植物营养因', max: 100 }
					],
					shape: 'polygon',
					splitNumber: 5,
					axisName: {
						color: '#555557'
					},
					splitLine: {
						lineStyle: {
							type: 'dashed',
							color: [
								'rgba(238, 197, 102, 0)',
								'rgba(48, 163, 117,1)',
								'rgba(238, 197, 102, 0)',
								'rgba(238, 197, 102, 0)',
								'rgba(238, 197, 102, 0)',
								'rgba(238, 197, 102, 0)'
							].reverse()
						}
					},
					splitArea: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(224, 230, 241, 1)'
						}
					}
				},
				series: [
					{
						name: 'NRV分析',
						type: 'radar',
						lineStyle: {
							opacity: 0
						},
						data: [],
						symbol: 'none',
						itemStyle: {
							color: '#4EF08C'
						},
						areaStyle: {
							opacity: 0.7
						}
					}
				]
			},
			pieOption: {
				color: ['#1D9E91', '#4EF08C', '#FF8B39'],
				legend: {
					show: false,
					orient: 'vertical',
					top: 'middle',
					icon: 'circle',
					left: 180,
					itemWidth: 8,
					itemHeight: 8,
					itemGap: 16,
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
						left: 28,
						top: 115,
						radius: [52, 68],
						startAngle: 270,
						avoidLabelOverlap: false,
						width: 120,
						height: 120,
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
	onShow() {
		this.memberId = this.member.member_id;
		this.getFamily();
	},
	onPageScroll(e) {
		if (e.scrollTop >= 50) {
			this.navbarBgColor = '#ffffff';
		} else {
			this.navbarBgColor = 'transparent';
		}
	},
	computed: {
		...mapState(['userInfo', 'member'])
	},
	methods: {
		...mapMutations(['setMember']),
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		initRadarChart(data) {
			this.$nextTick(() => {
				this.$refs.chart.init(echarts, (chart) => {
					this.radarOption.series[0].data = [[data['碳水化合物'], data['蛋白质'], data['脂肪'], data['矿物质'], data['维生素'], data['膳食纤维'], data['水']]];
					chart.setOption(this.radarOption);
				});
			});
		},
		initPieChart(data) {
			this.$nextTick(() => {
				this.$refs.chart.init(echarts, (chart) => {
					this.pieOption.series[0].data[0].value = data.percentage['碳水化合物'];
					this.pieOption.series[0].data[1].value = data.percentage['蛋白质'];
					this.pieOption.series[0].data[2].value = data.percentage['脂肪'];
					chart.setOption(this.pieOption);
				});
			});
		},
		selectChart(index) {
			this.chartIndex = index;
			if (index) {
				this.getPie();
			} else {
				this.getRadar();
			}
		},
		selectMember(member) {
			this.loaded = false;
			this.scheme = null;
			this.memberId = member.member_id;
			this.setMember(member);
			this.getMemberInitData();
			this.getScheme();
			this.getAdvice();
		},
		getPie() {
			request({
				url: '/api/v2/diet-scheme/calculate-energy-ratio',
				method: 'POST',
				data: {
					standard_diet: this.scheme.standard_diet
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.pieResult = res;
						this.initPieChart(res);
					}
				}
			});
		},
		getRadar() {
			request({
				url: '/api/v2/diet-scheme/calculate-nutrition-percentage',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId,
					standard_diet: this.scheme.standard_diet
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.recipeSummary = res.recipe_summary;
						this.initRadarChart(res);
					}
				}
			});
		},
		getScheme() {
			request({
				url: '/api/v2/diet-scheme/user-selected',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.scheme = res;
						this.getRadar();
					}
				},
				complete: () => {
					this.loaded = true;
				}
			});
		},
		getAdvice() {
			request({
				url: '/api/v2/diet-scheme/disease-diet-advice',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.advices = res;
					}
				}
			});
		},
		getMemberInitData() {
			request({
				url: '/api/v2/weight-loss-tracking/get_memeber_init_data',
				data: {
					member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.memberInfo = res;
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
					if (res && res.length > 0) {
						this.family = res;
						this.getMemberInitData();
						this.getScheme();
						this.getAdvice();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.diet-page {
	min-height: 100vh;
	padding: 0 32rpx 190rpx 32rpx;
	background-color: $uni-bg-color;

	.background {
		position: absolute;
		left: 0;
	}

	.family-list {
		position: relative;
		padding-top: 376rpx;
		padding-bottom: 16rpx;
	}

	.family-item.active {
		width: 88rpx;
		height: 88rpx;
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
		border-radius: 50%;
		background-color: #ffffff;
	}

	.diet-container {
		border-radius: 24rpx;
		padding: 32rpx 24rpx;
		background-color: #ffffff;
	}

	.line {
		width: 2rpx;
		height: 20rpx;
		background-color: $uni-text-color-gray3;
	}

	.chart-content {
		position: relative;
		width: 638rpx;
		height: 680rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
		overflow: hidden;

		.icon {
			position: absolute;
		}
	}

	.pie-legend {
		position: absolute;
		top: 204rpx;
		left: 360rpx;
		z-index: 9999;

		.dot {
			width: 16rpx;
			height: 16rpx;
			border-radius: 50%;
		}

		.primary-dot {
			background-color: $uni-color-primary;
		}

		.accent-dot {
			background-color: $uni-color-accent1;
		}

		.warning-dot {
			background-color: $uni-color-warning;
		}
	}

	.chart-tab,
	.chart-title {
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 9999;
	}

	.chart-tab {
		top: 40rpx;
	}

	.chart-title {
		bottom: 20rpx;
		text-align: center;
		opacity: 0.8;
	}

	.scheme-point-content,
	.plan-content,
	.empty-content {
		position: relative;
		padding-top: 48rpx;
	}

	.scheme-point-content:before,
	.plan-content:before,
	.empty-content:before {
		position: absolute;
		top: 0;
		content: '';
		width: 100%;
		height: 2rpx;
		background-color: $uni-text-color-gray4;
	}

	.empty-content {
		padding-bottom: 96rpx;
	}

	.recommend-title {
		width: 128rpx;
		height: 48rpx;
		background-color: $uni-text-color;
	}

	.scheme-name.text {
		line-height: 68rpx;
	}

	.cookbook-content {
		position: relative;
		padding-top: 40rpx;
		border-top: 2rpx dashed $uni-text-color-gray2;
	}

	.food-list {
		row-gap: 16rpx;
		column-gap: 16rpx;
		flex-wrap: wrap;
	}

	.food-item {
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
		background-color: $uni-color-accent2;
	}

	.advice-container {
		margin-top: 32rpx;
	}

	.advice-content {
		padding: 32rpx 24rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
	}

	.advice-item {
		line-height: 1;
		.text {
			display: inline;
		}
	}

	.scheme-btn {
		width: 200rpx;
		height: 72rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.cookbook-btn {
		position: fixed;
		left: 32rpx;
		right: 32rpx;
		bottom: 68rpx;
		width: 686rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
