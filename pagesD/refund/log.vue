<template>
	<view class="refund-log-page">
		<Navbar title="协商历史"></Navbar>
		<Flexbox direction="column" gap="12">
			<Flexbox direction="column" gap="4" v-for="log in logs" :key="log.id" className="log-item">
				<Typography>{{ log.action_way === 1 ? '买家' : '卖家' }}</Typography>
				<Typography color="gray2">{{ formatDate(log.action_time * 1000, 'YYYY-MM-DD hh:mm:ss') }}</Typography>
				<Typography>{{ log.action }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar">
			<Flexbox align="center" className="customer-btn">
				<button type="default" open-type="contact"></button>
				<Typography fontSize="18" color="white" :bold="true">联系客服</Typography>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { request } from '@/utils/request';
import { formatDate } from '@/utils/util';
export default {
	data() {
		return {
			formatDate,
			logs: [],
			orderGoodsId: ''
		};
	},
	onLoad(option) {
		this.orderGoodsId = option.orderGoodsId;
		this.getRefund();
	},
	methods: {
		getRefund() {
			request({
				url: '/api/orderrefund/detail',
				method: 'POST',
				data: {
					order_goods_id: this.orderGoodsId
				},
				success: (res) => {
					if (res) {
						this.logs = res.refund_log_list;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.refund-log-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding: 32rpx 32rpx 176rpx 32rpx;

	.log-item {
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 12rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: $uni-bg-color;
	}

	.customer-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
	
	button {
		position: absolute;
		width: 100%;
		height: 88rpx;
		opacity: 0;
	}
}
</style>
