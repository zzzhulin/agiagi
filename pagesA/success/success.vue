<template>
	<Flexbox align="center" direction="column" className="success-page">
		<Navbar />
		<Icon src="icon_success.png" size="128" />
		<Typography fontSize="18" :bold="true" v-if="from === 'sign'" className="title">支付成功</Typography>
		<Typography fontSize="18" :bold="true" className="title" v-else>领取成功</Typography>
		<Typography color="gray1">合约{{ orderInfo.card_name || '' }}已放入您的合约中</Typography>
		<Flexbox gap="20" className="btn-group">
			<Flexbox align="center" className="present-btn" v-if="orderInfo.is_allow_transfer === 1 && orderInfo.is_transfer === 0" @tap="navigateToGive">
				<Typography fontSize="16" color="gray1">转赠好友</Typography>
			</Flexbox>
			<Flexbox align="center" className="activate-btn" v-if="orderInfo.status !== 'used'" @tap="onActivate">
				<Typography fontSize="16" color="white" :bold="true">立即领取</Typography>
			</Flexbox>
			<Flexbox align="center" className="present-btn" v-if="from === 'sign'" @tap="navigateTo('/pagesA/overview/overview')">
				<Typography fontSize="16" color="gray1">回到首页</Typography>
			</Flexbox>
			<Flexbox align="center" className="activate-btn" v-if="from === 'sign'" @tap="navigateTo('/pagesA/contract/contract')">
				<Typography fontSize="16" color="gray1">查看合约</Typography>
			</Flexbox>
		</Flexbox>

		<Login></Login>
	</Flexbox>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			orderInfo: null,
			outTradeNo: '',
			from: ''
		};
	},
	onLoad(option) {
		this.outTradeNo = option.outTradeNo;
		this.from = option.from;
		this.getOrderInfo();
	},
	methods: {
		getOrderInfo() {
			request({
				url: '/contract/api/membercard/payOrderCardInfo',
				method: 'POST',
				data: { out_trade_no: this.outTradeNo },
				success: (res) => {
					if (res) {
						this.orderInfo = res;
					}
				}
			});
		},
		navigateTo(url) {
			uni.redirectTo({
				url
			});
		},
		navigateToGive() {
			if (this.orderInfo.is_transfer) {
				uni.showToast({
					title: '该合约已经被转赠过啦～',
					icon: 'none'
				});
				return;
			}
			uni.redirectTo({
				url: `/pagesA/gift/blessing?cardId=${this.orderInfo.member_card_id}&outTradeNo=${this.outTradeNo}`
			});
		},
		onActivate() {
			const { card_no, card_cdk } = this.orderInfo;
			request({
				url: '/contract/api/activate/activate',
				method: 'POST',
				data: { card_no, card_cdk },
				success: (res) => {
					if (res) {
						uni.redirectTo({
							url: `/pagesA/contract/contract`
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.success-page {
	padding-top: 80rpx;

	.title {
		margin: 64rpx 0 40rpx 0;
	}

	.btn-group {
		margin-top: 128rpx;
	}
	.present-btn,
	.activate-btn {
		position: relative;
		width: 240rpx;
		height: 72rpx;
		border-radius: 44rpx;
	}
	.present-btn {
		box-shadow: 0 0 0 2rpx $uni-text-color-gray1 inset;
	}
	.activate-btn {
		background-color: $uni-color-primary;
	}
}
</style>
