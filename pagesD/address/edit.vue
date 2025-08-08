<template>
	<view class="address-edit-page">
		<Navbar :title="title"></Navbar>
		<Flexbox direction="column" gap="16">
			<Flexbox align="left" gap="12">
				<Typography color="gray1" className="form-label">收货人</Typography>
				<input v-model="formData.name" type="text" placeholder="请输入收货人名字" placeholder-class="placeholder" class="form-input" />
			</Flexbox>
			<Flexbox align="left" gap="12">
				<Typography color="gray1" className="form-label">手机号码</Typography>
				<input v-model="formData.mobile" type="number" placeholder="请输入联系手机号" placeholder-class="placeholder" class="form-input" />
			</Flexbox>
			<Flexbox align="left" gap="12">
				<Typography color="gray1" className="form-label">收货地区</Typography>
				<Flexbox align="justify" className="form-input">
					<picker mode="region" :value="formData.full_address" @change="onSelectRegion">
						<view class="uni-input" v-if="formData.full_address">{{ formData.full_address }}</view>
						<view class="placeholder" v-else>选择省、市、区县</view>
					</picker>
					<Icon src="icon_arrow-right.png" size="24"></Icon>
				</Flexbox>
			</Flexbox>
			<Flexbox align="left" gap="12">
				<Typography color="gray1" className="form-label">详细地址</Typography>
				<input v-model="formData.address" type="text" placeholder="请输入街道地址、门牌号等" placeholder-class="placeholder" class="form-input" />
			</Flexbox>
		</Flexbox>
		<Flexbox align="justify" className="address-action">
			<Flexbox align="left" gap="5" @tap="setIsDefault">
				<Icon src="checkbox-active.png" size="20" v-if="formData.is_default === 1"></Icon>
				<Icon src="checkbox.png" size="20" v-else></Icon>
				<Typography>设为默认地址</Typography>
			</Flexbox>
			<Typography color="#FF5100" v-if="formData.id" @tap="deleteAddress">删除地址</Typography>
		</Flexbox>
		<Flexbox align="center" className="tabbar">
			<Flexbox align="center" className="add-btn" @tap="saveAddress">
				<Typography fontSize="18" color="white" :bold="true">保存</Typography>
			</Flexbox>
		</Flexbox>
	</view>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			title: '',
			formData: {
				id: '',
				name: '',
				mobile: '',
				telephone: '',
				province_id: '',
				city_id: '',
				district_id: '',
				address: '',
				full_address: '',
				longitude: '',
				latitude: '',
				is_default: 0
			}
		};
	},
	onLoad(options) {
		if (options.address) {
			const address = JSON.parse(options.address);
			this.formData.id = address.id;
			this.formData.name = address.name;
			this.formData.mobile = address.mobile;
			this.formData.telephone = address.telephone;
			this.formData.address = address.address;
			this.formData.is_default = address.is_default;
			this.formData.province_id = address.province_id;
			this.formData.city_id = address.city_id;
			this.formData.district_id = address.district_id;
			this.formData.full_address = address.full_address;
			this.formData.latitude = address.latitude;
			this.formData.longitude = address.longitude;
		}
		this.title = this.formData.id ? '编辑地址' : '新增地址';
	},
	methods: {
		onSelectRegion(e) {
			this.formData.province_id = e.detail.code[0];
			this.formData.city_id = e.detail.code[1];
			this.formData.district_id = e.detail.code[2];
			this.formData.full_address = e.detail.value.join('');
			this.getAddressInfo(e.detail.code[2]);
		},
		setIsDefault() {
			this.formData.is_default = this.formData.is_default === 1 ? 0 : 1;
		},
		getAddressInfo(id) {
			request({
				url: '/api/address/info',
				data: {
					id
				},
				success: (res) => {
					if (res) {
						this.formData.longitude = res.longitude;
						this.formData.latitude = res.latitude;
					}
				}
			});
		},
		deleteAddress() {
			uni.showModal({
				title: '提示',
				content: '确定删除地址？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '正在删除...', mask: true });
						request({
							url: '/api/memberaddress/delete',
							method: 'POST',
							data: {
								id: this.formData.id
							},
							success: (res) => {
								if (res) {
									setTimeout(() => {
										uni.showToast({
											title: '删除成功',
											icon: 'none',
											duration: 2000,
											complete: () => {
												uni.navigateBack();
											}
										});
									}, 100);
								}
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					}
				}
			});
		},
		saveAddress() {
			if (!this.formData.name) {
				uni.showToast({ title: '请输入收货人', icon: 'none' });
				return;
			}
			if (!this.formData.mobile) {
				uni.showToast({ title: '请输入手机号码', icon: 'none' });
				return;
			}
			if (this.formData.mobile && !/^1(3|4|5|7|8|9|6)\d{9}$/.test(this.formData.mobile)) {
				uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
				return;
			}
			if (!(this.formData.province_id && this.formData.city_id && this.formData.district_id)) {
				uni.showToast({ title: '请选择收货地区', icon: 'none' });
				return;
			}
			if (!this.formData.address) {
				uni.showToast({ title: '请输入详细地址', icon: 'none' });
				return;
			}
			uni.showLoading({ title: '正在保存...', mask: true });
			const url = this.formData.id ? '/api/memberaddress/edit' : '/api/memberaddress/add';
			request({
				url,
				method: 'POST',
				data: { ...this.formData, telephone: this.formData.mobile, community_id: 0 },
				success: (res) => {
					if (res) {
						setTimeout(() => {
							uni.showToast({
								title: '保存成功',
								icon: 'none',
								duration: 2000,
								complete: () => {
									uni.navigateBack();
								}
							});
						}, 100);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.address-edit-page {
	padding: 32rpx 32rpx 0 32rpx;

	.address-action {
		margin-top: 58rpx;
	}

	.form-label {
		width: 112rpx;
	}

	.form-input {
		flex: 1;
		height: 80rpx;
		padding: 0 24rpx;
		border-radius: 16rpx;
		background-color: $uni-bg-color-2;
		overflow: hidden;
	}

	.form-input input,
	.form-input picker,
	.uni-input {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
	}

	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 12rpx 32rpx 80rpx 32rpx;
		background-color: #fff;
	}

	.add-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.selected-area.placeholder {
		font-size: 28rpx;
		line-height: 40rpx;
		color: $uni-text-color-gray2;
	}

	.input-value.input-value-border {
		border: none;
		padding: 0;
		height: 40rpx;
	}

	.arrow-area {
		display: none;
	}

	.text-color,
	.item-text,
	.selected-item {
		color: $uni-text-color;
	}

	.selected-item-active,
	.check {
		border-color: $uni-color-primary;
	}

	.input-split-line,
	.icon-clear {
		display: none;
	}
}
</style>
