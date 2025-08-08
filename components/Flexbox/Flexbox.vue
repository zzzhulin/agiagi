<template>
	<view :class="flexboxClass" :style="flexboxStyle">
		<slot></slot>
	</view>
</template>

<script>
import { parseStyle } from '@/utils/util';

export default {
	name: 'Flexbox',
	props: {
		className: {
			type: [String, Array],
			default: undefined
		},
		style: {
			type: [String, Object],
			default: () => undefined
		},
		direction: {
			type: String,
			default: undefined
		},
		align: {
			type: String,
			default: undefined
		},
		gap: {
			type: [String, Number],
			default: undefined
		}
	},
	options: {
		virtualHost: true
	},
	computed: {
		flexboxClass() {
			const classList = ['flexbox'];

			if (this.direction) {
				classList.push(`flexbox-${this.direction}`);
			}
			if (this.align) {
				classList.push(`flexbox-${this.align}`);
			}
			if (this.className) {
				if (typeof this.className === 'string') {
					classList.push(this.className);
				} else {
					this.className.forEach((item) => {
						if (typeof item === 'string') {
							classList.push(item);
						} else {
							for (let key in item) {
								if (item[key]) {
									classList.push(key);
								}
							}
						}
					});
				}
			}
			return classList.filter((item) => item !== 'true');
		},
		flexboxStyle() {
			let style = {
				gap: this.gap ? `${parseInt(this.gap) * 2}rpx` : undefined
			};
			return `${parseStyle(style)}${this.style || ''}`;
		}
	}
};
</script>

<style scoped>
.flexbox {
	display: flex;
}

.flexbox-column {
	flex-direction: column;
}

.flexbox-left {
	align-items: center;
}

.flexbox-center {
	align-items: center;
	justify-content: center;
}

.flexbox-justify {
	align-items: center;
	justify-content: space-between;
}

.flexbox-reverse {
	flex-direction: row-reverse;
}

.flexbox-end {
	align-items: flex-end;
}

.flexbox-baseline {
	align-items: baseline;
}

.flexbox-right {
	justify-content: flex-end;
}
</style>
