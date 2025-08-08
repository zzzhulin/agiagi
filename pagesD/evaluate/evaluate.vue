<template>
	<view class="evaluate-page">
		<Navbar title="申请评价"></Navbar>
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
			<Flexbox direction="column" gap="16" className="form-container">
				<textarea v-model="formData.goods_evaluate" placeholder="请输入商品评价" placeholder-class="placeholder" class="form-textarea"></textarea>
				<Flexbox align="left" gap="5" @tap="setAnonymous">
					<Icon src="checkbox-active.png" size="20" v-if="formData.is_anonymous === 1"></Icon>
					<Icon src="checkbox.png" size="20" v-else></Icon>
					<Typography>匿名评价</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar">
			<Flexbox align="center" className="evaluate-btn" @tap="onEvaluate">
				<Typography fontSize="18" color="white" :bold="true">提交评价</Typography>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
import { extractSpecs } from '@/utils/util';
export default {
	data() {
		return {
			extractSpecs,
			goodsId: '',
			orderId: '',
			orderNo: '',
			goods: null,
			formData: {
				goods_evaluate: '',
				is_anonymous: 0
			}
		};
	},
	onLoad(option) {
		this.goodsId = option.goodsId;
		this.orderId = option.orderId;
		this.orderNo = option.orderNo;
		this.getGoods();
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
		onEvaluate() {
			if (!this.formData.goods_evaluate) {
				uni.showToast({
					title: '请输入商品评价',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在提交...',
				mask: true
			});
			request({
				url: '/api/Goodsevaluate/add',
				method: 'POST',
				data: {
					order_id: this.orderId,
					order_no: this.orderNo,
					member_name: this.userInfo.nickname,
					member_headimg: this.userInfo.headimg,
					...this.formData
				},
				success: (res) => {
					if (res) {
						uni.navigateBack();
					}
				}
			});
		},
		setAnonymous() {
			this.formData.is_anonymous = this.formData.is_anonymous === 1 ? 0 : 1;
		},
		getGoods() {
			request({
				url: '/api/Goodsevaluate/firstinfo',
				method: 'POST',
				data: { goods_id: this.goodsId },
				success: (res) => {
					if (res) {
						this.goods = res;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.evaluate-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding: 32rpx 32rpx 176rpx 32rpx;

	.form-container,
	.product-container {
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

	.form-textarea {
		width: 100%;
		height: 300rpx;
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

	.evaluate-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
