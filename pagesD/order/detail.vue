<template>
	<view class="order-detail-page" v-if="order">
		<Navbar title="订单详情" backgroundColor="transparent"></Navbar>
		<Flexbox direction="column" gap="12">
			<Flexbox direction="column">
				<Typography fontSize="22" :bold="true">{{ order.order_status_name }}</Typography>
				<Typography fontSize="12">{{ order.order_type_name }}</Typography>
			</Flexbox>
			<Flexbox align="left" gap="12" className="address-container">
				<Icon src="icon_location.png" size="28"></Icon>
				<Flexbox direction="column" gap="4">
					<Typography fontSize="16" :bold="true">
						{{ order.full_address + order.address }}
					</Typography>
					<Flexbox gap="12">
						<Typography color="gray1">{{ order.name }}</Typography>
						<Typography color="gray1">{{ order.mobile }}</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="16" className="order-container">
				<block v-for="goods in order.order_goods" :key="goods.goods_id">
					<Flexbox gap="12" className="product-item" @tap="navigateTo(`/pagesD/product/product?skuId=${goods.sku_id}`)">
						<Icon :src="goods.sku_image" size="88" type="remote" className="product-cover"></Icon>
						<Flexbox align="justify" direction="column" className="product-content">
							<Flexbox direction="column" gap="3" className="full-width">
								<Typography className="product-name">{{ goods.sku_name }}</Typography>
								<Typography fontSize="12" color="gray2">{{ extractSpecs(goods.sku_name) }}</Typography>
							</Flexbox>
							<Flexbox align="justify" className="full-width">
								<Flexbox align="baseline">
									<Typography fontSize="12" color="#FF5100">￥</Typography>
									<Typography color="#FF5100">{{ goods.price }}</Typography>
								</Flexbox>
								<Typography :bold="true">x {{ goods.num }}</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
					<Flexbox align="right" gap="8">
						<Flexbox align="center" className="order-btn" v-if="order.is_enable_refund" @tap="navigateTo(`/pagesD/refund/refund?orderGoodsId=${goods.order_goods_id}`)">
							<Typography color="gray1">退款</Typography>
						</Flexbox>
						<Flexbox align="center" className="order-btn" v-if="order.is_evaluate" @tap="navigateTo(`/pagesD/evaluate/evaluate?orderGoodsId=${goods.order_goods_id}`)">
							<Typography color="gray1">评价</Typography>
						</Flexbox>
					</Flexbox>
				</block>
				<Flexbox align="justify">
					<Typography color="gray2">实付款</Typography>
					<Flexbox align="baseline">
						<Typography fontSize="12" :bold="true">￥</Typography>
						<Typography fontSize="16" :bold="true">{{ order.pay_money }}</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">商品总价</Typography>
					<Typography>￥{{ order.order_money }}</Typography>
				</Flexbox>
				<!-- <Flexbox align="justify">
					<Typography color="gray2">优惠券</Typography>
					<Typography>￥{{ order.coupon_money }}</Typography>
				</Flexbox> -->
				<Flexbox align="justify">
					<Typography color="gray2">运费</Typography>
					<Typography>￥{{ order.delivery_money }}</Typography>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">订单编号</Typography>
					<Flexbox align="center" gap="8">
						<Typography>{{ order.order_no }}</Typography>
						<Typography fontSize="12" color="primary" @tap="onCopy">复制</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">下单时间</Typography>
					<Typography>{{ formatDate(order.create_time * 1000, 'YYYY-MM-DD hh:mm:ss') }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-if="order.pay_status === 1">
					<Typography color="gray2">付款时间</Typography>
					<Typography>{{ formatDate(order.pay_time * 1000, 'YYYY-MM-DD hh:mm:ss') }}</Typography>
				</Flexbox>
				<!-- <Flexbox align="justify">
					<Typography color="gray2">支付状态</Typography>
					<Typography>{{ order.pay_status === 1 ? '已支付' : '未支付' }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-if="order.pay_type_name">
					<Typography color="gray2">支付方式</Typography>
					<Typography>{{ order.pay_type_name }}</Typography>
				</Flexbox> -->
				<Flexbox align="justify" v-if="order.buyer_message">
					<Typography color="gray2">买家留言</Typography>
					<Typography>{{ order.buyer_message }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="right" gap="8" className="btn-group" v-if="order.action.length">
			<Flexbox align="center" className="order-btn" v-if="[0].includes(order.order_status)" @tap.stop="cancelOrder(order.order_id)">
				<Typography color="gray1">取消订单</Typography>
			</Flexbox>
			<Flexbox align="center" className="order-btn pay-btn" v-if="!order.order_status" @tap.stop="payOrder(order.out_trade_no)">
				<Typography color="white">支付</Typography>
			</Flexbox>
			<Flexbox align="center" className="order-btn" v-if="order.order_status > 1" @tap.stop="navigateTo(`/pagesD/logistics/logistics?orderId=${order.order_id}`)">
				<Typography color="gray1">查看物流</Typography>
			</Flexbox>
			<Flexbox align="center" className="order-btn confirm-btn" v-if="order.order_status === 3" @tap.stop="takeOrder(order.order_id)">
				<Typography color="white">确认收货</Typography>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { request } from '@/utils/request';
import { extractSpecs, formatDate } from '@/utils/util';
export default {
	data() {
		return {
			extractSpecs,
			formatDate,
			orderId: '',
			order: null
		};
	},
	onLoad(option) {
		this.orderId = option.orderId;
		this.getOrder();
	},
	methods: {
		onCopy() {
			uni.setClipboardData({
				data: this.order.order_no,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					});
				},
				fail: (err) => {
					console.error('复制失败', err);
				}
			});
		},
		payOrder(out_trade_no) {
			request({
				url: '/api/pay/pay',
				method: 'POST',
				data: { pay_type: 'wechatpay', out_trade_no },
				success: (res) => {
					if (res) {
						if (res.pay_success) {
							this.getOrder();
						} else {
							this.wxPay(res);
						}
					}
				}
			});
		},
		wxPay(payData) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payData.timeStamp,
				nonceStr: payData.nonceStr,
				package: payData.package,
				signType: payData.signType,
				paySign: payData.paySign,
				success: (res) => {
					this.getOrder();
				},
				fail: (err) => {
					console.log('支付失败', err);
				}
			});
		},
		cancelOrder(order_id) {
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
									this.getOrder();
								}
							}
						});
					}
				}
			});
		},
		takeOrder(order_id) {
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
									this.getOrder();
								}
							}
						});
					}
				}
			});
		},
		getOrder() {
			request({
				url: '/api/order/detail',
				method: 'POST',
				data: { order_id: this.orderId },
				success: (res) => {
					if (res) {
						this.order = res;
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
.order-detail-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding: 32rpx 32rpx 176rpx 32rpx;

	.address-container,
	.order-container {
		padding: 34rpx 32rpx;
		border-radius: 24rpx;
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

	.order-btn {
		width: 156rpx;
		height: 64rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2 inset;
		border-radius: 44rpx;
	}

	.btn-group {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 24rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.pay-btn,
	.confirm-btn {
		box-shadow: none;
		background-color: $uni-color-warning;
	}
}
</style>
