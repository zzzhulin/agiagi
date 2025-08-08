<template>
	<view class="navbar">
		<Flexbox direction="column" className="navbar-container" :style="{ backgroundColor }">
			<view class="status-bar" :style="{ height: `${statusBarHeight * 2}rpx` }"></view>
			<Flexbox align="left" className="navbar-content">
				<Icon src="icon_back.png" width="22" height="19" className="back-icon" mode="widthFix" @tap="navigateBack"></Icon>
				<Flexbox :align="title ? 'center' : ''" className="navbar-title">
					<Typography fontSize="17" :bold="600" v-if="title">{{ title }}</Typography>
					<slot v-else></slot>
				</Flexbox>
			</Flexbox>
		</Flexbox>
		<view class="navbar-placeholder" :style="{ height: `${(statusBarHeight + 44) * 2}rpx` }" v-if="fixed"></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	props: {
		title: {
			type: String,
			default: undefined
		},
		fixed: {
			type: Boolean,
			default: true
		},
		backgroundColor: {
			type: String,
			default: undefined
		}
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	},
	computed: {
		...mapState(['statusBarHeight'])
	},
	methods: {
		navigateBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
.navbar-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9999;
	background-color: #ffffff;
	.navbar-content {
		height: 88rpx;
	}
	.back-icon {
		position: absolute;
		left: 30rpx;
	}
	.navbar-title {
		flex: 1;
	}
}
</style>
