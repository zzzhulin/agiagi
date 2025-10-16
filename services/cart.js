// src/services/cart.js
import {
	request
} from '@/utils/request';

export function fetchRecommendedProducts(userId, text) {
	return new Promise((resolve, reject) => {
		request({
			url: '/api/v2/product-ai-recommend/recommended',
			data: {
				user_id: userId,
				text
			},
			isRobot: true,
			success: res => {
				if (res && res.recommended_products) {
					resolve(res.recommended_products);
				} else {
					resolve([]);
				}
			},
			fail: err => reject(err)
		});
	});
}

export function fetchGoodsSkuPage(goodsIdArr) {
	return new Promise((resolve, reject) => {
		request({
			url: '/api/Goodssku/page',
			method: 'POST',
			data: {
				goods_id_arr: goodsIdArr
			},
			success: res => {
				resolve(res && res.list ? res.list : []);
			},
			fail: err => reject(err)
		});
	});
}

export function fetchCartList() {
	return new Promise((resolve, reject) => {
		request({
			url: '/api/cart/goodsLists',
			method: 'POST',
			success: res => resolve(res || []),
			fail: err => reject(err)
		});
	});
}

export function addCartItem(sku_id, num) {
	return new Promise((resolve, reject) => {
		request({
			url: '/api/cart/add',
			method: 'POST',
			data: {
				sku_id,
				num
			},
			success: resolve,
			fail: reject
		});
	});
}

export function updateCartItem(cart_id, num) {
	return new Promise((resolve, reject) => {
		request({
			url: '/api/cart/edit',
			method: 'POST',
			data: {
				cart_id,
				num
			},
			success: resolve,
			fail: reject
		});
	});
}

export function removeCartItem(cart_id) {
	return new Promise((resolve, reject) => {
		request({
			url: '/api/cart/delete',
			method: 'POST',
			data: {
				cart_id
			},
			success: resolve,
			fail: reject
		});
	});
}