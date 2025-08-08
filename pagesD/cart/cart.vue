<template>
	<view class="cart-page" :style="{ paddingBottom: purchasePopupHeightRpx + 'rpx' }">
		<Navbar title="购物清单" :backgroundColor="navbarBgColor"></Navbar>
		<block v-if="duration_days">
			<Flexbox align="justify" className="title-container" :style="{ backgroundColor: navbarBgColor }">
				<Flexbox align="left" gap="20">
					<Flexbox align="center">
						<Typography>{{ participants_count }}人餐</Typography>
						<Icon src="icon_triangle.png" size="20"></Icon>
					</Flexbox>
					<Flexbox align="center">
						<Typography>{{ duration_days }}天量</Typography>
						<Icon src="icon_triangle.png" size="20"></Icon>
					</Flexbox>
					<Flexbox align="center" gap="2" @tap="navigateTo(`/pagesB/cookbook/detail?recipeId=${recipeId}`)">
						<Icon src="icon_menu.png" size="16"></Icon>
						<Typography>菜谱</Typography>
					</Flexbox>
				</Flexbox>
				<Flexbox align="center" className="select-btn" v-if="count" @tap="navigateTo('/pagesD/cart/list')">
					<Typography fontSize="16" color="primary" :bold="true">智选({{ count }})</Typography>
				</Flexbox>
			</Flexbox>

			<Flexbox direction="column" gap="12" className="cart-container">
				<block v-if="proteins.length">
					<Typography color="gray1" :bold="true" className="category-name">肉类</Typography>
					<Flexbox direction="column" gap="16">
						<Flexbox gap="12" v-for="item in proteins" :key="item.name">
							<Icon :src="item.image" size="80" type="remote" className="product-image"></Icon>
							<Flexbox direction="column" gap="5" className="full-width">
								<Flexbox align="justify">
									<Typography fontSize="16">{{ item.name }}</Typography>
									<Typography>x&nbsp;{{ item.quantity }}</Typography>
								</Flexbox>
								<Typography fontSize="12" color="gray2">优选成都周边本地</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>

				<block v-if="vegetables.length">
					<Typography color="gray1" :bold="true" className="category-name">蔬菜类</Typography>
					<Flexbox direction="column" gap="16">
						<Flexbox gap="12" v-for="item in vegetables" :key="item.name">
							<Icon :src="item.image" size="80" type="remote" className="product-image"></Icon>
							<Flexbox direction="column" gap="5" className="full-width">
								<Flexbox align="justify">
									<Typography fontSize="16">{{ item.name }}</Typography>
									<Typography>x&nbsp;{{ item.quantity }}</Typography>
								</Flexbox>
								<Typography fontSize="12" color="gray2">优选成都周边本地</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>

				<block v-if="fruits.length">
					<Typography color="gray1" :bold="true" className="category-name">水果类</Typography>
					<Flexbox direction="column" gap="16">
						<Flexbox gap="12" v-for="item in fruits" :key="item.name">
							<Icon :src="item.image" size="80" type="remote" className="product-image"></Icon>
							<Flexbox direction="column" gap="5" className="full-width">
								<Flexbox align="justify">
									<Typography fontSize="16">{{ item.name }}</Typography>
									<Typography>x&nbsp;{{ item.quantity }}</Typography>
								</Flexbox>
								<Typography fontSize="12" color="gray2">优选成都周边本地</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>

				<block v-if="grains.length">
					<Typography color="gray1" :bold="true" className="category-name">谷物类</Typography>
					<Flexbox direction="column" gap="16">
						<Flexbox gap="12" v-for="item in grains" :key="item.name">
							<Icon :src="item.image" size="80" type="remote" className="product-image"></Icon>
							<Flexbox direction="column" gap="5" className="full-width">
								<Flexbox align="justify">
									<Typography fontSize="16">{{ item.name }}</Typography>
									<Typography>x&nbsp;{{ item.quantity }}</Typography>
								</Flexbox>
								<Typography fontSize="12" color="gray2">优选成都周边本地</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>

				<block v-if="dairy.length">
					<Typography color="gray1" :bold="true" className="category-name">乳制品类</Typography>
					<Flexbox direction="column" gap="16">
						<Flexbox gap="12" v-for="item in dairy" :key="item.name">
							<Icon :src="item.image" size="80" type="remote" className="product-image"></Icon>
							<Flexbox direction="column" gap="5" className="full-width">
								<Flexbox align="justify">
									<Typography fontSize="16">{{ item.name }}</Typography>
									<Typography>x&nbsp;{{ item.quantity }}</Typography>
								</Flexbox>
								<Typography fontSize="12" color="gray2">优选成都周边本地</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>

				<block v-if="others.length">
					<Typography color="gray1" :bold="true" className="category-name">其他</Typography>
					<Flexbox direction="column" gap="16">
						<Flexbox gap="12" v-for="item in others" :key="item.name">
							<Icon :src="item.image" size="80" type="remote" className="product-image"></Icon>
							<Flexbox direction="column" gap="5" className="full-width">
								<Flexbox align="justify">
									<Typography fontSize="16">{{ item.name }}</Typography>
									<Typography>x&nbsp;{{ item.quantity }}</Typography>
								</Flexbox>
								<Typography fontSize="12" color="gray2">优选成都周边本地</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>
			</Flexbox>

			<!-- <view class="purchased-popup">
				<Flexbox direction="column" gap="10" className="purchased-content" v-if="purchased_list.length">
					<Typography :bold="true">我已购买</Typography>
					<Flexbox className="purchased-list">
						<Flexbox className="purchased-item" v-for="item in purchased_list" :key="item">
							<Typography>{{ item }}</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox align="center" className="speech-btn" @tap="openPopup">
					<Flexbox align="center" gap="4">
						<Icon src="icon_microphone-light.png" size="24"></Icon>
						<Typography fontSize="18" color="white" :bold="true">点击说话，告诉我已经买了哪些</Typography>
					</Flexbox>
				</Flexbox>
			</view> -->
		</block>
		<Flexbox align="center" direction="column" gap="16" className="empty-content" v-else>
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">陛下，您当前还没有购物清单</Typography>
		</Flexbox>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';

