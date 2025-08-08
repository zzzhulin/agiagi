<template>
	<view class="tongue-diagnosis-page">
		<Navbar title="察颜观舌"></Navbar>
		<Flexbox direction="column" gap="24">
			<Flexbox direction="column" gap="16">
				<Typography :bold="true">选择要调查的成员</Typography>
				<scroll-view :scroll-x="true" :enable-flex="true" class="family-list">
					<Flexbox
						align="center"
						:className="['family-item', { active: member.member_id === memberId }]"
						v-for="member in family"
						:key="member.member_id"
						@tap="selectMember(member)"
					>
						<Flexbox align="center" direction="column" gap="8">
							<Icon :src="member.avatar" size="60" :circle="true" type="remote"></Icon>
							<Typography :bold="true">{{ member.relationship }}</Typography>
						</Flexbox>
					</Flexbox>
				</scroll-view>
			</Flexbox>
			<Flexbox direction="column" gap="16">
				<Flexbox direction="column">
					<Typography>至少上传1张照片，请勿使用美颜照，</Typography>
					<Typography>如有特殊情况（如相机拍不到等），请文字补充说明。</Typography>
				</Flexbox>
				<Flexbox gap="16">
					<Flexbox align="center" className="upload-face" @tap="onUpload('face')">
						<block v-if="face">
							<image :src="face" mode="aspectFit" class="face-image" @tap="onPreview(0)"></image>
							<Icon src="icon_delete.png" size="24" className="icon-delete" @tap.stop="onDelete('face')"></Icon>
						</block>
						<Icon src="face.png" size="88" direction="column" gap="5" label="+上传正脸照" color="gray1" :bold="true" v-else></Icon>
					</Flexbox>
					<Flexbox direction="column" gap="16">
						<Flexbox align="center" className="upload-tongue" @tap="onUpload('tongueCoating')">
							<block v-if="tongueCoating">
								<image :src="tongueCoating" mode="aspectFit" class="tongue-image" @tap="onPreview(1)"></image>
								<Icon src="icon_delete.png" size="24" className="icon-delete" @tap.stop="onDelete('tongueCoating')"></Icon>
							</block>
							<Icon src="tongue-coating.png" size="88" direction="column" gap="5" label="+上传舌苔照" color="gray1" :bold="true" v-else></Icon>
						</Flexbox>
						<Flexbox align="center" className="upload-tongue" @tap="onUpload('tongueBody')">
							<block v-if="tongueBody">
								<image :src="tongueBody" mode="aspectFit" class="tongue-image" @tap="onPreview(2)"></image>
								<Icon src="icon_delete.png" size="24" className="icon-delete" @tap.stop="onDelete('tongueBody')"></Icon>
							</block>
							<Icon src="tongue-body.png" size="88" direction="column" gap="5" label="+上传舌腹照" color="gray1" :bold="true" v-else></Icon>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<Flexbox className="description">
					<textarea v-model="description" placeholder="如有特殊情况，请填写" placeholder-class="placeholder"></textarea>
					<Flexbox align="center" className="speech-btn" @tap="openPopup">
						<Icon src="icon_microphone-primary.png" size="18" />
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" className="tabbar-container">
			<Flexbox align="center" className="analysis-btn" @tap="onAnalysis">
				<Typography fontSize="18" color="white" :bold="true">开始分析</Typography>
			</Flexbox>
		</Flexbox>
		<Speech ref="speechPopup" @confirm="setText"></Speech>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { upload } from '@/utils/upload';

export default {
	data() {
		return {
			memberId: '',
			face: '',
			tongueCoating: '',
			tongueBody: '',
			description: '',
			family: []
		};
	},
	mounted() {
		this.getFamily();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['setMember']),
		openPopup() {
			this.$refs.speechPopup.open();
		},
		setText(text) {
			this.description += text;
		},
		onAnalysis() {
			if (!this.face) {
				uni.showToast({
					title: '请上传正脸照',
					icon: 'none'
				});
				return;
			}
			if (!this.tongueCoating) {
				uni.showToast({
					title: '请上传舌苔照',
					icon: 'none'
				});
				return;
			}
			if (!this.tongueBody) {
				uni.showToast({
					title: '请上传舌腹照',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '开始分析...',
				mask: true
			});
			request({
				url: '/ai_docter/api/tongue-diagnosis',
				method: 'POST',
				data: {
					description: this.description,
					images: [this.face, this.tongueCoating, this.tongueBody],
					member_id: this.memberId,
					user_id: this.userInfo.member_id.toString()
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						const { id, image_analysis, constitution_type, constitution_features, organ_location, symptom_analysis } = res;
						this.$store.commit('setTongueInfo', {
							diagnosis_id: id,
							member_id: this.memberId,
							images: [this.face, this.tongueCoating, this.tongueBody],
							description: this.description,
							image_analysis,
							constitution_type,
							constitution_features,
							organ_location,
							symptom_analysis
						});
						uni.redirectTo({
							url: '/pagesC/tongue/result'
						});
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		selectMember(member) {
			this.memberId = member.member_id;
			this.setMember(member);
		},
		getFamily() {
			request({
				url: '/api/v2/survey/family-members',
				data: {
					user_id: this.userInfo.member_id
				},
				isRobot: true,
				success: (res) => {
					if (res && res.length) {
						this.family = res;
						this.memberId = res[0].member_id;
						this.setMember(res[0]);
					}
				}
			});
		},
		onPreview(current) {
			uni.previewImage({
				urls: [this.face, this.tongueCoating, this.tongueBody],
				current
			});
		},
		onDelete(field) {
			this[field] = '';
		},
		onUpload(field) {
			if (this[field]) {
				return;
			}
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: async (res) => {
					const file = res.tempFiles[0];
					const result = await upload(file.path, 'image');
					if (result) {
						this[field] = result;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.tongue-diagnosis-page {
	min-height: 100vh;
	padding: 32rpx 32rpx 200rpx 32rpx;
	background-color: #fff;

	.upload-face,
	.upload-tongue {
		position: relative;
		background-color: $uni-bg-color-2;
		border-radius: 22rpx;
		border: 2rpx dashed $uni-text-color-gray2;
		overflow: hidden;
	}

	.upload-face,
	.falce-image {
		width: 390rpx;
		height: 560rpx;
	}

	.upload-tongue,
	.tongue-image {
		width: 264rpx;
		height: 264rpx;
	}

	.icon-delete {
		position: absolute;
		right: 8rpx;
		bottom: 8rpx;
	}

	.description {
		position: relative;
		width: 100%;
		height: 272rpx;
		padding: 16rpx 32rpx;
		border-radius: 24rpx;
		box-shadow: 0 0 0 2rpx $uni-border-color inset;
		font-size: 32rpx;
		line-height: 44rpx;
		color: $uni-text-color;
	}

	.speech-btn {
		position: absolute;
		right: 16rpx;
		bottom: 16rpx;
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background-color: $uni-bg-color;
		z-index: 9;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16rpx 32rpx env(safe-area-inset-bottom) 32rpx;
		background-color: #fff;
		z-index: 10;
	}

	.analysis-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $uni-color-primary;
	}

	.family-list {
		display: flex;
		width: auto;
		height: 264rpx;
	}

	.family-item {
		flex: none;
		width: 212rpx;
		height: 264rpx;
		margin-right: 24rpx;
		background-color: $uni-bg-color-2;
		border-radius: 24rpx;
		&:last-child {
			margin-right: 0;
		}
	}

	.family-item.active {
		box-shadow: 0 0 0 4rpx $uni-color-primary inset;
	}
}
</style>
