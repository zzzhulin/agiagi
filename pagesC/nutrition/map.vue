<template>
	<view class="nutrition-map-page">
		<Navbar title="本命营养地图" backgroundColor="#ffffff"></Navbar>
		<Flexbox align="justify" className="user-container">
			<Flexbox direction="column" gap="4">
				<Typography fontSize="22" :bold="true">{{ member.member_name }}</Typography>
				<Flexbox align="left" gap="24">
					<Typography fontSize="12" color="gray2">信息更新时间：{{ updatedTime }}</Typography>
					<picker :value="index" :range="family" range-key="member_name" @change="selectMember">
						<Flexbox align="left">
							<Typography fontSize="12" color="primary">切换对象</Typography>
							<Icon src="icon_transfer.png" size="16"></Icon>
						</Flexbox>
					</picker>
				</Flexbox>
			</Flexbox>
			<Icon :src="member.avatar" size="44" type="remote" :circle="true"></Icon>
		</Flexbox>
		<Flexbox direction="column" gap="23">
			<Flexbox gap="9">
				<Flexbox
					align="center"
					:className="['organ-item', { active: currentRecord.id === record.id }]"
					v-for="record in records"
					:key="record.id"
					@tap="currentRecord = record"
				>
					<Typography fontSize="22" color="primary" :bold="true" v-if="currentRecord.id === record.id">{{ record.organ_type }}</Typography>
					<Typography fontSize="18" v-else>{{ record.organ_type }}</Typography>
				</Flexbox>
				<Flexbox align="center" className="organ-item" @tap="openPopup('popup')">
					<Icon src="icon_add.png" size="24"></Icon>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="24" className="record-container" v-if="currentRecord">
				<!-- 描述部分 -->
				<Flexbox direction="column" gap="16" className="description-content">
					<Typography fontSize="16">{{ currentRecord.description }}</Typography>
					<Flexbox align="left" gap="4" @tap="onEdit">
						<Icon src="icon_edit-gray.png" size="20"></Icon>
						<Typography color="gray2">修改描述</Typography>
					</Flexbox>
				</Flexbox>
				<!-- 有益食物确认列表 -->
				<Flexbox direction="column" gap="16">
					<Flexbox>
						<Typography fontSize="18" :bold="true">实践证明</Typography>
						<Typography fontSize="18" color="primary" :bold="true">对我有益</Typography>
						<Typography fontSize="18" :bold="true">的食物</Typography>
					</Flexbox>
					<Flexbox className="food-list">
						<Flexbox
							align="center"
							className="food-item"
							v-for="(food, index) in currentRecord.curent_beneficial_foods"
							:key="index"
							@tap="updateBeneficialFood(false, food)"
						>
							<Flexbox align="center" gap="4">
								<Typography fontSize="16">{{ food }}</Typography>
								<Icon src="icon_delete-gray.png" size="16"></Icon>
							</Flexbox>
						</Flexbox>
						<Flexbox align="center" className="food-item" v-if="!currentRecord.curent_beneficial_foods.length">
							<Typography fontSize="16" color="gray2">暂无确认食物</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<!-- 不利食物确认列表 -->
				<Flexbox direction="column" gap="16">
					<Flexbox>
						<Typography fontSize="18" :bold="true">实践证明</Typography>
						<Typography fontSize="18" color="warning" :bold="true">对我不利</Typography>
						<Typography fontSize="18" :bold="true">的食物</Typography>
					</Flexbox>
					<Flexbox className="food-list">
						<Flexbox
							align="center"
							className="food-item"
							v-for="(food, index) in currentRecord.curent_adverse_foods"
							:key="index"
							@tap="updateAdverseFood(false, food)"
						>
							<Flexbox align="center" gap="4">
								<Typography fontSize="16">{{ food }}</Typography>
								<Icon src="icon_delete-gray.png" size="16"></Icon>
							</Flexbox>
						</Flexbox>
						<Flexbox align="center" className="food-item" v-if="!currentRecord.curent_adverse_foods.length">
							<Typography fontSize="16" color="gray2">暂无确认食物</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<!-- 食材探索（推荐食物展示） -->
				<Flexbox direction="column" gap="16">
					<Flexbox align="justify">
						<Typography fontSize="18" :bold="true">食材探索</Typography>
						<Flexbox @tap="redirectTo('/pagesA/survey/base?type=diet')">
							<Typography color="primary">膳食调查挖掘</Typography>
							<Icon src="icon_arrow-right-primary.png" size="20"></Icon>
						</Flexbox>
					</Flexbox>
					<Flexbox gap="7">
						<!-- 有益食物推荐 -->
						<Flexbox align="justify" direction="column" gap="39" className="benefit-food">
							<Icon src="benefit-tag.png" width="48" height="20" className="tag"></Icon>
							<Flexbox align="center" direction="column" gap="6">
								<Typography fontSize="22" :bold="true">{{ currentRecord.recommend_beneficial_foods[current].food_name }}</Typography>
								<Typography color="gray1">{{ currentRecord.recommend_beneficial_foods[current].reason }}</Typography>
							</Flexbox>
							<Flexbox align="center" direction="column" gap="8">
								<Typography fontSize="12" color="gray2">本食物对你是否有益？</Typography>
								<Flexbox gap="16">
									<Flexbox align="left" gap="2" @tap="updateBeneficialFood(true)">
										<block v-if="currentRecord.curent_beneficial_foods.includes(currentRecord.recommend_beneficial_foods[current].food_name)">
											<Icon src="checkbox-active.png" size="20"></Icon>
											<Typography fontSize="12" color="primary">有益</Typography>
										</block>
										<block v-else>
											<Icon src="checkbox-gray.png" size="20"></Icon>
											<Typography fontSize="12" color="gray1">有益</Typography>
										</block>
									</Flexbox>
									<Flexbox align="left" gap="2" @tap="updateBeneficialFood(false)">
										<block v-if="notBenefitFoods.includes(currentRecord.recommend_beneficial_foods[current].food_name)">
											<Icon src="checkbox-active.png" size="20"></Icon>
											<Typography fontSize="12" color="primary">不明显</Typography>
										</block>
										<block v-else>
											<Icon src="checkbox-gray.png" size="20"></Icon>
											<Typography fontSize="12" color="gray1">不明显</Typography>
										</block>
									</Flexbox>
								</Flexbox>
							</Flexbox>
						</Flexbox>
						<!-- 不利食物推荐 -->
						<Flexbox align="justify" direction="column" className="adverse-food">
							<Icon src="adverse-tag.png" width="48" height="20" className="tag"></Icon>
							<Flexbox align="center" direction="column" gap="6">
								<Typography fontSize="22" :bold="true">{{ currentRecord.recommend_adverse_foods[current].food_name }}</Typography>
								<Typography color="gray1">{{ currentRecord.recommend_adverse_foods[current].reason }}</Typography>
							</Flexbox>
							<Flexbox align="center" direction="column" gap="8">
								<Typography fontSize="12" color="gray2">本食物对你是否不利？</Typography>
								<Flexbox gap="16">
									<Flexbox align="left" gap="2" @tap="updateAdverseFood(true)">
										<block v-if="currentRecord.curent_adverse_foods.includes(currentRecord.recommend_adverse_foods[current].food_name)">
											<Icon src="checkbox-active.png" size="20"></Icon>
											<Typography fontSize="12" color="primary">不利</Typography>
										</block>
										<block v-else>
											<Icon src="checkbox-gray.png" size="20"></Icon>
											<Typography fontSize="12" color="gray1">不利</Typography>
										</block>
									</Flexbox>
									<Flexbox align="left" gap="2" @tap="updateAdverseFood(false)">
										<block v-if="notAdverseFoods.includes(currentRecord.recommend_adverse_foods[current].food_name)">
											<Icon src="checkbox-active.png" size="20"></Icon>
											<Typography fontSize="12" color="primary">影响小</Typography>
										</block>
										<block v-else>
											<Icon src="checkbox-gray.png" size="20"></Icon>
											<Typography fontSize="12" color="gray1">影响小</Typography>
										</block>
									</Flexbox>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
					<Flexbox align="center" className="toggle-btn" @tap="toggleFood">
						<Typography fontSize="16" color="gray2">换一组尝试</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<uni-popup ref="popup" type="bottom" backgroundColor="#ffffff" borderRadius="32rpx 32rpx 0 0">
			<Flexbox direction="column" gap="33" className="organ-popup">
				<Flexbox direction="column" gap="15">
					<Flexbox direction="column" gap="8">
						<Typography fontSize="16" color="gray1" :bold="true">身体部位/器官</Typography>
						<input v-model="formData.organ_type" placeholder="请输入身体部位/器官" placeholder-class="placeholder" class="form-input" />
					</Flexbox>
					<Flexbox direction="column" gap="8">
						<Typography fontSize="16" color="gray1" :bold="true">健康描述</Typography>
						<Flexbox className="description">
							<textarea v-model="formData.description" placeholder="请把你经常容易出现的问题告诉我们..." placeholder-class="placeholder"></textarea>
							<Flexbox align="center" className="speech-btn" @tap="openPopup('speechPopup')">
								<Icon src="icon_microphone-primary.png" size="18" />
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox align="center" className="save-btn" @tap="onSave">
					<Typography fontSize="18" color="white" :bold="true">保存</Typography>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';

