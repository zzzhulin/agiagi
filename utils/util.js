export const isAudioFile = (filename) => {
	const audioExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma', '.alac', '.opus'];
	const fileExtension = filename.toLowerCase().slice(-4);
	return audioExtensions.some(ext => fileExtension.endsWith(ext));
}

export const parseStyle = (style) => {
	return Object.entries(style)
		.filter(([key, value]) => value !== undefined)
		.map(([key, value]) => `${key}:${value}`)
		.join(';');
}

export const formatNumber = (value, digits) => {
	let number = parseFloat(value);
	if (Number.isInteger(number)) {
		if (digits) {
			return number.toFixed(1)
		}
		return number.toString();
	}
	let stringValue = number.toFixed(2);
	if (stringValue.endsWith('.00')) {

		return parseInt(stringValue).toString();
	}
	if (stringValue.endsWith('0')) {
		return parseFloat(stringValue).toString();
	}
	return stringValue;
}

export const formatDate = (dateStr, format) => {
	const date = new Date(dateStr);
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hour = date.getHours().toString().padStart(2, '0');
	const minute = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');

	return format.replace(/YYYY|MM|DD|hh|mm|ss/g, token => {
		switch (token) {
			case 'YYYY':
				return year;
			case 'MM':
				return month;
			case 'DD':
				return day;
			case 'hh':
				return hour;
			case 'mm':
				return minute;
			case 'ss':
				return seconds;
			default:
				return token;
		}
	});
};

export const arrayBufferToString = (buffer) => {
	const uint8Array = new Uint8Array(buffer);
	// 将字节数组转换为字符串
	let binaryString = '';
	for (let i = 0; i < uint8Array.length; i++) {
		binaryString += String.fromCharCode(uint8Array[i]);
	}
	// 处理 UTF-8 编码中的多字节字符
	return decodeURIComponent(escape(binaryString));
}

export const isImageLink = (url) => {
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
	return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

export const filterParams = (params) => {
	if (params && typeof params === "object") {
		Object.keys(params).forEach((key) => {
			if (params[key] === "" || params[key] === null || params[key] === undefined) {
				delete params[key];
			} else if (typeof params[key] === "object") {
				filterParams(params[key]);
			}
		});
	}
	return params;
};

export const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return `${[year, month, day].map(formatNumber).join('_')}_${[hour, minute, second].map(formatNumber).join('_')}`
}

const padding2 = (t) => {
	if (t < 10) {
		return "0" + t
	}
	return "" + t
}

export const utctimestamp = () => {
	let date = new Date()
	let YYYY = date.getUTCFullYear()
	let MM = padding2(date.getUTCMonth() + 1)
	let DD = padding2(date.getUTCDate())
	let HH = padding2(date.getUTCHours())
	let mm = padding2(date.getUTCMinutes())
	let ss = padding2(date.getUTCSeconds())
	return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`
}

export const sleep = (milSec) => {
	return new Promise(resolve => {
		setTimeout(resolve, milSec)
	})
}

export const parseMsg = (msg) => {
	let parsedMsg = null;
	try {
		parsedMsg = JSON.parse(msg);
	} catch (e) {
		console.error('消息解析失败:', e);
	}
	return parsedMsg;
}

export const getTime = (timestamp) => {
	if (timestamp.toString().length === 10) {
		timestamp *= 1000;
	}
	const date = new Date(timestamp);
	let hours = date.getHours();
	let minutes = date.getMinutes();
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;

	return `${hours}:${minutes}`;
}

export const extractSpecs = (title = '') => {
	// 常见单位
	const unitPattern = '(?:g|kg|mg|ml|l|L|mL)';
	// 可选包装后缀
	const packPattern = '(?:盒|箱|瓶|罐|支|件)?';
	// 可选“*12罐”或“× 12 瓶”之类的乘积形式
	const multiplierPattern = '(?:[×*]\\s?\\d+\\s?(?:瓶|罐|件|包)?)?';

	// 拼接总体正则：数字（可带小数）+ 单位 + 可选包装 + 可选乘积
	const regex = new RegExp(
		`\\d+(?:\\.\\d+)?${unitPattern}${packPattern}${multiplierPattern}`,
		'gi'
	);

	// 返回所有匹配，若无则返回空数组
	return title.match(regex) || [];
};