<template>
	<view :class="textClass" :style="textStyle"><slot></slot></view>
</template>

<script>
import { parseStyle } from '@/utils/util';

export default {
	name: 'Typography',
	props: {
		className: {
			type: String,
			default: undefined
		},
		fontSize: {
			type: [Number, String],
			default: undefined
		},
		color: {
			type: String,
			default: undefined
		},
		bold: {
			type: [Boolean, Number],
			default: false
		},
		align: {
			type: String,
			default: undefined
		},
		wrap: {
			type: Boolean,
			default: true
		},
		inline: {
			type: Boolean,
			default: false
		}
	},
	options: {
		virtualHost: true
	},
	computed: {
		textClass() {
			const classList = ['text'];
			if (this.color && !this.isValidColor(this.color)) {
				classList.push(`text-color-${this.color}`);
			}
			if (this.fontSize) {
				classList.push(`text-size-${this.fontSize}`);
			}
			if (this.bold && typeof this.bold === 'boolean') {
				classList.push('text-bold');
			}
			if (this.className) {
				classList.push(this.className);
			}
			return classList.filter((item) => item !== 'true');
		},
		textStyle() {
			const style = {
				color: this.isValidColor(this.color) ? this.color : undefined,
				display: this.inline ? 'inline' : undefined,
				'text-align': this.align || undefined,
				'white-space': !this.wrap ? 'nowrap' : undefined,
				'font-weight': this.bold && typeof this.bold === 'number' ? this.bold : undefined
			};
			return parseStyle(style);
		}
	},
	methods: {
		isValidColor(color) {
			if (!color) return false;

			// 判断是否为 hex 颜色
			const isHex = /^#[0-9A-Fa-f]{6}$/.test(color);

			// 判断是否为常见英文颜色名称
			const namedColors = [
				'black',
				'silver',
				'gray',
				'white',
				'maroon',
				'red',
				'purple',
				'fuchsia',
				'green',
				'lime',
				'olive',
				'yellow',
				'navy',
				'blue',
				'teal',
				'aqua',
				'orange',
				'brown',
				'pink',
				'gold',
				'cyan',
				'magenta'
			];
			const isNamed = namedColors.includes(color.toLowerCase());

			return isHex || isNamed;
		}
	}
};
</script>

<style scoped lang="scss">
.text {
	font-family: PingFang SC;
	font-weight: 400;
	font-size: 28rpx;
	line-height: 40rpx;
	font-family: inherit;
	color: $uni-text-color;
}

.text-size-10 {
	font-size: 20rpx;
	line-height: 28rpx;
}

.text-size-12 {
	font-size: 24rpx;
	line-height: 34rpx;
}

.text-size-13 {
	font-size: 26rpx;
}

.text-size-16 {
	font-size: 32rpx;
	line-height: 44rpx;
}

.text-size-17 {
	font-size: 34rpx;
	line-height: 50rpx;
}
.text-size-18 {
	font-size: 36rpx;
	line-height: 50rpx;
}
.text-size-22 {
	font-size: 44rpx;
	line-height: 62rpx;
}
.text-size-24 {
	font-size: 48rpx;
	line-height: 58rpx;
}

.text-size-28 {
	font-size: 56rpx;
	line-height: 78rpx;
}

.text-size-30 {
	font-size: 60rpx;
	line-height: 80rpx;
}

.text-size-36 {
	font-size: 72rpx;
	line-height: 100rpx;
}

.text-bold {
	font-weight: 600;
}

.text-color-white {
	color: #ffffff;
}

.text-color-gray1 {
	color: $uni-text-color-gray1;
}
.text-color-gray2 {
	color: $uni-text-color-gray2;
}
.text-color-gray3 {
	color: $uni-text-color-gray3;
}
.text-color-gray4 {
	color: $uni-text-color-gray4;
}

.text-color-primary {
	color: $uni-color-primary;
}

.text-color-warning {
	color: $uni-color-warning;
}
.text-color-danger {
	color: $uni-color-danger;
}
</style>
