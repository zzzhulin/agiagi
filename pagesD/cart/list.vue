<template>
	<view class="cart-list-page">
		<Navbar title="智选" :backgroundColor="navbarBgColor" />

		<!-- 有商品时 -->
		<Flexbox v-if="goodsList.length" direction="column" gap="16" className="product-container">
			<Flexbox v-for="(goods, index) in goodsList" :key="goods.goods_id" align="center" gap="16" className="product-item">
				<Icon :src="selected[index] ? 'checkbox-active.png' : 'checkbox-gray.png'" size="24" className="checkbox" @tap="toggleSelect(index)" />
				<Flexbox gap="12" @tap="navigateTo(`/pagesD/product/product?skuId=${goods.sku_id}`)">
					<Icon :src="goods.sku_image" mode="aspectFit" size="80" type="remote" className="product-image" />
					<Flexbox align="justify" direction="column">
						<Flexbox direction="column">
							<Typography fontSize="16" className="product-name">
								{{ goods.sku_name }}
							</Typography>
							<Typography fontSize="12" color="gray2">规格：{{ extractSpecs(goods.sku_name) }}</Typography>
						</Flexbox>
						<Flexbox align="justify" className="full-width">
							<Flexbox align="baseline">
								<Typography fontSize="12" color="#F77F36" :bold="true">¥</Typography>
								<Typography fontSize="16" color="#F77F36" :bold="true">
									{{ goods.price }}
								</Typography>
							</Flexbox>
							<Flexbox gap="12">
								<Flexbox align="center" :className="['minus-btn', { disabled: counts[index] === 1 }]" @tap.stop="changeCount('minus', index)" />
								<Typography>{{ counts[index] }}</Typography>
								<Flexbox align="center" :className="['plus-btn', { disabled: counts[index] >= (goods.stock || 1) }]" @tap.stop="changeCount('plus', index)" />
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>

		<!-- 购物车空提示 -->
		<Flexbox v-if="!goodsList.length && loaded" align="center" direction="column" gap="16" className="empty-content">
			<Icon src="empty.png" size="128" />
			<Typography color="gray2">购物车是空的</Typography>
		</Flexbox>

		<!-- 底部栏 -->
		<Flexbox v-if="goodsList.length" align="justify" className="tabbar-container">
			<Flexbox align="left" gap="8" @tap="toggleSelectAll">
				<Icon :src="selectAll ? 'checkbox-active.png' : 'checkbox-gray.png'" size="24" className="checkbox" />
				<Typography fontSize="16">全选</Typography>
			</Flexbox>
			<Flexbox align="center" gap="16">
				<Flexbox align="baseline" gap="3">
					<Typography fontSize="13">合计</Typography>
					<Typography fontSize="13" color="warning" :bold="true">¥</Typography>
					<Typography fontSize="18" color="warning" :bold="true">
						{{ totalPrice }}
					</Typography>
				</Flexbox>
				<Flexbox align="center" className="settle-btn" @tap="checkout">
					<Typography fontSize="16" color="white" :bold="true">结算</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { extractSpecs } from '@/utils/util';
import { request } from '@/utils/request';
import cartMixin from '@/mixins/cart';
export default {
	mixins: [cartMixin],
	data() {
		return {
			extractSpecs,
			navbarBgColor: 'transparent',
			location: '天府新谷'
		};
	},
	onLoad(option) {
		this.initCart(this.userInfo.member_id, option.text);
	},
	onPageScroll(e) {
		this.navbarBgColor = e.scrollTop >= 50 ? '#ffffff' : 'transparent';
	},
	computed: {
		...mapState(['userInfo'])
	}
};
</script>

<style lang="scss">
.cart-list-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding-bottom: 188rpx;

	.position-container {
		padding: 20rpx 24rpx 32rpx 24rpx;
	}
	.checkbox {
		flex: none;
	}
	.product-container {
		margin: 32rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
		padding: 24rpx;
		border-radius: 24rpx;
	}
	.product-image {
		flex: none;
		border-radius: 8rpx;
	}
	.product-name {
		width: 374rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.plus-btn,
	.minus-btn {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		background-color: $uni-color-primary;
	}
	.plus-btn:before {
		position: absolute;
		content: '';
		width: 4rpx;
		height: 20rpx;
		border-radius: 4rpx;
		background-color: #fff;
	}
	.minus-btn::after,
	.plus-btn::after {
		content: '';
		width: 20rpx;
		height: 4rpx;
		border-radius: 4rpx;
		background-color: #fff;
	}

	.plus-btn.disabled {
		background-color: $uni-border-color;
	}

	.minus-btn.disabled {
		background-color: $uni-color-danger;
	}
	.tabbar-container {
		position: fixed;
		bottom: 0;
		padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom)) 24rpx;
		width: 100%;
		background-color: #fff;
	}
	.settle-btn {
		width: 198rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
	.empty-content {
		margin: auto;
		height: 70vh;
	}
}
</style>
