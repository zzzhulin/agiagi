<template>
	<view class="product-page" v-if="goods">
		<Navbar title="商品详情"></Navbar>
		<Flexbox direction="column">
			<swiper :circular="true" :autoplay="true" class="swiper-content">
				<swiper-item v-for="image in goods.sku_images_list" :key="image.pic_path">
					<image :src="image.pic_path" class="product-cover"></image>
				</swiper-item>
			</swiper>
			<Flexbox direction="column" className="product-content">
				<Flexbox align="justify" className="product-price">
					<Flexbox align="baseline" gap="8">
						<Flexbox align="baseline">
							<Typography fontSize="16" color="#FF5100" :bold="true">￥</Typography>
							<block v-if="goods.price.includes('.')">
								<Typography fontSize="22" color="#FF5100" :bold="true">{{ goods.price.split('.')[0] }}.</Typography>
								<Typography fontSize="16" color="#FF5100" :bold="true">{{ goods.price.split('.')[1] }}</Typography>
							</block>
							<Typography fontSize="22" color="#FF5100" :bold="true" v-else>{{ goods.price }}</Typography>
						</Flexbox>
						<Typography color="gray3" className="old-price">￥{{ goods.market_price }}</Typography>
					</Flexbox>
					<!-- <Icon src="icon_share-circle.png" size="24" @tap="onShare"></Icon> -->
				</Flexbox>
				<Flexbox direction="column" gap="12">
					<Typography fontSize="16" :bold="true">{{ goods.goods_name }}</Typography>
					<Typography fontSize="13" color="gray1" v-if="goods.introduction">{{ goods.introduction }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Typography color="gray3" className="title" align="center">图文详情</Typography>
		<mp-html :content="goods.goods_content" :markdown="true" :highlight="true" container-style="padding:0;line-height:initial;font-size:initial;white-space:pre-line;" />
		<Flexbox className="tabbar">
			<Flexbox gap="19" className="tabbar-container">
				<Flexbox align="center" direction="column" @tap="relaunchTo">
					<Icon src="icon_home.png" size="24"></Icon>
					<Typography fontSize="10" color="gray1">首页</Typography>
				</Flexbox>
				<Flexbox gap="8" className="btn-group">
					<Flexbox direction="column" align="center" className="buy-btn" @tap="openPopup">
						<Typography fontSize="18" color="white" :bold="true">立即购买</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<view class="tabbar-placeholder"></view>
		</Flexbox>
		<uni-popup ref="popup" type="bottom" :safe-area="false">
			<Flexbox direction="column" className="spec-popup">
				<Icon src="icon_close.png" size="24" className="icon-close" @tap="closePopup"></Icon>
				<Flexbox direction="column" gap="24" className="spec-content">
					<Flexbox align="left" gap="16" v-if="selectedSpec">
						<image :src="goods.sku_spec_format[selectedSpec].image" class="product-cover"></image>
						<Flexbox direction="column" gap="4">
							<Flexbox align="baseline">
								<Typography fontSize="16" color="#FF5100" :bold="true">￥</Typography>
								<template v-if="goods.sku_spec_format[selectedSpec].price.includes('.')">
									<Typography fontSize="22" color="#FF5100" :bold="true">{{ goods.sku_spec_format[selectedSpec].price.split('.')[0] }}.</Typography>
									<Typography fontSize="16" color="#FF5100" :bold="true">{{ goods.sku_spec_format[selectedSpec].price.split('.')[1] }}</Typography>
								</template>
								<Typography fontSize="22" color="#FF5100" :bold="true" v-else>{{ goods.sku_spec_format[selectedSpec].price }}</Typography>
							</Flexbox>
							<Typography color="gray1" v-if="goods.goods_attr_format.length">已选：{{ selectedSpec }}</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox align="left" gap="16" v-else>
						<image :src="goods.goods_image" class="product-cover"></image>
						<Flexbox direction="column" gap="4">
							<Flexbox align="baseline">
								<Typography fontSize="16" color="#FF5100" :bold="true">￥</Typography>
								<template v-if="goods.price.includes('.')">
									<Typography fontSize="22" color="#FF5100" :bold="true">{{ goods.price.split('.')[0] }}.</Typography>
									<Typography fontSize="16" color="#FF5100" :bold="true">{{ goods.price.split('.')[1] }}</Typography>
								</template>
								<Typography fontSize="22" color="#FF5100" :bold="true" v-else>{{ goods.price }}</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
					<block v-if="goods.goods_attr_format.length">
						<Flexbox direction="column" gap="12" v-for="attr in goods.goods_attr_format" :key="attr.id">
							<Typography fontSize="16" :bold="true">{{ attr.attr_name }}</Typography>
							<Flexbox gap="12" className="spec-list">
								<Flexbox :className="['spec-item', { active: spec.check }]" v-for="spec in attr.attr_value" :key="spec.attr" @tap="selectAttr(attr, spec)">
									<Typography :color="spec.check ? 'primary' : 'gray1'">{{ spec.attr }}</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</block>
					<Flexbox align="justify">
						<Typography fontSize="16" :bold="true">数量</Typography>
						<Flexbox align="center" gap="12" className="count-info">
							<Icon src="icon_minus.png" class="count-icon" size="24" @tap="onMinus"></Icon>
							<input v-model="cartNum" type="number" class="count-input" />
							<Icon src="icon_plus-number.png" class="count-icon" size="24" @tap="onPlus"></Icon>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox direction="column" align="center" className="buy-btn" @tap="onBuy()">
					<Typography fontSize="18" color="white" :bold="true">立即购买</Typography>
				</Flexbox>
			</Flexbox>
		</uni-popup>
	</view>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			goods: null,
			skuId: '',
			selectedAttr: {},
			selectedSpecPrice: '',
			selectedSpecImage: '',
			cartNum: 1,
		};
	},
	onLoad(option) {
		this.skuId = option.skuId;
		this.getProduct();
	},
	onShareAppMessage() {
		return {
			title: '商品详情',
			path: `/pagesD/product/product?skuId=${this.skuId}`
		};
	},
	computed: {
		selectedSpec() {
			const arr = [];
			for (const key in this.selectedAttr) {
				if (this.selectedAttr[key]) {
					arr.push(this.selectedAttr[key].attr);
				}
			}
			return arr.join(',');
		}
	},
	methods: {
		relaunchTo() {
			uni.reLaunch({
				url: '/pages/home/home'
			});
		},
		openPopup() {
			this.$refs.popup.open();
		},
		closePopup() {
			this.$refs.popup.close();
		},
		getProduct() {
			request({
				url: '/api/Goodssku/detail',
				method: 'POST',
				data: { sku_id: this.skuId },
				success: (res) => {
					if (res) {
						this.goods = res.goods_sku_detail;
						if (this.goods.goods_attr_format) {
							this.goods.goods_attr_format = JSON.parse(this.goods.goods_attr_format);
						}
					}
				}
			});
		},
		selectAttr(attr, spec) {
			this.selectedAttr[attr.attr_name] = spec.attr_value_name;
			this.selectedSpec = `${attr.attr_name}: ${spec.attr_value_name}`;
			this.selectedSpecPrice = spec.price || this.goods.price;
			this.selectedSpecImage = spec.image || this.goods.sku_images[0].pic_path;
		},
		onMinus() {
			if (this.cartNum > 1) this.cartNum--;
		},
		onPlus() {
			if (this.cartNum >= this.goods.stock) {
				return;
			}
			this.cartNum++;
		},
		getCartList() {
			request({
				url: '/api/cart/goodsLists',
				method: 'POST',
				success: (res) => {
					const cart_id = res.find((item) => item.sku_id === parseInt(this.skuId)).cart_id;
					uni.navigateTo({
						url: `/pagesD/settlement/settlement?cartIds=${cart_id}`
					});
				}
			});
		},
		onBuy() {
			uni.showLoading({
				title: '正在加购...',
				mask: true
			});
			request({
				url: '/api/cart/add',
				method: 'POST',
				data: {
					sku_id: this.skuId,
					num: this.cartNum
				},
				success: (res) => {
					this.getCartList();
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.product-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	.swiper-content {
		height: 734rpx;
	}
	.product-cover {
		width: 100%;
		height: 734rpx;
	}

	.product-content {
		padding: 8rpx 32rpx 32rpx 32rpx;
		background-color: #fff;
	}

	.product-price {
		height: 88rpx;
	}

	.old-price {
		text-decoration: line-through;
	}

	.icon-share {
		width: 48rpx;
		height: 48rpx;
	}

	.title {
		padding: 10rpx 0 16rpx 0;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 180rpx;
		background-color: #fff;
		padding: 12rpx 32rpx 80rpx 48rpx;
	}

	.icon-mall {
		width: 52rpx;
		height: 48rpx;
	}

	.icon-customer {
		width: 48rpx;
		height: 48rpx;
	}

	.btn-group {
		flex: 1;

		.buy-btn {
			width: 100%;
			padding: 0 48rpx;
			height: 98rpx;
			border-radius: 44rpx;
			background-color: $uni-color-primary;
			white-space: nowrap;
		}
	}

	.tabbar-placeholder {
		height: 180rpx;
	}
}

.spec-popup {
	position: relative;
	background-color: #fff;
	border-radius: 32rpx 32rpx 0 0;
	padding: 32rpx 32rpx 80rpx 32rpx;

	.icon-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
		width: 48rpx;
		height: 48rpx;
	}

	.spec-content {
		padding-bottom: 44rpx;
	}

	.product-cover {
		flex: none;
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
	}

	.spec-list {
		flex-wrap: wrap;
	}

	.spec-item {
		padding: 12rpx 16rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color;
	}

	.spec-item.active {
		background-color: $uni-color-accent1;
		box-shadow: 0 0 0 2rpx $uni-color-primary inset;
	}

	.count-info {
		height: 80rpx;
	}

	.count-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.count-input {
		width: 96rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color;
		text-align: center;
		overflow: hidden;
	}

	.buy-btn {
		width: 100%;
		height: 98rpx;
		border-radius: 49rpx;
		background-color: $uni-color-primary;
	}
}
</style>
