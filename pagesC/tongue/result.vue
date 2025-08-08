<template>
	<view class="tongue-result-page">
		<Navbar title="察颜观舌"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox align="justify" gap="12">
				<image :src="image" mode="aspectFit" v-for="(image, index) in tongueInfo.images" :key="image" class="tongue-image" @tap="onPreview(index)"></image>
			</Flexbox>
			<Typography color="gray1" v-if="tongueInfo.description">{{ tongueInfo.description }}</Typography>
		</Flexbox>
		<Flexbox className="tips-content">
			<Typography fontSize="12" color="#000">提示：我们的面诊，舌诊旨在分析您的亚健康状态，非疾病诊断级别，以治未病的理念指导您的营养搭配与食疗方</Typography>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="result-content">
			<Typography fontSize="22" :bold="true">判断结果</Typography>
			<Flexbox direction="column" gap="8">
				<view class="result-item">
					<Typography fontSize="16" :bold="true">核心病机：</Typography>
					<Typography fontSize="16">{{ tongueInfo.constitution_type }}</Typography>
				</view>
				<view class="result-item">
					<Typography fontSize="16" :bold="true">脏腑定位：</Typography>
					<Typography fontSize="16">{{ tongueInfo.organ_location }}</Typography>
				</view>
				<view class="result-item">
					<Typography fontSize="16" :bold="true">证候要点：</Typography>
					<Typography fontSize="16">{{ tongueInfo.symptom_analysis }}</Typography>
				</view>
			</Flexbox>
			<Typography fontSize="16" color="gray2">可能已有如下情况出现：</Typography>
			<Flexbox align="left" gap="12" v-for="(item, index) in tongueInfo.constitution_features" :key="item" @tap="selectFeature(item)">
				<!-- <Icon src="checkbox-active.png" size="20" className="checkbox" v-if="features.includes(item)"></Icon>
				<Icon src="checkbox.png" size="20" className="checkbox" v-else></Icon> -->
				<Typography fontSize="16">{{ index + 1 }}. {{ item }}</Typography>
			</Flexbox>
		</Flexbox>
		<!-- <Flexbox align="center" gap="9" className="btn-group" v-if="!from">
			<Flexbox align="center" className="vertify-btn" @tap="onVertify">
				<Typography fontSize="16" color="white" :bold="true">进一步验证</Typography>
			</Flexbox>
			<Flexbox align="center" className="restart-btn" @tap="onAnalysis">
				<Typography fontSize="16" color="primary" :bold="true">重新分析</Typography>
			</Flexbox>
		</Flexbox> -->
		<!-- <Flexbox direction="column" gap="16" className="result-content" v-if="loading || loaded">
			<Typography fontSize="16" color="gray2" v-if="features.length">{{ features.join('、') }}：</Typography>
			<Typography fontSize="22" :bold="true" v-if="loading">验证分析中...</Typography>
			<block v-if="loaded">
				<Typography fontSize="22" :bold="true">病机及习惯分析</Typography>
				<Flexbox align="justify" direction="column" gap="4" className="description-item" v-for="(item, index) in etiologicalFactors" :key="index">
					<Typography fontSize="16">{{ index + 1 }}. {{ item }}</Typography>
					<Icon
						src="checkbox-active.png"
						size="20"
						fontSize="12"
						label="说对了"
						color="primary"
						gap="2"
						className="checkbox"
						v-if="confirmEtiologicalFactors.includes(item)"
						@tap="selectFactors(item)"
					></Icon>
					<Icon
						src="checkbox.png"
						size="20"
						align="center"
						label="说对了"
						fontSize="12"
						color="gray2"
						gap="2"
						className="checkbox"
						v-else
						@tap="selectFactors(item)"
					></Icon>
				</Flexbox>
			</block>
		</Flexbox>
		<Flexbox align="center" className="back-btn" v-if="confirmEtiologicalFactors.length && !from" @tap="onFinished">
			<Typography fontSize="16" color="primary" :bold="true">返回聊天页</Typography>
		</Flexbox> -->
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
			isNone: false,
			loaded: false,
			loading: false,
			analysisId: '',
			features: [],
			etiologicalFactors: [],
			confirmEtiologicalFactors: []
		};
	},
	onLoad(options) {
		if (options.from) {
			this.from = options.from;
			this.loaded = true;
			this.features = this.tongueInfo.confirm_constitution_features;
			this.etiologicalFactors = this.tongueInfo.etiologicalFactors;
			this.confirmEtiologicalFactors = this.tongueInfo.confirmEtiologicalFactors;
		}
	},
	computed: {
		...mapState(['tongueInfo', 'userInfo'])
	},
	methods: {
		...mapMutations(['setAiDocterResult']),
		onPreview(current) {
			uni.previewImage({
				urls: this.tongueInfo.images,
				current
			});
		},
		onFinished() {
			request({
				url: '/ai_docter/api/confirm-constituion',
				method: 'POST',
				data: {
					analysis_id: this.analysisId,
					confirm_etiological_factors: this.confirmEtiologicalFactors
				},
				isRobot: true,
				success: (res) => {
					uni.navigateBack();
				}
			});
		},
		onVertify() {
			if (!this.features.length) {
				uni.showToast({
					title: '请选择您的问题',
					icon: 'none'
				});
				return;
			}
			this.loading = true;
			this.loaded = false;
			this.$nextTick(() => {
				uni.pageScrollTo({
					scrollTop: 9999,
					duration: 300
				});
			});
			request({
				url: '/ai_docter/api/constitution-analysis',
				method: 'POST',
				data: {
					constitution_features: this.features,
					constitution_type: this.tongueInfo.constitution_type,
					diagnosis_id: this.tongueInfo.diagnosis_id,
					member_id: this.tongueInfo.member_id,
					user_id: this.userInfo.member_id.toString(),
					organ_location: this.tongueInfo.organ_location
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.loaded = true;
						this.etiologicalFactors = res.etiological_factors;
						this.analysisId = res.id;
						this.setAiDocterResult({ constitution_type: res.constitution_type, constitution_features: res.constitution_features });
					}
				},
				complete: () => {
					this.loading = false;
				}
			});
		},
		onAnalysis() {
			uni.showLoading({
				title: '重新分析...',
				mask: true
			});
			request({
				url: '/ai_docter/api/tongue-diagnosis',
				method: 'POST',
				data: {
					description: this.tongueInfo.description,
					images: this.tongueInfo.images,
					original_constitution: this.tongueInfo.constitution_type,
					user_id: this.userInfo.member_id.toString()
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.isNone = false;
						const { image_analysis, constitution_type, constitution_features, organ_location, symptom_analysis } = res;
						this.$store.commit('setTongueInfo', {
							images: this.tongueInfo.images,
							description: this.description,
							image_analysis,
							constitution_type,
							constitution_features,
							organ_location,
							symptom_analysis
						});
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		selectFactors(factor) {
			if (this.from) {
				uni.showToast({
					title: '当前不支持修改',
					icon: 'none'
				});
				return;
			}
			const index = this.confirmEtiologicalFactors.indexOf(factor);
			if (index > -1) {
				this.confirmEtiologicalFactors.splice(index, 1);
			} else {
				this.confirmEtiologicalFactors.push(factor);
			}
		},
		selectFeature(feature) {
			if (this.from) {
				uni.showToast({
					title: '当前不支持修改',
					icon: 'none'
				});
				return;
			}
			this.loaded = false;
			if (!feature) {
				this.isNone = !this.isNone;
				this.features = [];
				this.onAnalysis();
				return;
			}
			const index = this.features.indexOf(feature);
			if (index > -1) {
				this.features.splice(index, 1);
			} else {
				this.features.push(feature);
			}
		}
	}
};
</script>

<style lang="scss">
.tongue-result-page {
	min-height: 100vh;
	padding: 32rpx 32rpx 128rpx 32rpx;
	background-color: #fff;

	.tongue-image {
		width: 212rpx;
		height: 212rpx;
		border-radius: 16rpx;
	}

	.tips-content {
		margin: 42rpx 0 28rpx 0;
		padding: 22rpx 24rpx;
		border-radius: 16rpx;
		background-color: $uni-color-accent2;
	}

	.result-content {
		margin-bottom: 32rpx;
		padding: 32rpx 24rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
	}

	.result-item .text {
		display: inline;
	}

	.checkbox {
		flex: none;
	}

	.description-item {
		min-height: 136rpx;
	}

	.description-item .checkbox {
		margin-left: auto;
	}

	.btn-group {
		margin-top: 44rpx;
		margin-bottom: 32rpx;
	}

	.vertify-btn,
	.restart-btn {
		width: 240rpx;
		height: 72rpx;
		border-radius: 80rpx;
		background-color: $uni-color-primary;
	}

	.restart-btn {
		background: none;
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}

	.back-btn {
		width: 240rpx;
		height: 72rpx;
		border-radius: 80rpx;
		margin: 0 auto;
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}
}
</style>
