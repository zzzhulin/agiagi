<template>
	<view class="nutrition-page">
		<Navbar :fixed="false" title="本命营养地图" backgroundColor="transparent"></Navbar>
		<Icon src="nutrition-background.png" width="375" height="375" className="background"></Icon>
		<Flexbox direction="column" gap="24" className="nutrition-container">
			<Flexbox direction="column" gap="8">
				<Flexbox align="justify">
					<Flexbox align="left" gap="8">
						<Icon :src="member.avatar" size="32" type="remote" :circle="true"></Icon>
						<Typography fontSize="18" color="#000000" :bold="true">Hi，{{ member.member_name }}</Typography>
					</Flexbox>
					<picker :value="index" :range="family" range-key="member_name" @change="selectMember">
						<Flexbox align="left">
							<Typography color="primary" :bold="true">切换对象</Typography>
							<Icon src="icon_transfer.png" size="20"></Icon>
						</Flexbox>
					</picker>
				</Flexbox>
				<Typography>我们将根据大数据、地域特征等为您建立专属的本命营养地图，并在互动中摸索出与您健康共鸣的食物体系。</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<Flexbox align="left" gap="15">
					<Typography color="gray1" className="form-label">真实姓名</Typography>
					<Flexbox align="justify" className="form-input">
						<input v-model="formData.name" placeholder="请输入真实姓名" placeholder-class="placeholder" />
					</Flexbox>
				</Flexbox>
				<Flexbox align="left" gap="15">
					<Typography color="gray1" className="form-label">出生日期</Typography>
					<Flexbox align="justify" className="form-input">
						<picker mode="date" :value="formData.birthdate" start="1900-01-01" :end="endDate" @change="onSelect($event, 'birthdate')">
							<view class="uni-input" v-if="formData.birthdate">{{ formData.birthdate }}</view>
							<view class="placeholder" v-else>请选择出生日期</view>
							<Icon src="icon_arrow-right.png" size="24"></Icon>
						</picker>
					</Flexbox>
				</Flexbox>
				<Flexbox align="left" gap="15">
					<Typography color="gray1" className="form-label">出生时间</Typography>
					<Flexbox align="justify" className="form-input">
						<picker mode="time" :value="formData.birthtime" start="00:00" end="23:59" @change="onSelect($event, 'birthtime')">
							<view class="uni-input" v-if="formData.birthtime">{{ formData.birthtime }}</view>
							<view class="placeholder" v-else>请选择出生时间</view>
							<Icon src="icon_arrow-right.png" size="24"></Icon>
						</picker>
					</Flexbox>
				</Flexbox>
				<Flexbox align="left" gap="15">
					<Typography color="gray1" className="form-label">出生城市</Typography>
					<Flexbox align="justify" className="form-input">
						<picker mode="region" :value="formData.birthplace" @change="onSelect($event, 'birthplace')">
							<view class="uni-input" v-if="formData.birthplace">{{ formData.birthplace }}</view>
							<view class="placeholder" v-else>请选择出生城市</view>
							<Icon src="icon_arrow-right.png" size="24"></Icon>
						</picker>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="survey-btn" @tap="onOpen">
				<Typography fontSize="18" color="white" :bold="true">开启专属地图</Typography>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { formatDate } from '@/utils/util';
import { forIn } from 'lodash';
export default {
	data() {
		return {
			formData: {
				name: '',
				birthdate: '',
				birthtime: '',
				birthplace: ''
			},
			family: []
		};
	},
	onLoad() {
		this.getFamily();
		this.getMemberDetail();
	},
	computed: {
		...mapState(['userInfo', 'member']),
		index() {
			return this.family.findIndex((item) => item.member_id === this.member.member_id);
		},
		endDate() {
			const date = new Date();
			return formatDate(date, 'YYYY-MM-DD');
		}
	},
	methods: {
		...mapMutations(['setMember']),
		onOpen() {
			uni.showLoading({
				mask: true,
				title: '正在开启...'
			});
			request({
				url: '/api/v2/nutrition_maps/ai_generate',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.member.member_id,
					gender: this.member.gender,
					...this.formData
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.redirectTo('/pagesC/nutrition/risk');
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		redirectTo(url) {
			uni.redirectTo({
				url
			});
		},
		onSelect(e, field) {
			if (field === 'birthplace') {
				this.formData.birthplace = e.detail.value.join('');
				return;
			}
			this.formData[field] = e.detail.value;
		},
		selectMember(e) {
			const member = this.family[e.detail.value];
			this.setMember(member);
		},
		getMemberDetail() {
			request({
				url: '/api/v2/family_member/getDetail',
				data: {
					id: this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.formData.name = res.member_name;
						for (let key in res) {
							this.formData[key] = res[key];
						}
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
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.nutrition-page {
	min-height: 100vh;
	padding-top: 670rpx;
	background-color: $uni-bg-color;

	.background {
		position: absolute;
		top: 0;
	}

	.nutrition-container {
		position: relative;
		margin: 0 32rpx 76rpx 32rpx;
		padding: 48rpx 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.form-label {
		flex: none;
		width: 112rpx;
	}

	.form-input {
		position: relative;
		flex: 1;
		height: 80rpx;
		padding: 20rpx 24rpx;
		background-color: $uni-bg-color-2;
		border-radius: 16rpx;
	}

	.form-input input,
	.form-input picker,
	.uni-input {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
	}

	.form-input .icon {
		position: absolute;
		right: 24rpx;
		top: 0;
		bottom: 0;
		width: 48rpx;
		height: 48rpx;
		margin: auto;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.survey-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
