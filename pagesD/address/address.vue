<template>
	<Flexbox direction="column" gap="12" className="address-page">
		<Navbar title="收货地址" :backgroundColor="navbarBgColor"></Navbar>
		<Flexbox align="justify" gap="16" className="address-item" v-for="address in addressList" :key="address.id" @tap="selectAddress(address)">
			<Flexbox direction="column" gap="4">
				<Flexbox align="left" gap="12">
					<Typography fontSize="16" :bold="true">{{ address.name }}</Typography>
					<Typography fontSize="16" :bold="true">{{ address.mobile }}</Typography>
					<Flexbox align="center" className="default-tag" v-if="address.is_default === 1">
						<Typography fontSize="12" color="white">默认</Typography>
					</Flexbox>
				</Flexbox>
				<Typography color="gray1">{{ address.full_address + address.address }}</Typography>
			</Flexbox>
			<Icon src="icon_edit.png" size="24" @tap.stop="navigateToEdit(address)"></Icon>
		</Flexbox>
		<Flexbox align="center" className="tabbar">
			<Flexbox align="center" className="add-btn" @tap="navigateToEdit('')">
				<Typography fontSize="18" color="white" :bold="true">+ 新增地址</Typography>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" gap="8" className="empty-content" v-if="loaded && !addressList.length">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无收货地址</Typography>
		</Flexbox>
	</Flexbox>
</template>

<script>
import { mapMutations } from 'vuex';
import { request } from '@/utils/request';
export default {
	data() {
		return {
			from: '',
			navbarBgColor: 'transparent',
			loaded: false,
			page: 1,
			total: 0,
			addressList: []
		};
	},
	onLoad(option) {
		this.from = option.from;
	},
	onPageScroll(e) {
		this.navbarBgColor = e.scrollTop >= 50 ? '#ffffff' : 'transparent';
	},
	onShow() {
		this.getAddressList();
	},
	onReachBottom() {
		if (this.addressList.length < this.total) {
			this.page++;
			this.getAddressList();
		}
	},
	methods: {
		...mapMutations(['setAddressInfo']),
		selectAddress(address) {
			if (!this.from) {
				return;
			}
			this.setAddressInfo(address);
			uni.navigateBack();
		},
		navigateToEdit(address) {
			let url = '/pagesD/address/edit';
			if (address) {
				url += `?address=${JSON.stringify(address)}`;
			}
			uni.navigateTo({
				url
			});
		},
		getAddressList() {
			request({
				url: '/api/memberaddress/page',
				method: 'POST',
				data: {
					page: this.page,
					page_size: 20
				},
				success: (res) => {
					if (res && res.count) {
						if (this.page === 1) {
							this.addressList = res.list;
						} else {
							this.addressList = this.addressList.concat(res.list);
						}
						this.total = res.count;
					}
				},
				complete: () => {
					this.loaded = true;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.address-page {
	min-height: 100vh;
	padding: 0 32rpx 212rpx 32rpx;
	background-color: $uni-bg-color;

	.address-item {
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.default-tag {
		width: 64rpx;
		height: 36rpx;
		border-radius: 8rpx;
		background-color: $uni-color-primary;
	}

	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 12rpx 32rpx 80rpx 32rpx;
		background-color: $uni-bg-color;
	}

	.add-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
