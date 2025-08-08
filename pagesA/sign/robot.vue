<template>
	<view class="sign-page">
		<Navbar :fixed="false" :backgroundColor="navbarBgColor" title="签约"></Navbar>
		<Icon src="brand.png" width="375" height="667" className="background" />
		<view class="background-placeholder"></view>
		<Flexbox gap="12" className="contract-list">
			<Flexbox
				align="center"
				direction="column"
				:className="['contract-item', { active: contractId === contract.contract_id }]"
				v-for="(contract, index) in contracts"
				:key="contract.contract_id"
				@tap="contractId = contract.contract_id"
			>
				<view class="badge">
					<Icon src="badge.png" width="74" height="20" className="badge-background" />
					<Typography fontSize="12" className="badge-text" v-if="index === 0">限时福利</Typography>
					<Typography fontSize="12" className="badge-text" v-else>新客福利</Typography>
				</view>
				<Flexbox align="baseline">
					<Typography :bold="true">￥</Typography>
					<Typography fontSize="24" :bold="true" className="contract-price">{{ formatNumber(contract.card_price, 1) }}</Typography>
					<Typography :bold="true">/{{ cardType[contract.charge_rule] }}</Typography>
				</Flexbox>
				<Typography color="gray2" className="old-price">￥{{ formatNumber(contract.vip_price) }}</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="20" className="detail-container">
			<Flexbox direction="column" gap="12" className="detail-content">
				<Typography fontSize="22" :bold="true" align="center">服务合约</Typography>
				<Flexbox direction="column" gap="12">
					<Flexbox>
						<Typography color="gray2">聘用对象：</Typography>
						<Typography>阿济阿济</Typography>
					</Flexbox>
					<Flexbox>
						<Typography color="gray2">合约时间：</Typography>
						<Typography v-if="contract.validity_type === 'forever'">永久有效</Typography>
						<Typography v-else-if="contract.validity_type === 'day'">购买后{{ contract.validity_day }}天有效</Typography>
						<Typography v-else>{{ contract.valid_time }}过期</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Typography fontSize="16" :bold="true">工作内容</Typography>
				<view class="contract-description">
					<mp-html :content="contract.desc" :markdown="true" :highlight="true" container-style="padding:0;line-height:initial;font-size:initial;white-space:pre-line;" />
				</view>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Typography fontSize="16" :bold="true">合约说明</Typography>
				<view class="contract-description">
					<rich-text :nodes="contract.contract_desc"></rich-text>
				</view>
			</Flexbox>
		</Flexbox>
		<Flexbox className="tabbar-container">
			<Flexbox align="center" className="buy-btn">
				<Typography fontSize="18" color="white" :bold="true" @tap="onSign">￥{{ formatNumber(contract.card_price) }} 立即签下</Typography>
			</Flexbox>
		</Flexbox>

		<Login></Login>
	</view>
</template>

