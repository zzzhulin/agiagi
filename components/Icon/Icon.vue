<template>
	<Flexbox :align="align" :direction="direction" :gap="gap" :className="['icon', className]">
		<image :src="iconPath" :mode="mode" :style="iconStyle" class="icon-image" v-if="src" @tap="onPreview" />
		<view class="icon-image" :style="iconStyle" v-else></view>
		<Typography :color="color" :fontSize="fontSize" :bold="bold" className="icon-text">{{ label }}</Typography>
		<slot name="label"></slot>
	</Flexbox>
</template>

<script>
import { parseStyle } from '@/utils/util';
import { cdnUrl } from '@/utils/constant';
export default {
	props: {
		src: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: undefined
		},
		mode: {
			type: String,
			default: undefined
		},
		size: {
			type: [String, Number],
			default: undefined
		},
		width: {
			type: [String, Number],
			default: undefined
		},
		height: {
			type: [String, Number],
			default: undefined
		},
		circle: {
			type: Boolean,
			default: undefined
		},
		label: {
			type: String,
			default: undefined
		},
		direction: {
			type: String,
			default: undefined
		},
		align: {
			type: String,
			default: undefined
		},
		color: {
			type: String,
			default: undefined
		},
		fontSize: {
			type: [String, Number],
			default: undefined
		},
		bold: {
			type: Boolean,
			default: undefined
		},
		gap: {
			type: [String, Number],
			default: undefined
		},
		className: {
			type: String,
			default: ''
		},
		preview: {
			type: Boolean,
			default: undefined
		}
	},
	options: {
		styleIsolation: 'shared',
		virtualHost: true
	},
	computed: {
		iconPath() {
			return this.type === 'remote' ? this.src : `${cdnUrl}/images/${this.src}`;
		},
		iconStyle() {
			const style = {
				width: this.size ? `${this.size * 2}rpx` : `${this.width * 2}rpx`,
				height: this.size ? `${this.size * 2}rpx` : `${this.height * 2}rpx`,
				'border-radius': this.circle ? '50%' : undefined
			};
			return parseStyle(style);
		}
	},
	methods: {
		onPreview() {
			if (this.preview) {
				uni.previewImage({
					urls: [this.src]
				});
			}
		}
	}
};
</script>

<style lang="scss">
.icon {
	cursor: pointer;
	overflow: hidden;
}

.icon-text {
	white-space: nowrap;
}
</style>
