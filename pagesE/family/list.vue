<template>
	<view class="family-page">
		<Navbar title="我的家人" />
		<Flexbox direction="column">
			<Flexbox align="left" gap="8" className="famly-item" v-for="member in family" :key="member.id" @tap="navigateTo(`/pagesE/family/detail?id=${member.id}`)">
				<Icon :src="member.avatar" size="44" type="remote" :circle="true"></Icon>
				<Typography fontSize="16">{{ member.member_name }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="add-btn" @tap="navigateTo('/pagesE/family/detail')">
				<Typography fontSize="18" color="white" :bold="true">添加家人</Typography>
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
			family: []
		};
	},
	onShow() {
		this.getFamily();
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
		getFamily() {
			request({
				url: '/api/v2/family_member/list',
				data: {
					user_id: this.userInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res && res.total > 0) {
						this.family = res.items;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.family-page {
	padding: 32rpx 32rpx 172rpx 32rpx;
	.famly-item {
		padding: 24rpx 0;
		border-bottom: 2rpx solid $uni-border-color;
		&:last-child {
			border-bottom: none;
		}
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.add-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
