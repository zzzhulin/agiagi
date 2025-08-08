<template>
	<view class="music-page">
		<Navbar :fixed="false" :backgroundColor="navbarBgColor"></Navbar>
		<Icon src="plan_music-background.png" width="375" height="281" mode="widthFix" className="background"></Icon>
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
		<Flexbox direction="column" gap="24" className="music-container">
			<Flexbox direction="column" gap="4">
				<Typography fontSize="22" :bold="true">音乐疗愈</Typography>
				<Typography color="gray2">
					源于中华传统文化，樂藥同源，以五音（宫、商、角、徵、羽）调和五行（土、金、木、火、水），音符化药，缝补时光裂痕，找回灵性节拍。
				</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="music-list" v-if="musics.length">
				<Flexbox
					align="justify"
					className="music-item"
					v-for="(music, index) in musics"
					:key="music.music_id"
					@tap="navigateTo(`/pagesB/music/play?src=${music.music_path}&name=${music.music_name}`)"
				>
					<Flexbox direction="column" gap="8">
						<Typography fontSize="16" :bold="true">{{ music.music_name }}</Typography>
						<Typography color="gray1">{{ music.music_description || '无' }}</Typography>
					</Flexbox>
					<Icon src="icon_play.png" size="36" className="play-btn"></Icon>
				</Flexbox>
				<!-- <Flexbox align="center" className="change-btn" @tap="getMusics">
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
			musics: [],
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
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		selectMember(member) {
			this.memberId = member.member_id;
			this.getMusics();
		},
		getMusics() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			request({
				url: '/api/v2/music-and-sport/recommend-music',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.musics = res;
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
						this.getMusics();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.music-page {
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

	.music-container {
		border-radius: 24rpx;
		padding: 32rpx 24rpx;
		background-color: #ffffff;
	}

	.music-list:before {
		content: '';
		width: 100%;
		height: 2rpx;
		margin-bottom: 24rpx;
		background-color: $uni-text-color-gray4;
	}

	.music-item {
		background-color: $uni-bg-color-2;
		border-radius: 16rpx;
		padding: 30rpx 24rpx;
	}

	.change-btn {
		width: 330rpx;
		height: 64rpx;
		border-radius: 44rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		margin: auto;
	}
	
	.play-btn {
		flex: none;
	}
}
</style>