export default {
	data() {
		return {
			updatedTime: '',
			currentRecord: '',
			current: 0,
			records: [],
			notBenefitFoods: [],
			notAdverseFoods: [],
			formData: {
				organ_type: '',
				description: ''
			},
			family: []
		};
	},
	onLoad() {
		this.getRecords();
		this.getFamily();
	},
	computed: {
		...mapState(['userInfo', 'member']),
		index() {
			return this.family.findIndex((item) => item.member_id === this.member.member_id);
		}
	},
	methods: {
		...mapMutations(['setMember']),
		setText(text) {
			this.formData.description += text;
		},
		onEdit() {
			this.formData.organ_type = this.currentRecord.organ_type;
			this.formData.description = this.currentRecord.description;
			this.$refs.popup.open();
		},
		onSave() {
			if (!this.formData.organ_type) {
				uni.showToast({
					title: '请输入身体部位/器官',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.description) {
				uni.showToast({
					title: '请输入您经常容易出现的问题',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在保存...',
				mask: true
			});
			request({
				url: '/api/v2/nutrition_maps/update_nutrition_map_record',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id,
					...this.formData
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.$refs.popup.close();
						this.getRecords();
						setTimeout(() => {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							});
						}, 100);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		openPopup(ref) {
			this.$refs[ref].open();
		},
		toggleFood() {
			if (this.currentRecord.recommend_beneficial_foods.length - 1 === this.current) {
				this.current = 0;
				return;
			}
			this.current++;
		},
		selectMember(e) {
			this.records = [];
			this.currentRecord = null;
			const member = this.family[e.detail.value];
			this.setMember(member);
			this.getMemberDetail();
			this.getRecords();
		},
		getMemberDetail(id) {
			request({
				url: '/api/v2/family_member/getDetail',
				data: {
					id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.updatedTime = res.update_time.slice(0, 10).replace(/-/g, '.');
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
					if (res && res.length) {
						this.family = res;
						this.getMemberDetail();
					}
				}
			});
		},
		getRecords() {
			request({
				url: '/api/v2/nutrition_maps/get_nutrition_map',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.records = res.records;
						if (res.records.length) {
							this.currentRecord = res.records[0];
						}
					}
				}
			});
		},
		updateRecord(food_type, action, food_name) {
			request({
				url: '/api/v2/nutrition_maps/update_food_item',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id,
					record_id: this.currentRecord.id,
					food_type,
					food_name,
					action
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getRecords();
					}
				}
			});
		},
		updateBeneficialFood(isBeneficial, foodName) {
			const food = foodName || this.currentRecord.recommend_beneficial_foods[this.current].food_name;
			const index = this.currentRecord.curent_beneficial_foods.indexOf(food);
			if (isBeneficial) {
				if (index === -1) {
					this.currentRecord.curent_beneficial_foods.push(food);
					this.updateRecord('beneficial', 'add', food);
					this.notBenefitFoods.splice(index, 1);
				}
			} else {
				if (index !== -1) {
					this.currentRecord.curent_beneficial_foods.splice(index, 1);
					this.updateRecord('beneficial', 'remove', food);
					if (!foodName) {
						this.notBenefitFoods.push(food);
					}
				} else {
					this.notBenefitFoods.push(food);
				}
			}
		},
		updateAdverseFood(isAdverse, foodName) {
			const food = foodName || this.currentRecord.recommend_adverse_foods[this.current].food_name;
			const index = this.currentRecord.curent_adverse_foods.indexOf(food);
			if (isAdverse) {
				if (index === -1) {
					this.currentRecord.curent_adverse_foods.push(food);
					this.updateRecord('adverse', 'add', food);
					this.notAdverseFoods.splice(index, 1);
				}
			} else {
				if (index !== -1) {
					this.currentRecord.curent_adverse_foods.splice(index, 1);
					this.updateRecord('adverse', 'remove', food);
					if (!foodName) {
						this.notAdverseFoods.push(food);
					}
				} else {
					this.notAdverseFoods.push(food);
				}
			}
		},
		redirectTo(url) {
			uni.redirectTo({
				url
			});
		}
	}
};
</script>

