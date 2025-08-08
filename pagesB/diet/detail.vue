<template>
	<view class="diet-detail-page">
		<Navbar title="做菜助手"></Navbar>
		<!-- <view class="video-container">
			<cover-image :src="cdnUrl + '/images/icon_play.png'" class="play-btn"></cover-image>
			<video src=""></video>
		</view> -->
		<Flexbox direction="column" gap="16" className="diet-detail-container">
			<Flexbox direction="baseline" gap="6">
				<Typography fontSize="22" :bold="true">红烧排骨</Typography>
				<Typography color="gray2">川菜</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="24">
				<Flexbox direction="column" gap="16">
					<Typography fontSize="16" :bold="true">一、食材准备</Typography>
					<Flexbox direction="column" gap="12">
						<Flexbox gap="4">
							<Typography fontSize="16" :bold="true">1.</Typography>
							<view>
								<Typography fontSize="16" :bold="true" :inline="true">主料：</Typography>
								<Typography fontSize="16" color="gray1" :inline="true">排骨500g（尽量选肥瘦相间的肋排，口感更佳）、土豆200g</Typography>
							</view>
						</Flexbox>
						<Flexbox gap="4">
							<Typography fontSize="16" :bold="true">2.</Typography>
							<view>
								<Typography fontSize="16" :bold="true" :inline="true">辅料：</Typography>
								<Typography fontSize="16" color="gray1" :inline="true">排骨500g（尽量选肥瘦相间的肋排，口感更佳）、土豆200g</Typography>
							</view>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox direction="column" gap="16">
					<Typography fontSize="16" :bold="true">二、烹饪处理</Typography>
					<Flexbox direction="column" gap="12">
						<Flexbox gap="4">
							<Typography fontSize="16" :bold="true">1.</Typography>
							<view>
								<Typography fontSize="16" :bold="true" :inline="true">排骨和土豆处理：</Typography>
								<Typography fontSize="16" color="gray1" :inline="true">排骨500g（尽量选肥瘦相间的肋排，口感更佳）、土豆200g</Typography>
							</view>
						</Flexbox>
						<Flexbox gap="4">
							<Typography fontSize="16" :bold="true">2.</Typography>
							<view>
								<Typography fontSize="16" :bold="true" :inline="true">焯水：</Typography>
								<Typography fontSize="16" color="gray1" :inline="true">排骨500g（尽量选肥瘦相间的肋排，口感更佳）、土豆200g</Typography>
							</view>
						</Flexbox>
						<Flexbox gap="4">
							<Typography fontSize="16" :bold="true">3.</Typography>
							<view>
								<Typography fontSize="16" :bold="true" :inline="true">焯水：</Typography>
								<Typography fontSize="16" color="gray1" :inline="true">排骨500g（尽量选肥瘦相间的肋排，口感更佳）、土豆200g</Typography>
							</view>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="24" className="other-method-container">
			<Typography fontSize="18" :bold="true">其他做法</Typography>
			<Flexbox direction="column" gap="16">
				<Flexbox gap="12">
					<Icon width="120" height="90" className="diet-cover"></Icon>
					<Flexbox align="justify" direction="column">
						<Typography fontSize="16">土豆烧排骨大神都学不来的做法</Typography>
						<Flexbox align="justify" className="full-width">
							<Icon size="24" :circle="true" label="一手好菜" color="gray1" gap="4"></Icon>
							<Icon src="icon_thumb-up.png" size="16" label="23" color="gray2" fontSize="12"></Icon>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox gap="12">
					<Icon width="120" height="90" className="diet-cover"></Icon>
					<Flexbox align="justify" direction="column">
						<Typography fontSize="16">土豆烧排骨大神都学不来的做法</Typography>
						<Flexbox align="justify" className="full-width">
							<Icon size="24" :circle="true" label="一手好菜" color="gray1" gap="4"></Icon>
							<Icon src="icon_thumb-up.png" size="16" label="23" color="gray2" fontSize="12"></Icon>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox gap="12">
					<Icon width="120" height="90" className="diet-cover"></Icon>
					<Flexbox align="justify" direction="column">
						<Typography fontSize="16">土豆烧排骨大神都学不来的做法</Typography>
						<Flexbox align="justify" className="full-width">
							<Icon size="24" :circle="true" label="一手好菜" color="gray1" gap="4"></Icon>
							<Icon src="icon_thumb-up.png" size="16" label="23" color="gray2" fontSize="12"></Icon>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { cdnUrl } from '@/utils/constant';
export default {
	data() {
		return {
			cdnUrl
		};
	}
};
</script>

<style lang="scss">
.diet-detail-page {
	padding-bottom: 162rpx;
	.video-container {
		position: relative;
		height: 422rpx;
		video {
			width: 100%;
			height: 100%;
		}
	}

	.play-btn {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 88rpx;
		height: 88rpx;
		z-index: 99;
	}

	.diet-detail-container {
		position: relative;
		margin: 60rpx 32rpx 0 32rpx;
		padding-bottom: 48rpx;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 2rpx;
			background-color: $uni-text-color-gray4;
		}
	}

	.diet-cover {
		border-radius: 16rpx;
	}
	
	.other-method-container {
		margin: 48rpx 32rpx 0 32rpx;
	}
}
</style>
