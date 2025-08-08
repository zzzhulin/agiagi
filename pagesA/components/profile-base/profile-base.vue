<template>
	<Flexbox direction="column" gap="20" className="profile-base">
		<Flexbox direction="column" gap="12" className="auth-info">
			<Typography fontSize="18" :bold="true">身份信息</Typography>
			<Flexbox direction="column" gap="8">
				<Flexbox>
					<Typography color="gray2">ID：</Typography>
					<Typography>{{ baseInfo.identity_info.id || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">身份证号：</Typography>
					<Typography>{{ baseInfo.identity_info.id_number || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">手机号：</Typography>
					<Typography>{{ baseInfo.identity_info.phone || '' }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="12" className="base-info">
			<Typography fontSize="18" :bold="true">基础信息</Typography>
			<Flexbox direction="column" gap="8">
				<Flexbox>
					<Typography color="gray2">性别：</Typography>
					<Typography>{{ baseInfo.basic_info.gender || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">出生日期：</Typography>
					<Typography>{{ baseInfo.basic_info.birth_date || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">出生地：</Typography>
					<Typography>{{ baseInfo.basic_info.birth_place || '' }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<Flexbox direction="column" gap="12">
			<Typography fontSize="18" :bold="true">动态信息</Typography>
			<Flexbox direction="column" gap="8">
				<Flexbox>
					<Typography color="gray2">身高：</Typography>
					<Typography>{{ baseInfo.dynamic_info.height || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">体重：</Typography>
					<Typography>{{ baseInfo.dynamic_info.weight || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">心率：</Typography>
					<Typography>{{ baseInfo.dynamic_info.heart_rate || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">血脂：</Typography>
					<Typography>{{ baseInfo.dynamic_info.blood_lipid || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">血糖：</Typography>
					<Typography>{{ baseInfo.dynamic_info.blood_sugar_fasting || '' }}(空腹）/ {{ baseInfo.dynamic_info.blood_sugar_postprandial || '' }}(餐后)</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">尿酸：</Typography>
					<Typography>{{ baseInfo.dynamic_info.uric_acid || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">心脏：</Typography>
					<Typography>{{ baseInfo.dynamic_info.heart || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">肝脏：</Typography>
					<Typography>{{ baseInfo.dynamic_info.liver || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">胃：</Typography>
					<Typography>{{ baseInfo.dynamic_info.stomach || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">肺：</Typography>
					<Typography>{{ baseInfo.dynamic_info.lung || '' }}</Typography>
				</Flexbox>
				<Flexbox>
					<Typography color="gray2">肾：</Typography>
					<Typography>{{ baseInfo.dynamic_info.kidney || '' }}</Typography>
				</Flexbox>
			</Flexbox>
		</Flexbox>
	</Flexbox>
</template>

<script>
import { request } from '@/utils/request';
export default {
	data() {
		return {
			baseInfo: null
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
				url: '/api/v2/health_record/basic_info_new',
				data: {
					family_member_id: this.memberId
				},
				isRobot: true,
				success: (res) => {
					if (res) {
						this.baseInfo = res;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.profile-base {
	padding: 24rpx;
	background-color: #fff;
	border-radius: 16rpx;

	.auth-info,
	.base-info {
		position: relative;
		padding-bottom: 40rpx;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 2rpx;
			background-color: $uni-text-color-gray4;
		}
	}
}
</style>
