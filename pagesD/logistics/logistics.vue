<template>
	<view class="logistics-page">
		<Navbar title="物流信息"></Navbar>
		<Flexbox align="justify">
			<Flexbox align="left" gap="8">
				<Icon :src="express_company_image" size="28" :circle="true" type="remote"></Icon>
				<Typography :bold="true">{{ express_company_name }}</Typography>
				<Typography :bold="true">{{ delivery_no }}</Typography>
			</Flexbox>
			<Typography :bold="true" @tap="onCopy">复制</Typography>
		</Flexbox>
		<Flexbox direction="column" className="tracking-list">
			<Flexbox direction="column" gap="4" className="tracking-item" v-for="(item, index) in trackings" :key="item.time">
				<Flexbox align="left" gap="12" className="tracking-title">
					<Typography :color="!index ? 'primary' : 'gray1'">{{ item.datetime }}</Typography>
				</Flexbox>
				<Typography color="gray1" className="remark">{{ item.remark }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" className="empty-content" v-if="isEmpty && loaded">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无物流信息</Typography>
		</Flexbox>
	</view>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			orderId: '',
			express_company_image: '',
			express_company_name: '',
			delivery_no: '',
			isEmpty: false,
			loaded: false,
			trackings: []
		};
	},
	onLoad(option) {
		this.orderId = option.orderId;
		this.getLogistics();
	},
	methods: {
		onCopy() {
			uni.setClipboardData({
				data: this.delivery_no,
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
		getLogistics() {
			request({
				url: '/api/order/package',
				method: 'POST',
				data: { order_id: this.orderId },
				success: (res) => {
					if (res && res.length) {
						this.express_company_image = res[0].express_company_image;
						this.express_company_name = res[0].express_company_name;
						this.delivery_no = res[0].delivery_no;
						this.trackings = res[0].trace.list.reverse();
					} else {
						this.isEmpty = true;
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
.logistics-page {
	min-height: 100vh;
	padding: 48rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	
	.tracking-list {
		margin-top: 48rpx;
	}

	.tracking-item {
		position: relative;
		padding-left: 64rpx;
		padding-bottom: 32rpx;
		&:before {
			content: '';
			position: absolute;
			top: 30rpx;
			left: 28rpx;
			width: 2rpx;
			height: 100%;
			background-color: $uni-border-color;
			z-index: 1;
		}
		&:last-child {
			padding-bottom: 0;
		}
		&:last-child:before {
			display: none;
		}
		&:first-child {
			.tracking-title:before {
				box-shadow: none;
				background-color: $uni-color-primary;
			}
		}
	}

	.tracking-title {
		position: relative;
	}

	.tracking-title:before {
		position: absolute;
		left: -45rpx;
		content: '';
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray3 inset;
		z-index: 2;
	}

	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
