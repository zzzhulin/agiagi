<template>
	<view class="user-page">
		<Navbar :fixed="false" backgroundColor="transparent"></Navbar>
		<Icon src="user-background.png" width="375" mode="widthFix" className="background"></Icon>
		<Flexbox align="left" gap="12" className="user-container">
			<Icon :src="userInfo.headimg" size="60" :circle="true" type="remote"></Icon>
			<Typography fontSize="18" :bold="true">{{ userInfo.nickname }}</Typography>
		</Flexbox>
		<Flexbox align="justify" className="count-container">
			<Flexbox direction="column" align="center">
				<Typography fontSize="24" :bold="true">{{ contractCount }}</Typography>
				<Typography color="gray2">服务合约</Typography>
			</Flexbox>
			<Flexbox direction="column" align="center">
				<Typography fontSize="24" :bold="true">{{ userInfo.point }}</Typography>
				<Typography color="gray2">积分</Typography>
			</Flexbox>
			<Flexbox direction="column" align="center">
				<Typography fontSize="24" :bold="true">{{ familyCount }}</Typography>
				<Typography color="gray2">我的家人</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="8" className="order-container">
			<Flexbox align="justify" className="order-total">
				<Typography fontSize="16" :bold="true">我的订单</Typography>
				<Flexbox align="center" @tap="navigateTo('/pagesD/order/order?tab=all')">
					<Typography color="gray2">全部</Typography>
					<Icon src="icon_arrow-right.png" size="20"></Icon>
				</Flexbox>
			</Flexbox>
			<Flexbox align="justify">
				<Flexbox direction="column" align="center" gap="4" @tap="navigateTo('/pagesD/order/order?tab=waitpay')">
					<view class="order-icon">
						<Icon src="icon_wait-pay.png" size="28"></Icon>
						<Flexbox align="center" className="order-count" v-if="waitpay">
							<Typography fontSize="10" color="white">{{ waitpay }}</Typography>
						</Flexbox>
					</view>
					<Typography>待支付</Typography>
				</Flexbox>
				<Flexbox direction="column" align="center" gap="4" @tap="navigateTo('/pagesD/order/order?tab=waitsend')">
					<view class="order-icon">
						<Icon src="icon_wait-delivery.png" size="28"></Icon>
						<Flexbox align="center" className="order-count" v-if="waitsend">
							<Typography fontSize="10" color="white">{{ waitsend }}</Typography>
						</Flexbox>
					</view>
					<Typography>待发货</Typography>
				</Flexbox>
				<Flexbox direction="column" align="center" gap="4" @tap="navigateTo('/pagesD/order/order?tab=waitconfirm')">
					<view class="order-icon">
						<Icon src="icon_wait-take.png" size="28"></Icon>
						<Flexbox align="center" className="order-count" v-if="waitconfirm">
							<Typography fontSize="10" color="white">{{ waitconfirm }}</Typography>
						</Flexbox>
					</view>
					<Typography>待收货</Typography>
				</Flexbox>
				<Flexbox direction="column" align="center" gap="4" @tap="navigateTo('/pagesD/order/order?tab=waitrate')">
					<view class="order-icon">
						<Icon src="icon_wait-comment.png" size="28"></Icon>
						<Flexbox align="center" className="order-count" v-if="waitrate">
							<Typography fontSize="10" color="white">{{ waitrate }}</Typography>
						</Flexbox>
					</view>
					<Typography>待评价</Typography>
				</Flexbox>
				<Flexbox direction="column" align="center" gap="4" @tap="navigateTo('/pagesD/refund/list')">
					<view class="order-icon">
						<Icon src="icon_after-sale.png" size="28"></Icon>
						<Flexbox align="center" className="order-count" v-if="refunding">
							<Typography fontSize="10" color="white">{{ refunding }}</Typography>
						</Flexbox>
					</view>
					<Typography>售后/退款</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" className="menu-container">
			<Flexbox align="justify" v-for="menu in menus" :key="menu.url" className="menu-item" @tap="navigateTo(menu.url)">
				<Flexbox align="left" gap="12">
					<Icon :src="menu.icon" size="28"></Icon>
					<Typography fontSize="16">{{ menu.title }}</Typography>
				</Flexbox>
				<Icon src="icon_arrow-right.png" size="24"></Icon>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="logout-btn" @tap="onLogout">
			<Typography fontSize="18" color="white" :bold="true">退出登录</Typography>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { request } from '@/utils/request';
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			refunding: 0,
			waitconfirm: 0,
			waitpay: 0,
			waitrate: 0,
			waitsend: 0
		};
	},
	onShow() {
		this.getOrderCount();
	},
	computed: {
		...mapState(['userInfo', 'contractCount', 'familyCount']),
		menus() {
			return [
				{
					url: '/pagesA/profile/profile?tab=base',
					title: '健康档案',
					icon: 'icon_user-profile.png'
				},
				{
					url: '/pagesE/family/list',
					title: '家人管理',
					icon: 'icon_user-family.png'
				},
				{
					url: '/pagesD/address/address',
					title: '收货地址',
					icon: 'icon_user-address.png'
				}
				// {
				// 	url: '/pagesE/user/setting',
				// 	title: '设置',
				// 	icon: 'icon_user-setting.png'
				// }
			];
		}
	},
	methods: {
		...mapActions(['logout']),
		onLogout() {
			uni.showModal({
				title: '提示',
				content: '确定退出登录吗',
				success: async (res) => {
					if (res.confirm) {
						this.logout();
					}
				}
			});
		},
		getOrderCount() {
			request({
				url: '/api/order/num',
				method: 'POST',
				data: {
					order_status: 'waitpay,waitsend,waitconfirm,waitrate,refunding'
				},
				success: (res) => {
					if (res) {
						for (let field in res) {
							this[field] = res[field];
						}
					}
				}
			});
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		}
	}
};
</script>

<style lang="scss">
.user-page {
	.background {
		position: absolute;
	}

	.user-container {
		position: relative;
		padding: 196rpx 0 48rpx 30rpx;
	}

	.count-container {
		position: relative;
		margin: 0 56rpx;
	}

	.order-container {
		position: relative;
		padding: 28rpx 16rpx;
		margin: 48rpx 32rpx;
		background-color: #fff;
		box-shadow: 0rpx 8rpx 8rpx 0rpx #0000000d;
		border-radius: 24rpx;
	}

	.order-total {
		height: 88rpx;
	}

	.order-icon {
		position: relative;
	}

	.order-count {
		position: absolute;
		right: -8rpx;
		top: -8rpx;
		width: 32rpx;
		height: 32rpx;
		background-color: $uni-color-danger;
		border-radius: 50%;
	}

	.menu-container {
		margin: 0 48rpx;
	}

	.menu-item {
		position: relative;
		height: 112rpx;
		&::after {
			position: absolute;
			right: 0;
			bottom: 0;
			content: '';
			width: 100%;
			height: 2rpx;
			background-color: $uni-bg-color;
		}
	}

	.logout-btn {
		margin: 48rpx 32rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
