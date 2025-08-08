<template>
	<view class="evaluate-list-page">
		<Navbar title="商品评价"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox className="evalute-item" v-for="item in list" :key="item.id"></Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			page: 1,
			total: 0,
			list: []
		};
	},
	onLoad(option) {
		this.goodsId = option.goodsId;
		this.getEvaluateList();
	},
	onReachBottom() {
		if (this.list.length < this.total) {
			this.page++;
			this.getEvaluateList();
		}
	},
	methods: {
		getEvaluateList() {
			request({
				url: '/api/Goodsevaluate/page',
				method: 'POST',
				data: { goods_id: this.goodsId, page: this.page, page_size: 20 },
				success: (res) => {
					if (res) {
						this.list = res.list;
						this.total = res.count;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
