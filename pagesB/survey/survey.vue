<template>
	<view class="survey-page">
		<Navbar backgroundColor="transparent" title="方案"></Navbar>
		<Flexbox direction="column" className="survey-list">
			<Flexbox direction="column" gap="12" className="survey-item">
				<Flexbox direction="column" gap="8" className="survey-content">
					<Typography fontSize="16">48小时回忆调查法</Typography>
					<Flexbox gap="8">
						<Flexbox className="survey-description">
							<Typography color="gray1">[问答聊天]</Typography>
							<Typography color="gray2">可排查用户的什么什么内</Typography>
						</Flexbox>
						<Icon size="60" className="survey-cover"></Icon>
					</Flexbox>
				</Flexbox>
				<Flexbox align="justify" className="survey-category">
					<Typography fontSize="12" color="gray1">调查评估</Typography>
					<Typography fontSize="12" color="gray2">2025.02.12 12:23</Typography>
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
.survey-page {
	height: 100vh;
	padding: 24rpx 40rpx env(safe-area-inset-bottom) 40rpx;
	background-color: $uni-bg-color;

	.survey-item {
		padding: 16rpx 24rpx 0 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.survey-description {
		flex: 1;
	}

	.survey-cover {
		flex: none;
	}

	.survey-category {
		height: 64rpx;
		border-top: 2rpx solid $uni-text-color-gray4;
	}
}
</style>
