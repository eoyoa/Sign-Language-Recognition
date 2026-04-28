//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = /* @__PURE__ */ ((n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)))((/* @__PURE__ */ o(((e, t) => {
	(function() {
		function n(e, t, n) {
			var r = e, i = t, a = n, o, s, c, l = function() {
				if (o !== void 0) return o;
				s = [];
				for (var e = 0; e < r.length; e++) {
					s[e] = [];
					for (var t = 0; t < i.length; t++) {
						var n = Infinity;
						e > 0 ? (n = Math.min(n, s[e - 1][t]), t > 0 && (n = Math.min(n, s[e - 1][t - 1]), n = Math.min(n, s[e][t - 1]))) : n = t > 0 ? Math.min(n, s[e][t - 1]) : 0, s[e][t] = n + a(r[e], i[t]);
					}
				}
				return s[r.length - 1][i.length - 1];
			};
			this.getDistance = l;
			var u = function() {
				if (c !== void 0) return c;
				s === void 0 && l();
				var e = r.length - 1, t = i.length - 1;
				for (c = [[e, t]]; e > 0 || t > 0;) e > 0 ? t > 0 ? s[e - 1][t] < s[e - 1][t - 1] ? s[e - 1][t] < s[e][t - 1] ? (c.push([e - 1, t]), e--) : (c.push([e, t - 1]), t--) : s[e - 1][t - 1] < s[e][t - 1] ? (c.push([e - 1, t - 1]), e--, t--) : (c.push([e, t - 1]), t--) : (c.push([e - 1, t]), e--) : (c.push([e, t - 1]), t--);
				return c = c.reverse(), c;
			};
			this.getPath = u;
		}
		var r = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || this;
		e !== void 0 && !e.nodeType ? (t !== void 0 && !t.nodeType && t.exports && (e = t.exports = n), e.DynamicTimeWarping = n) : r.DynamicTimeWarping = n, typeof define == "function" && define.amd && define("dynamic-time-warping", [], function() {
			return n;
		});
	})();
})))(), 1), l = 1e3;
function u(e, t) {
	let n = 0;
	for (let r of ["left", "right"]) {
		let i = e[r], a = t[r];
		if (!i && !a) continue;
		if (!i || !a) {
			n += l;
			continue;
		}
		let o = Math.min(i.length, a.length);
		for (let e = 0; e < o; e++) n += Math.abs(i[e] - a[e]);
	}
	return n;
}
function d(e, t) {
	let n = e.vectors.length, r = t.vectors.length;
	return n === 0 || r === 0 ? Infinity : new c.default(e.vectors, t.vectors, u).getDistance() / (n + r);
}
//#endregion
//#region src/workers/classification.worker.ts
var f = [];
self.onmessage = (e) => {
	if (e.data.type === "updateDb") f = e.data.database;
	else if (e.data.type === "recognize") {
		let { sign: t } = e.data, n = "{???}", r = Infinity;
		for (let e of f) {
			let i = d(t, e.embedding);
			i < r && (r = i, n = e.word);
		}
		self.postMessage({
			type: "result",
			word: n,
			distance: r
		});
	}
};
//#endregion
