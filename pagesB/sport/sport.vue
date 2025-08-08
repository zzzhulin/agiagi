<template>
	<view class="sport-page">
		<Navbar :fixed="false" :backgroundColor="navbarBgColor"></Navbar>
		<Icon src="plan_sport-background.png" width="375" height="281" mode="widthFix" className="background"></Icon>
		<Flexbox align="left" gap="12" className="family-list">
			<Flexbox
				align="center"
				:className="['family-item', { active: member.member_id === memberId }]"
				v-for="member in family"
				:key="member.member_id"
				@tap="selectMember(member)"
			>
				<Icon :src="member.avatar" :size="member.member_id === memberId ? 36 : 32" type="remote" :circle="true" align="center" />
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="24" className="sport-container">
			<Flexbox direction="column" gap="4">
				<Typography fontSize="22" :bold="true">运气动血</Typography>
				<Typography color="gray2">
					我们建议每个人应该有1~2项运动爱好，如羽毛球，篮球等。同时我们更重视有保健效果的运动，遵循中医理念：动则生阳，静以养阴。适度运动助气行血畅，濡养脏腑；过激则耗气伤筋，反损根基。
				</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="sport-list" v-if="sports.length">
				<Flexbox direction="column" gap="12" className="sport-item" v-for="(sport, index) in sports" :key="sport.title">
					<Flexbox align="justify">
						<Typography fontSize="18" :bold="true">{{ sport.title }}</Typography>
						<Typography>宜{{ sport.time }}</Typography>
					</Flexbox>
					<Flexbox direction="column">
						<Flexbox className="exercise-item" v-for="exercise in sport.exercises" :key="exercise.name">
							<view class="dot"></view>
							<view class="text-group">
								<Typography :bold="true">{{ exercise.name }}：</Typography>
								<Typography>{{ exercise.description }}</Typography>
							</view>
						</Flexbox>
					</Flexbox>
					<Typography color="gray2">{{ sport.taboo_suggestions }}</Typography>
				</Flexbox>
				<!-- <Flexbox align="center" className="change-btn" @tap="getSports">
					<Typography fontSize="16" color="gray2">换一组</Typography>
				</Flexbox> -->
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			navbarBgColor: 'transparent',
			memberId: '',
			sports: [],
			family: []
		};
	},
	onLoad() {
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
		...mapState(['userInfo'])
	},
	methods: {
		selectMember(member) {
			this.memberId = member.member_id;
			this.getSports();
		},
		getSports() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			request({
				url: '/api/v2/music-and-sport/recommend-sport',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.sports = res;
					}
				},
				complete: () => {
					uni.hideLoading();
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
						this.memberId = res[0].member_id;
						this.family = res;
						this.getSports();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.sport-page {
	min-height: 100vh;
	padding: 0 32rpx 134rpx 32rpx;
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

	.sport-container {
		border-radius: 24rpx;
		padding: 32rpx 24rpx;
		background-color: #ffffff;
	}

	.sport-list:before {
		content: '';
		width: 100%;
		height: 2rpx;
		margin-bottom: 24rpx;
		background-color: $uni-text-color-gray4;
	}

	.sport-item {
		background-color: $uni-bg-color-2;
		border-radius: 16rpx;
		padding: 24rpx;
	}

	.exercise-item {
		line-height: 1;

		.text-group {
			display: inline-block;
		}
		.text {
			display: inline;
		}
		.dot {
			flex: none;
			display: inline-block;
			position: relative;
			width: 40rpx;
			height: 40rpx;
			&:first-child::after {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				margin: auto;
				content: '';
				width: 10rpx;
				height: 10rpx;
				background-color: $uni-text-color;
				border-radius: 50%;
			}
		}
	}

	.change-btn {
		width: 330rpx;
		height: 64rpx;
		border-radius: 44rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		margin: auto;
	}
}
</style>
