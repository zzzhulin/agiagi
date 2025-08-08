<template>
	<Flexbox direction="column" gap="12" className="profile-inherit">
		<Flexbox align="justify" gap="19" className="family-info" v-for="disease in diseases" :key="disease.history_id">
			<Typography>{{ disease.relative_name }}</Typography>
			<Typography>{{ disease.disease_name }}</Typography>
		</Flexbox>
		<Flexbox align="center" direction="column" className="empty-content" v-if="!diseases.length && loaded">
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
			diseases: []
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
				url: '/api/v2/health_record/genetic_history',
				data: {
					family_member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.diseases = res;
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
.profile-inherit {
	.family-info {
		padding: 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}
	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