<style lang="scss">
.nutrition-map-page {
	padding: 32rpx 32rpx 136rpx 32rpx;

	.user-container {
		margin-bottom: 48rpx;
	}

	.organ-item {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color;
	}
	.organ-item.active {
		background-color: $uni-color-accent2;
	}
	.record-container {
		padding: 0 6rpx;
	}
	.description-content {
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
	.food-list {
		flex-wrap: wrap;
		column-gap: 16rpx;
		row-gap: 16rpx;
	}
	.food-item {
		padding: 16rpx 24rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
	}
	.benefit-food,
	.adverse-food {
		position: relative;
		width: 330rpx;
		padding: 48rpx 24rpx 32rpx 24rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		border-radius: 24rpx;
		.tag {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
	.toggle-btn {
		width: 330rpx;
		height: 64rpx;
		margin: 0 auto;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		border-radius: 44rpx;
	}
}

.organ-popup {
	padding: 48rpx 32rpx 0 32rpx;
	.description {
		position: relative;
		width: 100%;
		height: 272rpx;
		padding: 24rpx 32rpx;
		border-radius: 24rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		font-size: 32rpx;
		line-height: 44rpx;
		color: $uni-text-color;
	}
	.form-input {
		height: auto;
		min-height: auto;
		line-height: 40rpx;
		font-size: 28rpx;
		padding: 28rpx 32rpx;
		border-radius: 16rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
	}
	.speech-btn {
		position: absolute;
		right: 16rpx;
		bottom: 16rpx;
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background-color: $uni-bg-color;
		z-index: 9;
	}
	.save-btn {
		width: 100%;
		height: 88rpx;
		background-color: $uni-color-primary;
		border-radius: 44rpx;
	}
}
</style>
