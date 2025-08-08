<template>
	<Flexbox direction="column" gap="12" className="profile-test">
		<Flexbox direction="column" gap="12" className="test-info" v-for="record in records" :key="record.record_id">
			<Flexbox align="justify" className="title">
				<Typography fontSize="18" :bold="true">{{ record.examination_date }}</Typography>
				<Typography color="gray1">体检机构：{{ record.institution || '-' }}</Typography>
			</Flexbox>
			<Flexbox direction="column" gap="8">
				<Typography color="gray1" :bold="true">异常项：</Typography>
				<Flexbox v-if="record.summary">
					<Flexbox align="center" className="dot"></Flexbox>
					<view class="result-text">
						<Typography>{{ record.summary }}</Typography>
					</view>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox align="center" direction="column" className="empty-content" v-if="!records.length && loaded">
			<Icon src="empty.png" size="128"></Icon>
			<Typography color="gray2">暂无数据</Typography>
		</Flexbox>
	</Flexbox>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			loaded: false,
			records: []
		};
	},
	mounted() {
		this.getData();
	},
	props: {
		memberId: [String, Number]
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	},
	watch: {
		memberId(newValue, oldValue) {
			this.getData();
		}
	},
	methods: {
		getData() {
			request({
				url: '/api/v2/health_record/medical_records',
				data: {
					family_member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.records = res;
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
.profile-test {
	.test-info {
		padding: 0 24rpx 24rpx 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.title {
		height: 98rpx;
		border-bottom: 2rpx solid $uni-text-color-gray4;
	}

	.dot {
		width: 40rpx;
		height: 40rpx;
		&::after {
			content: '';
			width: 10rpx;
			height: 10rpx;
			background-color: $uni-text-color;
			border-radius: 50%;
		}
	}

	.result-text {
		line-height: 1;
	}

	.result-text .text {
		display: inline;
	}

	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
