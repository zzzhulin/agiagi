<template>
	<view class="family-detail-page">
		<Navbar title="我的家人" backgroundColor="transparent" />
		<Flexbox direction="column" gap="8" className="form-container">
			<Flexbox align="justify" className="form-item">
				<Typography color="gray1" :bold="true" className="form-label">家人昵称</Typography>
				<Flexbox align="center" className="form-content">
					<input v-model="formData.member_name" placeholder="请输入家人的昵称姓名" placeholder-class="placeholder" class="form-input" />
					<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
				</Flexbox>
			</Flexbox>
			<Flexbox align="justify" className="form-item">
				<Typography color="gray1" :bold="true" className="form-label">家人头像</Typography>
				<Flexbox align="center" className="form-content" @tap="onUpload">
					<Icon :src="formData.avatar" size="44" :circle="true" type="remote" v-if="formData.avatar"></Icon>
					<input :disabled="true" placeholder="上传专属头像" placeholder-class="placeholder" class="form-input" v-else />
					<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
				</Flexbox>
			</Flexbox>
			<Flexbox align="justify" className="form-item" v-if="!formData.id">
				<Typography color="gray1" :bold="true" className="form-label">手机号码</Typography>
				<Flexbox align="center" className="form-content">
					<input v-model="formData.member_phone" type="number" placeholder="请输入家人的手机号" placeholder-class="placeholder" class="form-input" />
					<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
				</Flexbox>
			</Flexbox>
			<Flexbox align="justify" className="form-item">
				<Typography color="gray1" :bold="true" className="form-label">性别</Typography>
				<picker :value="gender" :range="genders" range-key="label" @change="selectGender">
					<Flexbox align="center" className="form-content">
						<input v-model="genders[gender].label" :disabled="true" placeholder="选择性别" placeholder-class="placeholder" class="form-input" />
						<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
					</Flexbox>
				</picker>
			</Flexbox>
			<Flexbox align="justify" className="form-item">
				<Typography color="gray1" :bold="true" className="form-label">生日</Typography>
				<picker mode="date" :value="formData.birthdate" start="1900-01-01" :end="endDate" @change="selectBirthday">
					<Flexbox align="center" className="form-content">
						<input v-model="formData.birthdate" :disabled="true" placeholder="年/月/日" placeholder-class="placeholder" class="form-input" />
						<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
					</Flexbox>
				</picker>
			</Flexbox>
			<Flexbox align="justify" className="form-item">
				<Typography color="gray1" :bold="true" className="form-label">常住城市</Typography>
				<picker mode="region" :value="formData.birthplace" @change="selectRegion">
					<Flexbox align="center" className="form-content">
						<input v-model="formData.birthplace" :disabled="true" placeholder="填写常住城市（如: 成都）" placeholder-class="placeholder" class="form-input" />
						<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
					</Flexbox>
				</picker>
			</Flexbox>
			<Flexbox align="justify" className="form-item">
				<Typography color="gray1" :bold="true" className="form-label">和他的关系</Typography>
				<Flexbox align="center" className="form-content">
					<input v-model="formData.relationship" placeholder="填写你们的关系" placeholder-class="placeholder" class="form-input" />
					<Icon src="icon_arrow-right-gray3.png" size="20"></Icon>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="save-btn" @tap="onSave">
				<Typography fontSize="18" color="white" :bold="true">保存</Typography>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@/utils/util';
import { request } from '@/utils/request';
import { upload } from '@/utils/upload';
export default {
	data() {
		return {
			gender: '',
			formData: {
				id: '',
				user_id: '',
				member_name: '',
				member_phone: '',
				gender: '',
				birthplace: '',
				avatar: '',
				birthdate: '',
				relationship: ''
			},
			genders: [
				{
					label: '男',
					value: 'M'
				},
				{
					label: '女',
					value: 'F'
				}
			]
		};
	},
	onLoad(option) {
		this.formData.id = option.id;
		if (option.id) {
			this.getFamilyDetail();
		}
	},
	computed: {
		...mapState(['userInfo']),
		endDate() {
			const date = new Date();
			return formatDate(date, 'YYYY-MM-DD');
		}
	},
	methods: {
		async onSave() {
			if (!this.formData.member_name) {
				uni.showToast({
					title: '请输入家人昵称',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.avatar) {
				uni.showToast({
					title: '请上传家人头像',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.member_phone && !this.formData.id) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.gender) {
				uni.showToast({
					title: '请选择性别',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.birthdate) {
				uni.showToast({
					title: '请选择生日',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.birthplace) {
				uni.showToast({
					title: '请选择常住城市',
					icon: 'none'
				});
				return;
			}
			if (!this.formData.relationship) {
				uni.showToast({
					title: '请输入和他的关系',
					icon: 'none'
				});
				return;
			}
			this.formData.user_id = this.userInfo.member_id;
			uni.showLoading({
				title: '正在保存...',
				mask: true
			});
			request({
				url: this.formData.id ? '/api/v2/family_member/updateFamilyMember' : '/api/v2/family_member/create',
				method: 'POST',
				data: this.formData,
				isRobot: true,
				success: (res) => {
					uni.showToast({
						title: '保存成功',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 500);
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		onUpload() {
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: async (res) => {
					const file = res.tempFiles[0];
					const result = await upload(file.path, 'image');
					if (result) {
						this.formData.avatar = result;
					}
				}
			});
		},
		selectRegion(e) {
			this.formData.birthplace = e.detail.value.join('');
		},
		selectBirthday(e) {
			this.formData.birthdate = e.detail.value;
		},
		selectGender(e) {
			this.gender = e.detail.value;
			this.formData.gender = this.genders[e.detail.value].value;
		},
		getFamilyDetail() {
			request({
				url: '/api/v2/family_member/getDetail',
				data: {
					id: this.formData.id
				},
				isRobot: true,
				success: (res) => {
					for (let key in res) {
						if (this.formData.hasOwnProperty(key)) {
							this.formData[key] = res[key];
						}
					}
					this.gender = this.genders.findIndex((item) => item.value === this.formData.gender);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.family-detail-page {
	min-height: 100vh;
	background-color: $uni-bg-color;
	padding: 24rpx 32rpx 172rpx 32rpx;

	.form-container {
		padding: 24rpx;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.form-item {
		height: 96rpx;
	}

	.form-label {
		width: 140rpx;
		flex: none;
	}

	.form-content {
		margin-left: auto;
	}

	.form-input {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		text-align: right;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
	}

	.save-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}
}
</style>
