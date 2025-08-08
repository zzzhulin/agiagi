<template>
	<Flexbox direction="column" gap="12" className="settlement-page" v-if="order">
		<Navbar title="确认订单"></Navbar>
		<Flexbox align="justify" className="address-container" v-if="addressInfo.id" @tap="navigateTo('/pagesD/address/address?from=settlement')">
			<Flexbox align="center" gap="12">
				<Icon src="icon_location.png" size="28"></Icon>
				<Flexbox direction="column" gap="4">
					<Typography fontSize="16" :bold="true">
						{{ addressInfo.full_address + addressInfo.address }}
					</Typography>
					<Flexbox gap="12">
						<Typography color="gray1">{{ addressInfo.name }}</Typography>
						<Typography color="gray1">{{ addressInfo.mobile }}</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Icon src="icon_arrow-right.png" size="24"></Icon>
		</Flexbox>
		<Flexbox align="left" gap="8" className="address-container empty" v-else @tap="navigateTo('/pagesD/address/address?from=settlement')">
			<Icon src="icon_add-primary.png" size="32"></Icon>
			<Typography fontSize="16">添加收货地址</Typography>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="product-container">
			<Flexbox gap="12" v-for="cart in order.shop_goods_list.goods_list" :key="cart.sku_id" @tap="navigateTo(`/pagesD/product/product?skuId=${cart.sku_id}`)">
				<Icon :src="cart.sku_image" type="remote" size="88" className="product-cover"></Icon>
				<Flexbox align="justify" direction="column" className="product-content">
					<Flexbox direction="column" gap="3" className="product-info">
						<Typography>{{ cart.sku_name }}</Typography>
						<Typography fontSize="12" color="gray2">{{ extractSpecs(cart.sku_name) }}</Typography>
					</Flexbox>
					<Flexbox align="justify" className="full-width">
						<Flexbox align="baseline">
							<Typography fontSize="12" color="#FF5100">￥</Typography>
							<Typography color="#FF5100">{{ cart.price }}</Typography>
						</Flexbox>
						<Typography :bold="true">x {{ cart.num }}</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<input v-model="mark" type="text" placeholder="买家留言，限45字" placeholder-class="placeholder" class="message-input" />
		</Flexbox>
		<Flexbox direction="column" className="settlement-container">
			<Flexbox align="justify" className="settlement-item">
				<Typography>商品总价</Typography>
				<Flexbox align="baseline">
					<Typography fontSize="12">￥</Typography>
					<Typography>{{ order.goods_money }}</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox align="justify" className="settlement-item">
				<Typography>运费</Typography>
				<Flexbox align="baseline">
					<Typography fontSize="12">￥</Typography>
					<Typography>{{ order.delivery_money }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="justify" className="tabbar">
			<Flexbox align="center">
				<Typography :bold="true">合计付款：</Typography>
				<Typography color="#FF5100" :bold="true">￥</Typography>
				<Typography fontSize="22" color="#FF5100" :bold="true">{{ order.pay_money }}</Typography>
			</Flexbox>
			<Flexbox align="center" className="pay-btn" @tap="createOrder">
				<Typography fontSize="18" color="white" :bold="true">立即支付</Typography>
			</Flexbox>
		</Flexbox>
	</Flexbox>
</template>

<script>
import { mapState } from 'vuex';
import { extractSpecs } from '@/utils/util';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			extractSpecs,
			mark: '',
			order: null
		};
	},
	onLoad(option) {
		const ids = decodeURIComponent(option.cartIds);
		this.getGoods(ids);
	},
	computed: {
		...mapState(['addressInfo'])
	},
	methods: {
		createOrder() {
			if (!this.addressInfo || !this.addressInfo.id) {
				uni.showToast({ title: '请添加收货地址', icon: 'none' });
				return;
			}
			uni.showLoading({ title: '正在下单...', mask: true });
			request({
				url: '/api/ordercreate/create',
				method: 'POST',
				data: {
					cart_ids: this.order.cart_ids,
					delivery: JSON.stringify(this.order.shop_goods_list.delivery),
					buyer_message: this.mark,
					member_address: JSON.stringify(this.addressInfo)
				},
				success: (res) => {
					if (res) {
						this.getPayInfo(res);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getPayInfo(out_trade_no) {
			request({
				url: '/api/pay/pay',
				method: 'POST',
				data: { pay_type: 'wechatpay', out_trade_no },
				success: (res) => {
					if (res) {
						if (res.pay_success) {
							this.navigateToSuccess();
						} else {
							this.wxPay(res);
						}
					}
				},
				complete: () => {
					uni.hideLoading();
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
					this.navigateToSuccess();
				},
				fail: (err) => {
					console.log('支付失败', err);
				}
			});
		},
		navigateToSuccess() {
			uni.redirectTo({
				url: '/pagesD/success/success'
			});
		},
		getGoods(cart_ids) {
			request({
				url: '/api/ordercreate/calculate',
				method: 'POST',
				data: {
					cart_ids
				},
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
.settlement-page {
	padding: 0 32rpx;
	min-height: 100vh;
	background-color: $uni-bg-color;

	.address-container {
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.address-container.empty {
		padding: 24rpx 32rpx;
	}

	.product-container {
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.product-content {
		flex: 1;
		height: 176rpx;
	}

	.product-cover {
		flex: none;
		border-radius: 8rpx;
	}

	.product-info {
		margin-right: auto;
	}

	.message-input {
		min-height: auto;
		line-height: 1;
		height: 72rpx;
		padding: 0 16rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
		overflow: hidden;
	}

	.input-placeholder {
		color: $uni-text-color-gray2;
	}

	.settlement-container {
		padding: 8rpx 24rpx;
		background-color: #fff;
		border-radius: 24rpx;
	}

	.settlement-item {
		height: 88rpx;
	}

	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 12rpx 32rpx 80rpx 32rpx;
	}

	.pay-btn {
		width: 240rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
