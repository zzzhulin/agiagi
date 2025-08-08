<template>
	<view class="refund-list-page">
		<Navbar title="售后列表"></Navbar>
		<Flexbox direction="column" gap="16" className="order-container">
			<Flexbox
				direction="column"
				className="order-item"
				gap="16"
				v-for="(order, index) in orders"
				:key="order.order_id"
				@tap="navigateTo(`/pagesD/refund/detail?orderGoodsId=${order.order_goods_id}`)"
			>
				<Flexbox align="justify" className="full-width">
					<Typography>售后编号：{{ order.refund_no }}</Typography>
					<Typography color="warning">{{ order.refund_status_name }}</Typography>
				</Flexbox>
				<Flexbox className="product-item" gap="12" @tap="navigateTo(`/pagesD/product/product?skuId=${order.sku_id}`)">
					<Icon :src="order.sku_image" size="88" type="remote" className="product-cover"></Icon>
					<Flexbox align="justify" direction="column" className="product-content">
						<Flexbox direction="column" gap="8" className="full-width">
							<Flexbox align="justify" gap="8">
								<Typography className="product-name">{{ order.sku_name }}</Typography>
								<Flexbox align="baseline">
									<Typography fontSize="12" :bold="true">¥</Typography>
									<Typography :bold="true">{{ order.price }}</Typography>
								</Flexbox>
							</Flexbox>
							<Flexbox align="justify">
								<Typography color="gray2">{{ extractSpecs(order.sku_name) }}</Typography>
								<Typography color="gray2">x{{ order.num }}</Typography>
							</Flexbox>
						</Flexbox>
						<Flexbox align="baseline" gap="2" className="order-price">
							<Typography>退款</Typography>
							<Typography fontSize="12" :bold="true">¥</Typography>
							<Typography fontSize="18" :bold="true">{{ order.refund_status == 3 ? order.refund_real_money : order.refund_apply_money }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox align="right" gap="8" className="btn-group" v-if="order.refund_action.length">
					<Flexbox
						align="center"
						className="order-btn"
						v-for="btn in order.refund_action"
						:key="btn.event"
						@tap.stop="cancelOrder(order.order_goods_id, index, btn.title)"
					>
						<Typography color="gray1">{{ btn.title }}</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" gap="8" className="empty-content" v-if="loaded && !orders.length">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无售后订单</Typography>
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
			page: 1,
			orders: [],
			total: 0,
			loaded: false
		};
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
		cancelOrder(order_goods_id, index, title) {
			uni.showModal({
				title: '提示',
				content: `确定${title}吗？`,
				success: (res) => {
					if (res.confirm) {
						request({
							url: '/api/orderrefund/cancel',
							method: 'POST',
							data: {
								order_goods_id
							},
							success: (result) => {
								if (result) {
									this.orders.splice(index, 1);
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
				url: '/api/orderrefund/lists',
				method: 'POST',
				data: {
					page: this.page,
					page_size: 20
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
.refund-list-page {
	min-height: 100vh;
	background-color: $uni-bg-color;

	.order-container {
		padding: 32rpx 32rpx env(safe-area-inset-bottom) 32rpx;
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
