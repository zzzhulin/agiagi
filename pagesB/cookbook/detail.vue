<template>
	<view class="cookbook-detail">
		<Navbar title="食谱详情"></Navbar>
		<!-- 顶部家庭成员选择区域，始终显示 -->
		<Flexbox direction="column" gap="20" v-if="family.length">
			<Flexbox align="justify">
				<!-- <Icon :src="member.avatar" size="36" type="remote" :circle="true" /> -->
				<Flexbox align="left" gap="12" class="family-list">
					<Flexbox
						align="center"
						:class="['family-item', { active: item.member_id === memberId }]"
						v-for="item in family"
						:key="item.member_id"
						@tap="selectMember(item)"
					>
						<Icon :src="item.member_avatar" :size="item.member_id === memberId ? 36 : 32" type="remote" :circle="true" align="center" />
					</Flexbox>
				</Flexbox>
				<Typography color="primary" @tap="redirectTo">TA的历史食谱</Typography>
			</Flexbox>
			
			<!-- 营养分析按钮，靠右对齐 -->
			<Flexbox align="right" gap="2" @tap="onAnalysis" v-if="!isGenerating && recipe_content.length">
				<Icon src="b_leaf.png" size="20"></Icon>
				<Typography color="gray1">营养分析</Typography>
			</Flexbox>
			
			<!-- 食谱生成中状态 -->
			<view class="generating-content" v-if="isGenerating">
				<view class="generating-card">
					<Typography color="primary" fontSize="16" :bold="true">AI正在为你备餐</Typography>
					<Typography color="gray1" fontSize="14">预计用时2~5分钟，请稍后刷新本页面...</Typography>
					<view class="refresh-btn" @tap="refreshRecipe">
						<Typography color="primary" fontSize="16">刷新</Typography>
					</view>
				</view>
			</view>
			
			<Flexbox direction="column" gap="16" v-for="(day, index) in recipe_content" :key="index" v-if="!isGenerating">
				<Flexbox direction="column" gap="12">
					<Typography fontSize="16" :bold="true">第{{ index + 1 }}天</Typography>
					<view class="table">
						<view class="tr" v-for="row in rows" :key="row">
							<view class="td">
								<Typography color="gray2">{{ rowsMap[row] }}</Typography>
							</view>
							<view class="td">
								<Typography class="meal-text">{{ mergedQuantities(day[row] || []).join('\n') }}</Typography>
							</view>
						</view>
					</view>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		
		<Flexbox align="center" direction="column" gap="8" class="empty-content" v-if="loaded && !family.length && !isGenerating">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无食谱</Typography>
		</Flexbox>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			loaded: false,
			memberId: '',
			userId: '',
			family: [],
			recipe_content: [],
			isGenerating: false, // 是否正在生成食谱
			rows: ['breakfast', 'lunch', 'snack', 'dinner', 'morning'],
			rowsMap: {
				breakfast: '早餐',
				lunch: '午餐',
				snack: '加餐',
				dinner: '晚餐',
				morning: '药食同源'
			}
		};
	},
	onLoad(option) {
		this.memberId = parseInt(option.memberId);
		this.userId = option.userId;
		this.recipeId = option.recipeId;
		this.getCookbooks();
	},
	// onShareAppMessage() {
	// 	return {
	// 		title: '食谱详情',
	// 		path: `/pagesB/cookbook/detail?recipeId=${this.recipeId}&memberId=${this.memberId}&userId=${this.userId || this.userInfo.member_id}`
	// 	};
	// },
	computed: {
		...mapState(['member', 'userInfo'])
	},
	methods: {
		...mapMutations(['setNutritionData']),
		onAnalysis() {
			uni.showLoading({
				title: '正在分析...'
			});
			request({
				url: '/api/v2/diet-scheme/analyze_recipe_nutrition',
				method: 'POST',
				data: {
					member_id: this.memberId,
					recipe_data: this.recipe_content
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.setNutritionData(res);
						this.navigateTo('/pagesB/cookbook/nutrition');
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
		redirectTo() {
			uni.redirectTo({
				url: `/pagesB/cookbook/history?memberId=${this.memberId}`
			});
		},
		mergedQuantities(meal) {
			return [].concat(...meal.map((dish) => dish.name + '(' + dish.quantity + ')'));
		},
		selectMember(member) {
			this.loaded = false;
			this.recipe_content = [];
			this.recipeId = member.recipe_id;
			this.memberId = member.member_id;
			
			// 检查选中成员的recipe_id是否为null
			if (member.recipe_id === null) {
				this.isGenerating = true;
			} else {
				this.isGenerating = false;
				this.getCookbook();
			}
		},
		getCookbooks() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			request({
				url: '/api/v2/diet-scheme/get_all_members_latest_recipes',
				data: {
					user_id: this.userId || this.userInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.family = res;
						const member = res.find((item) => item.member_id === this.member.member_id);
						if (member) {
							this.memberId = this.memberId || member.member_id;
							this.recipeId = member.recipe_id; // 强制更新为最新值
						} else {
							if (res.length) {
								this.memberId = this.memberId || res[0].member_id;
								this.recipeId = res[0].recipe_id; // 强制更新为最新值
							}
						}
						
						// 检查当前选中成员的recipe_id状态
						if (this.recipeId === null) {
							this.isGenerating = true;
						} else {
							this.isGenerating = false;
							this.getCookbook();
						}
					}
				},
				complete: () => {
					this.loaded = true;
					uni.hideLoading();
				}
			});
		},
		getCookbook() {
			if (!this.memberId || !this.recipeId || this.recipeId === null) {
				return;
			}
			request({
				url: '/api/v2/diet-scheme/get-user-recipe',
				method: 'POST',
				data: {
					user_id: this.userId || this.userInfo.member_id,
					member_id: this.memberId,
					recipe_id: this.recipeId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.recipe_content = res.recipe_content;
					}
				}
			});
		},
		// 刷新食谱
		refreshRecipe() {
			this.loaded = false;
			// 不要立即设置isGenerating = false，让getCookbooks根据返回的数据决定
			this.recipe_content = [];
			this.getCookbooks();
		}
	}
};
</script>

