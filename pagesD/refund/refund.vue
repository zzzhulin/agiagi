<template>
	<view class="refund-page">
		<Navbar title="申请退款"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox gap="12" className="product-container" v-if="goods" @tap="navigateTo(`/pagesD/product/product?skuId=${goods.sku_id}`)">
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
			<Flexbox direction="column" gap="16" className="refund-container">
				<Flexbox align="justify" className="refund-info">
					<Typography color="gray1">退款金额</Typography>
					<Typography>¥{{ refund_money }}</Typography>
				</Flexbox>
				<Flexbox align="justify" className="refund-info" v-if="formData.refund_type === 2">
					<Typography color="gray1">退货运费</Typography>
					<Typography>¥{{ refund_delivery_money }}</Typography>
				</Flexbox>
				<Flexbox align="justify" gap="15" className="refund-info">
					<Typography color="gray1">退款类型</Typography>
					<picker mode="selector" :value="refundTypeIndex" :range="refund_type" range-key="label" @change="onSelect($event, 'refundTypeIndex')">
						<Flexbox align="center" gap="26" className="refund-select">
							<input v-model="refund_type[refundTypeIndex].label" :disabled="true" placeholder="请选择退款类型" placeholder-class="placeholder" class="form-input" />
							<Icon src="icon_arrow-right.png" size="20"></Icon>
						</Flexbox>
					</picker>
				</Flexbox>
				<Flexbox align="justify" gap="15" className="refund-info">
					<Typography color="gray1">退款原因</Typography>
					<picker mode="selector" :value="refundReasonIndex" :range="refund_reason_type" @change="onSelect($event, 'refundReasonIndex')">
						<Flexbox align="center" gap="26" className="refund-select">
							<input v-model="formData.refund_reason" :disabled="true" placeholder="请选择退款原因" placeholder-class="placeholder" class="form-input" />
							<Icon src="icon_arrow-right.png" size="20"></Icon>
						</Flexbox>
					</picker>
				</Flexbox>
				<Flexbox direction="column" gap="12" className="refund-info">
					<Typography color="gray1">退款备注</Typography>
					<textarea v-model="formData.refund_remark" placeholder="请输入退款备注" placeholder-class="placeholder" class="form-textarea"></textarea>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar">
			<Flexbox align="center" className="apply-btn" @tap="onApply">
				<Typography fontSize="18" color="white" :bold="true">申请退款</Typography>
			</Flexbox>
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
			goods: null,
			refund_money: '',
			refund_type: [],
			refund_reason_type: [],
			refund_delivery_money: '',
			refundTypeIndex: '',
			refundReasonIndex: '',
			formData: {
				refund_type: '',
				order_goods_ids: '',
				refund_reason: '',
				refund_remark: ''
			}
		};
	},
	onLoad(option) {
		this.formData.order_goods_ids = option.orderGoodsId;
		this.getRefund();
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		onApply() {
			if (!this.formData.refund_type) {
				uni.showToast({
					title: '请选择退款类型',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.refund_reason) {
				uni.showToast({
					title: '请选择退款原因',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在申请...',
				mask: true
			});
			request({
				url: '/api/orderrefund/refund',
				method: 'POST',
				data: this.formData,
				success: (res) => {
					if (res) {
						uni.redirectTo({
							url: '/pagesD/refund/list'
						});
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		onSelect(e, field) {
			this[field] = e.detail.value;
			if (field === 'refundReasonIndex') {
				this.formData.refund_reason = this.refund_reason_type[e.detail.value];
			} else {
				this.formData.refund_type = this.refund_type[e.detail.value].value;
			}
		},
		getRefund() {
			request({
				url: '/api/orderrefund/refundData',
				method: 'POST',
				data: { order_goods_id: this.formData.order_goods_ids },
				success: (res) => {
					if (res) {
						this.goods = res.order_goods_info;
						this.refund_money = res.refund_money;
						this.refund_type = res.refund_type.map((item) => {
							let obj = { value: item, label: '' };
							if (item === 1) {
								obj.label = '退款';
							} else {
								obj.label = '退货';
							}
							return obj;
						});
						this.refund_reason_type = res.refund_reason_type;
						this.refund_delivery_money = res.refund_delivery_money;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.refund-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding: 32rpx 32rpx 168rpx 32rpx;
	.product-container,
	.refund-container {
		padding: 24rpx;
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

	picker {
		flex: 1;
		padding: 20rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
	}

	.form-input {
		flex: 1;
		min-height: auto;
		height: auto;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.form-textarea {
		width: 100%;
		height: 200rpx;
		padding: 20rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
	}

	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 12rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: $uni-bg-color;
	}

	.apply-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
