<template>
	<Flexbox direction="column" gap="12" className="profile-lifestyle">
		<block v-if="lifestyle">
			<Flexbox direction="column" gap="12" className="sleep-info">
				<Flexbox align="justify" className="title">
					<Typography fontSize="18" :bold="true">睡眠习惯</Typography>
					<!-- <Typography color="gray1">较为规律</Typography> -->
				</Flexbox>
				<Flexbox direction="column" gap="8">
					<Typography fontSize="16">{{ lifestyle.sleep_habits || '暂无数据' }}</Typography>
					<!-- <Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">入睡：</Typography>
						<Typography>22点左右</Typography>
					</Flexbox>
					<Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">起床：</Typography>
						<Typography>7点左右</Typography>
					</Flexbox> -->
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="diet-info">
				<Flexbox align="justify" className="title">
					<Typography fontSize="18" :bold="true">饮食模式</Typography>
					<!-- <Typography color="gray1">较为规律</Typography> -->
				</Flexbox>
				<Flexbox direction="column" gap="8">
					<Typography fontSize="16">{{ lifestyle.dietary_pattern || '暂无数据' }}</Typography>
					<!-- <Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">早餐：</Typography>
						<Typography>8:00，在家</Typography>
					</Flexbox>
					<Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">午餐：</Typography>
						<Typography>12:00，工作餐</Typography>
					</Flexbox>
					<Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">晚餐：</Typography>
						<Typography>18:00，饭局居多，每周约3次</Typography>
					</Flexbox> -->
				</Flexbox>
			</Flexbox>
			<Flexbox direction="column" gap="12" className="sport-info">
				<Flexbox align="justify" className="title">
					<Typography fontSize="18" :bold="true">运动习惯</Typography>
					<!-- <Typography color="gray1">较为规律</Typography> -->
				</Flexbox>
				<Flexbox direction="column" gap="8">
					<Typography fontSize="16">{{ lifestyle.exercise_habits || '暂无数据' }}</Typography>
					<!-- <Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">羽毛球：</Typography>
						<Typography>每周1次，约30分钟</Typography>
					</Flexbox>
					<Flexbox>
						<Flexbox align="center" className="dot"></Flexbox>
						<Typography :bold="true">跑步：</Typography>
						<Typography>每天1次，约30分钟</Typography>
					</Flexbox> -->
				</Flexbox>
			</Flexbox>
		</block>
		<Flexbox align="center" direction="column" className="empty-content" v-if="!lifestyle && loaded">
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
			lifestyle: null
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
				url: '/api/v2/health_record/lifestyle',
				data: {
					family_member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.lifestyle = res;
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
.profile-lifestyle {
	.sleep-info,
	.diet-info,
	.sport-info {
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

	.empty-content {
		margin-top: 200rpx;
	}
}
</style>
