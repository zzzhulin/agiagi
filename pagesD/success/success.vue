<template>
	<Flexbox direction="column" gap="32" className="pay-success-page">
		<Navbar title="支付成功" backgroundColor="transparent"></Navbar>
		<Flexbox align="center" direction="column">
			<Icon src="icon_success.png" size="128"></Icon>
			<Typography fontSize="18" :bold="true" align="center">支付成功</Typography>
		</Flexbox>
		<Flexbox align="center" className="sign-btn" @tap="redirectTo('/pagesE/user/user')">
			<Typography fontSize="18" color="white" :bold="true">返回个人中心</Typography>
		</Flexbox>
		<Flexbox align="center" className="sign-btn" @tap="redirectTo('/pagesD/order/order')">
			<Typography fontSize="18" color="white" :bold="true">查看我的订单</Typography>
		</Flexbox>
	</Flexbox>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		redirectTo(url) {
			uni.redirectTo({
				url
			});
		}
	}
};
</script>

<style lang="scss">
.pay-success-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	.sign-btn {
		width: 686rpx;
		height: 88rpx;
		border-radius: 44rpx;
		margin: 0 auto;
		background-color: $uni-color-primary;
	}
}
</style>
