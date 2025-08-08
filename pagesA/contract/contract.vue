<template>
	<view class="contract-page" v-if="loaded">
		<Navbar :fixed="false" :backgroundColor="navbarBgColor"></Navbar>
		<view class="background"></view>
		<Flexbox direction="column" gap="32" className="contract-container">
			<view class="contract-content" v-if="service.name">
				<Flexbox align="justify" className="officer-list">
					<Icon src="officer.png" width="72" height="18" />
					<Flexbox gap="16">
						<Icon
							:src="officer.head_path"
							type="remote"
							:circle="true"
							align="center"
							size="28"
							:label="officer.name"
							fontSize="12"
							gap="4"
							v-for="(officer, index) in officers"
							:key="index"
						></Icon>
					</Flexbox>
				</Flexbox>
				<Flexbox direction="column" gap="12" className="officer-detail">
					<Typography fontSize="22" :bold="true">{{ service.name }}</Typography>
					<Flexbox align="justify">
						<Flexbox direction="column" gap="4">
							<Flexbox>
								<Typography color="gray1">合 约 ID ：</Typography>
								<Typography>{{ service.contract_id }}</Typography>
							</Flexbox>
							<Flexbox>
								<Typography color="gray1">增量服务：</Typography>
								<Typography>{{ increment_service_num }}</Typography>
							</Flexbox>
							<Flexbox>
								<Typography color="gray1">家庭服务：</Typography>
								<Typography>{{ family_num }}人</Typography>
							</Flexbox>
							<Flexbox>
								<Typography color="gray1">激活日期：</Typography>
								<Typography>{{ service.activate_time }}</Typography>
							</Flexbox>
						</Flexbox>
						<Flexbox align="center" direction="column" className="points" @tap="openPopup('point')">
							<Typography fontSize="24" color="primary" :bold="true" className="points-text">{{ point }}</Typography>
							<Typography fontSize="12" color="gray1" v-if="point > 0">剩余积分</Typography>
							<Typography fontSize="12" color="gray1" :bold="true" v-else>充值</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox align="justify" direction="column" className="date-info">
						<Flexbox align="justify" className="full-width">
							<Typography fontSize="36" :bold="true" className="date-count">{{ service.valid_day }}</Typography>
							<Typography className="expire-date">{{ formatDate(service.valid_time, 'YYYY年MM月DD日') }}到期</Typography>
						</Flexbox>
						<Flexbox align="center" className="renew-btn" @tap="openPopup('contract')">
							<Typography fontSize="16" color="white" :bold="true">续约</Typography>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</view>
			<Flexbox align="center" direction="column" gap="16" className="empty-content" v-else>
				<Icon src="image_empty.png" size="128"></Icon>
				<Typography color="gray2">陛下，您当前还没有签约任何服务</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="16" className="contract-list">
				<Flexbox align="justify" direction="column" className="contract-item" v-for="card in cards" :key="card.card_id">
					<Typography color="primary" className="points">含{{ card.send_point }}积分</Typography>
					<Flexbox direction="column" gap="4" className="full-width">
						<Typography fontSize="18" :bold="true">{{ card.card_name }}</Typography>
						<Typography color="gray2">合约ID: {{ card.contract_id }}</Typography>
					</Flexbox>
					<Flexbox align="justify" className="full-width">
						<Flexbox align="center" gap="8">
							<Typography>{{ cardType[card.charge_rule.type] }}服务</Typography>
							<view class="line"></view>
							<Typography :bold="true">{{ card.charge_rule.day }}天</Typography>
						</Flexbox>
						<Flexbox gap="12">
							<Flexbox align="center" className="present-btn" v-if="card.is_allow_transfer === 1 && card.is_transfer === 0" @tap="navigateToGive(card.is_transfer)">
								<Typography>转赠</Typography>
							</Flexbox>
							<Flexbox align="center" className="activate-btn" v-if="card.status !== 'used'" @tap="openPopup('activate', card)">
								<Typography>激活</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="24">
				<Typography fontSize="22" :bold="true">更多服务</Typography>
				<Flexbox gap="12" className="service-item" v-for="service in services" :key="service.id" @tap="navigateTo(`/pagesA/sign/officer?agentId=${service.agent_id}`)">
					<Icon :src="service.cover_path" mode="aspectFit" width="136" height="102" type="remote" className="service-cover" />
					<Flexbox direction="column" align="justify">
						<Flexbox direction="column" gap="3">
							<Typography fontSize="16" :bold="true">{{ service.name }}</Typography>
							<Typography color="gray2" className="ellipsis">{{ service.content }}</Typography>
						</Flexbox>
						<Flexbox align="justify" className="full-width">
							<Typography color="primary" fontSize="16" :bold="true">￥{{ service.price }}</Typography>
							<Flexbox align="center" className="buy-btn" @tap.stop="onBuy(service)">
								<Typography>购买</Typography>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<block v-for="contract in contracts" :key="contract.contract_id">
					<Flexbox
						gap="12"
						className="service-item"
						v-if="!service.name || service.contract_id !== contract.contract_id"
						@tap="navigateTo(`/pagesA/sign/robot?contractId=${contract.contract_id}`)"
					>
						<Icon :src="contract.card_cover" mode="aspectFit" width="136" height="102" type="remote" className="service-cover" />
						<Flexbox direction="column" className="service-content">
							<Flexbox direction="column" gap="3">
								<Typography fontSize="16" :bold="true">{{ contract.card_name }}</Typography>
								<Typography color="gray2" className="ellipsis">{{ stripHtmlTags(contract.desc) }}</Typography>
							</Flexbox>
							<Flexbox align="justify" className="full-width">
								<Typography color="primary" fontSize="16" :bold="true">￥{{ contract.card_price }}</Typography>
								<Flexbox align="center" className="buy-btn" @tap.stop="onSign(contract)">
									<Typography>购买</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</block>
			</Flexbox>
		</Flexbox>

		<uni-popup ref="activate" type="center">
			<Flexbox align="center" direction="column" gap="24" className="activate-popup">
				<Flexbox align="center" direction="column" gap="12">
					<Icon src="icon_bulb.png" size="48"></Icon>
					<Typography fontSize="16" align="center">你即将激活{{ card.card_name }}，开启后服务立即生效</Typography>
				</Flexbox>
				<Flexbox gap="14">
					<Flexbox align="center" className="cancel-btn" @tap="closePopup('activate')">
						<Typography fontSize="18" color="gray2" :bold="true">取消</Typography>
					</Flexbox>
					<Flexbox align="center" className="confirm-btn" @tap="onActivate(card)">
						<Typography fontSize="18" color="white" :bold="true">立即激活</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<uni-popup ref="contract" type="bottom" borderRadius="32rpx 32rpx 0 0" mask-background-color="rgba(0,0,0,0.5)" backgroundColor="#fff">
			<Flexbox direction="column" gap="32" className="renew-popup">
				<Flexbox direction="column" className="popup-content">
					<Icon src="icon_close.png" size="24" className="close-btn" @tap="closePopup('contract')"></Icon>
					<Flexbox direction="column" gap="24">
						<Flexbox direction="column" gap="17">
							<Typography fontSize="22" :bold="true">{{ service.name }}</Typography>
							<Flexbox gap="12" className="contract-list">
								<Flexbox
									align="center"
									direction="column"
									:className="['contract-item', 'popup-contract-item', { active: contractId === contract.contract_id }]"
									v-for="(contract, index) in contracts"
									:key="contract.contract_id"
									@tap="contractId = contract.contract_id"
								>
									<view class="badge" v-if="index === 0">
										<Icon src="badge.png" width="74" height="20" className="badge-background" />
										<Typography fontSize="12" className="badge-text">限时优惠</Typography>
									</view>
									<Flexbox align="baseline">
										<Typography :bold="true">￥</Typography>
										<Typography fontSize="24" :bold="true" className="contract-price">{{ parseFloat(contract.card_price).toFixed(1) }}</Typography>
										<Typography :bold="true">/{{ cardType[contract.charge_rule] }}</Typography>
									</Flexbox>
									<Typography color="gray2" className="old-price">￥{{ parseFloat(contract.vip_price).toFixed(1) }}</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox className="tabbar-container">
					<Flexbox align="center" className="buy-btn" @tap="onSign">
						<Typography fontSize="18" color="white" :bold="true">￥{{ formatNumber(contract.card_price) }}&nbsp;&nbsp;&nbsp;立即续约</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<uni-popup ref="point" type="bottom" borderRadius="32rpx 32rpx 0 0" mask-background-color="rgba(0,0,0,0.5)" backgroundColor="#fff">
			<Flexbox direction="column" gap="32" className="point-popup">
				<Flexbox direction="column" className="popup-content">
					<Icon src="icon_close.png" size="24" className="close-btn" @tap="closePopup('point')"></Icon>
					<Flexbox direction="column" gap="24">
						<Flexbox direction="column" gap="12">
							<Typography fontSize="18" :bold="true">积分包</Typography>
							<Flexbox gap="12" className="point-list">
								<Flexbox
									direction="column"
									gap="9"
									:className="['point-item', { active: pointPrice === item.money }]"
									v-for="item in points"
									:key="item.points"
									@tap="pointPrice = item.money"
								>
									<Typography fontSize="18">{{ item.points }}积分</Typography>
									<Typography fontSize="16" color="primary" :bold="true">{{ item.money }}元</Typography>
								</Flexbox>
							</Flexbox>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox className="tabbar-container">
					<Flexbox align="center" className="buy-btn" @tap="onRecharge">
						<Typography fontSize="18" color="white" :bold="true">￥{{ pointPrice }}&nbsp;&nbsp;&nbsp;立即充值</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</uni-popup>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { formatNumber, formatDate } from '@/utils/util';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			formatNumber,
			formatDate,
			navbarBgColor: 'transparent',
			contractId: '',
			increment_service_num: '',
			family_num: '',
			point: '',
			pointPrice: 5,
			loaded: false,
			contract: {
				card_price: '0.0'
			},
			cardType: {
				week: '周',
				month: '月',
				quarter: '季',
				year: '年'
			},
			service: {
				valid_time: ''
			},
			card: null,
			officers: [],
			contracts: [],
			cards: [],
			services: [],
			points: []
		};
	},
	onLoad() {
		this.getContracts();
		this.getService();
		this.getCards();
		this.getServices();
		this.getPoints();
	},
	onShow() {
		console.log('合约onShow');
	},
	onPageScroll(e) {
		if (e.scrollTop >= 50) {
			this.navbarBgColor = '#ffffff';
		} else {
			this.navbarBgColor = 'transparent';
		}
	},
	onShareAppMessage() {
		return {
			title: '阿济阿济',
			path: '/pagesA/contract/contract'
		};
	},
	watch: {
		contractId() {
			this.getContract();
		}
	},
	methods: {
		...mapMutations(['setContractCount']),
		stripHtmlTags(input) {
			return input.replace(/<\/?[^>]+(>|$)/g, '');
		},
		openPopup(popup, data) {
			if (popup === 'point' && this.point) {
				return;
			}
			if (popup === 'activate') {
				this.card = data;
			}
			this.$refs[popup].open();
		},
		closePopup(popup) {
			this.$refs[popup].close();
		},
		navigateToGive() {
			// 转赠处理逻辑
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		onActivate({ member_card_id }) {
			request({
				url: '/contract/api/carduse/openinguse',
				method: 'POST',
				data: { member_card_id },
				success: (res) => {
					if (res) {
						uni.showToast({
							title: '激活成功',
							icon: 'success'
						});
						this.getService();
						this.getCards();
						this.closePopup('activate');
					}
				}
			});
		},
		getService() {
			request({
				url: '/contract/api/membercard/myCardInfo',
				method: 'POST',
				success: (res) => {
					if (res) {
						this.increment_service_num = res.increment_service_num;
						this.family_num = res.family_num;
						this.point = res.point;
						this.officers = res.contract;
						this.service = res.service;
						this.loaded = true;
					}
				}
			});
		},
		getCards() {
			request({
				url: '/contract/api/membercard/lists',
				method: 'POST',
				data: { page: 1, page_size: 100, status: 'all' },
				success: (res) => {
					if (res && res.count) {
						this.cards = res.list;
						this.setContractCount(res.count);
					}
				}
			});
		},
		getContracts() {
			request({
				url: '/contract/api/contract/lists',
				method: 'POST',
				data: { page: 1, page_size: 100 },
				success: (res) => {
					if (res && res.count) {
						this.contracts = res.list;
						this.contractId = res.list[0].contract_id;
					}
				}
			});
		},
		getContract() {
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
		getServices() {
			request({
				url: '/api/contract.agency/lists',
				method: 'POST',
				success: (res) => {
					if (res) {
						res.list.forEach((item) => {
							this.getServiceDetail(item.agent_id);
						});
					}
				}
			});
		},
		getServiceDetail(agent_id) {
			request({
				url: '/api/contract.agency/detail',
				method: 'POST',
				data: {
					agent_id
				},
				success: (res) => {
					if (res) {
						this.services = [...this.services, ...res.service_list];
					}
				}
			});
		},
		getPoints() {
			request({
				url: '/api/contract.point/getRechargePoints',
				success: (res) => {
					if (res && res.length) {
						this.points = res;
						this.pointPrice = res[0].money;
					}
				}
			});
		},
		onBuy(service) {
			uni.showLoading({
				mask: true
			});
			request({
				url: '/contract/api/orderservicecreate/create',
				method: 'POST',
				data: {
					service_id: service.id,
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
		onSign(contract) {
			console.log(contract, this.contract);
			uni.showLoading({
				mask: true
			});
			request({
				url: '/contract/api/ordercreate/create',
				method: 'POST',
				data: {
					media_id: contract.media_ids || this.contract.media_ids,
					media_path: contract.card_cover || this.contract.card_cover,
					contract_id: contract.contract_id || this.contractId,
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
		onRecharge() {
			uni.showLoading({
				mask: true
			});
			request({
				url: '/api/contract.point/createOrder',
				method: 'POST',
				data: {
					price: this.pointPrice
				},
				success: (res) => {
					if (res) {
						this.getPayType(res);
						this.closePopup('point');
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
							this.getService();
							this.getCards();
						} else {
							this.wxPay(res);
						}
					}
				}
			});
		},
		wxPay(payData) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payData.timeStamp,
				nonceStr: payData.nonceStr,
				package: payData.package,
				signType: payData.signType,
				paySign: payData.paySign,
				success: (res) => {
					this.getService();
					this.getCards();
				},
				fail: (err) => {
					console.log('支付失败', err);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.contract-page {
	padding: 0 32rpx 164rpx 32rpx;
	.background {
		position: absolute;
		left: 0;
		right: 0;
		height: 562rpx;
		padding-top: 350rpx;
		background-color: $uni-color-primary;
	}

	.background::after {
		position: absolute;
		content: '';
		width: 100%;
		height: 212rpx;
		background: linear-gradient(180deg, #30a375 0%, #ffffff 100%);
	}
	.contract-container {
		padding-top: 224rpx;
	}

	.contract-content {
		position: relative;
		box-shadow: 0rpx 16rpx 32rpx 0rpx #0000000d;
		border-radius: 48rpx;
		overflow: hidden;
	}

	.contract-content:before {
		content: '';
		position: absolute;
		width: 100%;
		height: 146rpx;
		background: linear-gradient(180deg, #ffffff 0%, #c9ffde 100%);
	}

	.empty-content {
		position: relative;
		width: 100%;
		height: 704rpx;
		border-radius: 24rpx;
		background-color: #fff;
		box-shadow: 0rpx 16rpx 32rpx 0rpx #0000000d;
	}

	.officer-list {
		position: relative;
		padding: 0 40rpx 0 24rpx;
		height: 98rpx;
	}

	.officer-detail {
		position: relative;
		padding: 32rpx 24rpx 24rpx 24rpx;
		background-color: #fff;
		border-radius: 48rpx;

		.points {
			width: 200rpx;
			height: 200rpx;
			background-color: $uni-bg-color;
			border-radius: 50%;
		}

		.text.points-text {
			line-height: 68rpx;
		}
	}

	.date-info {
		height: 240rpx;
		padding: 8rpx 24rpx 22rpx 24rpx;
		background: linear-gradient(180deg, #7dffaf 0%, #4ef08c 100%);
		border-radius: 24rpx;
	}

	.date-count::after {
		display: inline-block;
		vertical-align: super;
		content: '天';
		margin-left: 4rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: $uni-text-color;
		font-weight: 600;
	}

	.expire-date {
		display: flex;
		align-items: center;
		gap: 10rpx;
		opacity: 0.6;
	}

	.expire-date:before {
		content: '';
		height: 2rpx;
		width: 112rpx;
		background-color: $uni-text-color;
		opacity: 0.3;
	}

	.renew-btn {
		width: 360rpx;
		height: 72rpx;
		background-color: $uni-text-color;
		border-radius: 44rpx;
		margin: 0 auto;
	}

	.contract-item:not(.popup-contract-item) {
		position: relative;
		padding: 30rpx 24rpx 24rpx 32rpx;
		height: 256rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color;
		border-radius: 24rpx;
		background: linear-gradient(143.18deg, #e3ffee 6.48%, #ffffff 55.6%);

		.points {
			position: absolute;
			top: 36rpx;
			right: 24rpx;
		}
	}

	.line {
		width: 2rpx;
		height: 24rpx;
		background-color: $uni-text-color-gray3;
	}

	.present-btn,
	.activate-btn {
		width: 120rpx;
		height: 56rpx;
		border-radius: 28rpx;
	}

	.present-btn {
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2;
	}

	.activate-btn {
		background-color: $uni-color-accent1;
	}

	.service-cover {
		flex: none;
		border-radius: 16rpx;
	}

	.service-content {
		flex: 1;
		height: 204rpx;
		.full-width {
			margin-top: auto;
		}
	}

	.buy-btn {
		width: 120rpx;
		height: 56rpx;
		border-radius: 28rpx;
		box-shadow: 0 0 0 2rpx $uni-text-color-gray2;
	}

	.ellipsis {
		display: -webkit-box;
		-webkit-line-clamp: 2; /* 限制为两行 */
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
}

.renew-popup,
.point-popup {
	padding: 0 32rpx;

	.popup-content {
		flex: 1;
	}

	.close-btn {
		height: 88rpx;
		align-items: center;
		justify-content: flex-end;
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

	.point-list {
		flex-wrap: wrap;
		row-gap: 26rpx;
	}

	.point-item {
		width: 330rpx;
		height: 160rpx;
		padding: 24rpx 32rpx;
		border-radius: 24rpx;
		background-color: $uni-bg-color-2;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
	}

	.point-item.active {
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
		background-color: $uni-color-accent2;
	}

	.tabbar-container {
		height: 104rpx;
		background-color: #fff;
		padding: 16rpx 32rpx 0 32rpx;
	}

	.buy-btn {
		flex: 1;
		height: 88rpx;
		background-color: $uni-color-primary;
		border-radius: 44rpx;
	}
}

.activate-popup {
	width: 588rpx;
	border-radius: 32rpx;
	padding: 40rpx;
	background-color: #fff;

	.cancel-btn,
	.confirm-btn {
		width: 240rpx;
		height: 88rpx;
		border-radius: 44rpx;
	}

	.cancel-btn {
		background-color: $uni-bg-color;
	}

	.confirm-btn {
		background-color: $uni-color-primary;
	}
}
</style>
