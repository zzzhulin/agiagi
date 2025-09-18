<template>
	<view class="cookbook-detail">
		<Navbar title="食谱详情"></Navbar>
		<Flexbox direction="column" gap="20" v-if="family.length">
			<Flexbox align="justify">
				<!-- <Icon :src="member.avatar" size="36" type="remote" :circle="true" /> -->
				<Flexbox align="left" gap="12" className="family-list">
					<Flexbox
						align="center"
						:className="['family-item', { active: item.member_id === memberId }]"
						v-for="item in family"
						:key="item.member_id"
						@tap="selectMember(item)"
					>
						<Icon :src="item.member_avatar" :size="item.member_id === memberId ? 36 : 32" type="remote" :circle="true" align="center" />
					</Flexbox>
				</Flexbox>
				<Typography color="primary" @tap="redirectTo">TA的历史食谱</Typography>
			</Flexbox>
			<Flexbox align="center" gap="2" className="nutrition-btn" @tap="onAnalysis">
				<Icon src="b_leaf.png" size="20"></Icon>
				<Typography color="gray1">营养分析</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="16" v-for="(day, index) in recipe_content" :key="index">
				<Flexbox direction="column" gap="12">
					<Typography fontSize="16" :bold="true">第{{ index + 1 }}天</Typography>
					<Flexbox direction="column" className="table">
						<Flexbox className="tr" v-for="row in rows" :key="row">
							<Flexbox align="center" className="td">
								<Typography color="gray2">{{ rowsMap[row] }}</Typography>
							</Flexbox>
							<Flexbox align="left" className="td">
								<Typography className="meal-text">{{ mergedQuantities(day[row] || []).join('\n') }}</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" gap="8" className="empty-content" v-if="loaded && !family.length">
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
			this.getCookbook();
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
							this.recipeId = this.recipeId || member.recipe_id;
						} else {
							if (res.length) {
								this.memberId = this.memberId || res[0].member_id;
								this.recipeId = this.recipeId || res[0].recipe_id;
							}
						}
						this.getCookbook();
					}
				},
				complete: () => {
					this.loaded = true;
					uni.hideLoading();
				}
			});
		},
		getCookbook() {
			if (!this.memberId || !this.recipeId) {
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
		}
	}
};
</script>

<style lang="scss">
.cookbook-detail {
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

	.nutrition-btn {
		position: absolute;
		top: 338rpx;
		right: 32rpx;
	}

	.table {
		border: 2rpx solid $uni-border-color;
		border-radius: 8rpx;
		.tr {
			border-bottom: 2rpx solid $uni-border-color;
			&:last-child {
				border-bottom: none;
			}
		}
		.td {
			width: 526rpx;
			padding: 16rpx 24rpx;
			border-left: 2rpx solid $uni-border-color;
			&:first-child {
				width: 162rpx;
				border-left: none;
			}
		}

		.meal-text.text {
			white-space: break-spaces;
			line-height: 44rpx;
		}
	}
	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
