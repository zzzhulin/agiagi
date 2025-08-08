<template>
	<Flexbox align="justify" direction="column" gap="23" className="receive-page">
		<view class="banner-container">
			<Flexbox align="center" gap="4" className="logo-content">
				<Icon src="logo.png" size="40" :circle="true"></Icon>
				<Flexbox direction="column" gap="4">
					<Icon src="slogan.png" width="144" height="17"></Icon>
					<Typography fontSize="12" color="gray1">健康要在便宜的时候买哟~~</Typography>
				</Flexbox>
			</Flexbox>
			<swiper :autoplay="true" :circular="true" :duration="1000" class="banner-swipper" @change="onChange">
				<swiper-item>
					<Icon src="brand.png" width="375" height="667" mode="widthFix" className="banner-image"></Icon>
				</swiper-item>
				<swiper-item v-for="officer in officers" :key="officer.agent_id">
					<Icon :src="officer.cover_path" width="375" height="667" mode="widthFix" type="remote" className="banner-image"></Icon>
				</swiper-item>
			</swiper>

			<Flexbox align="center" className="recruit-btn" @tap="onReceive">
				<Typography color="white" fontSize="18" :bold="true">立即领取</Typography>
			</Flexbox>
		</view>

		<Tabbar @tap="navigateToHome"></Tabbar>

		<Login></Login>
	</Flexbox>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			no: '',
			outTradeNo: '',
			officers: []
		};
	},
	onLoad(option) {
		this.isGift = option.from === 'gift';
		this.outTradeNo = option.outTradeNo;
		this.no = option.no;
		this.getOfficers();
	},
	methods: {
		getOfficers() {
			request({
				url: '/api/contract.agency/lists',
				method: 'POST',
				success: (res) => {
					if (res) {
						this.officers = res.list;
					}
				}
			});
		},
		onReceive() {
			request({
				url: '/contract/api/transfer/transfer',
				method: 'POST',
				data: { no: this.no },
				success: (res) => {
					if (res) {
						this.navigateToSuccess();
					}
				}
			});
		},
		onChange(event) {
			this.current = event.detail.current;
		},
		navigateToSuccess() {
			uni.redirectTo({
				url: `/pagesA/success/success?outTradeNo=${this.outTradeNo}&from=gift`
			});
		},
		navigateToHome() {
			uni.reLaunch({
				url: `/pages/home/home?type=${this.current}`
			});
		}
	}
};
</script>

<style lang="scss">
.receive-page {
	height: 100vh;
	.banner-container {
		position: relative;
		width: 100%;
		flex: 1;
	}

	.logo-content {
		position: absolute;
		top: 96rpx;
		left: 24rpx;
		z-index: 9;
	}

	.banner-swipper {
		height: 100%;
	}

	.banner-image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.recruit-btn {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 48rpx;
		width: 480rpx;
		height: 88rpx;
		margin: auto;
		border-radius: 44rpx;
		background-color: $uni-color-warning;
		box-shadow: 0rpx 8rpx 20rpx 0rpx #f77f364d;
	}

	.btn-badge {
		position: absolute;
		top: -10rpx;
		right: 0;
	}

	.btn-badge-text {
		position: relative;
		width: 176rpx;
		margin-top: 2rpx;
		text-align: center;
	}

	.btn-badge-background {
		position: absolute;
		right: 0;
		width: 196rpx;
		height: 40rpx;
	}
}
</style>
