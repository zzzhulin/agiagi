<template>
	<view class="blessing-page">
		<Navbar backgroundColor="transparent" title="赠送合约" />
		<Flexbox direction="column" gap="24">
			<Flexbox direction="column" gap="12">
				<Flexbox align="baseline">
					<Typography fontSize="16" :bold="true">文字祝福</Typography>
					<Typography color="gray2">(自定义)</Typography>
				</Flexbox>
				<textarea v-model="blessing" placeholder="赠你一份好礼，祝你每天都开心快乐！" class="textarea" />
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Flexbox align="baseline">
					<Typography fontSize="16" :bold="true">表情包</Typography>
					<Typography color="gray2">(自定义)</Typography>
				</Flexbox>
				<Flexbox gap="12">
					<Flexbox direction="column" align="center" gap="8" className="upload-btn" @tap="onUpload" v-if="!expression_path || !video_url">
						<view class="icon-plus"></view>
						<Typography color="gray2">图片/视频</Typography>
					</Flexbox>
					<Icon :src="expression_path" v-if="expression_path" class="upload-image"></Icon>
					<video :src="video_url" class="upload-video" v-if="video_url"></video>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox className="tabbar-container">
			<Flexbox align="center" className="present-btn">
				<button open-type="share" class="share-btn"></button>
				<Typography fontSize="18" color="white" :bold="true">立即赠送</Typography>
			</Flexbox>
		</Flexbox>

		<Login></Login>
	</view>
</template>

<script>
import { request } from '@/utils/request';
import { upload } from '@/utils/upload';

export default {
	data() {
		return {
			no: '',
			out_trade_no: '',
			member_card_id: '',
			blessing: '',
			expression_path: '',
			video_url: '',
			expression_type: 0,
			isShare: false
		};
	},
	onLoad(option) {
		this.member_card_id = option.cardId;
		this.out_trade_no = option.outTradeNo;
	},
	onShareAppMessage() {
		// 调用赠送接口
		this.onPresent();
		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					title: this.blessing || '赠你一份好礼，祝你每天都开心快乐！',
					imageUrl: this.expression_path,
					path: `/pagesA/gift/gift?no=${this.no}&outTradeNo=${this.out_trade_no}`
				});
				this.isShare = true;
			}, 2000);
		});
		return {
			title: this.blessing || '赠你一份好礼，祝你每天都开心快乐！',
			imageUrl: this.expression_path,
			path: `/pagesA/gift/gift?no=${this.no}&outTradeNo=${this.out_trade_no}`,
			promise
		};
	},
	watch: {
		isShare() {
			uni.redirectTo({
				url: '/pagesA/contract/contract'
			});
		}
	},
	methods: {
		onUpload() {
			uni.chooseMedia({
				count: 1,
				mediaType: ['image', 'video'],
				sourceType: ['album', 'camera'],
				maxDuration: 30,
				camera: 'back',
				success: async (res) => {
					const file = res.tempFiles[0];
					const result = await upload(file.tempFilePath, file.fileType);
					if (result) {
						if (file.fileType === 'image') {
							this.expression_path = result;
							this.expression_type = 1;
						} else {
							this.video_url = result;
							this.expression_type = 2;
						}
					}
				}
			});
		},
		onPresent() {
			request({
				url: '/contract/api/membercard/blessing',
				method: 'POST',
				data: {
					member_card_id: this.member_card_id,
					blessing: this.blessing,
					expression_path: this.expression_path,
					video_url: this.video_url,
					expression_type: this.expression_type
				},
				success: (res) => {
					if (res) {
						this.no = res.no;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.blessing-page {
	height: 100vh;
	padding: 32rpx 32rpx 172rpx 32rpx;
	background-color: $uni-bg-color-2;

	.textarea {
		width: 100%;
		padding: 24rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		border-radius: 16rpx;
		background-color: #ffffff;
	}

	.upload-btn {
		width: 200rpx;
		height: 200rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.icon-plus {
		position: relative;
		width: 40rpx;
		height: 40rpx;
	}

	.icon-plus::before,
	.icon-plus::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		margin: auto;
		background-color: $uni-text-color-gray2;
		border-radius: 8rpx;
	}

	.icon-plus::before {
		width: 4rpx;
		height: 40rpx;
	}

	.icon-plus::after {
		width: 40rpx;
		height: 4rpx;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 172rpx;
		background-color: #fff;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	}

	.present-btn {
		flex: 1;
		height: 88rpx;
		background-color: $uni-color-primary;
		border-radius: 44rpx;
	}

	.share-btn {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
</style>
