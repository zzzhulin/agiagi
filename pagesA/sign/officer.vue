<template>
	<view class="sign-page" v-if="loaded">
		<Navbar :fixed="false" :backgroundColor="navbarBgColor" title="签约"></Navbar>
		<swiper :autoplay="true" :circular="true" :duration="1000" class="background" @change="onChange">
			<swiper-item v-for="service in services" :key="service.id">
				<Icon :src="service.cover_path" type="remote" width="375" height="667" mode="widthFix"></Icon>
			</swiper-item>
		</swiper>
		<view class="background-placeholder"></view>
		<Flexbox direction="column" gap="20" className="detail-container">
			<Flexbox direction="column" gap="12" className="detail-content">
				<Typography fontSize="22" :bold="true" align="center">服务合约</Typography>
				<Flexbox direction="column" gap="12">
					<Flexbox>
						<Typography color="gray2">聘用对象：</Typography>
						<Typography>{{ real_name }} &amp; 阿济阿济</Typography>
					</Flexbox>
					<Flexbox>
						<Typography color="gray2">合约时间：</Typography>
						<Typography>{{ service.valid_num }}天</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Typography fontSize="16" :bold="true">工作内容</Typography>
				<view class="contract-description">
					<mp-html :content="service.content" :markdown="true" :highlight="true" container-style="padding:0;line-height:initial;font-size:initial;white-space:pre-line;" />
				</view>
			</Flexbox>
			<Flexbox direction="column" gap="12">
				<Typography fontSize="16" :bold="true">推广说明</Typography>
				<view class="contract-description">
					<rich-text :nodes="service.promotional"></rich-text>
				</view>
			</Flexbox>
		</Flexbox>
		<Flexbox className="tabbar-container">
			<Flexbox align="center" className="buy-btn">
				<Typography fontSize="18" color="white" :bold="true" @tap="onSign">￥{{ formatNumber(service.price) }} 立即签下</Typography>
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
			agentId: '',
			serviceId: '',
			real_name: '',
			loaded: false,
			service: {
				price: '0.0'
			},
			services: []
		};
	},
	onLoad(option) {
		this.agentId = option.agentId;
		this.getServices(option.agentId);
	},
	onPageScroll(e) {
		if (e.scrollTop >= 50) {
			this.navbarBgColor = '#ffffff';
		} else {
			this.navbarBgColor = 'transparent';
		}
	},
	watch: {
		serviceId() {
			this.getService();
		}
	},
	methods: {
		onChange(event) {
			const current = event.detail.current;
			this.serviceId = this.services[current].id;
		},
		getServices(agent_id) {
			request({
				url: '/api/contract.agency/detail',
				method: 'POST',
				data: { agent_id },
				success: (res) => {
					if (res) {
						this.real_name = res.real_name;
						if (res.service_list.length) {
							this.services = res.service_list;
							this.serviceId = res.service_list[0].id;
						}
					}
				}
			});
		},
		getService() {
			request({
				url: '/api/contract.service/detail',
				method: 'POST',
				data: { service_id: this.serviceId },
				success: (res) => {
					if (res) {
						this.service = res;
						this.loaded = true;
					}
				}
			});
		},
		onSign() {
			uni.showLoading({
				mask: true
			});
			request({
				url: '/contract/api/orderservicecreate/create',
				method: 'POST',
				data: {
					service_id: this.serviceId,
					first_agent_id: this.first_agent_id,
					second_agent_id: this.second_agent_id,
					tertiary_agent_id: this.tertiary_agent_id,
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
				timeStamp: payData.timeStamp,
				nonceStr: payData.nonceStr,
				package: payData.package,
				signType: payData.signType,
				paySign: payData.paySign,
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