<style lang="scss">
.cookbook-detail {
	position: relative;
	padding: 32rpx 30rpx 206rpx 32rpx;

	.family-list {
		position: relative;
	}

	.family-item.active {
		width: 88rpx;
		height: 88rpx;
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
		border-radius: 50%;
		background-color: #ffffff;
	}


	.table {
		border: 2rpx solid $uni-border-color;
		border-radius: 8rpx;
		
		.tr {
			display: flex;
			border-bottom: 2rpx solid $uni-border-color;
			&:last-child {
				border-bottom: none;
			}
		}
		
		.td {
			display: flex;
			align-items: center;
			padding: 16rpx 24rpx;
			border-left: 2rpx solid $uni-border-color;
			
			&:first-child {
				width: 162rpx;
				justify-content: center;
				border-left: none;
			}
			
			&:last-child {
				flex: 1;
				align-items: flex-start;
			}
		}

		.meal-text {
			white-space: break-spaces;
			line-height: 44rpx;
		}
	}
	.empty-content {
		margin-top: 200rpx;
	}
	
	.generating-content {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 100rpx;
	}
	
	.generating-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32rpx;
		width: 600rpx;
		padding: 40rpx;
		border-radius: 16rpx;
		border: 2rpx solid $uni-color-primary;
		background-color: #fff;
		text-align: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}
	
	.refresh-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 80rpx;
		margin-top: 16rpx;
		border-radius: 40rpx;
		border: 2rpx solid $uni-color-primary;
		background-color: #fff;
		cursor: pointer;
		
		&:active {
			background-color: #f5f5f5;
		}
	}
}
</style>
