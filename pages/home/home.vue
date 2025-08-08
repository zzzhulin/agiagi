<template>
	<Flexbox direction="column" className="home-page" :style="{ background: userInfo.is_card ? '#F4F6F9' : '#ffffff' }"></Flexbox>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	onLoad() {
		this.autoRedirect();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		autoRedirect() {
			let url = '';
			if (this.userInfo && this.userInfo.is_card) {
				url = '/pagesA/overview/overview';
			} else {
				url = '/pagesA/contract/sign';
			}
			setTimeout(() => {
				uni.redirectTo({
					url
				});
			}, 100);
		}
	}
};
</script>

<style lang="scss">
.home-page {
	height: 100vh;
	background-color: $uni-bg-color;
}
</style>