<script>
import { formatNumber } from '@/utils/util';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			formatNumber,
			navbarBgColor: 'transparent',
			contractId: '',
			contract: {
				card_price: '0.0'
			},
			cardType: {
				week: '周',
				month: '月',
				quarter: '季',
				year: '年'
			},
			contracts: []
		};
	},
	onLoad(option) {
		this.contractId = parseInt(option.contractId);
		this.getContracts();
	},
	onPageScroll(e) {
		if (e.scrollTop >= 50) {
			this.navbarBgColor = '#ffffff';
		} else {
			this.navbarBgColor = 'transparent';
		}
	},
	watch: {
		contractId() {
			this.getContract();
		}
	},
	methods: {
		getContracts() {
			request({
				url: '/contract/api/contract/lists',
				method: 'POST',
				data: { page: 1, page_size: 10 },
				success: (res) => {
					if (res && res.count) {
						this.contracts = res.list;
						if (!this.contractId) {
							this.contractId = res.list[0].contract_id;
						}
					}
				}
			});
		},
		getContract() {
			if (!this.contractId) {
				return;
			}
			request({
				url: '/contract/api/contract/detail',
				method: 'POST',
				data: { contract_id: this.contractId },
				success: (res) => {
					if (res) {
						this.contract = res;
					}
				}
			});
		},
		onSign() {
			uni.showLoading({
				mask: true
			});
			request({
				url: '/contract/api/ordercreate/create',
				method: 'POST',
				data: {
					media_id: this.contract.media_ids,
					media_path: this.contract.card_cover,
					contract_id: this.contractId,
					buyer_message: '',
					num: 1
				},
				success: (res) => {
					if (res) {
						this.getPayType(res);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		getPayType(out_trade_no) {
			request({
				url: '/api/pay/type',
				method: 'POST',
				success: (res) => {
					if (res) {
						this.getPayInfo(res.pay_type, out_trade_no);
					}
				}
			});
		},
		getPayInfo(pay_type, out_trade_no) {
			request({
				url: '/api/pay/pay',
				method: 'POST',
				data: { pay_type, out_trade_no },
				success: (res) => {
					if (res) {
						if (res.pay_success) {
							this.navigateToSuccess(out_trade_no);
						} else {
							this.wxPay(res, out_trade_no);
						}
						uni.hideLoading();
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		wxPay(payData, out_trade_no) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payData.timeStamp, // 由后台传来的时间戳
				nonceStr: payData.nonceStr, // 由后台传来的随机字符串
				package: payData.package, // 由后台传来的支付包
				signType: payData.signType, // 微信支付签名方式
				paySign: payData.paySign, // 由后台传来的签名
				success: (res) => {
					this.navigateToSuccess(out_trade_no);
				},
				fail: (err) => {
					console.log('支付失败', err);
				}
			});
		},
		navigateToSuccess(out_trade_no) {
			uni.redirectTo({
				url: `/pagesA/success/success?outTradeNo=${out_trade_no}&from=sign`
			});
		}
	}
};
</script>

<style lang="scss">
.sign-page {
	padding: 0 32rpx;
	background-color: $uni-bg-color;
	padding-bottom: 280rpx;
	.background {
		position: absolute;
		left: 0;
		width: 100%;
		height: 1334rpx;
	}

	.background-placeholder {
		width: 100%;
		height: 1148rpx;
	}

	.contract-list {
		position: relative;
		padding: 0 0 32rpx 0;
	}

	.contract-list::after {
		content: '';
		position: absolute;
		left: -32rpx;
		right: -32rpx;
		bottom: -10rpx;
		height: 234rpx;
		background: linear-gradient(180deg, rgba(244, 246, 249, 0) 0%, #f4f6f9 100%);
	}

	.contract-item {
		position: relative;
		width: 330rpx;
		height: 176rpx;
		padding: 34rpx 54rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray3 inset;
		border-radius: 24rpx;
		background-color: #ffffff;
		z-index: 1;
	}

	.contract-item.active {
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
		background-color: $uni-color-accent2;
	}

	.contract-item.active::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: 0rpx 4rpx 20rpx 0rpx #4ef08c1a;
	}

	.badge {
		position: absolute;
		top: -10rpx;
		right: 0;
	}

	.badge-background {
		position: absolute;
		right: 0;
		width: 148rpx;
		height: 40rpx;
	}

	.badge-text {
		position: relative;
		width: 128rpx;
		margin-top: 2rpx;
		text-align: center;
	}

	.text.contract-price {
		line-height: 68rpx;
	}

	.old-price {
		text-decoration: line-through;
	}

	.detail-container {
		position: relative;
		background-color: #fff;
		border-radius: 24rpx;
		padding: 24rpx;
	}

	.contract-description {
		padding: 24rpx 24rpx 32rpx 24rpx;
		background: linear-gradient(180deg, #dffaea 0%, #ffffff 100%);
		box-shadow: 0 0 0 2rpx $uni-color-accent2 inset;
		border-radius: 24rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: $uni-text-color-gray1;
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

	.buy-btn {
		flex: 1;
		height: 88rpx;
		background-color: $uni-color-primary;
		border-radius: 44rpx;
	}
}
</style>