export default {
	data() {
		return {
			navbarBgColor: 'transparent',
			participants_count: 0,
			duration_days: 0,
			diet_scheme_id: '',
			text: '',
			dairy: [],
			fruits: [],
			grains: [],
			others: [],
			proteins: [],
			vegetables: [],
			purchased_list: [],
			purchasePopupHeightRpx: 0,
			windowWidth: 0,
			count: 0,
			text: '',
			recipeId: '',
			userId: '',
			memberId: ''
		};
	},

	onLoad(option) {
		this.memberId = option.memberId;
		this.userId = option.userId;
		this.text = decodeURIComponent(option.text);
		this.getGoodsId();
		this.getCarts();
		this.windowWidth = uni.getSystemInfoSync().windowWidth;
	},
	onReady() {
		uni.createSelectorQuery()
			.select('.purchased-popup')
			.boundingClientRect((rect) => {
				if (rect && rect.height) {
					this.purchasePopupHeightRpx = ((rect.height + 16) * 750) / this.windowWidth;
				}
			})
			.exec();
	},
	onPageScroll(e) {
		this.navbarBgColor = e.scrollTop >= 50 ? '#ffffff' : 'transparent';
	},
	onShareAppMessage() {
		return {
			title: '购物清单',
			path: this.text
				? `/pagesD/cart/cart?text=${this.text}&memberId=${this.memberId || this.taskInfo.member_id}&userId=${this.userId || this.userInfo.member_id}`
				: `/pagesD/cart/cart?memberId=${this.memberId || this.taskInfo.member_id}&userId=${this.userId || this.userInfo.member_id}`
		};
	},
	computed: {
		...mapState(['userInfo', 'taskInfo'])
	},
	methods: {
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.text += text;
			this.updateCarts();
		},
		updateCarts() {
			uni.showLoading({ title: '正在更新...', mask: true });
			request({
				url: '/api/v2/diet-scheme/update-purchased-list',
				method: 'POST',
				data: {
					user_id: this.userId || this.userInfo.member_id,
					member_id: this.memberId || this.taskInfo.member_id,
					recipe_id: this.diet_scheme_id,
					text_string: this.text
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.getCarts();
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getCarts() {
			request({
				url: '/api/v2/diet-scheme/get-shopping-list',
				method: 'POST',
				data: {
					user_id: this.userId || this.userInfo.member_id,
					member_id: this.memberId || this.taskInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.recipeId = res.id;
						this.participants_count = res.participants_count;
						this.duration_days = res.duration_days;
						this.diet_scheme_id = res.diet_scheme_id;
						this.dairy = res.shopping_list.dairy;
						this.fruits = res.shopping_list.fruits;
						this.grains = res.shopping_list.grains;
						this.others = res.shopping_list.others;
						this.proteins = res.shopping_list.proteins;
						this.vegetables = res.shopping_list.vegetables;
						this.purchased_list = res.purchased_list;
					}
				}
			});
		},
		getGoodsId() {
			request({
				url: '/api/v2/product-ai-recommend/recommended',
				data: {
					user_id: this.userId || this.userInfo.member_id,
					text: this.text
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.count = res.recommended_products.length;
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
.cart-page {
	min-height: 100vh;
	padding: 0 32rpx;
	background-color: $uni-bg-color;

	.title-container {
		position: fixed;
		left: 0;
		right: 0;
		padding: 46rpx 32rpx 18rpx 32rpx;
	}

	.select-btn {
		height: 72rpx;
		padding: 0 46rpx;
		box-shadow: 0rpx 8rpx 8rpx 0rpx #48ca7b33;
		border: 2rpx solid #30a375;
		border-radius: 40rpx;
	}

	.cart-container {
		margin-top: 136rpx;
		border-radius: 24rpx;
		padding: 24rpx;
		background-color: #fff;
	}

	.category-name.text {
		line-height: 44rpx;
	}

	.product-image {
		flex: none;
		border-radius: 8rpx;
	}

	.purchased-popup {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 40rpx 32rpx env(safe-area-inset-bottom) 34rpx;
		background-color: #fff;
		border-radius: 40rpx;
		box-shadow: 0rpx -4rpx 16rpx 0rpx #0000000d;
	}

	.purchased-content {
		margin-bottom: 70rpx;
	}

	.speech-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.purchased-list {
		flex-wrap: wrap;
		row-gap: 16rpx;
		column-gap: 24rpx;
	}

	.purchased-item {
		padding: 6rpx 16rpx;
		background-color: $uni-bg-color;
		border-radius: 8rpx;
	}

	.empty-content {
		margin: auto;
		height: 704rpx;
	}
}
</style>
