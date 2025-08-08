<template>
	<view class="test-list-page">
		<Navbar title="历史报告" backgroundColor="transparent"></Navbar>
		<Flexbox direction="column" gap="12">
			<Flexbox direction="column" gap="16" className="test-item" v-for="record in records" :key="record.id">
				<Typography color="gray2" :bold="true">{{ appName }}</Typography>
				<Flexbox>
					<Flexbox direction="column" gap="4">
						<Flexbox>
							<Typography color="gray2">测评时间：</Typography>
							<Typography>{{ formatDate(record.created_at, 'YYYY.MM.DD hh:mm') }}</Typography>
						</Flexbox>
						<Flexbox>
							<Typography color="gray2">测评对象：</Typography>
							<Typography>{{ record.member_name }}</Typography>
						</Flexbox>
					</Flexbox>
					<Flexbox align="left" gap="4" className="detail-btn" @tap="getRecordDetail(record.member_id, record.id)">
						<Icon src="icon_file.png" size="16"></Icon>
						<Typography color="gray1">报告详情</Typography>
					</Flexbox>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Login></Login>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { request } from '@/utils/request';
import { formatDate } from '@/utils/util';
export default {
	data() {
		return {
			formatDate,
			appName: '',
			appId: '',
			page: 1,
			records: [],
			total: 0
		};
	},
	onLoad(option) {
		this.appName = decodeURIComponent(option.appName);
		this.appId = option.appId;
		this.getRecords();
	},
	onReachBottom() {
		if (this.records.length < this.total) {
			this.page++;
			this.getRecords();
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['setTongueInfo']),
		getRecords() {
			request({
				url: '/api/v2/take-a-test/app-test-records',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					app_id: this.appId,
					page: this.page,
					page_size: 10
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.records = this.records.concat(res.records);
						this.total = res.pagination.total;
					}
				}
			});
		},
		getRecordDetail(member_id, record_id) {
			switch (this.appId) {
				case '1':
					uni.navigateTo({
						url: `/pagesA/report/diet?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
				case '2':
					uni.navigateTo({
						url: `/pagesA/report/slimming?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
				case '3':
					this.getTongueInfo(member_id, record_id);
					break;
				case '4':
					uni.navigateTo({
						url: `/pagesA/report/height?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
				case '5':
					uni.navigateTo({
						url: `/pagesA/report/metabolism?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
				case '6':
					uni.navigateTo({
						url: `/pagesA/report/sleep?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
				case '7':
					uni.navigateTo({
						url: `/pagesA/report/emotion?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
				case '8':
					uni.navigateTo({
						url: `/pagesA/report/age?from=test&memberId=${member_id}&appId=${this.appId}&recordId=${record_id}`
					});
					break;
			}
		},
		getTongueInfo(member_id, record_id) {
			request({
				url: '/api/v2/take-a-test/record-detail',
				method: 'POST',
				data: {
					user_id: this.userInfo.member_id,
					member_id,
					app_id: this.appId,
					record_id
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						const tongueInfo = {
							images: res.tongue_image.image_url_list,
							description: res.tongue_diagnosis.description,
							constitution_type: res.tongue_diagnosis.constitution_type,
							organ_location: res.tongue_diagnosis.organ_location,
							symptom_analysis: res.tongue_diagnosis.symptom_analysis,
							constitution_features: res.tongue_diagnosis.constitution_features
							// confirm_constitution_features: res.constitution_analysis.constitution_features,
							// etiologicalFactors: res.constitution_analysis.etiological_factors,
							// confirmEtiologicalFactors: res.constitution_analysis.confirm_etiological_factors
						};
						this.setTongueInfo(tongueInfo);
						uni.navigateTo({
							url: '/pagesC/tongue/result?from=test'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.test-list-page {
	min-height: 100vh;
	padding: 32rpx 32rpx env(safe-area-inset-bottom) 32rpx;
	background-color: $uni-bg-color;

	.test-item {
		border-radius: 24rpx;
		background-color: #ffffff;
		padding: 24rpx 32rpx 32rpx 32rpx;
	}

	.detail-btn {
		margin-left: auto;
		margin-top: auto;
	}
}
</style>
