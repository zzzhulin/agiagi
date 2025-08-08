<template>
	<view class="health-page">
		<Navbar :fixed="false" backgroundColor="transparent"></Navbar>
		<Icon src="plan_health-background.png" width="375" height="281" mode="widthFix" className="background"></Icon>
		<Flexbox align="left" gap="12" className="officer-list">
			<Icon size="32" :circle="true" align="center" className="current-officer" />
			<Icon size="32" :circle="true" className="" />
			<Icon size="32" :circle="true" className="" />
		</Flexbox>
		<Flexbox direction="column" gap="24" className="health-container">
			<Flexbox direction="column" gap="4">
				<Typography fontSize="22" :bold="true">音乐疗愈</Typography>
				<Typography color="gray2">这里是调理方案的依据这里是调理方案的依据这里是调理方案的依据这里是调理方案的依据这里是调理方案的依据这里是调理方案的依据</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="24" className="health-list">
				<Flexbox direction="column" gap="16">
					<Flexbox direction="column" gap="8">
						<Typography fontSize="16" :bold="true">GAMMA中枢神经修复音乐</Typography>
						<Typography color="gray1">每天睡前听30分钟</Typography>
					</Flexbox>
					<Flexbox className="health-cover">
						<Icon width="140" height="105"></Icon>
						<Icon src="icon_play.png" size="44" className="play-btn"></Icon>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.health-page {
	height: 100vh;
	padding: 0 32rpx env(safe-area-inset-bottom) 32rpx;
	background-color: $uni-bg-color;

	.background {
		position: absolute;
		left: 0;
	}

	.officer-list {
		position: relative;
		padding-top: 376rpx;
		padding-bottom: 16rpx;
	}

	.current-officer {
		width: 88rpx;
		height: 88rpx;
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
		border-radius: 50%;
		background-color: #ffffff;
	}

	.current-officer .icon-image {
		width: 72rpx;
		height: 72rpx;
	}

	.health-container {
		border-radius: 24rpx;
		padding: 32rpx 24rpx;
		background-color: #ffffff;
	}

	.health-list:before {
		content: '';
		width: 100%;
		height: 2rpx;
		background-color: $uni-text-color-gray4;
	}

	.health-cover {
		position: relative;
		width: 210rpx;
		height: 210rpx;
		border-radius: 16rpx;
	}
	
	.play-btn {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 88rpx;
		height: 88rpx;
	}
}
</style>
