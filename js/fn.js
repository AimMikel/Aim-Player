/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Project  : Aim Player
 * Developer: Aim Mikel (Michael Aloo)
 * Created  : 10 Feb, 2021
 * Copyright: 2021 Aim Mikel
 * Contacts : { email: 'michaelaloo.sudo@gmail.com', phone: '+254703929108' }
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * This project and all its content was created by Aim Mikel and is therefore
 * a copyright of the owner. All rights are therefore reserved.
 *
 * You can edit or redistribute this file as you want.
 * However, this product should not be used for any commercial purposes without
 * owners awareness.
 *
 * The aim of this project was to teach developers who are begginers in web
 * development some basic Javascript fundamentals.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

((root, factory) => {
	root.fn = factory();
})(typeof self !== 'undefined' ? self : fn, () => {
	let toString = Object.prototype.toString;
	let cssPrefix = ['webkit', 'moz', 'ms'];
	let availCss = typeof document !== 'undefined' ? document.createElement('div').style : {};

	return {
		isString: (v) => typeof v === 'string',
		isObject: (v) => typeof v === 'object' && v !== null,
		isArray: (v) => Array.isArray(v) || v instanceof Array,
		isFunction: (v) => typeof v === 'function',
		isBool: (v) => typeof v === 'boolean',
		isDef: (v) => typeof v !== 'undefined',
		isNull: (v) => v === null,
		isFile: (v) => toString.call(v) === '[object File]',
		isBlob: (v) => toString.call(v) === '[object Blob]',
		isEmpty: (v) => fn.len(v) == 0,
		includes: (v1, v2) => {
			if (!fn.isString(v2)) {
				return false;
			}
			v2 = v2.toLowerCase();
			if (fn.isString(v1)) {
				v1 = v1.toLowerCase();
				return v1.includes(v2);
			} else if (fn.isArray(v1)) {
				for (let i = 0; i < v1.length; i++) {
					if (fn.isString(v1[i]) && v1[i].toLowerCase() === v2) {
						return true;
					}
				}
			}
			return false;
		},
		len: (v) => {
			if (fn.isArray(v) || fn.isString(v)) {
				return v.length;
			} else if (fn.isObject(v)) {
				return Object.keys(v).length;
			}
			return 0;
		},
		dom: (sel) => (fn.isString(sel) ? document.querySelector(sel) : sel),
		doms: (sel) => (fn.isString(sel) ? document.querySelectorAll(sel) : [sel]),
		html: (elem, val) => {
			if (fn.isDef(val)) {
				elem = fn.doms(elem);
				for (var i = 0, ii = fn.len(elem); i < ii; i++) {
					elem[i].innerHTML = val;
				}
			} else {
				return fn.dom(elem).innerHTML;
			}
		},
		text: (elem, val) => {
			if (fn.isDef(val)) {
				elem = fn.doms(elem);
				for (var i = 0, ii = fn.len(elem); i < ii; i++) {
					elem[i].innerText = val;
				}
			} else {
				return fn.dom(elem).innerText;
			}
		},
		css: function css(elem, styles) {
			elem = fn.doms(elem);
			for (var prop in styles) {
				for (var i = 0, ii = fn.len(elem); i < ii; i++) {
					elem[i].style[fn.cssPrefixed(prop)] = styles[prop];
				}
			}
		},
		val: (elem, value) => {
			if (fn.isDef(value)) {
				elem = fn.doms(elem);
				for (var i = 0, ii = fn.len(elem); i < ii; i++) {
					elem[i].value = value;
				}
			} else {
				return fn.dom(elem).value;
			}
		},
		attr: function attr(elem, attr, val) {
			if (fn.len(arguments) > 2) {
				elem = fn.doms(elem);
				for (var i = 0, ii = fn.len(elem); i < ii; i++) {
					elem[i].setAttribute(attr, val);
				}
			} else {
				return fn.dom(elem).getAttribute(attr);
			}
		},
		hasAttr: (elem, attr) => fn.dom(elem).getAttribute(attr) !== null,
		hasClass: (elem, val) => fn.includes(fn.dom(elem).className, val),
		addClass: (elem, val) => {
			elem = fn.doms(elem);
			for (var i = 0, ii = fn.len(elem); i < ii; i++) {
				if (!fn.hasClass(elem[i], val)) {
					fn.attr(elem[i], 'class', `${elem[i].className.trim()} ${val}`);
				}
			}
		},
		removeClass: (elem, val) => {
			elem = fn.doms(elem);
			for (var i = 0, ii = fn.len(elem); i < ii; i++) {
				if (fn.hasClass(elem[i], val)) {
					fn.attr(elem[i], 'class', elem[i].className.replace(val, '').trim());
				}
			}
		},
		toggleClass: (elem, val) => {
			elem = fn.doms(elem);
			for (var i = 0, ii = fn.len(elem); i < ii; i++) {
				if (fn.hasClass(elem[i], val)) {
					fn.attr(elem[i], 'class', elem[i].className.replace(val, '').trim());
				} else {
					fn.attr(elem[i], 'class', `${elem[i].className.trim()} ${val}`);
				}
			}
		},
		cssPrefixed: function cssPrefixed(prop) {
			if (prop in availCss) return prop;
			var capProp = prop[0].toUpperCase() + prop.slice(1),
				i = cssPrefix.length;
			while (i--) {
				prop = cssPrefix[i] + capProp;
				if (prop in availCss) return prop;
			}
		},
		on: (evt, elem, callback) => {
			elem = fn.doms(elem);
			for (var i = 0, ii = fn.len(elem); i < ii; i++) {
				elem[i].addEventListener(evt, callback.bind(elem[i]), true);
			}
		},

		readFile: function readFile(file) {
			return URL.createObjectURL(file);
		},
		toTime: function toTime(num) {
			let h = '00';
			let m = '00';
			let s = '00';

			if (num >= 3600) {
				h = Math.trunc(num / 3600).toString();
				if (h.length < 2) h = '0' + h;
				num = num % 3600;
			}
			if (num >= 60) {
				m = Math.trunc(num / 60).toString();
				if (m.length < 2) m = `0${m}`;
				num = num % 60;
			}
			s = Math.trunc(num).toString();
			if (s.length < 2) s = `0${s}`;
			return `${h}:${m}:${s}`;
		},
	};
});

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * End of File. Goodbye and good luck in your programming.
 * Remember, genius is 1% talent and 99% hardwork.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
