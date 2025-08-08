<template>
	<view class="refund-detail-page" v-if="refund">
		<Navbar title="售后详情"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox direction="column" className="status-container">
				<Flexbox align="left" className="refund-status">
					<Typography fontSize="16">{{ refund.refund_status_name }}</Typography>
				</Flexbox>
				<Flexbox direction="column" gap="4" v-if="refund.refund_status == 1">
					<Typography fontSize="12" color="gray2">如果商家拒绝，你可重新发起申请</Typography>
					<Typography fontSize="12" color="gray2">如果商家同意，将通过申请并退款给你</Typography>
				</Flexbox>
				<Flexbox direction="column" gap="4" v-if="refund.refund_status == 5">
					<Typography fontSize="12" color="gray2">如果商家确认收货将会退款给你</Typography>
					<Typography fontSize="12" color="gray2">如果商家拒绝收货，该次退款将会关闭，你可以重新发起退款</Typography>
				</Flexbox>
			</Flexbox>
			<Flexbox align="justify" className="log-container" @tap="navigateTo(`/pagesD/refund/log?orderGoodsId=${orderGoodsId}`)">
				<Typography>协商历史</Typography>
				<Icon src="icon_arrow-right.png" size="20"></Icon>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="refund-container">
				<Flexbox gap="12" @tap="navigateTo(`/pagesD/product/product?skuId=${refund.sku_id}`)">
					<Icon :src="refund.sku_image" size="88" type="remote" className="product-cover"></Icon>
					<Flexbox align="justify" direction="column" className="product-content">
						<Flexbox direction="column" gap="3" className="full-width">
							<Typography className="product-name">{{ refund.sku_name }}</Typography>
							<Typography fontSize="12" color="gray2">{{ extractSpecs(refund.sku_name) }}</Typography>
						</Flexbox>
						<Flexbox align="justify" className="full-width">
							<Flexbox align="baseline">
								<Typography fontSize="12" color="#FF5100">￥</Typography>
								<Typography color="#FF5100">{{ refund.price }}</Typography>
							</Flexbox>
							<Typography :bold="true">x {{ refund.num }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<block v-if="refund.refund_status == 4">
					<Flexbox align="justify">
						<Typography color="gray2">收货人</Typography>
						<Typography>{{ refund.shop_contacts }}</Typography>
					</Flexbox>
					<Flexbox align="justify">
						<Typography color="gray2">联系方式</Typography>
						<Typography>{{ refund.shop_mobile }}</Typography>
					</Flexbox>
					<Flexbox align="justify">
						<Typography color="gray2">退货地址</Typography>
						<Typography>{{ refund.shop_address }}</Typography>
					</Flexbox>
				</block>
				<Flexbox align="justify" v-if="refund.refund_status == 3 && refund.refund_real_money > 0">
					<Typography color="gray2">退款金额</Typography>
					<Typography>¥{{ refund.refund_real_money }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-else-if="refund.refund_apply_money > 0">
					<Typography color="gray2">退款金额</Typography>
					<Typography>¥{{ refund.refund_apply_money }}</Typography>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">退款方式</Typography>
					<Typography>{{ refund.refund_type == 1 ? '仅退款' : '退款退货' }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-if="refund.refund_status == 3">
					<Typography color="gray2">退款途径</Typography>
					<Typography>{{ refund.refund_money_type == 1 ? '原路退款' : refund.refund_money_type == 2 ? '线下退款' : '退款到余额' }}</Typography>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">退款原因</Typography>
					<Typography>{{ refund.refund_reason }}</Typography>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">退款编号</Typography>
					<Flexbox align="center" gap="8">
						<Typography>{{ refund.refund_no }}</Typography>
						<Typography fontSize="12" color="primary" @tap="onCopy">复制</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="justify">
					<Typography color="gray2">申请时间</Typography>
					<Typography>{{ formatDate(refund.refund_action_time * 1000, 'YYYY-MM-DD hh:mm:ss') }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-if="refund.refund_time">
					<Typography color="gray2">退款时间</Typography>
					<Typography>{{ formatDate(refund.refund_time * 1000, 'YYYY-MM-DD hh:mm:ss') }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-if="refund.refund_remark">
					<Typography color="gray2">退款说明</Typography>
					<Typography>{{ refund.refund_remark }}</Typography>
				</Flexbox>
				<Flexbox align="justify" v-if="refund.use_point">
					<Typography color="gray2">退款积分</Typography>
					<Typography>{{ refund.use_point }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="16" className="form-container" v-if="refund.refund_status === 2">
			<Flexbox align="justify" gap="16" className="refund-info">
				<Typography color="gray1">物流公司</Typography>
				<input v-model="formData.refund_delivery_name" placeholder="请输入物流公司" placeholder-class="placeholder" class="form-input" />
			</Flexbox>
			<Flexbox align="justify" gap="16" className="refund-info">
				<Typography color="gray1">物流单号</Typography>
				<input v-model="formData.refund_delivery_no" placeholder="请输入物流单号" placeholder-class="placeholder" class="form-input" />
			</Flexbox>
			<Flexbox direction="column" gap="12" className="refund-info">
				<Typography color="gray1">物流备注</Typography>
				<textarea v-model="formData.refund_delivery_remark" placeholder="请输入物流备注" placeholder-class="placeholder" class="form-textarea"></textarea>
			</Flexbox>
		</Flexbox>
		<Flexbox align="right" gap="8" className="btn-group" v-if="refund.refund_action.length">
			<Flexbox align="center" className="order-btn" v-if="refund.refund_status === 1" @tap="cancelRefund(refund.order_goods_id)">
				<Typography color="gray1">撤销维权</Typography>
			</Flexbox>
			<Flexbox align="center" className="order-btn" v-if="refund.refund_status === 2" @tap="returnGoods(refund.order_goods_id)">
				<Typography color="gray1">发起退货</Typography>
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
			orderGoodsId: '',
			refund: null,
			formData: {
				refund_delivery_name: '',
				refund_delivery_no: '',
				refund_delivery_remark: ''
			}
		};
	},
	onLoad(option) {
		this.orderGoodsId = option.orderGoodsId;
		this.getRefund();
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		returnGoods(order_goods_id) {
			if (!this.formData.refund_delivery_name) {
				uni.showToast({
					title: '请输入物流公司',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.refund_delivery_no) {
				uni.showToast({
					title: '请输入物流单号',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在退货...',
				mask: true
			});
			request({
				url: '/api/orderrefund/delivery',
				method: 'POST',
				data: {
					order_goods_id,
					...this.formData
				},
				success: (res) => {
					if (res) {
						this.getRefund();
					}
				}
			});
		},
		cancelRefund(order_goods_id) {
			uni.showLoading({
				title: '正在撤销...',
				mask: true
			});
			request({
				url: '/api/orderrefund/cancel',
				method: 'POST',
				data: {
					order_goods_id
				},
				success: (res) => {
					if (res) {
						uni.redirectTo({
							url: '/pagesD/order/order'
						});
					}
				}
			});
		},
		onCopy() {
			uni.setClipboardData({
				data: this.refund.refund_no,
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
		getRefund() {
			request({
				url: '/api/orderrefund/detail',
				method: 'POST',
				data: {
					order_goods_id: this.orderGoodsId
				},
				success: (res) => {
					if (res) {
						this.refund = res;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.refund-detail-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding: 32rpx 32rpx 176rpx 32rpx;

	.status-container,
	.log-container,
	.refund-container,
	.form-container {
		padding: 0 24rpx 24rpx 24rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.refund-container,
	.log-container,
	.form-container {
		padding-top: 24rpx;
	}

	.refund-status {
		height: 88rpx;
		margin-bottom: 24rpx;
		border-bottom: 2rpx solid $uni-border-color;
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

	.form-input {
		flex: 1;
		min-height: auto;
		height: auto;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 20rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
	}

	.form-textarea {
		width: 100%;
		height: 200rpx;
		padding: 20rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
	}
}
</style>
