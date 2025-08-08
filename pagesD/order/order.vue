<template>
	<view class="order-page">
		<Navbar title="订单列表"></Navbar>
		<Flexbox align="justify" className="tab-container">
			<Flexbox align="center" className="tab-item" @tap="selectTab(tab.value)" v-for="tab in tabs" :key="tab.value">
				<Typography fontSize="16" :color="activeTab !== tab.value ? 'gray1' : ''" :bold="activeTab === tab.value">{{ tab.label }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="order-container">
			<Flexbox
				direction="column"
				className="order-item"
				gap="16"
				v-for="(order, index) in orders"
				:key="order.order_id"
				@tap="navigateTo(`/pagesD/order/detail?orderId=${order.order_id}`)"
			>
				<Flexbox align="justify" className="full-width">
					<Typography>订单编号：{{ order.order_no }}</Typography>
					<Typography color="warning">{{ order.order_status_name }}</Typography>
				</Flexbox>
				<Flexbox className="product-item" gap="12" v-for="goods in order.order_goods" :key="goods.sku_id">
					<Icon :src="goods.sku_image" size="88" type="remote" className="product-cover"></Icon>
					<Flexbox align="justify" direction="column" className="product-content">
						<Flexbox direction="column" gap="8" className="full-width">
							<Flexbox align="justify" gap="8">
								<Typography className="product-name">{{ goods.sku_name }}</Typography>
								<Flexbox align="baseline">
									<Typography fontSize="12" :bold="true">¥</Typography>
									<Typography :bold="true">{{ goods.price }}</Typography>
								</Flexbox>
							</Flexbox>
							<Flexbox align="justify">
								<Typography color="gray2">{{ extractSpecs(goods.sku_name) }}</Typography>
								<Typography color="gray2">x{{ goods.num }}</Typography>
							</Flexbox>
						</Flexbox>
						<Flexbox align="baseline" gap="2" className="order-price">
							<Typography>实付款</Typography>
							<Typography fontSize="12" :bold="true">¥</Typography>
							<Typography fontSize="18" :bold="true">{{ order.pay_money }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox align="right" gap="8" className="btn-group" v-if="order.action.length">
					<Flexbox align="center" className="order-btn" v-if="[0].includes(order.order_status)" @tap.stop="cancelOrder(order.order_id, index)">
						<Typography color="gray1">取消订单</Typography>
					</Flexbox>
					<Flexbox align="center" className="order-btn pay-btn" v-if="!order.order_status" @tap.stop="payOrder(order.out_trade_no, index)">
						<Typography color="white">支付</Typography>
					</Flexbox>
					<Flexbox align="center" className="order-btn" v-if="order.order_status > 1" @tap.stop="navigateTo(`/pagesD/logistics/logistics?orderId=${order.order_id}`)">
						<Typography color="gray1">查看物流</Typography>
					</Flexbox>
					<Flexbox align="center" className="order-btn confirm-btn" v-if="order.order_status === 3" @tap.stop="takeOrder(order.order_id, index)">
						<Typography color="white">确认收货</Typography>
					</Flexbox>
					<Flexbox align="center" className="order-btn" v-if="order.order_status === 4" @tap.stop="navigateTo(`/pagesD/evaluate/evaluate?orderId=${order.order_id}`)">
						<Typography color="gray1">评价</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" gap="8" className="empty-content" v-if="loaded && !orders.length">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无订单</Typography>
		</Flexbox>
	</view>
</template>

<script>
import { request } from '@/utils/request';
import { extractSpecs } from '@/utils/util';
export default {
	data() {
		return {
			extractSpecs,
			tabs: [
				{
					value: 'all',
					label: '全部'
				},
				{
					value: 'waitpay',
					label: '待支付'
				},
				{
					value: 'waitsend',
					label: '待发货'
				},
				{
					value: 'waitconfirm',
					label: '待收货'
				},
				{
					value: 'waitrate',
					label: '待评价'
				}
			],
			activeTab: 'all',
			page: 1,
			orders: [],
			total: 0,
			loaded: false
		};
	},
	onLoad(option) {
		this.activeTab = option.tab;
	},
	onShow() {
		this.getOrders();
	},
	onReachBottom() {
		if (this.orders.length < this.total) {
			this.page++;
			this.getOrders();
		}
	},
	methods: {
		payOrder(out_trade_no, index) {
			request({
				url: '/api/pay/pay',
				method: 'POST',
				data: { pay_type: 'wechatpay', out_trade_no },
				success: (res) => {
					if (res) {
						if (res.pay_success) {
							this.orders[index].order_status = 1;
							this.orders[index].order_status_name = '待发货';
						} else {
							this.wxPay(res, index);
						}
					}
				}
			});
		},
		wxPay(payData, index) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payData.timeStamp,
				nonceStr: payData.nonceStr,
				package: payData.package,
				signType: payData.signType,
				paySign: payData.paySign,
				success: (res) => {
					this.orders[index].order_status = 1;
					this.orders[index].order_status_name = '待发货';
				},
				fail: (err) => {
					console.log('支付失败', err);
				}
			});
		},
		cancelOrder(order_id, index) {
			uni.showModal({
				title: '提示',
				content: '确定取消订单吗？',
				success: (res) => {
					if (res.confirm) {
						request({
							url: '/api/order/close',
							method: 'POST',
							data: {
								order_id
							},
							success: (result) => {
								if (result) {
									this.orders[index].order_status = -1;
									this.orders[index].order_status_name = '已关闭';
								}
							}
						});
					}
				}
			});
		},
		takeOrder(order_id, index) {
			uni.showModal({
				title: '提示',
				content: '确定收货吗？',
				success: (res) => {
					if (res.confirm) {
						request({
							url: '/api/order/takeDelivery',
							method: 'POST',
							data: {
								order_id
							},
							success: (result) => {
								if (result) {
									this.orders[index].order_status = 3;
									this.orders[index].order_status_name = '待评价';
								}
							}
						});
					}
				}
			});
		},
		selectTab(value) {
			this.activeTab = value;
			this.page = 1;
			this.loaded = false;
			this.orders = [];
			this.getOrders();
		},
		getOrders() {
			request({
				url: '/api/order/lists',
				method: 'POST',
				data: {
					page: this.page,
					page_size: 20,
					order_status: this.activeTab
				},
				success: (res) => {
					if (res && res.count) {
						if (this.page === 1) {
							this.orders = res.list;
						} else {
							this.orders = this.orders.concat(res.list);
						}
						this.total = res.count;
					}
				},
				complete: () => {
					this.loaded = true;
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
.order-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	.tab-container {
		position: fixed;
		padding: 0 32rpx;
		width: 100%;
		height: 88rpx;
		background-color: #fff;
	}

	.order-container {
		padding: 120rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	}

	.order-item {
		padding: 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.product-cover {
		flex: none;
		border-radius: 8rpx;
	}

	.product-content {
		width: calc(100% - 176rpx - 24rpx);
	}

	.product-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.order-price {
		margin-left: auto;
	}

	.order-btn {
		width: 156rpx;
		height: 64rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		border-radius: 44rpx;
	}

	.pay-btn,
	.confirm-btn {
		box-shadow: none;
		background-color: $uni-color-warning;
	}

	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
