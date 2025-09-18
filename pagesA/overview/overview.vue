<template>
	<Flexbox direction="column" className="sign-in" v-if="loaded">
		<Flexbox direction="column" className="sign-in-body">
			<Flexbox align="left" gap="8" className="welcome-container">
				<button open-type="chooseAvatar" class="avatar-btn" @chooseavatar="chooseAvatar">
					<Icon :src="avatar" size="44" type="remote" :circle="true"></Icon>
				</button>
				<Icon src="greet.png" width="121" height="29" mode="widthFix"></Icon>
			</Flexbox>
			<Flexbox align="justify" className="account-container">
				<Flexbox gap="32">
					<Flexbox gap="2" @tap="navigateTo(`/pagesA/profile/profile?memberId=${taskInfo.member_id}&tab=base`)">
						<Icon src="icon_profile.png" size="20"></Icon>
						<Flexbox align="center">
							<Typography>健康档案</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox gap="2" @tap="navigateTo('/pagesA/contract/contract')">
						<Icon src="icon_contract.png" size="20"></Icon>
						<Flexbox align="center">
							<Typography>合约</Typography>
							<Typography color="primary" :bold="true">{{ contractCount }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Typography @tap="navigateTo('/pagesE/user/user')">个人中心</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="target-container">
				<Flexbox align="justify">
					<Flexbox align="left" gap="12" className="family-list">
						<Flexbox
							align="center"
							:className="['family-item', { active: member.member_id === memberId }]"
							v-for="member in family"
							:key="member.member_id"
							@tap="selectMember(member)"
						>
							<Icon :src="member.avatar" size="28" type="remote" :circle="true" align="center" />
						</Flexbox>
					</Flexbox>
					<Flexbox align="center" className="family-btn" @tap="navigateTo('/pagesE/family/list')">
						<Typography fontSize="12" color="gray2">家人管理</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox direction="column" gap="20" v-if="!isEmpty">
					<Flexbox>
						<picker :value="targetIndex" :range="targets" range-key="goal_type_name" @change="selectTarget">
							<Flexbox direction="column" gap="4">
								<Flexbox align="left">
									<Typography color="primary" :bold="true">第一目标</Typography>
									<Icon src="icon_transfer.png" size="20"></Icon>
								</Flexbox>
								<Typography fontSize="24" :bold="true" className="target-name">{{ targetName }}</Typography>
							</Flexbox>
						</picker>
						<!-- <Icon src="scheme.png" width="88" height="52" className="scheme-image" v-if="url || reportUrl" @tap="navigateTo(url || reportUrl)"></Icon> -->
					</Flexbox>
					<block v-if="targetInfo">
						<Flexbox direction="column" gap="4">
							<view class="target-progress">
								<view class="target-progress-bar" :style="{ width: targetInfo.progress + '%' }"></view>
							</view>
							<Flexbox align="justify">
								<Flexbox direction="column">
									<Typography :bold="true">{{ targetInfo.initial_value }}{{ targetInfo.unit }}</Typography>
									<Typography fontSize="12" color="gray2">最初</Typography>
								</Flexbox>
								<Typography :fontSize="targetInfo.progress > 0 && targetInfo.progress < 100 ? 14 : 12" color="primary">
									{{ targetInfo.progress_description }}
								</Typography>
								<Flexbox align="end" direction="column">
									<Typography :bold="true">{{ targetInfo.target_value }}{{ targetInfo.unit }}</Typography>
									<Typography fontSize="12" color="gray2">期望值</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
						<Flexbox align="justify" className="analysis-content" @tap="readMessage">
							<Flexbox align="left" gap="12">
								<Icon src="health-analysis.png" width="64" height="20"></Icon>
								<Flexbox align="center" className="volume-icon-wrapper">
									<Icon src="icon_volume-close.png" size="20" v-if="isPlay"></Icon>
									<Icon src="icon_volume.png" size="20" v-else></Icon>
								</Flexbox>
							</Flexbox>
							<Flexbox align="center" gap="4" className="wave-list">
								<view :class="['bar', { recording: isPlay }]" v-for="n in 18" :key="n" :style="{ animationDelay: (n - 1) * 0.1 + 's' }"></view>
							</Flexbox>
						</Flexbox>
					</block>
					<Flexbox align="center" direction="column" className="empty-content" v-else @tap="navigateTo(targetUrl)">
						<Icon src="empty.png" size="128"></Icon>
						<Typography color="gray2">未找到{{ targetName }}调查记录</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="center" direction="column" gap="34" className="float-container" v-if="isEmpty && isLoaded">
					<Flexbox align="center" direction="column" gap="7">
						<Typography fontSize="18" :bold="true">阿济阿济陪您开启新的健康生活</Typography>
						<Typography fontSize="16" color="primary" :bold="true">先给自己选一个健康目标吧~</Typography>
					</Flexbox>
					<view class="float-content">
						<Icon src="home_survey-background.png" width="265" height="247" className="float-background" />
						<view class="float-content">
							<Flexbox align="center" className="float-btn" @tap="navigateTo('/pagesA/survey/base?type=slimming')">
								<Typography color="gray1">减肥增肌</Typography>
							</Flexbox>
							<Flexbox align="center" className="float-btn" @tap="navigateTo('/pagesA/survey/base?type=height')">
								<Typography color="gray1">增高成长</Typography>
							</Flexbox>
							<Flexbox align="center" className="float-btn" @tap="navigateTo('/pagesA/survey/base?type=emotion')">
								<Typography color="gray1">开心解压</Typography>
							</Flexbox>
							<Flexbox align="center" className="float-btn" @tap="navigateTo('/pagesA/survey/base?type=metabolism')">
								<Typography color="gray1">代谢调理</Typography>
							</Flexbox>
							<Flexbox align="center" className="float-btn" @tap="navigateTo('/pagesA/survey/base?type=age')">
								<Typography color="gray1">减龄抗衰</Typography>
							</Flexbox>
							<Flexbox align="center" className="float-btn" @tap="navigateTo('/pagesA/survey/base?type=sleep')">
								<Typography color="gray1">睡眠改善</Typography>
							</Flexbox>
						</view>
					</view>
				</Flexbox>
			</Flexbox>
			<!-- </block> -->
			<!-- 这个是过渡的，暂时不用 -->
			<!-- <Flexbox direction="column" className="slimming-container" v-else>
				<Icon src="slimming-banner.png" width="343" height="314" className="slimming-banner"></Icon>
				<Flexbox align="center" direction="column" gap="22" className="slimming-content">
					<Flexbox align="center" direction="column" gap="7">
						<Flexbox>
							<Typography fontSize="30" :bold="true">5天挑战</Typography>
							<Typography fontSize="30" color="warning" :bold="true">5斤</Typography>
						</Flexbox>
						<Typography :bold="300">体重管理不是意志力比拼，而是科学体系的胜利</Typography>
					</Flexbox>
					<Flexbox align="center" className="challenge-btn" @tap="navigateTo('/pagesA/survey/family?type=slimming')">
						<Typography fontSize="16" color="primary" :bold="true">我要挑战</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox> -->
			<Flexbox direction="column" gap="12" className="plan-container">
				<Flexbox align="justify">
					<Typography fontSize="18" :bold="true">调理安排</Typography>
					<Flexbox align="center" gap="4" v-if="cartCount" @tap="navigateTo('/pagesD/cart/list')">
						<Icon src="icon_bag.png" size="24"></Icon>
						<Typography color="primary">购物清单({{ cartCount }})</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="justify">
					<Flexbox align="center" direction="column" gap="4" @tap="navigateTo('/pagesB/diet/diet')">
						<Icon src="diet.png" size="68" className="plan-icon"></Icon>
						<Typography className="plan-name">膳食方案</Typography>
					</Flexbox>
					<Flexbox align="center" direction="column" gap="4" @tap="navigateTo('/pagesD/cart/cart')">
						<Icon src="assistant.png" size="68" className="plan-icon"></Icon>
						<Typography className="plan-name">买菜助手</Typography>
					</Flexbox>
					<Flexbox align="center" direction="column" gap="4" @tap="navigateTo('/pagesB/music/music')">
						<Icon src="music.png" size="68" className="plan-icon"></Icon>
						<Typography className="plan-name">音药</Typography>
					</Flexbox>
					<Flexbox align="center" direction="column" gap="4" @tap="navigateTo('/pagesB/sport/sport')">
						<Icon src="sport.png" size="68" className="plan-icon"></Icon>
						<Typography className="plan-name">运动方案</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Tabbar @tap="navigateTo('/pagesB/robot/robot')">
			<Flexbox gap="8">
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo(nutritionUrl)">
					<Icon src="icon_diet.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">营养地图</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo('/pagesC/tongue/diagnosis')">
					<Icon src="icon_tongue.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">察颜观舌</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo('/pagesC/alert/alert')">
					<Icon src="icon_clock.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">提醒我</Typography>
				</Flexbox>
				<Flexbox align="center" gap="2" className="assistant-btn" @tap.stop="navigateTo('/pagesC/test/test')">
					<Icon src="icon_test.png" size="16"></Icon>
					<Typography fontSize="12" color="gray1">测一测</Typography>
				</Flexbox>
			</Flexbox>
		</Tabbar>
		<Login></Login>
	</Flexbox>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { request } from '@/utils/request';
import { onVoiceEnded, onVoicePlay, pauseVoice, playVoice, resumeVoice } from '@/utils/voice';
import { upload } from '@/utils/upload';
export default {
	data() {
		return {
			nutritionUrl: '',
			reportUrl: '',
			url: '',
			avatar: '',
			cartCount: 0,
			loaded: false,
			isPlay: false,
			isStart: false,
			isEmpty: false,
			isLoaded: false,
			message: null,
			socketTask: null,
			family: [],
			memberId: '',
			targetName: '',
			targetType: '',
			targetInfo: null,
			targets: [],
			targetIndex: ''
		};
	},
	onShow() {
		if (!this.userInfo) {
			return;
		}
		this.getContractCount();
		this.getDefaultMember();
		this.getTask();
		this.getFamily();
		this.avatar = this.userInfo.headimg;
	},
	onShareAppMessage() {
		return {
			title: '阿济阿济',
			path: '/pagesA/home/home',
			imageUrl:'https://cdn.agiagi.cc/images/brand.png'
		};
	},
	computed: {
		...mapState(['userInfo', 'contractCount', 'taskInfo', 'member']),
		targetUrl() {
			switch (this.targetType) {
				case 'weight_loss':
					return '/pagesA/survey/base?type=slimming';
				case 'children_growth':
					return '/pagesA/survey/base?type=height';
				case 'metabolic':
					return '/pagesA/survey/base?type=metabolism';
				case 'body_age':
					return '/pagesA/survey/base?type=age';
				case 'improve_sleep':
					return '/pagesA/survey/base?type=sleep';
				case 'happy_decompress':
					return '/pagesA/survey/base?type=emotion';
				default:
					break;
			}
		}
	},
	methods: {
		...mapMutations(['setContractCount', 'setTaskInfo', 'setLoss', 'setMember', 'setFamilyCount']),
		chooseAvatar(e) {
			const { avatarUrl } = e.detail;
			upload(avatarUrl, 'image').then((result) => {
				this.avatar = result;
				this.setAvatar();
			});
		},
		setAvatar() {
			request({
				url: '/api/member/modifyheadimg',
				method: 'POST',
				data: {
					headimg: this.avatar
				},
				success: () => {}
			});
		},
		selectMember(member) {
			this.url = '';
			this.isLoaded = false;
			this.isEmpty = false;
			this.targetInfo = null;
			this.memberId = member.member_id;
			this.getTask();
			this.setMember(member);
			this.updateDefaultMember();
		},
		selectTarget(e) {
			this.isLoaded = false;
			this.isEmpty = false;
			this.targetInfo = null;
			this.targetIndex = e.detail.value;
			this.targetType = this.targets[this.targetIndex].goal_type;
			this.targetName = this.targets[this.targetIndex].goal_type_name;
			this.updateTarget();
		},
		readMessage() {
			if (!this.targetInfo.health_performance) {
				uni.showToast({
					title: '暂无详细分析',
					icon: 'none'
				});
				return;
			}
			if (!this.isStart) {
				playVoice(this.targetInfo.health_performance);
			}

			onVoicePlay(() => {
				this.isStart = true;
				this.isPlay = true;
				console.log('音频开始播放');
			});

			onVoiceEnded(() => {
				console.log('播放完成');
				this.isPlay = false;
				this.isStart = false;
			});
			if (this.isPlay) {
				pauseVoice();
				this.isPlay = false;
			} else {
				if (this.isStart) {
					resumeVoice();
				}
			}
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		navigateToChat() {
			if (this.userInfo.is_card_service === 1) {
				this.navigateTo(`/pagesB/chat/chat?friendName=${this.message.username}&friendId=${this.message.agent_id}`);
			} else {
				this.navigateTo('/pagesB/robot/robot');
			}
		},
		getDefaultMember() {
			request({
				url: '/api/v2/first_goal/default_homepage_member',
				data: { user_id: this.userInfo.member_id },
				isRobot: true,
				success: (res) => {
					if (res) {
						this.memberId = res.id;
						this.targetType = res.goal_type;
						this.targetName = res.goal_type_name;
						this.getTargets();
						if (!this.url) {
							this.getRecords(res.id);
						}
					}
				}
			});
		},
		updateDefaultMember() {
			request({
				url: `/api/v2/first_goal/update_homepage?member_id=${this.memberId}`,
				method: 'POST',
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getDefaultMember();
					}
				}
			});
		},
		getTarget() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			request({
				url: '/api/v2/first_goal/get_first_goal_data',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId || this.member.member_id,
					goal_type: this.targetType
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.targetInfo = res;
						this.setLoss(res.remaining_value);
					} else {
						if (!this.targetType) {
							this.isEmpty = true;
						}
					}
				},
				complete: () => {
					uni.hideLoading();
					this.isLoaded = true;
				}
			});
		},
		updateTarget() {
			request({
				url: '/api/v2/first_goal/update_goal_type',
				method: 'POST',
				data: { member_id: this.memberId || this.member.member_id, goal_type: this.targetType },
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getTargets();
					}
				}
			});
		},
		getTargets() {
			request({
				url: '/api/v2/first_goal/get_available_goal_types',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId || this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.targets = res.available_goal_types;
						this.targetIndex = res.available_goal_types.findIndex((item) => item.goal_type === res.current_goal_type);
						this.getTarget();
					}
				}
			});
		},
		getContractCount() {
			request({
				url: '/contract/api/membercard/lists',
				method: 'POST',
				data: { page: 1, page_size: 1, status: 'all' },
				success: (res) => {
					if (res) {
						this.setContractCount(res.count);
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
					this.loaded = true;
					if (res && res.length > 0) {
						const member = res.find((item) => item.member_id === this.memberId);
						this.family = res;
						this.setFamilyCount(res.length);
						this.setMember(member);
					}
				}
			});
		},
		getTask() {
			request({
				url: '/api/v2/weight-loss-tracking/get-user-task',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId || this.member.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.setTaskInfo(res);
						this.getRecords(res.member_id);
						switch (res.status) {
							case 'processing':
								this.url = '/pagesC/clock/clock';
								break;
							case 'pending':
								this.url = '/pagesC/clock/start';
								break;
							case 'completed':
								this.url = '/pagesC/clock/finish';
								break;
							default:
								break;
						}
					} else {
						this.reportUrl = '/pagesA/report/slimming';
					}
				}
			});
		},
		getRecords(member_id) {
			request({
				url: '/api/v2/nutrition_maps/get_nutrition_map',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id
				},
				isRobot: true,
				success: (res) => {
					this.nutritionUrl = res ? '/pagesC/nutrition/map' : '/pagesC/nutrition/nutrition';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.sign-in {
	position: relative;
	height: 100vh;
	background-color: $uni-bg-color;
	&:before {
		content: '';
		position: absolute;
		left: 0;
		width: 100%;
		height: 746rpx;
		background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 95.46%);
	}

	.avatar-btn {
		width: 88rpx;
		height: 88rpx;
		padding: 0;
		margin: 0;
		border-radius: 50%;
		background-color: transparent;
	}

	.sign-in-body {
		height: calc(100vh - 244rpx);
		overflow: auto;
		padding: 0 32rpx;
	}

	.welcome-container {
		position: relative;
		margin: 88rpx 0 20rpx 0;
	}

	.account-container {
		position: relative;
		height: 80rpx;
		padding: 16rpx 20rpx 16rpx 24rpx;
		background-color: $uni-color-accent2;
		border-radius: 16rpx;
	}

	.family-item.active {
		width: 72rpx;
		height: 72rpx;
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
		border-radius: 50%;
		background-color: #ffffff;
	}

	.family-avatar {
		box-shadow: 0 0 0 2rpx #fff inset;
		margin-left: -16rpx;
		border-radius: 50%;
	}

	.family-btn {
		width: 128rpx;
		height: 48rpx;
		border-radius: 28rpx;
		background-color: $uni-bg-color-2;
	}

	.target-container {
		position: relative;
		margin: 28rpx 0;
		padding: 32rpx 24rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
	}

	.scheme-image {
		margin-left: auto;
	}

	.text.target-name {
		line-height: 68rpx;
	}

	.profile-btn {
		position: absolute;
		top: 32rpx;
		right: 24rpx;
		width: 128rpx;
		height: 48rpx;
		border-radius: 24rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color;
	}

	.target-progress {
		width: 100%;
		height: 16rpx;
		background-color: $uni-color-accent2;
		border-radius: 8rpx;
	}

	.target-progress-bar {
		height: 100%;
		background-color: $uni-color-accent1;
		border-radius: 8rpx;
		transition: width 0.3s ease;
	}

	.analysis-content {
		height: 120rpx;
		padding: 0 32rpx;
		border-radius: 24rpx;
		background: rgba(227, 255, 238, 0.5);
	}

	.wave-list {
		width: 280rpx;
		height: 24rpx;

		.bar {
			width: 8rpx;
			height: 24rpx;
			border-radius: 4rpx;
			background-color: $uni-color-primary;
		}

		.bar.recording:nth-child(1) {
			height: 24rpx;
		}
		.bar.recording:nth-child(2) {
			height: 32rpx;
		}
		.bar.recording:nth-child(3) {
			height: 24rpx;
		}
		.bar.recording:nth-child(4) {
			height: 44rpx;
		}
		.bar.recording:nth-child(5) {
			height: 40rpx;
		}
		.bar.recording:nth-child(6) {
			height: 24rpx;
		}
		.bar.recording:nth-child(7) {
			height: 48rpx;
		}
		.bar.recording:nth-child(8) {
			height: 64rpx;
		}
		.bar.recording:nth-child(9) {
			height: 48rpx;
		}
		.bar.recording:nth-child(10) {
			height: 32rpx;
		}
		.bar.recording:nth-child(11) {
			height: 24rpx;
		}
		.bar.recording:nth-child(12) {
			height: 48rpx;
		}
		.bar.recording:nth-child(13) {
			height: 24rpx;
		}
		.bar.recording:nth-child(14) {
			height: 24rpx;
		}
		.bar.recording:nth-child(15) {
			height: 56rpx;
		}
		.bar.recording:nth-child(16) {
			height: 40rpx;
		}
		.bar.recording:nth-child(17) {
			height: 24rpx;
		}
		.bar.recording:nth-child(18) {
			height: 24rpx;
		}

		.bar.recording {
			transform-origin: center center;
			animation: wave 1s infinite ease-in-out;
		}
	}

	@keyframes wave {
		0%,
		100% {
			transform: scaleY(0.8);
		}
		50% {
			transform: scaleY(1.2);
		}
	}

	.analysis-container {
		margin: 24rpx 0;
		padding: 24rpx 24rpx 32rpx 24rpx;
		background: linear-gradient(180deg, #dffaea 0%, #ffffff 100%);
		border-radius: 24rpx;
		box-shadow: 0 0 0 2rpx #ffffff inset;
	}

	.volume-icon-wrapper {
		width: 48rpx;
		height: 48rpx;
		background-color: #fff;
		box-shadow: 0rpx 8rpx 8rpx 0rpx #0000001a;
		border-radius: 50%;
	}

	.plan-container {
		margin-bottom: 20rpx;
		padding: 32rpx 24rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
	}

	.plan-icon {
		border-radius: 16rpx;
		box-shadow: 0 0 0 2rpx $uni-bg-color inset;
	}

	.text.plan-name {
		color: #000000;
	}

	.float-content {
		position: relative;
		width: 530rpx;
		height: 494rpx;
		margin: 0 auto;
	}

	.float-background {
		position: absolute;
	}

	.float-btn {
		position: absolute;
		width: 176rpx;
		height: 72rpx;
		border-radius: 44rpx;
		background: linear-gradient(180deg, #ffffff 0%, #e3ffee 100%);
		box-shadow: 0rpx 6rpx 16rpx 0rpx #30a3754d;
		animation: floatAllInOne 3s ease-in-out infinite;
	}

	.float-btn::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 200%;
		border: 2rpx solid $uni-color-primary;
		transform: scale(0.5);
		transform-origin: 0 0;
		border-radius: 88rpx;
	}

	.float-btn:nth-child(1) {
		top: 2rpx;
		left: 62rpx;
		animation-duration: 2.8s;
		animation-delay: 0.2s;
	}

	.float-btn:nth-child(2) {
		top: 2rpx;
		right: 8rpx;
		animation-duration: 3.2s;
		animation-delay: 0.4s;
	}

	.float-btn:nth-child(3) {
		top: 178rpx;
		left: -26rpx;
		animation-duration: 3s;
		animation-delay: 0.1s;
	}

	.float-btn:nth-child(4) {
		top: 178rpx;
		right: -42rpx;
		animation-duration: 2.5s;
		animation-delay: 0.3s;
	}

	.float-btn:nth-child(5) {
		bottom: 66rpx;
		left: 62rpx;
		animation-duration: 3.5s;
		animation-delay: 0.5s;
	}

	.float-btn:nth-child(6) {
		bottom: 66rpx;
		right: 8rpx;
		animation-duration: 2.9s;
		animation-delay: 0.2s;
	}

	@keyframes floatAllInOne {
		0% {
			transform: translateX(0) translateY(0) rotate(0deg);
		}
		25% {
			transform: translateX(-3rpx) translateY(-5rpx) rotate(-1deg);
		}
		50% {
			transform: translateX(0) translateY(-10rpx) rotate(0deg);
		}
		75% {
			transform: translateX(3rpx) translateY(-5rpx) rotate(1deg);
		}
		100% {
			transform: translateX(0) translateY(0) rotate(0deg);
		}
	}
	.slimming-container {
		position: relative;
		width: 100%;
		min-height: 870rpx;
		margin: 32rpx 0 34rpx 0;
		overflow: hidden;
		background-color: #fff;
		border-radius: 24rpx;
	}

	.slimming-banner {
		position: absolute;
	}

	.slimming-content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 42rpx;
	}

	.challenge-btn {
		width: 240rpx;
		height: 72rpx;
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
		border-radius: 80rpx;
	}
}
</style>
