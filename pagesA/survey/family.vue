<template>
	<view class="diet-survey-family-page">
		<Navbar :title="title"></Navbar>
		<Flexbox align="center" className="survey-banner">
			<Icon src="meal.png" width="279" height="167"></Icon>
		</Flexbox>
		<Flexbox direction="column" gap="32">
			<Flexbox align="center" gap="12">
				<view class="line"></view>
				<Typography>选择要调查的成员</Typography>
				<view class="line"></view>
			</Flexbox>
			<scroll-view :scroll-x="true" :enable-flex="true" class="family-list">
				<Flexbox
					align="center"
					:className="['family-item', { active: member.member_id === memberId }]"
					v-for="member in family"
					:key="member.member_id"
					@tap="selectMember(member)"
				>
					<Flexbox align="center" direction="column" gap="8">
						<Icon :src="member.avatar" size="60" :circle="true" type="remote"></Icon>
						<Typography :bold="true">{{ member.relationship }}</Typography>
					</Flexbox>
				</Flexbox>
			</scroll-view>
		</Flexbox>
		<Flexbox align="center" className="tabbar">
			<Flexbox align="center" className="survey-btn" @tap="onSurvey">
				<Typography fontSize="18" color="white" :bold="true">开始调查</Typography>
			</Flexbox>
		</Flexbox>
		<uni-popup ref="popup" type="center">
			<Flexbox align="center" direction="column" gap="24" className="popup-content">
				<Typography fontSize="16" align="center">为了确定调查的准确性，请完善Ta的基础资料后再进行。</Typography>
				<Flexbox gap="14">
					<Flexbox align="center" className="cancel-btn" @tap="closePopup">
						<Typography fontSize="18" color="gray2" :bold="true">取消</Typography>
					</Flexbox>
					<Flexbox align="center" className="confirm-btn" @tap="navigateTo(`/pagesA/profile/profile?memberId=${memberId}&tab=base`)">
						<Typography fontSize="18" color="white" :bold="true">先完善资料</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			title: '',
			type: '',
			memberId: '',
			family: []
		};
	},
	onLoad(option) {
		this.type = option.type || '';
		switch (option.type) {
			case 'slimming':
				this.title = '减肥活动健康调查';
				break;
			default:
				this.title = '膳食调查';
				break;
		}
	},
	onShow() {
		this.getFamily();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['setMember']),
		navigateTo(url) {
			uni.navigateTo({
				url
			});
			this.closePopup();
		},
		redirectTo(url) {
			uni.redirectTo({
				url
			});
		},
		closePopup() {
			this.$refs.popup.close();
		},
		onSurvey() {
			const member = this.family.find((item) => item.member_id === this.memberId);
			if (member.health_record_status !== 'N') {
				this.$refs.popup.open();
				return;
			}
			if (this.type === 'slimming') {
				this.redirectTo('/pagesA/survey/base');
			} else {
				this.redirectTo('/pagesA/survey/diet');
			}
		},
		selectMember(member) {
			this.memberId = member.member_id;
			this.setMember(member);
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
						this.memberId = res[0].member_id;
						this.setMember(res[0]);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.diet-survey-family-page {
	min-height: 100vh;
	background-color: #fff;

	.survey-banner {
		width: 600rpx;
		height: 600rpx;
		margin: 48rpx auto 66rpx auto;
	}

	.line {
		width: 120rpx;
		height: 2rpx;
		background-color: $uni-text-color-gray2;
	}

	.family-list {
		display: flex;
		width: auto;
		height: 264rpx;
		padding: 0 32rpx;
	}

	.family-item {
		flex: none;
		width: 212rpx;
		height: 264rpx;
		margin-right: 24rpx;
		background-color: $uni-bg-color-2;
		border-radius: 24rpx;
		&:last-child {
			margin-right: 0;
		}
	}

	.family-item.active {
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
	}

	.tabbar {
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

	.popup-content {
		width: 588rpx;
		border-radius: 32rpx;
		padding: 40rpx;
		background-color: #fff;
	}

	.cancel-btn,
	.confirm-btn {
		width: 240rpx;
		height: 88rpx;
		border-radius: 44rpx;
	}

	.cancel-btn {
		background-color: $uni-bg-color;
	}

	.confirm-btn {
		background-color: $uni-color-primary;
	}
}
</style>
