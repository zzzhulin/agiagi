// src/mixins/cartMixin.js
import {
	fetchRecommendedProducts,
	fetchGoodsSkuPage,
	fetchCartList,
	addCartItem,
	updateCartItem,
	removeCartItem
} from '@/services/cart';

export default {
	data() {
		return {
			goodsList: [],
			counts: [],
			loaded: false,
			selected: [],
			selectAll: false,
			loadingCart: false
		};
	},
	computed: {
		totalPrice() {
			return this.goodsList
				.reduce((acc, g, idx) =>
					this.selected[idx] ? acc + g.price * this.counts[idx] : acc, 0)
				.toFixed(2);
		}
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url
			})
		},
		async initCart(userId, text) {
			this.loadingCart = true;
			try {
				// 1. 推荐列表
				const recs = await fetchRecommendedProducts(userId, text);
				const ids = recs.map(r => r.product.id);
				const qtys = recs.map(r => r.recommended_quantity || 1);

				// 2. 拿 SKU 详情
				const skuList = await fetchGoodsSkuPage(ids);

				// 3. 现有购物车
				let cart = await fetchCartList();

				// 4. 补缺失项
				await Promise.all(
					skuList.map((sku, i) => {
						if (!cart.some(ci => ci.sku_id === sku.sku_id)) {
							return addCartItem(sku.sku_id, qtys[i]);
						}
						return Promise.resolve();
					})
				);

				// 5. 重新拉购物车
				if (!cart.length) {
					cart = await fetchCartList();
				}

				// 6. 合并并赋值
				this.goodsList = cart.map(item => {
					const info = skuList.find(s => s.sku_id === item.sku_id) || {};
					return {
						...item,
						...info
					};
				});
				this.counts = this.goodsList.map(i => i.num || 1);
				this.selected = this.goodsList.map(() => false);
				this.selectAll = false;
				this.loaded = true;
			} catch (err) {
				uni.showToast({
					title: err.message || '购物车加载失败',
					icon: 'none'
				});
			} finally {
				this.loadingCart = false;
			}
		},

		toggleSelect(idx) {
			this.$set(this.selected, idx, !this.selected[idx]);
			this.selectAll = this.selected.every(v => v);
		},

		toggleSelectAll() {
			const flag = !this.selectAll;
			this.selectAll = flag;
			this.selected = this.goodsList.map(() => flag);
		},

		async changeCount(type, idx) {
			const item = this.goodsList[idx];
			const cur = this.counts[idx];
			let next;

			if (type === 'minus') {
				if (cur === 1) {
					uni.showModal({
						title: '提示',
						content: '确定删除该商品吗',
						success: async (res) => {
							if (res.confirm) {
								await removeCartItem(item.cart_id);
								this.goodsList.splice(idx, 1);
								this.counts.splice(idx, 1);
								this.selected.splice(idx, 1);
								this.selectAll = this.selected.every(v => v);
							}
						}
					})
					return;
				}
				next = cur - 1;
			} else {
				next = Math.min(cur + 1, item.stock || 1);
			}

			this.$set(this.counts, idx, next);
			await updateCartItem(item.cart_id, next);
		},

		checkout() {
			const chosen = this.selected
				.map((v, i) => (v ? this.goodsList[i].cart_id : null))
				.filter(Boolean)
				.join(',');
			if (!chosen) {
				uni.showToast({
					title: '请先选择商品',
					icon: 'none'
				});
				return;
			}
			uni.redirectTo({
				url: `/pagesD/settlement/settlement?cartIds=${chosen}`
			});
		}
	}
};