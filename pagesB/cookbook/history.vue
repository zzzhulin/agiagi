<template>
	<view class="cookbook-history">
		<Navbar title="历史食谱" :backgroundColor="navbarBgColor"></Navbar>
		<Flexbox direction="column" gap="12">
			<Flexbox align="justify" className="cookbook-item" v-for="cookbook in cookbooks" :key="cookbook.id">
				<Typography fontSize="16" className="cookbook-title">{{ cookbook.date_range + cookbook.title }}</Typography>
				<Flexbox @tap="redirectTo(cookbook.id)">
					<Typography color="gray2">详情</Typography>
					<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" gap="8" className="empty-content" v-if="loaded && !cookbooks.length">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无历史食谱</Typography>
		</Flexbox>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			memberId: '',
			navbarBgColor: 'transparent',
			page: 1,
			cookbooks: [],
			total: 0,
			loaded: false
		};
	},
	onLoad(option) {
		this.memberId = option.memberId;
		this.getCookbooks();
	},
	onPageScroll(e) {
		this.navbarBgColor = e.scrollTop >= 50 ? '#ffffff' : 'transparent';
	},
	onReachBottom() {
		if (this.cookbooks.length < this.total) {
			this.page++;
			this.getCookbooks();
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		redirectTo(id) {
			uni.redirectTo({
				url: `/pagesB/cookbook/detail?recipeId=${id}&memberId=${this.memberId}`
			});
		},
		getCookbooks() {
			request({
				url: '/api/v2/diet-scheme/user-recipe-history',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id: this.memberId,
					page: this.page,
					page_size: 20
				},
				isRobot: true,
				success: (res) => {
					if (res && res.total) {
						if (this.page === 1) {
							this.cookbooks = res.items;
						} else {
							this.cookbooks = this.cookbooks.concat(res.items);
						}
						this.total = res.total;
					}
				},
				complete: () => {
					this.loaded = true;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.cookbook-history {
	min-height: 100vh;
	padding: 20rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	background-color: $uni-bg-color;

	.cookbook-item {
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.cookbook-title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
