<template>
	<Flexbox direction="column" className="gift-page">
		<Navbar :fixed="false" backgroundColor="transparent" />
		<Icon src="gift_background.png" width="375" height="207" mode="widthFix" className="background" />
		<Icon
			:src="detail.member_headimg"
			type="remote"
			size="48"
			:circle="true"
			:label="detail.member_nickname"
			align="center"
			direction="column"
			color="white"
			gap="8"
			className="user-info"
		/>
		<Flexbox align="center" direction="column" gap="8">
			<Typography color="white" fontSize="16" :bold="true">送你一张神秘礼品卡</Typography>
			<Typography color="white">{{ detail.blessing || '赠你一份好礼，祝你每天都开心快乐！' }}</Typography>
		</Flexbox>
		<Icon :src="detail.expression_path" size="200" align="center" className="gift-cover" v-if="detail.expression_type === 1" />
		<video :src="detail.video_url" class="gift-cover" v-else-if="detail.expression_type === 2"></video>
		<Flexbox align="center" className="receive-btn" @tap="navigateToReceive">
			<Typography color="white" fontSize="16" :bold="true">领取礼品</Typography>
		</Flexbox>
		<Login></Login>
	</Flexbox>
</template>

<script>
import { request } from '@/utils/request';

export default {
	data() {
		return {
			no: '',
			out_trade_no: '',
			detail: null
		};
	},
	onLoad(option) {
		this.no = option.no;
		this.out_trade_no = option.outTradeNo;
		this.getBlessingDetail();
	},
	methods: {
		getBlessingDetail() {
			request({
				url: '/contract/api/transfer/blessingdetail',
				method: 'POST',
				data: { no: this.no },
				success: (res) => {
					if (res) {
						this.detail = res;
					}
				}
			});
		},
		navigateToReceive() {
			if (this.detail.is_self === 1) {
				uni.showToast({
					title: '不能领取自己分享的礼品卡哟～',
					icon: 'none'
				});
				return;
			}
			if (this.detail.card_status === 'to_use') {
				uni.showToast({
					title: '您来晚了，礼品卡已经被领取啦～',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: `/pagesA/gift/receive?no=${this.no}&outTradeNo=${this.out_trade_no}`
			});
		}
	}
};
</script>

<style lang="scss">
.gift-page {
	height: 100vh;
	background-color: #ff3d64;
	.background {
		position: absolute;
	}

	.user-info {
		margin-top: 448rpx;
		margin-bottom: 32rpx;
	}

	.gift-cover {
		margin: 48rpx 0 164rpx 0;
	}

	.receive-btn {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 150rpx;
		width: 428rpx;
		height: 88rpx;
		margin: 0 auto;
		border-radius: 44rpx;
		background-color: $uni-color-warning;
	}
}
</style>
