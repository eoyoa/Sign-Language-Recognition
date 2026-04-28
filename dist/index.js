import { DrawingUtils as e, FilesetResolver as t, HandLandmarker as n, PoseLandmarker as r } from "@mediapipe/tasks-vision";
import i from "dynamic-time-warping";
//#region \0rolldown/runtime.js
var a = Object.defineProperty, o = (e, t) => {
	let n = {};
	for (var r in e) a(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || a(n, Symbol.toStringTag, { value: "Module" }), n;
}, s = typeof globalThis.Float16Array < "u";
function c(e) {
	return e === "float16" && !s ? "float32" : e;
}
var l = "float64";
function u(e) {
	switch (e) {
		case "float64": return Float64Array;
		case "float32": return Float32Array;
		case "float16": return s ? Float16Array : Float32Array;
		case "complex128": return Float64Array;
		case "complex64": return Float32Array;
		case "int64": return BigInt64Array;
		case "int32": return Int32Array;
		case "int16": return Int16Array;
		case "int8": return Int8Array;
		case "uint64": return BigUint64Array;
		case "uint32": return Uint32Array;
		case "uint16": return Uint16Array;
		case "uint8": return Uint8Array;
		case "bool": return Uint8Array;
		default: throw Error(`Unknown dtype: ${e}`);
	}
}
function d(e) {
	switch (e) {
		case "complex128": return 16;
		case "float64":
		case "int64":
		case "uint64":
		case "complex64": return 8;
		case "float32":
		case "int32":
		case "uint32": return 4;
		case "float16":
		case "int16":
		case "uint16": return 2;
		case "int8":
		case "uint8":
		case "bool": return 1;
		default: throw Error(`Unknown dtype: ${e}`);
	}
}
function f(e) {
	return e === "float64" || e === "float32" || e === "float16";
}
function p(e) {
	return e === "int64" || e === "uint64";
}
function m(e) {
	return e === "complex64" || e === "complex128";
}
function h(e, t) {
	if (e === t) return e;
	if (e === "bool") return t;
	if (t === "bool") return e;
	if (m(e) || m(t)) {
		if (m(e) && m(t)) return e === "complex128" || t === "complex128" ? "complex128" : "complex64";
		let n = m(e) ? e : t, r = m(e) ? t : e;
		return n === "complex128" || r === "float64" || r === "int64" || r === "uint64" || r === "int32" || r === "uint32" ? "complex128" : "complex64";
	}
	if (f(e) || f(t)) {
		if (e === "float64" || t === "float64") return "float64";
		if (e === "float32" || t === "float32") {
			let n = e === "float32" ? t : e;
			return n === "int32" || n === "int64" || n === "uint32" || n === "uint64" ? "float64" : "float32";
		}
		if (e === "float16" || t === "float16") {
			let n = e === "float16" ? t : e;
			return n === "float16" || n === "int8" || n === "uint8" ? "float16" : n === "int16" || n === "uint16" ? "float32" : "float64";
		}
		return "float32";
	}
	let n = e.startsWith("int"), r = t.startsWith("int"), i = e.startsWith("uint"), a = t.startsWith("uint"), o = (e) => e.includes("64") ? 64 : e.includes("32") ? 32 : e.includes("16") ? 16 : e.includes("8") ? 8 : 0, s = o(e), c = o(t);
	if (e === "int64" && t === "uint64" || e === "uint64" && t === "int64") return "float64";
	if (n && a && s === c) {
		if (s === 8) return "int16";
		if (s === 16) return "int32";
		if (s === 32) return "int64";
	}
	if (i && r && s === c) {
		if (c === 8) return "int16";
		if (c === 16) return "int32";
		if (c === 32) return "int64";
	}
	if (n && r || i && a) {
		let e = Math.max(s, c);
		return n ? e === 64 ? "int64" : e === 32 ? "int32" : e === 16 ? "int16" : "int8" : e === 64 ? "uint64" : e === 32 ? "uint32" : e === 16 ? "uint16" : "uint8";
	}
	return n && a ? s > c ? e : c === 8 ? "int16" : c === 16 ? "int32" : c === 32 ? "int64" : "float64" : i && r ? c > s ? t : s === 8 ? "int16" : s === 16 ? "int32" : s === 32 ? "int64" : "float64" : "float64";
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/complex.js
var g = class e {
	constructor(e, t = 0) {
		this.re = e, this.im = t;
	}
	abs() {
		return Math.sqrt(this.re * this.re + this.im * this.im);
	}
	angle() {
		return Math.atan2(this.im, this.re);
	}
	conj() {
		return new e(this.re, -this.im);
	}
	add(t) {
		return typeof t == "number" ? new e(this.re + t, this.im) : new e(this.re + t.re, this.im + t.im);
	}
	sub(t) {
		return typeof t == "number" ? new e(this.re - t, this.im) : new e(this.re - t.re, this.im - t.im);
	}
	mul(t) {
		return typeof t == "number" ? new e(this.re * t, this.im * t) : new e(this.re * t.re - this.im * t.im, this.re * t.im + this.im * t.re);
	}
	div(t) {
		if (typeof t == "number") return new e(this.re / t, this.im / t);
		let n = t.re * t.re + t.im * t.im;
		return new e((this.re * t.re + this.im * t.im) / n, (this.im * t.re - this.re * t.im) / n);
	}
	neg() {
		return new e(-this.re, -this.im);
	}
	equals(e) {
		return this.re === e.re && this.im === e.im;
	}
	toString() {
		return this.im === 0 ? `(${this.re}+0j)` : this.im < 0 ? `(${this.re}${this.im}j)` : `(${this.re}+${this.im}j)`;
	}
	static from(t) {
		if (t instanceof e) return t;
		if (typeof t == "number") return new e(t, 0);
		if (Array.isArray(t)) return new e(t[0] ?? 0, t[1] ?? 0);
		if (typeof t == "object" && t && "re" in t) return new e(t.re ?? 0, t.im ?? 0);
		throw Error(`Cannot convert ${t} to Complex`);
	}
	static isComplex(t) {
		return t instanceof e || typeof t == "object" && !!t && "re" in t && "im" in t;
	}
};
function _(e) {
	return e instanceof g || typeof e == "object" && !!e && "re" in e;
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/config.js
var v = {
	maxMemoryBytes: 268435456,
	scratchBytes: 8388608,
	fallbackToJS: !0
}, y = {
	thresholdMultiplier: 1,
	wasmCallCount: 0,
	useRelaxedSimd: "auto"
}, b = "AGFzbQEAAAABHAZgAABgAn9/AGABfwF/YAF/AGACf38Bf2AAAX8CDwEDZW52Bm1lbW9yeQIAFAMHBgABAgMEBQYJAX8BQYCBzAALB0gFCWhlYXBfaW5pdAABC2hlYXBfbWFsbG9jAAIJaGVhcF9mcmVlAAMMaGVhcF9yZWFsbG9jAAQPaGVhcF9mcmVlX2J5dGVzAAUIAQAKvAcGDgBBgIAMQQBB/AD8CwALRgBBACAAQQdqQXhxNgKEgIyAAEEAIAEgAGpBeHE2AoCAjIAAQQBBADYCiICMgAACQEHwAEUNAEGMgIyAAEEAQfAA/AsACwu2AQEDfwJAAkAgAA0AQQAhAQwBC0EAIQECQEEAQRsgAEF/amdrIABBIUkbIgJBAnRBjICMgABqIgMoAgAiAEUNACADIAAoAAQ2AgBBAEEAKAKIgIyAAEFgIAJ0ajYCiICMgAAgAEEIag8LQQAoAoSAjIAAQQdqQXhxIgBBICACdGpBCGoiA0EAKAKAgIyAAEsNAEEAIAM2AoSAjIAAIAAgAjYCACAAQQRyQQA2AgAgAEEIag8LIAELVQECfwJAIABFDQAgAEF4aiIBKAAAIgJBG0sNACAAQXxqIAJBAnRBjICMgABqIgAoAgA2AAAgACABNgIAQQBBACgCiICMgABBICACdGo2AoiAjIAACwunBAEGfwJAAkAgAA0AAkAgAQ0AQQAPC0EAIQICQEEAQRsgAUF/amdrIAFBIUkbIgBBAnRBjICMgABqIgMoAgAiAUUNACADIAEoAAQ2AgBBAEEAKAKIgIyAAEFgIAB0ajYCiICMgAAgAUEIag8LQQAoAoSAjIAAQQdqQXhxIgFBICAAdGpBCGoiA0EAKAKAgIyAAEsNAUEAIAM2AoSAjIAAIAEgADYCACABQQRyQQA2AgAgAUEIag8LIABBeGoiBCgAACEDAkAgAQ0AAkAgA0EbTQ0AQQAPCyAAQXxqIANBAnRBjICMgABqIgEoAgA2AAAgASAENgIAQQBBACgCiICMgABBICADdGo2AoiAjIAAQQAPCwJAQQBBGyABQX9qZ2sgAUEhSRsiBSADRw0AIAAPCwJAAkAgBUECdEGMgIyAAGoiAigCACIGRQ0AIAIgBigABDYCAEEAQQAoAoiAjIAAQWAgBXRqNgKIgIyAAAwBC0EAIQJBACgChICMgABBB2pBeHEiBkEgIAV0akEIaiIHQQAoAoCAjIAASw0BQQAgBzYChICMgAAgBiAFNgIAIAZBBHJBADYCAAsgBkEIaiECAkBBICADdCIDIAEgAyABSRsiAUUNACACIAAgAfwKAAALIAQoAAAiAUEbSw0AIABBfGogAUECdEGMgIyAAGoiACgCADYAACAAIAQ2AgBBAEEAKAKIgIyAAEEgIAF0ajYCiICMgAALIAILLQECf0EAKAKIgIyAAEEAQQAoAoCAjIAAIgBBACgChICMgABrIgEgASAASxtqCw==", x = null;
function S() {
	if (x) return x;
	let e = atob(b), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	x = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = x.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), x;
}
function C(e, t) {
	S().exports.heap_init(e, t);
}
function w(e) {
	return S().exports.heap_malloc(e);
}
function T(e) {
	S().exports.heap_free(e);
}
function E() {
	return S().exports.heap_free_bytes();
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/runtime.js
var D = 65536, O = null, k = 0, ee = !1, A = 0, te = 0, j = [];
function M() {
	if (!O) {
		let e = Math.ceil(v.maxMemoryBytes / D);
		O = new WebAssembly.Memory({
			initial: e,
			maximum: e
		});
	}
	return O;
}
function N(e) {
	if (e > k && (k = e, ee)) {
		A = v.maxMemoryBytes - v.scratchBytes;
		let e = A - k;
		e > 0 && C(k, e), te = A;
	}
}
function ne() {
	if (ee) return;
	ee = !0, M();
	let e = 8 * 1024 * 1024;
	k < e && (k = e), A = v.maxMemoryBytes - v.scratchBytes;
	let t = A - k;
	t > 0 && C(k, t), te = A;
}
var re = class {
	constructor(e, t) {
		this._refCount = 1, this.ptr = e, this.byteLength = t;
	}
	retain() {
		this._refCount++;
	}
	release() {
		this._refCount <= 0 || --this._refCount === 0 && ee && this.ptr >= 64 && A > 0 && this.ptr < A && T(this.ptr);
	}
	get refCount() {
		return this._refCount;
	}
}, ie = new FinalizationRegistry((e) => {
	e.release();
});
function ae(e, t) {
	ie.register(e, t, e);
}
function oe(e) {
	ie.unregister(e);
}
function P(e) {
	if (e <= 0) return null;
	ne();
	let t = w(e);
	if (t === 0) {
		if (typeof process < "u" && process.env?.LOG_HEAP) {
			let t = E();
			console.error(`[wasm] malloc failed: requested ${e} bytes, ${t} bytes free`);
		}
		return null;
	}
	return new re(t, e);
}
function F() {
	if (ne(), te = A, j.length > 0) {
		for (let e of j) T(e);
		j = [];
	}
}
function I(e) {
	ne();
	let t = te + 7 & -8, n = t + e;
	if (n > v.maxMemoryBytes) {
		let t = w(e);
		if (t === 0) throw Error(`WASM OOM: scratch full (${v.scratchBytes} bytes) and heap malloc failed for ${e} bytes`);
		return j.push(t), t;
	}
	return te = n, t;
}
function se(e) {
	let t = I(e.byteLength), n = M();
	return new Uint8Array(n.buffer, t, e.byteLength).set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength)), t;
}
function L(e, t, n, r, i, a) {
	return t ? n + r * a : se(e.subarray(r, r + i));
}
function ce(e) {
	let t = M();
	return e.buffer === t.buffer ? e.byteOffset : se(e);
}
function R(e, t) {
	let n = M(), r = I(t * 4), i = new Float32Array(n.buffer, r, t);
	return e.isWasmBacked ? i.set(new Float16Array(n.buffer, e.wasmPtr + e.offset * 2, t)) : i.set(e.data.subarray(e.offset, e.offset + t)), r;
}
function le(e, t) {
	let n = P(t * 2);
	if (!n) return null;
	let r = M(), i = new Float32Array(r.buffer, e.ptr, t);
	return new Float16Array(r.buffer, n.ptr, t).set(i), n;
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/storage.js
Symbol.dispose ??= Symbol.for("Symbol.dispose");
var z = class e {
	constructor(e, t, n, r, i, a = null) {
		this._isCContiguous = -1, this._data = e, this._shape = t, this._strides = n, this._offset = r, this._dtype = i, this._wasmRegion = a, a && ae(this, a);
	}
	[Symbol.dispose]() {
		this.dispose();
	}
	get shape() {
		return this._shape;
	}
	get ndim() {
		return this._shape.length;
	}
	get size() {
		return this._shape.reduce((e, t) => e * t, 1);
	}
	get dtype() {
		return this._dtype;
	}
	get data() {
		return this._data;
	}
	get strides() {
		return this._strides;
	}
	get offset() {
		return this._offset;
	}
	get isWasmBacked() {
		return this._wasmRegion !== null;
	}
	dispose() {
		this._wasmRegion &&= (oe(this), this._wasmRegion.release(), null);
	}
	get wasmPtr() {
		return this._wasmRegion ? this._wasmRegion.ptr : 0;
	}
	get wasmRegion() {
		return this._wasmRegion;
	}
	get isCContiguous() {
		if (this._isCContiguous !== -1) return this._isCContiguous === 1;
		let e = this._shape, t = this._strides, n = e.length, r;
		if (n === 0) r = !0;
		else if (n === 1) r = t[0] === 1;
		else {
			r = !0;
			let i = 1;
			for (let a = n - 1; a >= 0; a--) {
				if (t[a] !== i) {
					r = !1;
					break;
				}
				i *= e[a];
			}
		}
		return this._isCContiguous = +!!r, r;
	}
	get isFContiguous() {
		let e = this._shape, t = this._strides, n = e.length;
		if (n === 0) return !0;
		if (n === 1) return t[0] === 1;
		let r = 1;
		for (let i = 0; i < n; i++) {
			if (t[i] !== r) return !1;
			r *= e[i];
		}
		return !0;
	}
	iget(e) {
		let t = this._shape, n = this._strides, r = t.length, i = m(this._dtype), a;
		if (r === 0) a = this._offset;
		else {
			let i = e;
			a = this._offset;
			for (let e = 0; e < r; e++) {
				let o = 1;
				for (let n = e + 1; n < r; n++) o *= t[n];
				let s = Math.floor(i / o);
				i %= o, a += s * n[e];
			}
		}
		if (i) {
			let e = a * 2, t = this._data[e], n = this._data[e + 1];
			return new g(t, n);
		}
		return this._data[a];
	}
	iset(e, t) {
		let n = this._shape, r = this._strides, i = n.length, a = m(this._dtype), o;
		if (i === 0) o = this._offset;
		else {
			let t = e;
			o = this._offset;
			for (let e = 0; e < i; e++) {
				let a = 1;
				for (let t = e + 1; t < i; t++) a *= n[t];
				let s = Math.floor(t / a);
				t %= a, o += s * r[e];
			}
		}
		if (a) {
			let e = o * 2, n, r;
			t instanceof g ? (n = t.re, r = t.im) : typeof t == "object" && t && "re" in t ? (n = t.re, r = t.im ?? 0) : (n = Number(t), r = 0), this._data[e] = n, this._data[e + 1] = r;
		} else this._data[o] = t;
	}
	get(...e) {
		let t = this._strides, n = this._offset;
		for (let r = 0; r < e.length; r++) n += e[r] * t[r];
		if (m(this._dtype)) {
			let e = n * 2, t = this._data[e], r = this._data[e + 1];
			return new g(t, r);
		}
		return this._data[n];
	}
	set(e, t) {
		let n = this._strides, r = this._offset;
		for (let t = 0; t < e.length; t++) r += e[t] * n[t];
		if (m(this._dtype)) {
			let e = r * 2, n, i;
			t instanceof g ? (n = t.re, i = t.im) : typeof t == "object" && t && "re" in t ? (n = t.re, i = t.im ?? 0) : (n = Number(t), i = 0), this._data[e] = n, this._data[e + 1] = i;
		} else this._data[r] = t;
	}
	copy() {
		let t = Array.from(this._shape), n = this._dtype, r = this.size, i = m(n), a = u(n);
		if (!a) throw Error(`Cannot copy array with dtype ${n}`);
		let o = i ? r * 2 : r, s = new a(o);
		if (this.isCContiguous && this._offset === 0) s.set(this._data.subarray(0, o));
		else if (p(n)) {
			let e = s;
			for (let t = 0; t < r; t++) e[t] = this.iget(t);
		} else if (i) {
			let e = s;
			for (let t = 0; t < r; t++) {
				let n = this.iget(t);
				e[t * 2] = n.re, e[t * 2 + 1] = n.im;
			}
		} else for (let e = 0; e < r; e++) s[e] = this.iget(e);
		let c = P(s.byteLength);
		if (c) {
			let r = new a(M().buffer, c.ptr, o);
			return r.set(s), new e(r, t, e._computeStrides(t), 0, n, c);
		}
		return new e(s, t, e._computeStrides(t), 0, n);
	}
	static fromData(t, n, r, i, a) {
		if (n.length > 64) throw Error(`maximum supported dimension for an ndarray is currently 64, found ${n.length}`);
		let o = i ?? e._computeStrides(n), s = a ?? 0, c = M();
		if (t.buffer === c.buffer) return new e(t, n, o, s, r);
		let l = P(t.byteLength);
		if (l) {
			let i = t.constructor, a = new i(c.buffer, l.ptr, t.length);
			return a.set(t), new e(a, n, o, s, r, l);
		}
		return new e(t, n, o, s, r);
	}
	static fromDataShared(t, n, r, i, a, o) {
		return o && o.retain(), new e(t, n, i, a, r, o);
	}
	static fromWasmRegion(t, n, r, i, a) {
		return new e(new a(M().buffer, r.ptr, i), t, e._computeStrides(t), 0, n, r);
	}
	static zeros(t, n = l) {
		if (t.length > 64) throw Error(`maximum supported dimension for an ndarray is currently 64, found ${t.length}`);
		let r = t.reduce((e, t) => e * t, 1), i = m(n), a = u(n);
		if (!a) throw Error(`Cannot create array with dtype ${n}`);
		let o = i ? r * 2 : r, s = o * a.BYTES_PER_ELEMENT, c = P(s);
		if (c) {
			let r = M();
			return new Uint8Array(r.buffer, c.ptr, s).fill(0), new e(new a(r.buffer, c.ptr, o), t, e._computeStrides(t), 0, n, c);
		}
		return new e(new a(o), t, e._computeStrides(t), 0, n);
	}
	static empty(t, n = l) {
		let r = t.reduce((e, t) => e * t, 1), i = m(n), a = u(n);
		if (!a) throw Error(`Cannot create array with dtype ${n}`);
		let o = i ? r * 2 : r, s = P(o * a.BYTES_PER_ELEMENT);
		return s ? new e(new a(M().buffer, s.ptr, o), t, e._computeStrides(t), 0, n, s) : new e(new a(o), t, e._computeStrides(t), 0, n);
	}
	static ones(t, n = l) {
		let r = t.reduce((e, t) => e * t, 1), i = m(n), a = u(n);
		if (!a) throw Error(`Cannot create array with dtype ${n}`);
		let o = i ? r * 2 : r, s = P(o * a.BYTES_PER_ELEMENT), c;
		if (c = s ? new a(M().buffer, s.ptr, o) : new a(o), p(n)) c.fill(BigInt(1));
		else if (i) {
			let e = c;
			for (let t = 0; t < r; t++) e[t * 2] = 1, e[t * 2 + 1] = 0;
		} else c.fill(1);
		return new e(c, t, e._computeStrides(t), 0, n, s ?? null);
	}
	static _computeStrides(e) {
		let t = Array(e.length), n = 1;
		for (let r = e.length - 1; r >= 0; r--) t[r] = n, n *= e[r];
		return t;
	}
};
function ue(e) {
	let t = Array(e.length), n = 1;
	for (let r = e.length - 1; r >= 0; r--) t[r] = n, n *= e[r];
	return t;
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/slicing.js
function de(e) {
	if (!e.includes(":")) {
		if (e.includes(".")) throw Error(`Invalid slice index: "${e}" (must be integer)`);
		let t = parseInt(e, 10);
		if (isNaN(t)) throw Error(`Invalid slice index: "${e}"`);
		return {
			start: t,
			stop: null,
			step: 1,
			isIndex: !0
		};
	}
	let t = e.split(":");
	if (t.length > 3) throw Error(`Invalid slice notation: "${e}" (too many colons)`);
	let n = t[0] === "" ? null : parseInt(t[0], 10), r = t[1] === "" || t[1] === void 0 ? null : parseInt(t[1], 10), i = t[2] === "" || t[2] === void 0 ? 1 : parseInt(t[2], 10);
	if (n !== null && isNaN(n)) throw Error(`Invalid start index in slice: "${e}"`);
	if (r !== null && isNaN(r)) throw Error(`Invalid stop index in slice: "${e}"`);
	if (isNaN(i)) throw Error(`Invalid step in slice: "${e}"`);
	if (i === 0) throw Error("Slice step cannot be zero");
	return {
		start: n,
		stop: r,
		step: i,
		isIndex: !1
	};
}
function fe(e, t) {
	let { start: n, stop: r } = e, { step: i, isIndex: a } = e;
	if (a) {
		if (n === null) throw Error("Index cannot be null");
		let e = n < 0 ? t + n : n;
		if (e < 0 || e >= t) throw Error(`Index ${n} is out of bounds for size ${t}`);
		return {
			start: e,
			stop: e + 1,
			step: 1,
			isIndex: !0
		};
	}
	return i > 0 ? (n === null && (n = 0), r === null && (r = t)) : (n === null && (n = t - 1), r === null && (r = -t - 1)), n < 0 && (n = t + n), r < 0 && (r = t + r), n = Math.max(0, Math.min(n, t)), r = Math.max(-1, Math.min(r, t)), {
		start: n,
		stop: r,
		step: i,
		isIndex: !1
	};
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/internal/indexing.js
function pe(e, t) {
	let n = e.filter((e) => e === "...").length, r = e.filter((e) => e === "newaxis").length;
	if (n > 1) throw Error("an index can only have a single ellipsis (...)");
	let i = e.length - n - r, a = t - i;
	if (a < 0) throw Error(`Too many indices for array: array is ${t}-dimensional, but ${i} were indexed`);
	if (a === 0 && n === 0) return e;
	let o = n === 0 ? e.length : e.indexOf("..."), s = e.slice();
	return s.splice(o, n, ...Array(a).fill(":")), s;
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/ops/shape.js
function me(e, ...t) {
	if (t.length === 0) return e;
	t = pe(t, e.ndim);
	let n = [], r = [], i = e.offset, a = 0;
	for (let o = 0; o < t.length; o++) {
		let s = t[o];
		if (typeof s == "number") {
			let t = s, n = e.shape[a], r = t < 0 ? n + t : t;
			if (r < 0 || r >= n) throw Error(`Index ${t} is out of bounds for size ${n}`);
			let o = e.strides[a];
			a++, i += r * o;
			continue;
		} else if (s === "newaxis") n.push(1), r.push(0);
		else {
			let t = fe(de(s), e.shape[a]), o = e.strides[a];
			if (a++, i += t.start * o, t.isIndex) continue;
			let c = Math.max(0, Math.ceil((t.stop - t.start) / t.step));
			n.push(c), r.push(o * t.step);
		}
	}
	return z.fromDataShared(e.data, n, e.dtype, r, i, e.wasmRegion);
}
function B(e, t) {
	let n = e.size, r = e.dtype, i = t.indexOf(-1), a;
	if (i !== -1) {
		let e = n / t.reduce((e, t, n) => n === i ? e : e * t, 1);
		if (!Number.isInteger(e)) throw Error(`cannot reshape array of size ${n} into shape ${JSON.stringify(t)}`);
		a = t.map((t, n) => n === i ? e : t);
	} else a = t;
	if (a.reduce((e, t) => e * t, 1) !== n) throw Error(`cannot reshape array of size ${n} into shape ${JSON.stringify(a)}`);
	if (e.isCContiguous) {
		let t = e.data;
		return z.fromDataShared(t, a, r, ue(a), 0, e.wasmRegion);
	}
	let o = m(r), s = z.empty(a, r), c = s.data, l = p(r);
	if (o) for (let t = 0; t < n; t++) {
		let n = e.iget(t);
		c[t * 2] = n.re, c[t * 2 + 1] = n.im;
	}
	else if (l) for (let t = 0; t < n; t++) c[t] = e.iget(t);
	else for (let t = 0; t < n; t++) c[t] = e.iget(t);
	return s;
}
function he(e) {
	let t = e.size, n = e.dtype;
	if (!u(n)) throw Error(`Cannot flatten array with dtype ${n}`);
	let r = m(n), i = r ? t * 2 : t;
	if (e.isCContiguous) {
		let a = e.data, o = r ? e.offset * 2 : e.offset, s = z.empty([t], n);
		return s.data.set(a.subarray(o, o + i)), s;
	}
	let a = z.empty([t], n), o = a.data;
	if (r) for (let n = 0; n < t; n++) {
		let t = e.iget(n);
		o[n * 2] = t.re, o[n * 2 + 1] = t.im;
	}
	else for (let n = 0; n < t; n++) o[n] = e.iget(n);
	return a;
}
function ge(e) {
	let t = e.size, n = e.dtype;
	if (e.isCContiguous) {
		let r = e.data;
		return z.fromDataShared(r, [t], n, [1], 0, e.wasmRegion);
	}
	return he(e);
}
function _e(e, t) {
	let n = e.shape, r = n.length, i = e.strides, a = e.data, o = e.dtype, s;
	if (t === void 0) s = Array.from({ length: r }, (e, t) => r - 1 - t);
	else {
		if (t.length !== r) throw Error(`axes must have length ${r}, got ${t.length}`);
		let e = /* @__PURE__ */ new Set();
		for (let n of t) {
			let t = n < 0 ? r + n : n;
			if (t < 0 || t >= r) throw Error(`axis ${n} is out of bounds for array of dimension ${r}`);
			if (e.has(t)) throw Error("repeated axis in transpose");
			e.add(t);
		}
		s = t.map((e) => e < 0 ? r + e : e);
	}
	let c = s.map((e) => n[e]), l = Array.from(i), u = s.map((e) => l[e]);
	return z.fromDataShared(a, c, o, u, e.offset, e.wasmRegion);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/ops/formatting.js
var V = {
	threshold: 1e3,
	edgeitems: 3,
	precision: 8,
	linewidth: 75,
	floatmode: "maxprec",
	suppress: !0,
	separator: " ",
	prefix: "",
	suffix: "",
	nanstr: "nan",
	infstr: "inf",
	sign: "-",
	legacy: !1
};
function ve(e, t = null, n = !0, r = !0, i = "k", a = "-", o = null, s = null, c = null) {
	let l = t ?? V.precision;
	if (!Number.isFinite(e)) return Number.isNaN(e) ? V.nanstr : (e > 0 ? "" : "-") + V.infstr;
	let u;
	if (n && t === null ? (u = e.toString(), r && !u.includes(".") && !u.includes("e") && (u += ".0")) : u = e.toFixed(l), c !== null) {
		let e = u.indexOf(".");
		if (e !== -1) {
			let t = u.length - e - 1;
			t < c && (u += "0".repeat(c - t));
		} else r && (u += "." + "0".repeat(c));
	}
	if (i !== "k" && u.includes(".")) {
		if (i === "." || i === "0" || i === "-") {
			let e = u.length;
			for (; e > 0 && u[e - 1] === "0";) e--;
			u = u.slice(0, e);
		}
		i === "0" && u.endsWith(".") && (u += "0"), i === "-" && u.endsWith(".") && (u = u.slice(0, -1));
	}
	if (e >= 0 && !Object.is(e, -0) && (a === "+" ? u = "+" + u : a === " " && (u = " " + u)), o !== null && u.length < o && (u = " ".repeat(o - u.length) + u), s !== null) {
		let e = u.indexOf(".");
		if (e !== -1) {
			let t = u.length - e - 1;
			t < s && (u += "0".repeat(s - t));
		}
	}
	return u;
}
function ye(e, t = null, n = !0, r = "k", i = "-", a = null, o = 2, s = null) {
	let c = t ?? V.precision;
	if (!Number.isFinite(e)) return Number.isNaN(e) ? V.nanstr : (e > 0 ? "" : "-") + V.infstr;
	let l = e.toExponential(c);
	if (s !== null) {
		let e = l.indexOf("e"), t = l.slice(0, e), n = l.slice(e), r = t.indexOf(".");
		if (r !== -1) {
			let e = t.length - r - 1;
			e < s && (l = t + "0".repeat(s - e) + n);
		}
	}
	if (r !== "k") {
		let e = l.indexOf("e"), t = l.slice(0, e), n = l.slice(e);
		t.includes(".") && ((r === "." || r === "0" || r === "-") && (t = t.replace(/0+$/, "")), r === "0" && t.endsWith(".") && (t += "0"), r === "-" && (t = t.replace(/\.$/, ""))), l = t + n;
	}
	let u = l.indexOf("e"), d = l.slice(0, u), f = l.slice(u + 1), p = f[0] === "-" ? "-" : "+", m = f.replace(/^[+-]/, "");
	for (; m.length < o;) m = "0" + m;
	return l = d + "e" + p + m, e >= 0 && !Object.is(e, -0) && (i === "+" ? l = "+" + l : i === " " && (l = " " + l)), a !== null && l.length < a && (l = " ".repeat(a - l.length) + l), l;
}
function be(e, t, n) {
	if (e instanceof g) {
		let t = be(e.re, "float64", n), r = be(Math.abs(e.im), "float64", n);
		return `${t}${e.im >= 0 ? "+" : "-"}${r}j`;
	}
	return typeof e == "boolean" ? e ? " True" : "False" : typeof e == "bigint" ? e.toString() : Number.isFinite(e) ? t === "float16" || t === "float32" || t === "float64" ? n.suppress && Math.abs(e) < 1e-10 && e !== 0 ? "0." : ve(e, n.precision, !1, !0, "k", n.sign) : e.toString() : Number.isNaN(e) ? n.nanstr : (e > 0 ? "" : "-") + n.infstr;
}
function xe(e, t) {
	let n = [], r = e.shape, i = r.length, a = e.strides;
	function o(s, c) {
		if (c === i) {
			let t = 0;
			for (let e = 0; e < i; e++) t += s[e] * a[e];
			n.push(e.iget(t));
			return;
		}
		let l = r[c];
		if (r.reduce((e, t) => e * t, 1) > t.threshold && l > 2 * t.edgeitems) {
			for (let e = 0; e < t.edgeitems; e++) s[c] = e, o(s, c + 1);
			for (let e = l - t.edgeitems; e < l; e++) s[c] = e, o(s, c + 1);
		} else for (let e = 0; e < l; e++) s[c] = e, o(s, c + 1);
	}
	return i > 0 ? o(Array(i).fill(0), 0) : n.push(e.iget(0)), n;
}
function Se(e, t) {
	return e < 0 || Object.is(e, -0) ? "-" + Math.abs(e).toString() + "." : t === "+" ? "+" + e.toString() + "." : t === " " ? " " + e.toString() + "." : e.toString() + ".";
}
function Ce(e, t, n) {
	let r = e.indexOf(".");
	if (r === -1) return e.padStart(t + (n > 0 ? 1 + n : 0));
	let i = e.slice(0, r), a = e.slice(r + 1), o = i.padStart(t), s = n > 0 ? a.padEnd(n) : a;
	return o + "." + s;
}
function we(e) {
	let t = 0, n = 0;
	for (let r of e) {
		let e = r.indexOf(".");
		e === -1 ? t = Math.max(t, r.length) : (t = Math.max(t, e), n = Math.max(n, r.length - e - 1));
	}
	return {
		maxLeft: t,
		maxRight: n
	};
}
function Te(e, t) {
	let n = e.filter((e) => Number.isFinite(e));
	if (n.length === 0) {
		let n = e.map((e) => Number.isNaN(e) ? t.nanstr : (e > 0 ? "" : "-") + t.infstr), r = n.length > 0 ? Math.max(...n.map((e) => e.length)) : 1;
		return (e) => Number.isNaN(e) ? t.nanstr.padStart(r) : Number.isFinite(e) ? e.toString().padStart(r) : ((e > 0 ? "" : "-") + t.infstr).padStart(r);
	}
	let r = t.suppress ? n.map((e) => Math.abs(e) < 1e-10 && e !== 0 ? 0 : e) : n, i = r.map(Math.abs).filter((e) => e > 0), a = i.length > 0 ? Math.max(...i) : 0, o = i.length > 0 ? Math.min(...i) : 0;
	if (a >= 0x2386f26fc10000 || o > 0 && o < 1e-4 || o > 0 && a / o > 1e3) {
		let n = r.map((e) => ye(e, t.precision, !1, ".", t.sign)), i = 0;
		for (let e of n) {
			let t = e.indexOf("e"), n = t === -1 ? e : e.slice(0, t), r = n.indexOf(".");
			r !== -1 && (i = Math.max(i, n.length - r - 1));
		}
		let a = Math.max(i, 0), o = Math.max(a, 1), s = a === 0 ? "." : "k", c = r.map((e) => ye(e, o, !1, s, t.sign));
		for (let n of e) Number.isFinite(n) || c.push(Number.isNaN(n) ? t.nanstr : (n > 0 ? "" : "-") + t.infstr);
		let l = Math.max(...c.map((e) => e.length));
		return (e) => (t.suppress && Math.abs(e) < 1e-10 && e !== 0 && Number.isFinite(e) && (e = 0), Number.isNaN(e) ? t.nanstr.padStart(l) : Number.isFinite(e) ? ye(e, o, !1, s, t.sign).padStart(l) : ((e > 0 ? "" : "-") + t.infstr).padStart(l));
	}
	if (r.every((e) => Number.isInteger(e))) {
		let n = r.map((e) => Se(e, t.sign));
		for (let r of e) Number.isFinite(r) || n.push(Number.isNaN(r) ? t.nanstr : (r > 0 ? "" : "-") + t.infstr);
		let { maxLeft: i, maxRight: a } = we(n);
		return (e) => (t.suppress && Math.abs(e) < 1e-10 && e !== 0 && Number.isFinite(e) && (e = 0), Ce(Number.isNaN(e) ? t.nanstr : Number.isFinite(e) ? Se(e, t.sign) : (e > 0 ? "" : "-") + t.infstr, i, a));
	}
	let s = r.map((e) => ve(e, t.precision, !1, !0, ".", t.sign));
	for (let n of e) Number.isFinite(n) || s.push(Number.isNaN(n) ? t.nanstr : (n > 0 ? "" : "-") + t.infstr);
	let { maxLeft: c, maxRight: l } = we(s);
	return (e) => (t.suppress && Math.abs(e) < 1e-10 && e !== 0 && Number.isFinite(e) && (e = 0), Ce(Number.isNaN(e) ? t.nanstr : Number.isFinite(e) ? ve(e, t.precision, !1, !0, ".", t.sign) : (e > 0 ? "" : "-") + t.infstr, c, l));
}
function Ee(e, t) {
	let n = e.dtype, r = xe(e, t);
	if (r.length === 0) return (e) => be(e, n, t);
	if (n === "bool") return (e) => e ? " True" : "False";
	if (n === "int64" || n === "uint64") {
		let e = r.map((e) => e.toString()), t = Math.max(...e.map((e) => e.length));
		return (e) => e.toString().padStart(t);
	}
	if (n.startsWith("int") || n.startsWith("uint")) {
		let e = r.map((e) => e.toString()), t = Math.max(...e.map((e) => e.length));
		return (e) => e.toString().padStart(t);
	}
	if (n === "complex64" || n === "complex128") {
		let e = r.map((e) => e.re), n = r.map((e) => Math.abs(e.im)), i = Te(e, t), a = Te(n, t);
		return (e) => {
			let t = e, n = i(t.re), r = a(Math.abs(t.im));
			return `${n}${t.im >= 0 ? "+" : "-"}${r}j`;
		};
	}
	let i = Te(r, t);
	return (e) => i(e);
}
function De(e, t, n, r, i, a) {
	let o = e.shape, s = o.length;
	if (n === s) {
		let n = 0, r = e.strides;
		for (let e = 0; e < s; e++) n += t[e] * r[e];
		return i(e.iget(n));
	}
	let c = o[n], l = r.threshold, u = r.edgeitems, d = o.reduce((e, t) => e * t, 1) > l && c > 2 * u, f = [], p = [...t];
	if (d) {
		for (let t = 0; t < u; t++) p[n] = t, f.push(De(e, p, n + 1, r, i, a + 1));
		f.push("...");
		for (let t = c - u; t < c; t++) p[n] = t, f.push(De(e, p, n + 1, r, i, a + 1));
	} else for (let t = 0; t < c; t++) p[n] = t, f.push(De(e, p, n + 1, r, i, a + 1));
	if (n === s - 1) {
		let e = "[" + f.join(r.separator) + "]";
		if (a + e.length < r.linewidth) return e;
		let t = " ".repeat(a + 1), n = r.linewidth - a - 1, i = [], o = "";
		for (let e = 0; e < f.length; e++) {
			let t = f[e];
			if (o === "") o = t;
			else {
				let e = o + r.separator + t;
				e.length < n ? o = e : (i.push(o), o = t);
			}
		}
		return o && i.push(o), "[" + i.join("\n" + t) + "]";
	} else {
		let e = " ".repeat(a + 1), t = s - n - 2, r = "\n" + "\n".repeat(Math.max(0, t)) + e;
		return "[" + f.join(r) + "]";
	}
}
function Oe(e, t = null, n = null, r = null, i = " ", a = "", o = "", s = null, c = null, l = null, u = null) {
	let d = {
		...V,
		linewidth: t ?? V.linewidth,
		precision: n ?? V.precision,
		suppress: r ?? V.suppress,
		separator: i,
		prefix: a,
		suffix: o,
		threshold: s ?? V.threshold,
		edgeitems: c ?? V.edgeitems,
		floatmode: l ?? V.floatmode,
		sign: u ?? V.sign
	};
	if (e.ndim === 0) return be(e.iget(0), e.dtype, d);
	let f = Ee(e, d), p = d.prefix.length, m = De(e, Array(e.ndim).fill(0), 0, d, f, p);
	return d.prefix + m + d.suffix;
}
function ke(e, t = null, n = null, r = null) {
	return Oe(e, t, n, r);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/ndarray-core.js
var Ae = 2 ** 63, je = {
	int8: -1,
	int16: -1,
	uint8: 255,
	uint16: 65535
}, Me = {
	int8: 0,
	int16: 0,
	uint8: 0,
	uint16: 0
}, Ne = {
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295]
};
function Pe(e, t) {
	if (isNaN(e)) return 0;
	if (t in je) return e >= Ae || e === Infinity ? je[t] : e <= -Ae || e === -Infinity ? Me[t] : Math.trunc(e);
	if (t in Ne) {
		let [n, r] = Ne[t];
		return e >= r || e === Infinity ? r : e <= n || e === -Infinity ? n : Math.trunc(e);
	}
	return Math.trunc(e);
}
var Fe = class e {
	static {
		this._proxyHandler = {
			get(e, t, n) {
				if (typeof t == "string") {
					let n = parseInt(t, 10);
					if (!isNaN(n) && String(n) === t) {
						let r = e._storage.ndim > 0 ? e._storage.shape[0] : 1, i = n < 0 ? r + n : n;
						return e._storage.ndim <= 1 ? e._storage.iget(i) : e.slice(t);
					}
				}
				return Reflect.get(e, t, n);
			},
			set(t, n, r, i) {
				if (typeof n == "string") {
					let i = parseInt(n, 10);
					if (!isNaN(i) && String(i) === n) {
						let n = t._storage.shape[0], a = i < 0 ? n + i : i;
						if (t._storage.ndim === 1) return t.set([a], r), !0;
						let o = t.slice(String(i)), s = o.size;
						if (typeof r == "number" || typeof r == "bigint") o.fill(r);
						else if (r instanceof g) for (let e = 0; e < s; e++) o._storage.iset(e, r);
						else if (r instanceof e) {
							if (r.size !== s) throw Error(`Cannot assign array of size ${r.size} into slice of size ${s}`);
							for (let e = 0; e < s; e++) o._storage.iset(e, r._storage.iget(e));
						} else if (Array.isArray(r)) {
							let e = r.flat(Infinity);
							if (e.length !== s) throw Error(`Cannot assign array of length ${e.length} into slice of size ${s}`);
							for (let t = 0; t < s; t++) o._storage.iset(t, e[t]);
						} else throw Error(`Cannot assign value of type ${typeof r} via bracket operator`);
						return !0;
					}
				}
				return Reflect.set(t, n, r, i);
			}
		};
	}
	constructor(t, n) {
		return this._storage = t, this._base = n, new Proxy(this, e._proxyHandler);
	}
	get storage() {
		return this._storage;
	}
	static fromStorage(t, n) {
		return new e(t, n);
	}
	get shape() {
		return this._storage.shape;
	}
	get ndim() {
		return this._storage.ndim;
	}
	get size() {
		return this._storage.size;
	}
	get dtype() {
		return this._storage.dtype;
	}
	get data() {
		return this._storage.data;
	}
	get strides() {
		return this._storage.strides;
	}
	get flags() {
		return {
			C_CONTIGUOUS: this._storage.isCContiguous,
			F_CONTIGUOUS: this._storage.isFContiguous,
			OWNDATA: this._base === void 0
		};
	}
	get base() {
		return this._base ?? null;
	}
	get itemsize() {
		return d(this._storage.dtype);
	}
	get nbytes() {
		return this.size * this.itemsize;
	}
	fill(e) {
		let t = this._storage.dtype, n = this.size;
		if (p(t)) {
			let t = typeof e == "bigint" ? e : BigInt(Math.round(Number(e)));
			for (let e = 0; e < n; e++) this._storage.iset(e, t);
		} else if (t === "bool") {
			let t = +!!e;
			for (let e = 0; e < n; e++) this._storage.iset(e, t);
		} else {
			let t = Number(e);
			for (let e = 0; e < n; e++) this._storage.iset(e, t);
		}
	}
	*[Symbol.iterator]() {
		if (this.ndim === 0) yield this._storage.iget(0);
		else if (this.ndim === 1) for (let e = 0; e < this.shape[0]; e++) yield this._storage.iget(e);
		else for (let e = 0; e < this.shape[0]; e++) yield this.slice(String(e));
	}
	get(e) {
		if (e.length !== this.ndim) throw Error(`Index has ${e.length} dimensions, but array has ${this.ndim} dimensions`);
		let t = e.map((e, t) => {
			let n = e;
			if (n < 0 && (n = this.shape[t] + n), n < 0 || n >= this.shape[t]) throw Error(`Index ${e} is out of bounds for axis ${t} with size ${this.shape[t]}`);
			return n;
		});
		return this._storage.get(...t);
	}
	set(e, t) {
		if (e.length !== this.ndim) throw Error(`Index has ${e.length} dimensions, but array has ${this.ndim} dimensions`);
		let n = e.map((e, t) => {
			let n = e;
			if (n < 0 && (n = this.shape[t] + n), n < 0 || n >= this.shape[t]) throw Error(`Index ${e} is out of bounds for axis ${t} with size ${this.shape[t]}`);
			return n;
		}), r = this.dtype;
		if (m(r)) this._storage.set(n, t);
		else if (p(r)) {
			let e = t instanceof g ? t.re : Number(t), r = typeof t == "bigint" ? t : BigInt(Math.round(e));
			this._storage.set(n, r);
		} else if (r === "bool") {
			let e = (t instanceof g ? t.re : Number(t)) ? 1 : 0;
			this._storage.set(n, e);
		} else {
			let e = t instanceof g ? t.re : Number(t);
			this._storage.set(n, e);
		}
	}
	iget(e) {
		return this._storage.iget(e);
	}
	iset(e, t) {
		this._storage.iset(e, t);
	}
	copy() {
		return new e(this._storage.copy());
	}
	astype(t, n = !0) {
		let r = this.dtype;
		if (r === t && !n) return this;
		if (r === t && n) return this.copy();
		let i = Array.from(this.shape), a = this.size, o = u(t);
		if (!o) throw Error(`Cannot convert to dtype ${t}`);
		let s = m(r), c = m(t);
		if (s && c) {
			let n = new o(a * 2), r = this.data, s = n;
			for (let e = 0; e < a * 2; e++) s[e] = r[e];
			return new e(z.fromData(n, i, t));
		}
		if (!s && c) {
			let n = new o(a * 2), r = n;
			for (let e = 0; e < a; e++) r[e * 2] = Number(this.data[e]), r[e * 2 + 1] = 0;
			return new e(z.fromData(n, i, t));
		}
		if (s && !c) {
			let n = new o(a), r = this.data;
			if (p(t)) {
				let e = t === "int64";
				for (let t = 0; t < a; t++) {
					let i = Math.trunc(r[t * 2]);
					isNaN(i) || !e && i < 0 ? n[t] = 0n : n[t] = BigInt(i);
				}
			} else if (t === "bool") for (let e = 0; e < a; e++) n[e] = r[e * 2] === 0 ? 0 : 1;
			else if (t === "uint32") for (let e = 0; e < a; e++) {
				let t = r[e * 2];
				n[e] = isNaN(t) || t < 0 ? 0 : t;
			}
			else for (let e = 0; e < a; e++) n[e] = r[e * 2];
			return new e(z.fromData(n, i, t));
		}
		let l = new o(a), d = this.data;
		if (p(r) && !p(t)) {
			let e = d;
			if (t === "bool") for (let t = 0; t < a; t++) l[t] = e[t] === BigInt(0) ? 0 : 1;
			else for (let t = 0; t < a; t++) l[t] = Number(e[t]);
		} else if (!p(r) && p(t)) {
			let e = d;
			if (f(r)) {
				let n = t === "int64", r = BigInt(n ? "9223372036854775807" : "18446744073709551615"), i = n ? BigInt("-9223372036854775808") : 0n;
				for (let t = 0; t < a; t++) {
					let n = Number(e[t]);
					isNaN(n) ? l[t] = 0n : !isFinite(n) || n >= Number(r) ? l[t] = n < 0 ? i : r : n <= Number(i) ? l[t] = i : l[t] = BigInt(Math.trunc(n));
				}
			} else for (let t = 0; t < a; t++) l[t] = BigInt(Math.round(Number(e[t])));
		} else if (t === "bool") {
			let e = d;
			for (let t = 0; t < a; t++) l[t] = e[t] === 0 ? 0 : 1;
		} else if (r === "bool" && !p(t)) {
			let e = d;
			for (let t = 0; t < a; t++) l[t] = e[t];
		} else if (!p(r) && !p(t)) {
			let e = d;
			if (f(r) && !f(t)) for (let n = 0; n < a; n++) l[n] = Pe(e[n], t);
			else for (let t = 0; t < a; t++) l[t] = e[t];
		} else {
			let e = d;
			for (let t = 0; t < a; t++) l[t] = e[t];
		}
		return new e(z.fromData(l, i, t));
	}
	slice(...e) {
		let t = me(this._storage, ...e);
		if (t === this._storage) return this;
		let n = this._base ?? this;
		return new this.constructor(t, n);
	}
	toString() {
		return ke(this._storage);
	}
	toArray() {
		if (this.ndim === 0) return this._storage.iget(0);
		let e = this.shape, t = e.length, n = (r, i) => {
			if (i === t) return this._storage.get(...r);
			let a = [];
			for (let t = 0; t < e[i]; t++) r[i] = t, a.push(n(r, i + 1));
			return a;
		};
		return n(Array(t), 0);
	}
	tolist() {
		return this.toArray();
	}
	tobytes() {
		if (this._storage.isCContiguous) {
			let e = this._storage.data, t = e.BYTES_PER_ELEMENT, n = e.byteOffset + this._storage.offset * t, r = this.size * t;
			return e.buffer.slice(n, n + r);
		}
		let e = this.copy()._storage.data;
		return e.buffer.slice(e.byteOffset, e.byteOffset + this.size * e.BYTES_PER_ELEMENT);
	}
	dispose() {
		this._storage.dispose();
	}
	item(...e) {
		if (e.length === 0) {
			if (this.size !== 1) throw Error("can only convert an array of size 1 to a Python scalar");
			return this._storage.iget(0);
		}
		if (e.length === 1) {
			let t = e[0];
			if (t < 0 || t >= this.size) throw Error(`index ${t} is out of bounds for size ${this.size}`);
			return this._storage.iget(t);
		}
		return this.get(e);
	}
	[Symbol.dispose]() {
		this.dispose();
	}
};
//#endregion
//#region node_modules/numpy-ts/dist/esm/core/types.js
function H(e) {
	return e instanceof Fe || e && typeof e == "object" && "storage" in e && e.storage instanceof z ? e.storage : e;
}
function U(e, t) {
	return Fe.fromStorage(e, t);
}
function Ie(e, t) {
	let n = t.base ?? t;
	return Fe.fromStorage(e, n);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/core/creation.js
function Le(e) {
	return Array.isArray(e) || ArrayBuffer.isView(e);
}
function Re(e) {
	let t = [], n = e;
	for (; Le(n);) t.push(n.length), n = n[0];
	return t;
}
function ze(e) {
	return typeof e == "bigint" || e instanceof BigInt64Array || e instanceof BigUint64Array ? !0 : Array.isArray(e) ? e.some((e) => ze(e)) : !1;
}
function Be(e) {
	return _(e) ? !0 : Array.isArray(e) ? e.some((e) => Be(e)) : !1;
}
function Ve(e) {
	let t = [];
	function n(e) {
		if (Array.isArray(e)) e.forEach((e) => n(e));
		else if (ArrayBuffer.isView(e) && "length" in e) {
			let n = e;
			for (let e = 0; e < n.length; e++) t.push(n[e]);
		} else t.push(e);
	}
	return n(e), t;
}
function He(e, t) {
	if (e instanceof Fe) return !t || e.dtype === t ? e.copy() : e.astype(t);
	let n = ze(e), r = Be(e), i = Re(e), a = i.reduce((e, t) => e * t, 1), o = t;
	o ||= e instanceof Float64Array ? "float64" : e instanceof Float32Array ? "float32" : e instanceof Int32Array ? "int32" : e instanceof Int16Array ? "int16" : e instanceof Int8Array ? "int8" : e instanceof Uint32Array ? "uint32" : e instanceof Uint16Array ? "uint16" : e instanceof Uint8Array || e instanceof Uint8ClampedArray ? "uint8" : e instanceof BigInt64Array ? "int64" : e instanceof BigUint64Array ? "uint64" : typeof Float16Array < "u" && e instanceof Float16Array ? "float16" : r ? "complex128" : n ? "int64" : "float64";
	let s = m(o), c = z.empty(i, o), l = c.data, u = Ve(e);
	if (p(o)) {
		let e = l;
		for (let t = 0; t < a; t++) {
			let n = u[t];
			e[t] = typeof n == "bigint" ? n : BigInt(Math.trunc(Number(n)));
		}
	} else if (o === "bool") {
		let e = l;
		for (let t = 0; t < a; t++) e[t] = +!!u[t];
	} else if (s) {
		let e = l;
		for (let t = 0; t < a; t++) {
			let n = u[t], r, i;
			n instanceof g ? (r = n.re, i = n.im) : typeof n == "object" && n && "re" in n ? (r = n.re, i = n.im ?? 0) : (r = Number(n), i = 0), e[t * 2] = r, e[t * 2 + 1] = i;
		}
	} else {
		let e = l;
		for (let t = 0; t < a; t++) {
			let n = u[t];
			e[t] = Number(n);
		}
	}
	return new Fe(c);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/matmul_float.wasm.js
var Ue = /* @__PURE__ */ o({
	matmul_c128: () => Xe,
	matmul_c64: () => Ye,
	matmul_f32: () => Je,
	matmul_f64: () => qe
}), We = "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", Ge = null;
function Ke() {
	if (Ge) return Ge;
	let e = atob(We), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Ge = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Ge.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Ge;
}
function qe(e, t, n, r, i, a) {
	Ke().exports.matmul_f64(e, t, n, r, i, a);
}
function Je(e, t, n, r, i, a) {
	Ke().exports.matmul_f32(e, t, n, r, i, a);
}
function Ye(e, t, n, r, i, a, o) {
	Ke().exports.matmul_c64(e, t, n, r, i, a, o);
}
function Xe(e, t, n, r, i, a, o) {
	Ke().exports.matmul_c128(e, t, n, r, i, a, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/matmul_float-relaxed.wasm.js
var Ze = /* @__PURE__ */ o({
	matmul_c128: () => it,
	matmul_c64: () => rt,
	matmul_f32: () => nt,
	matmul_f64: () => tt
}), Qe = "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", $e = null;
function et() {
	if ($e) return $e;
	let e = atob(Qe), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	$e = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = $e.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), $e;
}
function tt(e, t, n, r, i, a) {
	et().exports.matmul_f64(e, t, n, r, i, a);
}
function nt(e, t, n, r, i, a) {
	et().exports.matmul_f32(e, t, n, r, i, a);
}
function rt(e, t, n, r, i, a, o) {
	et().exports.matmul_c64(e, t, n, r, i, a, o);
}
function it(e, t, n, r, i, a, o) {
	et().exports.matmul_c128(e, t, n, r, i, a, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/matmul_int.wasm.js
var at = "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", ot = null;
function st() {
	if (ot) return ot;
	let e = atob(at), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	ot = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = ot.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), ot;
}
function ct(e, t, n, r, i, a) {
	st().exports.matmul_i64(e, t, n, r, i, a);
}
function lt(e, t, n, r, i, a) {
	st().exports.matmul_i32(e, t, n, r, i, a);
}
function ut(e, t, n, r, i, a) {
	st().exports.matmul_i16(e, t, n, r, i, a);
}
function dt(e, t, n, r, i, a) {
	st().exports.matmul_i8(e, t, n, r, i, a);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/detect.js
var ft = new Uint8Array([
	0,
	97,
	115,
	109,
	1,
	0,
	0,
	0,
	1,
	8,
	1,
	96,
	3,
	123,
	123,
	123,
	1,
	123,
	3,
	2,
	1,
	0,
	10,
	13,
	1,
	11,
	0,
	32,
	0,
	32,
	1,
	32,
	2,
	253,
	133,
	2,
	11
]), pt = null;
function mt() {
	if (pt === null) try {
		pt = typeof WebAssembly < "u" && WebAssembly.validate(ft);
	} catch {
		pt = !1;
	}
	return pt;
}
function ht() {
	let e = y.useRelaxedSimd;
	return e === !0 ? !0 : e === !1 ? !1 : mt();
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/matmul.js
var gt = null;
function _t() {
	return gt ??= ht() ? Ze : Ue;
}
var vt = 32, yt = {
	float64: (...e) => _t().matmul_f64(...e),
	float32: (...e) => _t().matmul_f32(...e),
	int64: ct,
	uint64: ct,
	int32: lt,
	uint32: lt,
	int16: ut,
	uint16: ut,
	int8: dt,
	uint8: dt,
	float16: (...e) => _t().matmul_f32(...e)
}, bt = {
	complex64: (...e) => _t().matmul_c64(...e),
	complex128: (...e) => _t().matmul_c128(...e)
}, xt = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array,
	float16: Float32Array
}, St = {
	complex128: 2,
	complex64: 2
};
function Ct(e, t, n, r, i, a, o) {
	F(), e(ce(t), ce(n), r, i, o, a);
}
function wt(e, t, n, r, i, a, o, s) {
	let c = t.BYTES_PER_ELEMENT, l = (2 * a * o + 2 * o * s + 3 * a * s) * c;
	F(), e(ce(n), ce(r), i, a, s, o, I(l));
}
function Tt(e, t) {
	if (e.ndim === 0 || t.ndim === 0) return null;
	let n = c(h(e.dtype, t.dtype));
	if (n === "bool" || m(n) && e.dtype !== t.dtype) return null;
	let r = n, i = yt[r], a = bt[r], o = xt[r];
	if (!i && !a || !o || !e.isCContiguous || !t.isCContiguous) return null;
	let s = St[r] ?? 1, l = o.BYTES_PER_ELEMENT, u = e.ndim === 1, d = t.ndim === 1, f = u ? [1, e.shape[0]] : Array.from(e.shape), p = d ? [t.shape[0], 1] : Array.from(t.shape), g = f.length, _ = p.length, v = f[g - 2], b = f[g - 1], x = p[_ - 2], S = p[_ - 1];
	if (b !== x || v * b + b * S < vt * y.thresholdMultiplier) return null;
	let C = r === "float16", w = Et(e, r, s), T = Et(t, r, s);
	if (C && (w = new Float32Array(w), T = new Float32Array(T)), g === 2 && _ === 2) {
		let e = v * S * s, t = P(e * l);
		if (!t) return null;
		if (y.wasmCallCount++, a ? wt(a, o, w, T, t.ptr, v, b, S) : Ct(i, w, T, t.ptr, v, b, S), C) {
			let n;
			n = u && d ? [] : u ? [S] : d ? [v] : [v, S];
			let i = le(t, e);
			return t.release(), i ? z.fromWasmRegion(n, r, i, e, Float16Array) : null;
		}
		let n;
		n = u && d ? [] : u ? [S] : d ? [v] : [v, S];
		let c = z.fromWasmRegion(n.length === 0 ? [v, S] : n, r, t, e, o);
		return u && d ? W(c, []) : u ? W(c, [S]) : d ? W(c, [v]) : c;
	}
	let E = f.slice(0, g - 2), D = p.slice(0, _ - 2), O = Dt(E, D), k = O.reduce((e, t) => e * t, 1), ee = v * b * s, A = b * S * s, te = v * S * s, j = k * te, M = P(j * l);
	if (!M) return null;
	y.wasmCallCount++;
	for (let e = 0; e < k; e++) {
		let t = Ot(e, O), n = kt(t, E), r = kt(t, D), s = n * ee, c = r * A, u = w.subarray(s, s + ee), d = T.subarray(c, c + A), f = M.ptr + e * te * l;
		a ? wt(a, o, u, d, f, v, b, S) : Ct(i, u, d, f, v, b, S);
	}
	let N = [
		...O,
		v,
		S
	];
	if (C) {
		let e = le(M, j);
		if (M.release(), !e) return null;
		let t = z.fromWasmRegion(N, r, e, j, Float16Array);
		return u && d ? W(t, [...O]) : u ? W(t, [...O, S]) : d ? W(t, [...O, v]) : t;
	}
	let ne = z.fromWasmRegion(N, r, M, j, o);
	return u && d ? W(ne, [...O]) : u ? W(ne, [...O, S]) : d ? W(ne, [...O, v]) : ne;
}
function Et(e, t, n) {
	let r = e.data, i = e.offset, a = e.size, o = a * n;
	if (e.dtype === t && i === 0) return r.subarray(0, o);
	if (e.dtype === t) {
		let e = i * n;
		return r.subarray(e, e + o);
	}
	let s = xt[t];
	if (!s) throw Error(`No TypedArray constructor for dtype ${t}`);
	let c = new s(o);
	for (let t = 0; t < a; t++) c[t] = Number(e.iget(t));
	return c;
}
function W(e, t) {
	let n = Array(t.length), r = 1;
	for (let e = t.length - 1; e >= 0; e--) n[e] = r, r *= t[e];
	return z.fromDataShared(e.data, t, e.dtype, n, 0, e.wasmRegion);
}
function Dt(e, t) {
	let n = Math.max(e.length, t.length), r = [];
	for (let i = 0; i < n; i++) {
		let a = i < n - e.length ? 1 : e[i - (n - e.length)], o = i < n - t.length ? 1 : t[i - (n - t.length)];
		if (a !== o && a !== 1 && o !== 1) throw Error(`matmul: batch shapes not broadcastable: [${e}] vs [${t}]`);
		r.push(Math.max(a, o));
	}
	return r;
}
function Ot(e, t) {
	let n = Array(t.length), r = e;
	for (let e = t.length - 1; e >= 0; e--) n[e] = r % t[e], r = Math.floor(r / t[e]);
	return n;
}
function kt(e, t) {
	let n = e.length - t.length, r = 0, i = 1;
	for (let a = t.length - 1; a >= 0; a--) {
		let o = t[a], s = e[a + n];
		r += (o === 1 ? 0 : s) * i, i *= o;
	}
	return r;
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/svd.wasm.js
var At = "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", jt = null;
function Mt() {
	if (jt) return jt;
	let e = atob(At), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	jt = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = jt.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), jt;
}
function Nt(e, t, n, r, i, a, o) {
	Mt().exports.svd_f64(e, t, n, r, i, a, o);
}
function Pt(e, t, n, r, i, a, o) {
	Mt().exports.svd_f32(e, t, n, r, i, a, o);
}
function Ft(e, t, n, r, i) {
	Mt().exports.svd_values_gk_f64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/svd.js
var It = 4;
function Lt(e) {
	if (e.ndim !== 2 || m(e.dtype)) return null;
	let t = e.shape[0], n = e.shape[1];
	if (t < It * y.thresholdMultiplier || n < It * y.thresholdMultiplier) return null;
	let r = Math.min(t, n), i = e.dtype === "float32" || e.dtype === "float16", a = i ? 4 : 8, o = t * t, s = r, c = n * n, l = P(o * a);
	if (!l) return null;
	let u = P(s * a);
	if (!u) return l.release(), null;
	let d = P(c * a);
	if (!d) return l.release(), u.release(), null;
	y.wasmCallCount++, F();
	let f = t * n, p = P(f * a);
	if (!p) return l.release(), u.release(), d.release(), null;
	let h = M();
	if (i) {
		let r = new Float32Array(h.buffer, p.ptr, f);
		if (e.dtype === "float32" && e.isCContiguous) e.isWasmBacked ? r.set(new Float32Array(h.buffer, e.wasmPtr + e.offset * 4, f)) : r.set(e.data.subarray(e.offset, e.offset + f));
		else for (let i = 0; i < t; i++) for (let t = 0; t < n; t++) r[i * n + t] = Number(e.get(i, t));
	} else if (e.dtype === "float64" && e.isCContiguous) {
		let t = new Float64Array(h.buffer, p.ptr, f);
		e.isWasmBacked ? t.set(new Float64Array(h.buffer, e.wasmPtr + e.offset * 8, f)) : t.set(e.data.subarray(e.offset, e.offset + f));
	} else {
		let r = new Float64Array(h.buffer, p.ptr, f);
		for (let i = 0; i < t; i++) for (let t = 0; t < n; t++) r[i * n + t] = Number(e.get(i, t));
	}
	let g = P((t * n + n * n) * a);
	if (!g) return p.release(), l.release(), u.release(), d.release(), null;
	i ? Pt(p.ptr, l.ptr, u.ptr, d.ptr, g.ptr, t, n) : Nt(p.ptr, l.ptr, u.ptr, d.ptr, g.ptr, t, n), p.release(), g.release();
	let _ = i ? "float32" : "float64", v = i ? Float32Array : Float64Array;
	return {
		u: z.fromWasmRegion([t, t], _, l, o, v),
		s: z.fromWasmRegion([r], _, u, s, v),
		vt: z.fromWasmRegion([n, n], _, d, c, v)
	};
}
function Rt(e) {
	if (e.ndim !== 2 || m(e.dtype)) return null;
	let t = e.shape[0], n = e.shape[1];
	if (t < It * y.thresholdMultiplier || n < It * y.thresholdMultiplier) return null;
	let r = Math.min(t, n), i = P(r * 8);
	if (!i) return null;
	y.wasmCallCount++, F();
	let a = t * n, o = P(a * 8);
	if (!o) return i.release(), null;
	let s = M();
	if (e.isCContiguous && e.dtype === "float64") {
		let t = new Float64Array(s.buffer, o.ptr, a);
		e.isWasmBacked ? t.set(new Float64Array(s.buffer, e.wasmPtr + e.offset * 8, a)) : t.set(e.data.subarray(e.offset, e.offset + a));
	} else {
		let t = new Float64Array(s.buffer, o.ptr, a);
		for (let n = 0; n < a; n++) t[n] = Number(e.iget(n));
	}
	let c = P((t * n + 4 * r) * 8);
	if (!c) return o.release(), i.release(), null;
	Ft(o.ptr, i.ptr, c.ptr, t, n), o.release(), c.release();
	let l = Float64Array;
	return z.fromWasmRegion([r], "float64", i, r, l);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vector_norm.wasm.js
var zt = /* @__PURE__ */ o({
	vector_norm2_f32: () => Wt,
	vector_norm2_f64: () => Ut
}), Bt = "AGFzbQEAAAABDQJgAn9/AXxgAn9/AX0CDwEDZW52Bm1lbW9yeQIAfgMDAgABBgkBfwFBgID4AwsHJwIQdmVjdG9yX25vcm0yX2Y2NAAAEHZlY3Rvcl9ub3JtMl9mMzIAAQq5CAKSBAUBfwF7BH8BewJ8AkACQCABQX5xIgINAP0MAAAAAAAAAAAAAAAAAAAAACEDQQAhBAwBCyACQX9qIgVBAXZBAWoiBkEDcSEHAkACQCACQQdPDQBBACEG/QwAAAAAAAAAAAAAAAAAAAAAIQMMAQsgBkF8cSEEQQAhBv0MAAAAAAAAAAAAAAAAAAAAACEDIAAhAgNAIAMgAv0AAwAiCCAI/fIB/fABIAJBEGr9AAMAIgMgA/3yAf3wASACQSBq/QADACIDIAP98gH98AEgAkEwav0AAwAiAyAD/fIB/fABIQMgAkHAAGohAiAGQQhqIQYgBEF8aiIEDQALCyAFQX5xIQQCQCAHRQ0AIAAgBkEDdGohAgNAIAMgAv0AAwAiCCAI/fIB/fABIQMgAkEQaiECIAdBf2oiBw0ACwsgBEECaiEECyAD/SEAIAP9IQGgIQkCQCAEIAFPDQACQAJAIAEgBGtBA3EiBg0AIAQhBwwBCyAAIARBA3RqIQIgBCEHA0AgB0EBaiEHIAkgAisDACIKIAqioCEJIAJBCGohAiAGQX9qIgYNAAsLIAQgAWtBfEsNACABIAdrIQYgACAHQQN0aiECA0AgCSACKwMAIgogCqKgIAJBCGorAwAiCSAJoqAgAkEQaisDACIJIAmioCACQRhqKwMAIgkgCaKgIQkgAkEgaiECIAZBfGoiBg0ACwsgCZ8LogQFAX8BewR/AXsCfQJAAkAgAUF8cSICDQD9DAAAAAAAAAAAAAAAAAAAAAAhA0EAIQQMAQsgAkF/aiIFQQJ2QQFqIgZBA3EhBwJAAkAgAkENTw0AQQAhBv0MAAAAAAAAAAAAAAAAAAAAACEDDAELIAZB/P///wdxIQRBACEG/QwAAAAAAAAAAAAAAAAAAAAAIQMgACECA0AgAyAC/QACACIIIAj95gH95AEgAkEQav0AAgAiAyAD/eYB/eQBIAJBIGr9AAIAIgMgA/3mAf3kASACQTBq/QACACIDIAP95gH95AEhAyACQcAAaiECIAZBEGohBiAEQXxqIgQNAAsLIAVBfHEhBAJAIAdFDQAgACAGQQJ0aiECA0AgAyAC/QACACIIIAj95gH95AEhAyACQRBqIQIgB0F/aiIHDQALCyAEQQRqIQQLIAP9HwMgA/0fAiAD/R8AIAP9HwGSkpIhCQJAIAQgAU8NAAJAAkAgASAEa0EDcSIGDQAgBCEHDAELIAAgBEECdGohAiAEIQcDQCAHQQFqIQcgCSACKgIAIgogCpSSIQkgAkEEaiECIAZBf2oiBg0ACwsgBCABa0F8Sw0AIAEgB2shBiAAIAdBAnRqIQIDQCAJIAIqAgAiCiAKlJIgAkEEaioCACIJIAmUkiACQQhqKgIAIgkgCZSSIAJBDGoqAgAiCSAJlJIhCSACQRBqIQIgBkF8aiIGDQALCyAJkQs=", Vt = null;
function Ht() {
	if (Vt) return Vt;
	let e = atob(Bt), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Vt = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Vt.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Vt;
}
function Ut(e, t) {
	return Ht().exports.vector_norm2_f64(e, t);
}
function Wt(e, t) {
	return Ht().exports.vector_norm2_f32(e, t);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vector_norm-relaxed.wasm.js
var Gt = /* @__PURE__ */ o({
	vector_norm2_f32: () => Xt,
	vector_norm2_f64: () => Yt
}), Kt = "AGFzbQEAAAABDQJgAn9/AXxgAn9/AX0CEAEDZW52Bm1lbW9yeQIAhQEDAwIAAQYJAX8BQYCAlAQLBycCEHZlY3Rvcl9ub3JtMl9mNjQAABB2ZWN0b3Jfbm9ybTJfZjMyAAEKmwgCgwQFAX8BewR/BHsCfAJAAkAgAUF+cSICDQD9DAAAAAAAAAAAAAAAAAAAAAAhA0EAIQQMAQsgAkF/aiIFQQF2QQFqIgZBA3EhBwJAAkAgAkEHTw0AQQAhBv0MAAAAAAAAAAAAAAAAAAAAACEDDAELIAZBfHEhBEEAIQb9DAAAAAAAAAAAAAAAAAAAAAAhAyAAIQIDQCACQTBq/QADACIIIAggAkEgav0AAwAiCSAJIAJBEGr9AAMAIgogCiAC/QADACILIAsgA/2HAv2HAv2HAv2HAiEDIAJBwABqIQIgBkEIaiEGIARBfGoiBA0ACwsgBUF+cSEEAkAgB0UNACAAIAZBA3RqIQIDQCAC/QADACIIIAggA/2HAiEDIAJBEGohAiAHQX9qIgcNAAsLIARBAmohBAsgA/0hACAD/SEBoCEMAkAgBCABTw0AAkACQCABIARrQQNxIgYNACAEIQcMAQsgACAEQQN0aiECIAQhBwNAIAdBAWohByAMIAIrAwAiDSANoqAhDCACQQhqIQIgBkF/aiIGDQALCyAEIAFrQXxLDQAgASAHayEGIAAgB0EDdGohAgNAIAwgAisDACINIA2ioCACQQhqKwMAIgwgDKKgIAJBEGorAwAiDCAMoqAgAkEYaisDACIMIAyioCEMIAJBIGohAiAGQXxqIgYNAAsLIAyfC5MEBQF/AXsEfwR7An0CQAJAIAFBfHEiAg0A/QwAAAAAAAAAAAAAAAAAAAAAIQNBACEEDAELIAJBf2oiBUECdkEBaiIGQQNxIQcCQAJAIAJBDU8NAEEAIQb9DAAAAAAAAAAAAAAAAAAAAAAhAwwBCyAGQfz///8HcSEEQQAhBv0MAAAAAAAAAAAAAAAAAAAAACEDIAAhAgNAIAJBMGr9AAIAIgggCCACQSBq/QACACIJIAkgAkEQav0AAgAiCiAKIAL9AAIAIgsgCyAD/YUC/YUC/YUC/YUCIQMgAkHAAGohAiAGQRBqIQYgBEF8aiIEDQALCyAFQXxxIQQCQCAHRQ0AIAAgBkECdGohAgNAIAL9AAIAIgggCCAD/YUCIQMgAkEQaiECIAdBf2oiBw0ACwsgBEEEaiEECyAD/R8DIAP9HwIgA/0fACAD/R8BkpKSIQwCQCAEIAFPDQACQAJAIAEgBGtBA3EiBg0AIAQhBwwBCyAAIARBAnRqIQIgBCEHA0AgB0EBaiEHIAwgAioCACINIA2UkiEMIAJBBGohAiAGQX9qIgYNAAsLIAQgAWtBfEsNACABIAdrIQYgACAHQQJ0aiECA0AgDCACKgIAIg0gDZSSIAJBBGoqAgAiDCAMlJIgAkEIaioCACIMIAyUkiACQQxqKgIAIgwgDJSSIQwgAkEQaiECIAZBfGoiBg0ACwsgDJEL", qt = null;
function Jt() {
	if (qt) return qt;
	let e = atob(Kt), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	qt = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = qt.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), qt;
}
function Yt(e, t) {
	return Jt().exports.vector_norm2_f64(e, t);
}
function Xt(e, t) {
	return Jt().exports.vector_norm2_f32(e, t);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/vector_norm.js
var Zt = null;
function Qt() {
	return Zt ??= ht() ? Gt : zt;
}
var $t = 32, en = {
	float64: {
		fn: (...e) => Qt().vector_norm2_f64(...e),
		bpe: 8
	},
	float32: {
		fn: (...e) => Qt().vector_norm2_f32(...e),
		bpe: 4
	}
};
function tn(e) {
	if (!e.isCContiguous || m(e.dtype)) return null;
	let t = e.size;
	if (t < $t * y.thresholdMultiplier) return null;
	let n = c(e.dtype);
	if (y.wasmCallCount++, F(), n === "float16") {
		let n = R(e, t);
		return Qt().vector_norm2_f32(n, t);
	}
	let r = en[n];
	if (!r) return y.wasmCallCount--, null;
	let i = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset, t, r.bpe);
	return r.fn(i, t);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/inner_float.wasm.js
var nn = /* @__PURE__ */ o({
	inner_c128: () => un,
	inner_c64: () => ln,
	inner_f32: () => cn,
	inner_f64: () => sn
}), rn = "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", an = null;
function on() {
	if (an) return an;
	let e = atob(rn), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	an = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = an.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), an;
}
function sn(e, t, n, r, i, a) {
	on().exports.inner_f64(e, t, n, r, i, a);
}
function cn(e, t, n, r, i, a) {
	on().exports.inner_f32(e, t, n, r, i, a);
}
function ln(e, t, n, r, i, a, o) {
	on().exports.inner_c64(e, t, n, r, i, a, o);
}
function un(e, t, n, r, i, a, o) {
	on().exports.inner_c128(e, t, n, r, i, a, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/inner_float-relaxed.wasm.js
var dn = /* @__PURE__ */ o({
	inner_c128: () => vn,
	inner_c64: () => _n,
	inner_f32: () => gn,
	inner_f64: () => hn
}), fn = "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", pn = null;
function mn() {
	if (pn) return pn;
	let e = atob(fn), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	pn = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = pn.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), pn;
}
function hn(e, t, n, r, i, a) {
	mn().exports.inner_f64(e, t, n, r, i, a);
}
function gn(e, t, n, r, i, a) {
	mn().exports.inner_f32(e, t, n, r, i, a);
}
function _n(e, t, n, r, i, a, o) {
	mn().exports.inner_c64(e, t, n, r, i, a, o);
}
function vn(e, t, n, r, i, a, o) {
	mn().exports.inner_c128(e, t, n, r, i, a, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/inner_int.wasm.js
var yn = "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", bn = null;
function xn() {
	if (bn) return bn;
	let e = atob(yn), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	bn = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = bn.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), bn;
}
function Sn(e, t, n, r, i, a) {
	xn().exports.inner_i64(e, t, n, r, i, a);
}
function Cn(e, t, n, r, i, a) {
	xn().exports.inner_i32(e, t, n, r, i, a);
}
function wn(e, t, n, r, i, a) {
	xn().exports.inner_i16(e, t, n, r, i, a);
}
function Tn(e, t, n, r, i, a) {
	xn().exports.inner_i8(e, t, n, r, i, a);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/inner.js
var En = null;
function Dn() {
	return En ??= ht() ? dn : nn;
}
var On = 32, kn = {
	float64: (...e) => Dn().inner_f64(...e),
	float32: (...e) => Dn().inner_f32(...e),
	int64: Sn,
	uint64: Sn,
	int32: Cn,
	uint32: Cn,
	int16: wn,
	uint16: wn,
	int8: Tn,
	uint8: Tn
}, An = {
	complex64: (...e) => Dn().inner_c64(...e),
	complex128: (...e) => Dn().inner_c128(...e)
}, jn = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array
}, Mn = {
	complex128: 2,
	complex64: 2
};
function Nn(e, t) {
	if (e.ndim === 0 || t.ndim === 0 || !e.isCContiguous || !t.isCContiguous) return null;
	let n = h(e.dtype, t.dtype), r = kn[n], i = An[n], a = jn[n];
	if (!r && !i || !a) return null;
	let o = Mn[n] ?? 1, s = e.shape[e.ndim - 1];
	if (s !== t.shape[t.ndim - 1]) return null;
	let c = e.ndim === 1 ? 1 : e.shape.slice(0, -1).reduce((e, t) => e * t, 1), l = t.ndim === 1 ? 1 : t.shape.slice(0, -1).reduce((e, t) => e * t, 1);
	if (c * s + l * s < On * y.thresholdMultiplier) return null;
	let u = a.BYTES_PER_ELEMENT, d = c * l * o, f = d * u;
	if (e.ndim === 1 && t.ndim === 1) {
		y.wasmCallCount++, F();
		let n = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * o, c * s * o, u), p = L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * o, l * s * o, u), m = I(f);
		i ? i(n, p, m, c, l, s, I((2 * c * s + 2 * l * s + 3 * c * l) * u)) : r(n, p, m, c, l, s);
		let h = new a(M().buffer, m, d);
		return o === 2 ? new g(Number(h[0]), Number(h[1])) : h[0];
	}
	let p = P(f);
	if (!p) return null;
	y.wasmCallCount++, F();
	let m = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * o, c * s * o, u), _ = L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * o, l * s * o, u);
	if (i) {
		let e = I((2 * c * s + 2 * l * s + 3 * c * l) * u);
		i(m, _, p.ptr, c, l, s, e);
	} else r(m, _, p.ptr, c, l, s);
	let v = [...e.shape.slice(0, -1), ...t.shape.slice(0, -1)];
	return z.fromWasmRegion(v, n, p, d, a);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/dot_float.wasm.js
var Pn = /* @__PURE__ */ o({
	dot_c128: () => Bn,
	dot_c64: () => Vn,
	dot_f32: () => zn,
	dot_f64: () => Rn
}), Fn = "AGFzbQEAAAABCAFgBH9/f38AAg8BA2VudgZtZW1vcnkCAC0DBQQAAAAABgkBfwFBgIC0AQsHKgQHZG90X2Y2NAAAB2RvdF9mMzIAAQhkb3RfYzEyOAACB2RvdF9jNjQAAwqZEQTtBAQBfwF7Bn8BfAJAAkAgA0F+cSIEDQD9DAAAAAAAAAAAAAAAAAAAAAAhBUEAIQYMAQsgBEF/aiIHQQF2QQFqIghBA3EhCQJAAkAgBEEHTw0AQQAhBv0MAAAAAAAAAAAAAAAAAAAAACEFDAELIAhBfHEhCv0MAAAAAAAAAAAAAAAAAAAAACEFQQAhBEEAIQYDQCAFIAAgBGoiCP0AAwAgASAEaiIL/QADAP3yAf3wASAIQRBq/QADACALQRBq/QADAP3yAf3wASAIQSBq/QADACALQSBq/QADAP3yAf3wASAIQTBq/QADACALQTBq/QADAP3yAf3wASEFIARBwABqIQQgBkEIaiEGIApBfGoiCg0ACwsgB0F+cSELAkAgCUUNACAAIAZBA3QiCGohBCABIAhqIQgDQCAFIAT9AAMAIAj9AAMA/fIB/fABIQUgBEEQaiEEIAhBEGohCCAJQX9qIgkNAAsLIAtBAmohBgsgBf0hACAF/SEBoCEMAkAgBiADTw0AAkACQCADIAZrQQNxIgkNACAGIQsMAQsgACAGQQN0IghqIQQgASAIaiEIIAYhCwNAIAtBAWohCyAMIAQrAwAgCCsDAKKgIQwgBEEIaiEEIAhBCGohCCAJQX9qIgkNAAsLIAYgA2tBfEsNACALQQN0IQkgAyALayELA0AgDCAAIAlqIgQrAwAgASAJaiIIKwMAoqAgBEEIaisDACAIQQhqKwMAoqAgBEEQaisDACAIQRBqKwMAoqAgBEEYaisDACAIQRhqKwMAoqAhDCAAQSBqIQAgAUEgaiEBIAtBfGoiCw0ACwsgAiAMOQMAC/0EBAF/AXsGfwF9AkACQCADQXxxIgQNAP0MAAAAAAAAAAAAAAAAAAAAACEFQQAhBgwBCyAEQX9qIgdBAnZBAWoiCEEDcSEJAkACQCAEQQ1PDQBBACEG/QwAAAAAAAAAAAAAAAAAAAAAIQUMAQsgCEH8////B3EhCv0MAAAAAAAAAAAAAAAAAAAAACEFQQAhBEEAIQYDQCAFIAAgBGoiCP0AAgAgASAEaiIL/QACAP3mAf3kASAIQRBq/QACACALQRBq/QACAP3mAf3kASAIQSBq/QACACALQSBq/QACAP3mAf3kASAIQTBq/QACACALQTBq/QACAP3mAf3kASEFIARBwABqIQQgBkEQaiEGIApBfGoiCg0ACwsgB0F8cSELAkAgCUUNACAAIAZBAnQiCGohBCABIAhqIQgDQCAFIAT9AAIAIAj9AAIA/eYB/eQBIQUgBEEQaiEEIAhBEGohCCAJQX9qIgkNAAsLIAtBBGohBgsgBf0fAyAF/R8CIAX9HwAgBf0fAZKSkiEMAkAgBiADTw0AAkACQCADIAZrQQNxIgkNACAGIQsMAQsgACAGQQJ0IghqIQQgASAIaiEIIAYhCwNAIAtBAWohCyAMIAQqAgAgCCoCAJSSIQwgBEEEaiEEIAhBBGohCCAJQX9qIgkNAAsLIAYgA2tBfEsNACALQQJ0IQkgAyALayELA0AgDCAAIAlqIgQqAgAgASAJaiIIKgIAlJIgBEEEaioCACAIQQRqKgIAlJIgBEEIaioCACAIQQhqKgIAlJIgBEEMaioCACAIQQxqKgIAlJIhDCAAQRBqIQAgAUEQaiEBIAtBfGoiCw0ACwsgAiAMOAIAC8cDBgF/AnsDfwZ7AX8GfAJAAkAgA0ECTw0AQQAhBP0MAAAAAAAAAAAAAAAAAAAAACIFIQYMAQtBACEHIAEhCCAAIQn9DAAAAAAAAAAAAAAAAAAAAAAiBiEFA0AgBSAJ/QADACIKIAlBEGr9AAMAIgv9DQABAgMEBQYHEBESExQVFhciDCAI/QADACINIAhBEGr9AAMAIg79DQgJCgsMDQ4PGBkaGxwdHh8iD/3yASAKIAv9DQgJCgsMDQ4PGBkaGxwdHh8iCiANIA79DQABAgMEBQYHEBESExQVFhciC/3yAf3wAf3wASEFIAYgDCAL/fIBIAogD/3yAf3xAf3wASEGIAhBIGohCCAJQSBqIQkgB0EEaiEQIAdBAmoiBCEHIBAgA00NAAsLIAX9IQAgBf0hAaAhESAG/SEAIAb9IQGgIRICQCADIARNDQAgAyAEayEHIAEgBEEEdCIJaiEIIAAgCWohCQNAIBEgCUEIaisDACITIAgrAwAiFKIgCSsDACIVIAhBCGorAwAiFqKgoCERIBIgFSAUoiATIBaioaAhEiAIQRBqIQggCUEQaiEJIAdBf2oiBw0ACwsgAiAROQMIIAIgEjkDAAvfAwYBfwJ7A38GewF/Bn0CQAJAIANBBE8NAEEAIQT9DAAAAAAAAAAAAAAAAAAAAAAiBSEGDAELQQAhByABIQggACEJ/QwAAAAAAAAAAAAAAAAAAAAAIgYhBQNAIAUgCf0AAgAiCiAJQRBq/QACACIL/Q0AAQIDCAkKCxAREhMYGRobIgwgCP0AAgAiDSAIQRBq/QACACIO/Q0EBQYHDA0ODxQVFhccHR4fIg/95gEgCiAL/Q0EBQYHDA0ODxQVFhccHR4fIgogDSAO/Q0AAQIDCAkKCxAREhMYGRobIgv95gH95AH95AEhBSAGIAwgC/3mASAKIA/95gH95QH95AEhBiAIQSBqIQggCUEgaiEJIAdBCGohECAHQQRqIgQhByAQIANNDQALCyAF/R8DIAX9HwIgBf0fACAF/R8BkpKSIREgBv0fAyAG/R8CIAb9HwAgBv0fAZKSkiESAkAgAyAETQ0AIAMgBGshByABIARBA3QiCWohCCAAIAlqIQkDQCARIAlBBGoqAgAiEyAIKgIAIhSUIAkqAgAiFSAIQQRqKgIAIhaUkpIhESASIBUgFJQgEyAWlJOSIRIgCEEIaiEIIAlBCGohCSAHQX9qIgcNAAsLIAIgETgCBCACIBI4AgAL", In = null;
function Ln() {
	if (In) return In;
	let e = atob(Fn), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	In = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = In.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), In;
}
function Rn(e, t, n, r) {
	Ln().exports.dot_f64(e, t, n, r);
}
function zn(e, t, n, r) {
	Ln().exports.dot_f32(e, t, n, r);
}
function Bn(e, t, n, r) {
	Ln().exports.dot_c128(e, t, n, r);
}
function Vn(e, t, n, r) {
	Ln().exports.dot_c64(e, t, n, r);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/dot_float-relaxed.wasm.js
var Hn = /* @__PURE__ */ o({
	dot_c128: () => Jn,
	dot_c64: () => Yn,
	dot_f32: () => qn,
	dot_f64: () => Kn
}), Un = "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", Wn = null;
function Gn() {
	if (Wn) return Wn;
	let e = atob(Un), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Wn = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Wn.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Wn;
}
function Kn(e, t, n, r) {
	Gn().exports.dot_f64(e, t, n, r);
}
function qn(e, t, n, r) {
	Gn().exports.dot_f32(e, t, n, r);
}
function Jn(e, t, n, r) {
	Gn().exports.dot_c128(e, t, n, r);
}
function Yn(e, t, n, r) {
	Gn().exports.dot_c64(e, t, n, r);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/dot_int.wasm.js
var Xn = "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", Zn = null;
function Qn() {
	if (Zn) return Zn;
	let e = atob(Xn), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Zn = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Zn.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Zn;
}
function $n(e, t, n, r) {
	Qn().exports.dot_i64(e, t, n, r);
}
function er(e, t, n, r) {
	Qn().exports.dot_i32(e, t, n, r);
}
function tr(e, t, n, r) {
	Qn().exports.dot_i16(e, t, n, r);
}
function nr(e, t, n, r) {
	Qn().exports.dot_i8(e, t, n, r);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/dot.js
var rr = null;
function ir() {
	return rr ??= ht() ? Hn : Pn;
}
var ar = 32, or = {
	float64: (...e) => ir().dot_f64(...e),
	float32: (...e) => ir().dot_f32(...e),
	complex128: (...e) => ir().dot_c128(...e),
	complex64: (...e) => ir().dot_c64(...e),
	int64: $n,
	uint64: $n,
	int32: er,
	uint32: er,
	int16: tr,
	uint16: tr,
	int8: nr,
	uint8: nr
}, sr = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array
}, cr = {
	complex128: 2,
	complex64: 2
};
function lr(e, t) {
	if (e.ndim !== 1 || t.ndim !== 1 || !e.isCContiguous || !t.isCContiguous) return null;
	let n = e.shape[0];
	if (n !== t.shape[0] || n < ar * y.thresholdMultiplier) return null;
	let r = h(e.dtype, t.dtype), i = or[r], a = sr[r];
	if (!i || !a) return null;
	let o = cr[r] ?? 1, s = a.BYTES_PER_ELEMENT, c = 1 * o * s;
	y.wasmCallCount++, F();
	let l = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * o, n * o, s), u = L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * o, n * o, s), d = I(c);
	i(l, u, d, n);
	let f = new a(M().buffer, d, 1 * o);
	return o === 2 ? new g(Number(f[0]), Number(f[1])) : Number(f[0]);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/matvec_float.wasm.js
var ur = /* @__PURE__ */ o({
	matvec_c128: () => gr,
	matvec_c64: () => _r,
	matvec_f32: () => hr,
	matvec_f64: () => mr
}), dr = "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", fr = null;
function pr() {
	if (fr) return fr;
	let e = atob(dr), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	fr = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = fr.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), fr;
}
function mr(e, t, n, r, i) {
	pr().exports.matvec_f64(e, t, n, r, i);
}
function hr(e, t, n, r, i) {
	pr().exports.matvec_f32(e, t, n, r, i);
}
function gr(e, t, n, r, i) {
	pr().exports.matvec_c128(e, t, n, r, i);
}
function _r(e, t, n, r, i) {
	pr().exports.matvec_c64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/matvec_float-relaxed.wasm.js
var vr = /* @__PURE__ */ o({
	matvec_c128: () => wr,
	matvec_c64: () => Tr,
	matvec_f32: () => Cr,
	matvec_f64: () => Sr
}), yr = "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", br = null;
function xr() {
	if (br) return br;
	let e = atob(yr), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	br = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = br.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), br;
}
function Sr(e, t, n, r, i) {
	xr().exports.matvec_f64(e, t, n, r, i);
}
function Cr(e, t, n, r, i) {
	xr().exports.matvec_f32(e, t, n, r, i);
}
function wr(e, t, n, r, i) {
	xr().exports.matvec_c128(e, t, n, r, i);
}
function Tr(e, t, n, r, i) {
	xr().exports.matvec_c64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/matvec_int.wasm.js
var Er = "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", Dr = null;
function Or() {
	if (Dr) return Dr;
	let e = atob(Er), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Dr = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Dr.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Dr;
}
function kr(e, t, n, r, i) {
	Or().exports.matvec_i64(e, t, n, r, i);
}
function Ar(e, t, n, r, i) {
	Or().exports.matvec_i32(e, t, n, r, i);
}
function jr(e, t, n, r, i) {
	Or().exports.matvec_i16(e, t, n, r, i);
}
function Mr(e, t, n, r, i) {
	Or().exports.matvec_i8(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/matvec.js
var Nr = null;
function Pr() {
	return Nr ??= ht() ? vr : ur;
}
var Fr = 32, Ir = {
	float64: (...e) => Pr().matvec_f64(...e),
	float32: (...e) => Pr().matvec_f32(...e),
	complex128: (...e) => Pr().matvec_c128(...e),
	complex64: (...e) => Pr().matvec_c64(...e),
	int64: kr,
	uint64: kr,
	int32: Ar,
	uint32: Ar,
	int16: jr,
	uint16: jr,
	int8: Mr,
	uint8: Mr,
	float16: (...e) => Pr().matvec_f32(...e)
}, Lr = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array,
	float16: Float32Array
}, Rr = {
	complex128: 2,
	complex64: 2
};
function zr(e, t) {
	if (e.ndim !== 2 || t.ndim !== 1 || !e.isCContiguous || !t.isCContiguous) return null;
	let n = e.shape[0], r = e.shape[1];
	if (r !== t.shape[0] || n * r < Fr * y.thresholdMultiplier) return null;
	let i = c(h(e.dtype, t.dtype)), a = Ir[i], o = Lr[i];
	if (!a || !o) return null;
	let s = Rr[i] ?? 1, l = o.BYTES_PER_ELEMENT, u = n * s, d = u * l, f = i === "float16", p = P(d);
	if (!p) return null;
	if (y.wasmCallCount++, F(), f) {
		a(R(e, n * r), R(t, r), p.ptr, n, r);
		let o = le(p, u);
		return p.release(), o ? z.fromWasmRegion([n], i, o, u, Float16Array) : null;
	}
	return a(L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * s, n * r * s, l), L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * s, r * s, l), p.ptr, n, r), z.fromWasmRegion([n], i, p, u, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vecmat_float.wasm.js
var Br = /* @__PURE__ */ o({
	vecmat_c128: () => Kr,
	vecmat_c64: () => qr,
	vecmat_f32: () => Gr,
	vecmat_f64: () => Wr
}), Vr = "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", Hr = null;
function Ur() {
	if (Hr) return Hr;
	let e = atob(Vr), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Hr = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Hr.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Hr;
}
function Wr(e, t, n, r, i) {
	Ur().exports.vecmat_f64(e, t, n, r, i);
}
function Gr(e, t, n, r, i) {
	Ur().exports.vecmat_f32(e, t, n, r, i);
}
function Kr(e, t, n, r, i) {
	Ur().exports.vecmat_c128(e, t, n, r, i);
}
function qr(e, t, n, r, i) {
	Ur().exports.vecmat_c64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vecmat_float-relaxed.wasm.js
var Jr = /* @__PURE__ */ o({
	vecmat_c128: () => ei,
	vecmat_c64: () => ti,
	vecmat_f32: () => $r,
	vecmat_f64: () => Qr
}), Yr = "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", Xr = null;
function Zr() {
	if (Xr) return Xr;
	let e = atob(Yr), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Xr = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Xr.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Xr;
}
function Qr(e, t, n, r, i) {
	Zr().exports.vecmat_f64(e, t, n, r, i);
}
function $r(e, t, n, r, i) {
	Zr().exports.vecmat_f32(e, t, n, r, i);
}
function ei(e, t, n, r, i) {
	Zr().exports.vecmat_c128(e, t, n, r, i);
}
function ti(e, t, n, r, i) {
	Zr().exports.vecmat_c64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vecmat_int.wasm.js
var ni = "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", ri = null;
function ii() {
	if (ri) return ri;
	let e = atob(ni), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	ri = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = ri.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), ri;
}
function ai(e, t, n, r, i) {
	ii().exports.vecmat_i64(e, t, n, r, i);
}
function oi(e, t, n, r, i) {
	ii().exports.vecmat_i32(e, t, n, r, i);
}
function si(e, t, n, r, i) {
	ii().exports.vecmat_i16(e, t, n, r, i);
}
function ci(e, t, n, r, i) {
	ii().exports.vecmat_i8(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/vecmat.js
var li = null;
function ui() {
	return li ??= ht() ? Jr : Br;
}
var di = 32, fi = {
	float64: (...e) => ui().vecmat_f64(...e),
	float32: (...e) => ui().vecmat_f32(...e),
	complex128: (...e) => ui().vecmat_c128(...e),
	complex64: (...e) => ui().vecmat_c64(...e),
	int64: ai,
	uint64: ai,
	int32: oi,
	uint32: oi,
	int16: si,
	uint16: si,
	int8: ci,
	uint8: ci,
	float16: (...e) => ui().vecmat_f32(...e)
}, pi = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array,
	float16: Float32Array
}, mi = {
	complex128: 2,
	complex64: 2
};
function hi(e, t) {
	if (e.ndim !== 1 || t.ndim !== 2 || !e.isCContiguous || !t.isCContiguous) return null;
	let n = t.shape[0], r = t.shape[1];
	if (n !== e.shape[0] || n * r < di * y.thresholdMultiplier) return null;
	let i = c(h(e.dtype, t.dtype)), a = fi[i], o = pi[i];
	if (!a || !o) return null;
	let s = mi[i] ?? 1, l = o.BYTES_PER_ELEMENT, u = r * s, d = u * l, f = i === "float16", p = P(d);
	if (!p) return null;
	if (y.wasmCallCount++, F(), f) {
		a(R(e, n), R(t, n * r), p.ptr, n, r);
		let o = le(p, u);
		return p.release(), o ? z.fromWasmRegion([r], i, o, u, Float16Array) : null;
	}
	return a(L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * s, n * s, l), L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * s, n * r * s, l), p.ptr, n, r), z.fromWasmRegion([r], i, p, u, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/lu.wasm.js
var gi = "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", _i = null;
function vi() {
	if (_i) return _i;
	let e = atob(gi), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	_i = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = _i.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), _i;
}
function yi(e, t, n) {
	return vi().exports.lu_factor_f64(e, t, n);
}
function bi(e, t, n, r, i) {
	vi().exports.lu_solve_f64(e, t, n, r, i);
}
function xi(e, t, n, r) {
	vi().exports.lu_inv_f64(e, t, n, r);
}
function Si(e, t, n) {
	return vi().exports.lu_factor_f32(e, t, n);
}
function Ci(e, t, n, r, i) {
	vi().exports.lu_solve_f32(e, t, n, r, i);
}
function wi(e, t, n, r) {
	vi().exports.lu_inv_f32(e, t, n, r);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/lu.js
function Ti(e) {
	if (!e.isCContiguous || e.ndim !== 2) return null;
	let [t, n] = e.shape;
	if (t !== n || t < 2) return null;
	let r = e.dtype, i = t, a = r === "float32";
	if (r !== "float64" && r !== "float32") return null;
	let o = a ? 4 : 8, s = i * i * o, c = i * 4, l = P(s);
	if (!l) return null;
	let u = P(c);
	if (!u) return l.release(), null;
	y.wasmCallCount++, F();
	let d = M(), f = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset, i * i, o);
	new Uint8Array(d.buffer, l.ptr, s).set(new Uint8Array(d.buffer, f, s));
	let p = a ? Si(l.ptr, u.ptr, i) : yi(l.ptr, u.ptr, i), m = a ? Float32Array : Float64Array, h = z.fromWasmRegion([i, i], r, l, i * i, m), g = new Int32Array(d.buffer, u.ptr, i).slice();
	return u.release(), {
		lu: h,
		piv: g,
		sign: p
	};
}
function Ei(e, t, n) {
	let r = e.shape[0], i = n === "float32", a = i ? 4 : 8, o = P(r * r * a);
	if (!o) return null;
	y.wasmCallCount++, F();
	let s = I(r * 4), c = M();
	new Int32Array(c.buffer, s, r).set(t);
	let l = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset, r * r, a);
	i ? wi(l, s, o.ptr, r) : xi(l, s, o.ptr, r);
	let u = i ? Float32Array : Float64Array;
	return z.fromWasmRegion([r, r], n, o, r * r, u);
}
function Di(e, t, n, r) {
	let i = e.shape[0], a = r === "float32", o = a ? 4 : 8, s = P(i * o);
	if (!s) return null;
	y.wasmCallCount++, F();
	let c = I(i * 4), l = M();
	new Int32Array(l.buffer, c, i).set(t);
	let u = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset, i * i, o), d = L(n.data, n.isWasmBacked, n.wasmPtr, n.offset, i, o);
	a ? Ci(u, c, d, s.ptr, i) : bi(u, c, d, s.ptr, i);
	let f = a ? Float32Array : Float64Array;
	return z.fromWasmRegion([i], r, s, i, f);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/outer.wasm.js
var Oi = "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", ki = null;
function G() {
	if (ki) return ki;
	let e = atob(Oi), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	ki = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = ki.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), ki;
}
function Ai(e, t, n, r, i) {
	G().exports.outer_f64(e, t, n, r, i);
}
function ji(e, t, n, r, i) {
	G().exports.outer_f32(e, t, n, r, i);
}
function Mi(e, t, n, r, i) {
	G().exports.outer_c128(e, t, n, r, i);
}
function Ni(e, t, n, r, i) {
	G().exports.outer_c64(e, t, n, r, i);
}
function Pi(e, t, n, r, i) {
	G().exports.outer_i64(e, t, n, r, i);
}
function Fi(e, t, n, r, i) {
	G().exports.outer_i32(e, t, n, r, i);
}
function Ii(e, t, n, r, i) {
	G().exports.outer_i16(e, t, n, r, i);
}
function Li(e, t, n, r, i) {
	G().exports.outer_i8(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/outer.js
var Ri = 32, zi = {
	float64: Ai,
	float32: ji,
	complex128: Mi,
	complex64: Ni,
	int64: Pi,
	uint64: Pi,
	int32: Fi,
	uint32: Fi,
	int16: Ii,
	uint16: Ii,
	int8: Li,
	uint8: Li,
	float16: ji
}, Bi = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array,
	float16: Float32Array
}, Vi = {
	complex128: 2,
	complex64: 2
};
function Hi(e, t) {
	if (!e.isCContiguous || !t.isCContiguous) return null;
	let n = e.size, r = t.size;
	if (n + r < Ri * y.thresholdMultiplier) return null;
	let i = c(h(e.dtype, t.dtype)), a = zi[i], o = Bi[i];
	if (!a || !o) return null;
	let s = Vi[i] ?? 1, l = o.BYTES_PER_ELEMENT, u = n * r * s, d = u * l, f = i === "float16", p = P(d);
	if (!p) return null;
	if (y.wasmCallCount++, F(), f) {
		a(R(e, n), R(t, r), p.ptr, n, r);
		let o = le(p, u);
		return p.release(), o ? z.fromWasmRegion([n, r], i, o, u, Float16Array) : null;
	}
	return a(L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * s, n * s, l), L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * s, r * s, l), p.ptr, n, r), z.fromWasmRegion([n, r], i, p, u, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vecdot_float.wasm.js
var Ui = /* @__PURE__ */ o({
	vecdot_c128: () => Yi,
	vecdot_c64: () => Xi,
	vecdot_f32: () => Ji,
	vecdot_f64: () => qi
}), Wi = "AGFzbQEAAAABCQFgBX9/f39/AAIPAQNlbnYGbWVtb3J5AgB6AwUEAAAAAAYJAX8BQYCA6AMLBzYECnZlY2RvdF9mNjQAAAp2ZWNkb3RfZjMyAAELdmVjZG90X2MxMjgAAgp2ZWNkb3RfYzY0AAMKww8E6AUEDH8BewN/AXwCQCADRQ0AAkAgBEF+cSIFRQ0AIARBA3QhBiAEQQFxIQcgBUF/aiIIQQJxIQkgCEF+cSIFQQNqIQogBUECaiELIAhBAXZBAWpBfnEhDEEAIQ0gBEF9aiAFRiEOIAAhDyABIRADQAJAAkAgCEEBRw0A/QwAAAAAAAAAAAAAAAAAAAAAIRFBACESDAELQQAhEv0MAAAAAAAAAAAAAAAAAAAAACERIAwhEyAPIQUgECEUA0AgESAF/QADACAU/QADAP3yAf3wASAFQRBq/QADACAUQRBq/QADAP3yAf3wASERIAVBIGohBSAUQSBqIRQgEkEEaiESIBNBfmoiEw0ACwsgDSAEbCEFAkAgCQ0AIBEgACASIAVqQQN0IhRq/QADACABIBRq/QADAP3yAf3wASERCyAR/SEAIBH9IQGgIRUCQCALIARPDQACQAJAIAcNACALIQUMAQsgFSAAIAsgBWpBA3QiBWorAwAgASAFaisDAKKgIRUgCiEFCyAODQAgBCAFayEUIAVBA3QhBQNAIBUgDyAFaiISKwMAIBAgBWoiEysDAKKgIBJBCGorAwAgE0EIaisDAKKgIRUgBUEQaiEFIBRBfmoiFA0ACwsgAiANQQN0aiAVOQMAIA8gBmohDyAQIAZqIRAgDUEBaiINIANHDQAMAgsLAkAgBEUNACAEQQN0IQ1BACETIARBAUYhBiAAIQ8gASEQA0BEAAAAAAAAAAAhFUEAIRICQCAGDQBBACESRAAAAAAAAAAAIRUgDyEFIBAhFANAIBUgBSsDACAUKwMAoqAgBUEIaisDACAUQQhqKwMAoqAhFSAFQRBqIQUgFEEQaiEUIBJBAmoiEg0ACwsgAiATQQN0aiAVIAAgEiATIARsakEDdCIFaisDACABIAVqKwMAoqA5AwAgDyANaiEPIBAgDWohECATQQFqIhMgA0cNAAwCCwsgA0EDdCIFRQ0AIAJBACAF/AsACwuOBgQNfwF7An8BfQJAIANFDQACQCAEQXxxIgVFDQAgBEECdCEGIARBAXEhByAFQX9qIgVBBHEhCCAFQXxxIglBBWohCiAJQQRqIQsgBUECdkEBakH+////B3EhDEEAIQ0gBUEDRiEOIARBe2ogCUYhDyAAIRAgASERA0ACQAJAIA5FDQD9DAAAAAAAAAAAAAAAAAAAAAAhEkEAIRMMAQtBACET/QwAAAAAAAAAAAAAAAAAAAAAIRIgDCEUIBAhBSARIQkDQCASIAX9AAIAIAn9AAIA/eYB/eQBIAVBEGr9AAIAIAlBEGr9AAIA/eYB/eQBIRIgBUEgaiEFIAlBIGohCSATQQhqIRMgFEF+aiIUDQALCyANIARsIQUCQCAIDQAgEiAAIBMgBWpBAnQiCWr9AAIAIAEgCWr9AAIA/eYB/eQBIRILIBL9HwMgEv0fAiAS/R8AIBL9HwGSkpIhFQJAIAsgBE8NAAJAAkAgBw0AIAshBQwBCyAVIAAgCyAFakECdCIFaioCACABIAVqKgIAlJIhFSAKIQULIA8NACAEIAVrIQkgBUECdCEFA0AgFSAQIAVqIhMqAgAgESAFaiIUKgIAlJIgE0EEaioCACAUQQRqKgIAlJIhFSAFQQhqIQUgCUF+aiIJDQALCyACIA1BAnRqIBU4AgAgECAGaiEQIBEgBmohESANQQFqIg0gA0cNAAwCCwsCQCAERQ0AIARBAnQhBiAEQQJxIRQgBEEBcSELQQAhECAAIREgASENA0BDAAAAACEVQQAhEwJAIARBAUYNAEEAIRNDAAAAACEVIBEhBSANIQkDQCAVIAUqAgAgCSoCAJSSIAVBBGoqAgAgCUEEaioCAJSSIRUgBUEIaiEFIAlBCGohCSAUIBNBAmoiE0cNAAsLAkAgC0UNACAVIAAgEyAQIARsakECdCIFaioCACABIAVqKgIAlJIhFQsgAiAQQQJ0aiAVOAIAIBEgBmohESANIAZqIQ0gEEEBaiIQIANHDQAMAgsLIANBAnQiBUUNACACQQAgBfwLAAsL5gEEAn8BfAN/BXwCQCADRQ0AAkAgBEUNACAEQQR0IQVBACEGA0BEAAAAAAAAAAAhByAAIQggASEJIAQhCkQAAAAAAAAAACELA0AgCyAIKwMAIgwgCUEIaisDACINoiAIQQhqKwMAIg4gCSsDACIPoqGgIQsgByAMIA+iIA4gDaKgoCEHIAhBEGohCCAJQRBqIQkgCkF/aiIKDQALIAIgBkEEdGoiCCAHOQMAIAhBCGogCzkDACAAIAVqIQAgASAFaiEBIAZBAWoiBiADRw0ADAILCyADQQR0IghFDQAgAkEAIAj8CwALC94BBAJ/AX0DfwV9AkAgA0UNAAJAIARFDQAgBEEDdCEFQQAhBgNAQwAAAAAhByAAIQggASEJIAQhCkMAAAAAIQsDQCALIAgqAgAiDCAJQQRqKgIAIg2UIAhBBGoqAgAiDiAJKgIAIg+Uk5IhCyAHIAwgD5QgDiANlJKSIQcgCEEIaiEIIAlBCGohCSAKQX9qIgoNAAsgAiAGQQN0aiIIIAc4AgAgCEEEaiALOAIAIAAgBWohACABIAVqIQEgBkEBaiIGIANHDQAMAgsLIANBA3QiCEUNACACQQAgCPwLAAsL", Gi = null;
function Ki() {
	if (Gi) return Gi;
	let e = atob(Wi), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Gi = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Gi.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Gi;
}
function qi(e, t, n, r, i) {
	Ki().exports.vecdot_f64(e, t, n, r, i);
}
function Ji(e, t, n, r, i) {
	Ki().exports.vecdot_f32(e, t, n, r, i);
}
function Yi(e, t, n, r, i) {
	Ki().exports.vecdot_c128(e, t, n, r, i);
}
function Xi(e, t, n, r, i) {
	Ki().exports.vecdot_c64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vecdot_float-relaxed.wasm.js
var Zi = /* @__PURE__ */ o({
	vecdot_c128: () => ra,
	vecdot_c64: () => ia,
	vecdot_f32: () => na,
	vecdot_f64: () => ta
}), Qi = "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", $i = null;
function ea() {
	if ($i) return $i;
	let e = atob(Qi), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	$i = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = $i.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), $i;
}
function ta(e, t, n, r, i) {
	ea().exports.vecdot_f64(e, t, n, r, i);
}
function na(e, t, n, r, i) {
	ea().exports.vecdot_f32(e, t, n, r, i);
}
function ra(e, t, n, r, i) {
	ea().exports.vecdot_c128(e, t, n, r, i);
}
function ia(e, t, n, r, i) {
	ea().exports.vecdot_c64(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/vecdot_int.wasm.js
var aa = "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", oa = null;
function sa() {
	if (oa) return oa;
	let e = atob(aa), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	oa = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = oa.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), oa;
}
function ca(e, t, n, r, i) {
	sa().exports.vecdot_i64(e, t, n, r, i);
}
function la(e, t, n, r, i) {
	sa().exports.vecdot_i32(e, t, n, r, i);
}
function ua(e, t, n, r, i) {
	sa().exports.vecdot_i16(e, t, n, r, i);
}
function da(e, t, n, r, i) {
	sa().exports.vecdot_i8(e, t, n, r, i);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/vecdot.js
var fa = null;
function pa() {
	return fa ??= ht() ? Zi : Ui;
}
var ma = 32, ha = {
	float64: (...e) => pa().vecdot_f64(...e),
	float32: (...e) => pa().vecdot_f32(...e),
	complex128: (...e) => pa().vecdot_c128(...e),
	complex64: (...e) => pa().vecdot_c64(...e),
	int64: ca,
	uint64: ca,
	int32: la,
	uint32: la,
	int16: ua,
	uint16: ua,
	int8: da,
	uint8: da,
	float16: (...e) => pa().vecdot_f32(...e)
}, ga = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array,
	float16: Float32Array
}, _a = {
	complex128: 2,
	complex64: 2
};
function va(e, t) {
	if (e.ndim !== 2 || t.ndim !== 2 || !e.isCContiguous || !t.isCContiguous) return null;
	let n = e.shape[0], r = e.shape[1];
	if (n !== t.shape[0] || r !== t.shape[1] || n * r < ma * y.thresholdMultiplier) return null;
	let i = c(h(e.dtype, t.dtype)), a = ha[i], o = ga[i];
	if (!a || !o) return null;
	let s = _a[i] ?? 1, l = o.BYTES_PER_ELEMENT, u = n * s, d = u * l, f = i === "float16", p = P(d);
	if (!p) return null;
	if (y.wasmCallCount++, F(), f) {
		a(R(e, n * r), R(t, n * r), p.ptr, n, r);
		let o = le(p, u);
		return p.release(), o ? z.fromWasmRegion([n], i, o, u, Float16Array) : null;
	}
	return a(L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * s, n * r * s, l), L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * s, n * r * s, l), p.ptr, n, r), z.fromWasmRegion([n], i, p, u, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/cross.wasm.js
var ya = "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", ba = null;
function K() {
	if (ba) return ba;
	let e = atob(ya), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	ba = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = ba.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), ba;
}
function xa(e, t, n, r) {
	K().exports.cross_f64(e, t, n, r);
}
function Sa(e, t, n, r) {
	K().exports.cross_f32(e, t, n, r);
}
function Ca(e, t, n, r) {
	K().exports.cross_c128(e, t, n, r);
}
function wa(e, t, n, r) {
	K().exports.cross_c64(e, t, n, r);
}
function Ta(e, t, n, r) {
	K().exports.cross_i64(e, t, n, r);
}
function Ea(e, t, n, r) {
	K().exports.cross_i32(e, t, n, r);
}
function Da(e, t, n, r) {
	K().exports.cross_i16(e, t, n, r);
}
function Oa(e, t, n, r) {
	K().exports.cross_i8(e, t, n, r);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/cross.js
var ka = 8, Aa = {
	float64: xa,
	float32: Sa,
	complex128: Ca,
	complex64: wa,
	int64: Ta,
	uint64: Ta,
	int32: Ea,
	uint32: Ea,
	int16: Da,
	uint16: Da,
	int8: Oa,
	uint8: Oa,
	float16: Sa
}, ja = {
	float64: Float64Array,
	float32: Float32Array,
	complex128: Float64Array,
	complex64: Float32Array,
	int64: BigInt64Array,
	uint64: BigUint64Array,
	int32: Int32Array,
	uint32: Uint32Array,
	int16: Int16Array,
	uint16: Uint16Array,
	int8: Int8Array,
	uint8: Uint8Array,
	float16: Float32Array
}, Ma = {
	complex128: 2,
	complex64: 2
};
function Na(e, t, n) {
	if (n < ka * y.thresholdMultiplier || !e.isCContiguous || !t.isCContiguous) return null;
	let r = c(h(e.dtype, t.dtype)), i = Aa[r], a = ja[r];
	if (!i || !a) return null;
	let o = Ma[r] ?? 1, s = a.BYTES_PER_ELEMENT, l = n * 3 * o, u = l * s, d = r === "float16", f = P(u);
	if (!f) return null;
	if (y.wasmCallCount++, F(), d) {
		i(R(e, l), R(t, l), f.ptr, n);
		let a = le(f, l);
		return f.release(), a ? z.fromWasmRegion([...e.shape], r, a, l, Float16Array) : null;
	}
	return i(L(e.data, e.isWasmBacked, e.wasmPtr, e.offset * o, l, s), L(t.data, t.isWasmBacked, t.wasmPtr, t.offset * o, l, s), f.ptr, n), z.fromWasmRegion([...e.shape], r, f, l, a);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/qr.wasm.js
var Pa = "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", Fa = null;
function Ia() {
	if (Fa) return Fa;
	let e = atob(Pa), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Fa = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Fa.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Fa;
}
function La(e, t, n, r, i, a, o) {
	Ia().exports.qr_f64(e, t, n, r, i, a, o);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/qr.js
var Ra = 4;
function za(e) {
	if (e.ndim !== 2 || m(e.dtype)) return null;
	let t = e.shape[0], n = e.shape[1];
	if (t < Ra * y.thresholdMultiplier || n < Ra * y.thresholdMultiplier) return null;
	let r = Math.min(t, n), i = t * r, a = r * n, o = P(i * 8);
	if (!o) return null;
	let s = P(a * 8);
	if (!s) return o.release(), null;
	y.wasmCallCount++, F();
	let c = t * n, l = P(c * 8);
	if (!l) return o.release(), s.release(), null;
	let u = M();
	if (e.dtype === "float64" && e.isCContiguous) {
		let t = new Float64Array(u.buffer, l.ptr, c);
		e.isWasmBacked ? t.set(new Float64Array(u.buffer, e.wasmPtr + e.offset * 8, c)) : t.set(e.data.subarray(e.offset, e.offset + c));
	} else {
		let r = new Float64Array(u.buffer, l.ptr, c);
		for (let i = 0; i < t; i++) for (let t = 0; t < n; t++) r[i * n + t] = Number(e.get(i, t));
	}
	let d = I(r * 8), f = I(r * 8);
	return La(l.ptr, o.ptr, s.ptr, d, f, t, n), l.release(), {
		q: z.fromWasmRegion([t, r], "float64", o, i, Float64Array),
		r: z.fromWasmRegion([r, n], "float64", s, a, Float64Array)
	};
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/bins/cholesky.wasm.js
var Ba = "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", Va = null;
function Ha() {
	if (Va) return Va;
	let e = atob(Ba), t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	Va = new WebAssembly.Instance(new WebAssembly.Module(t), { env: { memory: M() } });
	let n = Va.exports.__heap_base;
	return n && typeof n.value == "number" && N(n.value), Va;
}
function Ua(e, t, n) {
	return Ha().exports.cholesky_f64(e, t, n);
}
function Wa(e, t, n) {
	return Ha().exports.cholesky_f32(e, t, n);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/wasm/cholesky.js
var Ga = 4;
function Ka(e) {
	if (e.ndim !== 2 || m(e.dtype)) return null;
	let t = e.shape[0];
	if (t !== e.shape[1] || t < Ga * y.thresholdMultiplier) return null;
	let n = t * t, r = P(n * 8);
	if (!r) return null;
	y.wasmCallCount++, F();
	let i;
	if (e.isCContiguous && e.dtype === "float64") i = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset, n, 8);
	else {
		let r = new Float64Array(n);
		for (let n = 0; n < t; n++) for (let i = 0; i < t; i++) r[n * t + i] = Number(e.get(n, i));
		i = se(r);
	}
	if (Ua(i, r.ptr, t) !== 0) throw r.release(), /* @__PURE__ */ Error("cholesky: matrix is not positive definite");
	return z.fromWasmRegion([t, t], "float64", r, n, Float64Array);
}
function qa(e) {
	if (e.ndim !== 2 || m(e.dtype)) return null;
	let t = e.shape[0];
	if (t !== e.shape[1] || t < Ga * y.thresholdMultiplier) return null;
	let n = t * t, r = P(n * 4);
	if (!r) return null;
	y.wasmCallCount++, F();
	let i;
	if (e.isCContiguous && e.dtype === "float32") i = L(e.data, e.isWasmBacked, e.wasmPtr, e.offset, n, 4);
	else {
		let r = new Float32Array(n);
		for (let n = 0; n < t; n++) for (let i = 0; i < t; i++) r[n * t + i] = Number(e.get(n, i));
		i = se(r);
	}
	if (Wa(i, r.ptr, t) !== 0) throw r.release(), /* @__PURE__ */ Error("cholesky: matrix is not positive definite");
	return z.fromWasmRegion([t, t], "float32", r, n, Float32Array);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/ops/linalg.js
function q(e) {
	if (e === "float16") throw TypeError("array type float16 is unsupported in linalg");
}
var Ja = {
	int32: new Int32Array(1),
	uint32: new Uint32Array(1),
	int16: new Int16Array(1),
	uint16: new Uint16Array(1),
	int8: new Int8Array(1),
	uint8: new Uint8Array(1)
};
function J(e) {
	return Ja[e] ?? null;
}
function Y(e) {
	return e instanceof g ? e.abs() : Math.abs(Number(e));
}
function X(e) {
	return e instanceof g ? e.re : Number(e);
}
function Z(e, t) {
	if (e instanceof g || t instanceof g) {
		let n = e instanceof g ? e : new g(Number(e), 0), r = t instanceof g ? t : new g(Number(t), 0);
		return n.mul(r);
	}
	return typeof e == "bigint" && typeof t == "bigint" ? e * t : Number(e) * Number(t);
}
function Ya(e, t, n, r, i, a, o, s, c) {
	for (let l = 0; l < n; l++) for (let n = 0; n < a; n++) for (let u = 0; u < o; u++) {
		let d = 0;
		for (let a = 0; a < s; a++) d += e[t + l * s + a] * r[i + n * s * o + a * o + u];
		c[l * a * o + n * o + u] = d;
	}
}
function Xa(e, t, n, r, i, a, o, s, c, l) {
	for (let u = 0; u < n; u++) for (let d = 0; d < o; d++) {
		let f = 0;
		for (let n = 0; n < c; n++) {
			let o = r === 1 ? n : u * c + n, l = s === 1 ? n : d * c + n;
			f += e[t + o] * i[a + l];
		}
		let p = n === 1 ? d : u * o + d;
		l[p] = f;
	}
}
function Za(e, t, n, r, i, a, o, s, c, l, u, d) {
	for (let e = 0; e < n * r; e++) u[e] = 0;
	let f = e === "transpose", p = t === "transpose";
	if (!f && !p) for (let e = 0; e < n; e++) for (let t = 0; t < r; t++) {
		let n = 0;
		for (let r = 0; r < i; r++) n += (o[e * s + r] ?? 0) * (c[r * l + t] ?? 0);
		u[e * d + t] = a * n;
	}
	else if (f && !p) for (let e = 0; e < n; e++) for (let t = 0; t < r; t++) {
		let n = 0;
		for (let r = 0; r < i; r++) n += (o[r * s + e] ?? 0) * (c[r * l + t] ?? 0);
		u[e * d + t] = a * n;
	}
	else if (!f && p) for (let e = 0; e < n; e++) for (let t = 0; t < r; t++) {
		let n = 0;
		for (let r = 0; r < i; r++) n += (o[e * s + r] ?? 0) * (c[t * l + r] ?? 0);
		u[e * d + t] = a * n;
	}
	else for (let e = 0; e < n; e++) for (let t = 0; t < r; t++) {
		let n = 0;
		for (let r = 0; r < i; r++) n += (o[r * s + e] ?? 0) * (c[t * l + r] ?? 0);
		u[e * d + t] = a * n;
	}
}
function Qa(e, t) {
	let n = e.ndim, r = t.ndim, i = m(e.dtype) || m(t.dtype);
	if (n === 0 || r === 0) {
		let i = n === 0 ? e.get() : null, a = r === 0 ? t.get() : null;
		if (n === 0 && r === 0) return Z(i, a);
		if (n === 0) {
			let n = h(e.dtype, t.dtype), r = z.zeros([...t.shape], n), a = (e, t) => {
				let n = Array(t.length), r = e;
				for (let e = t.length - 1; e >= 0; e--) n[e] = r % t[e], r = Math.floor(r / t[e]);
				return n;
			};
			for (let e = 0; e < t.size; e++) {
				let n = a(e, t.shape), o = t.get(...n);
				r.set(n, Z(i, o));
			}
			return r;
		} else {
			let n = h(e.dtype, t.dtype), r = z.zeros([...e.shape], n), i = (e, t) => {
				let n = Array(t.length), r = e;
				for (let e = t.length - 1; e >= 0; e--) n[e] = r % t[e], r = Math.floor(r / t[e]);
				return n;
			};
			for (let t = 0; t < e.size; t++) {
				let n = i(t, e.shape), o = e.get(...n);
				r.set(n, Z(o, a));
			}
			return r;
		}
	}
	if (n === 1 && r === 1) {
		if (e.shape[0] !== t.shape[0]) throw Error(`dot: incompatible shapes (${e.shape[0]},) and (${t.shape[0]},)`);
		let n = lr(e, t);
		if (n !== null) return n;
		let r = e.shape[0];
		if (i) {
			let n = 0, i = 0;
			for (let a = 0; a < r; a++) {
				let r = Z(e.get(a), t.get(a));
				r instanceof g ? (n += r.re, i += r.im) : n += Number(r);
			}
			return new g(n, i);
		}
		let a = h(e.dtype, t.dtype);
		if (p(a)) {
			let n = BigInt(0);
			for (let i = 0; i < r; i++) n += BigInt(e.get(i)) * BigInt(t.get(i));
			return n;
		}
		let o = J(a);
		if (o) {
			o[0] = 0;
			for (let n = 0; n < r; n++) o[0] += Number(e.get(n)) * Number(t.get(n));
			return o[0];
		}
		if (a === "float16" && s) {
			let n = new Float16Array(1);
			n[0] = 0;
			for (let i = 0; i < r; i++) n[0] += Number(e.get(i)) * Number(t.get(i));
			return Number(n[0]);
		}
		if (a === "float32") {
			let n = new Float32Array(1);
			n[0] = 0;
			for (let i = 0; i < r; i++) n[0] += Number(e.get(i)) * Number(t.get(i));
			return n[0];
		}
		let c = 0;
		for (let n = 0; n < r; n++) {
			let r = e.get(n), i = t.get(n);
			typeof r == "bigint" && typeof i == "bigint" ? c = Number(c) + Number(r * i) : c += Number(r) * Number(i);
		}
		return c;
	}
	if (n === 2 && r === 2) return $(e, t);
	if (n === 2 && r === 1) {
		let [n, r] = e.shape, a = t.shape[0];
		if (r !== a) throw Error(`dot: incompatible shapes (${n},${r}) and (${a},)`);
		let o = zr(e, t);
		if (o) return o;
		let s = h(e.dtype, t.dtype), c = z.zeros([n], s);
		if (i) for (let i = 0; i < n; i++) {
			let n = 0, a = 0;
			for (let o = 0; o < r; o++) {
				let r = e.get(i, o), s = t.get(o), c = r instanceof g ? r : new g(Number(r), 0), l = s instanceof g ? s : new g(Number(s), 0);
				n += c.re * l.re - c.im * l.im, a += c.re * l.im + c.im * l.re;
			}
			c.set([i], new g(n, a));
		}
		else if (p(s)) for (let i = 0; i < n; i++) {
			let n = 0n;
			for (let a = 0; a < r; a++) n += BigInt(e.get(i, a)) * BigInt(t.get(a));
			c.set([i], n);
		}
		else {
			let i = J(s);
			for (let a = 0; a < n; a++) if (i) {
				i[0] = 0;
				for (let n = 0; n < r; n++) i[0] += Number(e.get(a, n)) * Number(t.get(n));
				c.set([a], i[0]);
			} else {
				let n = 0;
				for (let i = 0; i < r; i++) n += Number(e.get(a, i)) * Number(t.get(i));
				c.set([a], n);
			}
		}
		return c;
	}
	if (n === 1 && r === 2) {
		let n = e.shape[0], [r, a] = t.shape;
		if (n !== r) throw Error(`dot: incompatible shapes (${n},) and (${r},${a})`);
		let o = hi(e, t);
		if (o) return o;
		let s = h(e.dtype, t.dtype), c = z.zeros([a], s);
		if (i) for (let r = 0; r < a; r++) {
			let i = 0, a = 0;
			for (let o = 0; o < n; o++) {
				let n = e.get(o), s = t.get(o, r), c = n instanceof g ? n : new g(Number(n), 0), l = s instanceof g ? s : new g(Number(s), 0);
				i += c.re * l.re - c.im * l.im, a += c.re * l.im + c.im * l.re;
			}
			c.set([r], new g(i, a));
		}
		else if (p(s)) for (let r = 0; r < a; r++) {
			let i = 0n;
			for (let a = 0; a < n; a++) i += BigInt(e.get(a)) * BigInt(t.get(a, r));
			c.set([r], i);
		}
		else {
			let r = J(s);
			for (let i = 0; i < a; i++) if (r) {
				r[0] = 0;
				for (let a = 0; a < n; a++) r[0] += Number(e.get(a)) * Number(t.get(a, i));
				c.set([i], r[0]);
			} else {
				let r = 0;
				for (let a = 0; a < n; a++) r += Number(e.get(a)) * Number(t.get(a, i));
				c.set([i], r);
			}
		}
		return c;
	}
	if (n > 2 && r === 1) {
		let r = e.shape[n - 1], a = t.shape[0];
		if (r !== a) throw Error(`dot: incompatible shapes ${JSON.stringify(e.shape)} and (${a},)`);
		let o = [...e.shape.slice(0, -1)], s = h(e.dtype, t.dtype), c = z.zeros(o, s), l = o.reduce((e, t) => e * t, 1);
		if (i) for (let n = 0; n < l; n++) {
			let i = 0, a = 0, s = n, l = [];
			for (let e = o.length - 1; e >= 0; e--) l[e] = s % o[e], s = Math.floor(s / o[e]);
			for (let n = 0; n < r; n++) {
				let r = [...l, n], o = e.get(...r), s = t.get(n), c = o instanceof g ? o : new g(Number(o), 0), u = s instanceof g ? s : new g(Number(s), 0);
				i += c.re * u.re - c.im * u.im, a += c.re * u.im + c.im * u.re;
			}
			c.set(l, new g(i, a));
		}
		else {
			let n = J(s);
			for (let i = 0; i < l; i++) {
				let a = i, s = [];
				for (let e = o.length - 1; e >= 0; e--) s[e] = a % o[e], a = Math.floor(a / o[e]);
				if (n) {
					n[0] = 0;
					for (let i = 0; i < r; i++) {
						let r = [...s, i];
						n[0] += Number(e.get(...r)) * Number(t.get(i));
					}
					c.set(s, n[0]);
				} else {
					let n = 0;
					for (let i = 0; i < r; i++) {
						let r = [...s, i], a = e.get(...r), o = t.get(i);
						typeof a == "bigint" && typeof o == "bigint" ? n = Number(n) + Number(a * o) : n += Number(a) * Number(o);
					}
					c.set(s, n);
				}
			}
		}
		return c;
	}
	if (n === 1 && r > 2) {
		let n = e.shape[0];
		if (n !== t.shape[1]) throw Error(`dot: incompatible shapes (${n},) and ${JSON.stringify(t.shape)}`);
		let r = [...t.shape.slice(0, 1), ...t.shape.slice(2)], a = h(e.dtype, t.dtype), o = z.zeros(r, a), s = r.reduce((e, t) => e * t, 1);
		if (i) for (let i = 0; i < s; i++) {
			let a = i, s = [];
			for (let e = r.length - 1; e >= 0; e--) s[e] = a % r[e], a = Math.floor(a / r[e]);
			let c = s.slice(0, 1), l = s.slice(1), u = 0, d = 0;
			for (let r = 0; r < n; r++) {
				let n = e.get(r), i = [
					...c,
					r,
					...l
				], a = t.get(...i), o = n instanceof g ? n : new g(Number(n), 0), s = a instanceof g ? a : new g(Number(a), 0);
				u += o.re * s.re - o.im * s.im, d += o.re * s.im + o.im * s.re;
			}
			o.set(s, new g(u, d));
		}
		else {
			let i = J(a);
			for (let a = 0; a < s; a++) {
				let s = a, c = [];
				for (let e = r.length - 1; e >= 0; e--) c[e] = s % r[e], s = Math.floor(s / r[e]);
				let l = c.slice(0, 1), u = c.slice(1);
				if (i) {
					i[0] = 0;
					for (let r = 0; r < n; r++) {
						let n = [
							...l,
							r,
							...u
						];
						i[0] += Number(e.get(r)) * Number(t.get(...n));
					}
					o.set(c, i[0]);
				} else {
					let r = 0;
					for (let i = 0; i < n; i++) {
						let n = e.get(i), a = [
							...l,
							i,
							...u
						], o = t.get(...a);
						typeof n == "bigint" && typeof o == "bigint" ? r = Number(r) + Number(n * o) : r += Number(n) * Number(o);
					}
					o.set(c, r);
				}
			}
		}
		return o;
	}
	if (n >= 2 && r >= 2 && !(n === 2 && r === 2)) {
		let a = e.shape[n - 1];
		if (a !== t.shape[r - 2]) throw Error(`dot: incompatible shapes ${JSON.stringify(e.shape)} and ${JSON.stringify(t.shape)}`);
		let o = [
			...e.shape.slice(0, -1),
			...t.shape.slice(0, -2),
			t.shape[r - 1]
		], s = h(e.dtype, t.dtype), c = z.zeros(o, s), l = e.shape.slice(0, -1).reduce((e, t) => e * t, 1), u = t.shape.slice(0, -2).reduce((e, t) => e * t, 1), d = t.shape[r - 1], f = a;
		if (i) for (let n = 0; n < l; n++) for (let r = 0; r < u; r++) for (let i = 0; i < d; i++) {
			let a = 0, o = 0;
			for (let s = 0; s < f; s++) {
				let c = [], l = n;
				for (let t = e.shape.length - 2; t >= 0; t--) c.unshift(l % e.shape[t]), l = Math.floor(l / e.shape[t]);
				c.push(s);
				let u = e.get(...c), d = [], f = r;
				for (let e = t.shape.length - 3; e >= 0; e--) d.unshift(f % t.shape[e]), f = Math.floor(f / t.shape[e]);
				d.push(s, i);
				let p = t.get(...d), m = u instanceof g ? u : new g(Number(u), 0), h = p instanceof g ? p : new g(Number(p), 0);
				a += m.re * h.re - m.im * h.im, o += m.re * h.im + m.im * h.re;
			}
			let s = n * u * d + r * d + i, l = c.data;
			l[s * 2] = a, l[s * 2 + 1] = o;
		}
		else if (e.isCContiguous && t.isCContiguous && !p(e.dtype) && !p(t.dtype) && !J(s)) Ya(e.data, e.offset, l, t.data, t.offset, u, d, f, c.data);
		else {
			let n = J(s);
			for (let r = 0; r < l; r++) for (let i = 0; i < u; i++) for (let a = 0; a < d; a++) {
				let o = r * u * d + i * d + a;
				if (n) {
					n[0] = 0;
					for (let o = 0; o < f; o++) {
						let s = r * f + o, c = i * f * d + o * d + a;
						n[0] += Number(e.iget(s)) * Number(t.iget(c));
					}
					c.data[o] = n[0];
				} else {
					let n = 0;
					for (let o = 0; o < f; o++) {
						let s = r * f + o, c = i * f * d + o * d + a, l = e.iget(s), u = t.iget(c);
						typeof l == "bigint" && typeof u == "bigint" ? n = Number(n) + Number(l * u) : n += Number(l) * Number(u);
					}
					c.data[o] = n;
				}
			}
		}
		return c;
	}
	throw Error(`dot: unexpected combination of dimensions ${n}D \xB7 ${r}D`);
}
function $a(e, t) {
	let [n = 0, r = 0] = e.shape, [i = 0, a = 0] = t.shape;
	if (r !== i) throw Error(`matmul shape mismatch: (${n},${r}) @ (${i},${a})`);
	let o = h(e.dtype, t.dtype);
	if (m(o)) {
		let i = m(e.dtype), s = m(t.dtype), c = z.zeros([n, a], o), l = c.data;
		for (let o = 0; o < n; o++) for (let n = 0; n < a; n++) {
			let c = 0, u = 0;
			for (let l = 0; l < r; l++) {
				let d = e.iget(o * r + l), f = t.iget(l * a + n), p = i ? d.re : Number(d), m = i ? d.im : 0, h = s ? f.re : Number(f), g = s ? f.im : 0;
				c += p * h - m * g, u += p * g + m * h;
			}
			let d = o * a + n;
			l[d * 2] = c, l[d * 2 + 1] = u;
		}
		return c;
	}
	if (o.startsWith("int") || o.startsWith("uint") || o === "bool") {
		let i = z.zeros([n, a], o), s = i.data, c = e.offset, l = t.offset, [u = 0, d = 0] = e.strides, [f = 0, m = 0] = t.strides;
		if (p(o)) {
			let i = e.data, o = t.data, p = s;
			for (let e = 0; e < n; e++) for (let t = 0; t < a; t++) {
				let n = 0n;
				for (let a = 0; a < r; a++) n += i[c + e * u + a * d] * o[l + a * f + t * m];
				p[e * a + t] = n;
			}
		} else {
			let i = e.data, o = t.data, p = s;
			for (let e = 0; e < n; e++) for (let t = 0; t < a; t++) {
				let n = 0;
				for (let a = 0; a < r; a++) n += i[c + e * u + a * d] * o[l + a * f + t * m];
				p[e * a + t] = n;
			}
		}
		return i;
	}
	let s = o;
	if (s !== "float64" && s !== "float32" && s !== "float16") throw Error(`matmul currently only supports float64/float32/float16, got ${s}`);
	let c = (e) => e.dtype === "float64" ? e.data : e.dtype === "float32" || e.dtype === "float16" ? Float64Array.from(e.data) : Float64Array.from(Array.from(e.data).map(Number)), l = c(e), u = c(t);
	e.offset > 0 && (l = l.subarray(e.offset)), t.offset > 0 && (u = u.subarray(t.offset));
	let [d = 0, f = 0] = e.strides, [g = 0, _ = 0] = t.strides, v = f > d, y = _ > g, b = v ? "transpose" : "no-transpose", x = y ? "transpose" : "no-transpose", S, C;
	S = v ? f : d, C = y ? _ : g;
	let w = z.zeros([n, a], "float64");
	if (Za(b, x, n, a, r, 1, l, S, u, C, w.data, a), s === "float32" || s === "float16") {
		let e = z.zeros([n, a], s), t = w.data, r = e.data;
		for (let e = 0; e < t.length; e++) r[e] = t[e];
		return w.dispose(), e;
	}
	return w;
}
function eo(e, t) {
	let n = Math.max(e.length, t.length), r = Array(n);
	for (let i = 0; i < n; i++) {
		let a = e[e.length - n + i] ?? 1, o = t[t.length - n + i] ?? 1;
		if (a !== o && a !== 1 && o !== 1) throw Error(`matmul: cannot broadcast batch shapes ${JSON.stringify(e)} and ${JSON.stringify(t)}`);
		r[i] = Math.max(a, o);
	}
	return r;
}
function to(e, t) {
	let n = Array(t.length), r = e;
	for (let e = t.length - 1; e >= 0; e--) n[e] = r % t[e], r = Math.floor(r / t[e]);
	return n;
}
function no(e, t) {
	let n = t.length, r = 0;
	for (let i = 0; i < n; i++) {
		let a = e.length - n + i, o = a >= 0 ? e[a] : 0, s = t[i] === 1 ? 0 : o;
		r = r * t[i] + s;
	}
	return r;
}
function Q(e) {
	if (e.isCContiguous && e.offset === 0 && e.dtype === "float64") return e.data;
	let t = new Float64Array(e.size);
	for (let n = 0; n < e.size; n++) t[n] = Number(e.iget(n));
	return t;
}
function ro(e, t, n, r) {
	let i = e.ndim, a = n * r, o = m(e.dtype), s = p(e.dtype), c = o ? 2 : 1, l = z.empty([n, r], e.dtype), u = l.data;
	if (e.isCContiguous) {
		let n = (e.offset + t * a) * c;
		if (s) {
			let t = e.data, r = u;
			for (let e = 0; e < a * c; e++) r[e] = t[n + e];
		} else {
			let t = e.data, r = u;
			for (let e = 0; e < a * c; e++) r[e] = t[n + e];
		}
	} else {
		let n = t * a;
		for (let t = 0; t < a; t++) {
			let r = n + t, a = e.offset;
			for (let t = i - 1; t >= 0; t--) {
				let n = e.shape[t];
				a += r % n * e.strides[t], r = Math.floor(r / n);
			}
			if (o) {
				let n = e.data, r = u;
				r[t * 2] = n[a * 2], r[t * 2 + 1] = n[a * 2 + 1];
			} else u[t] = e.data[a];
		}
	}
	return l;
}
function $(e, t) {
	if (e.ndim === 1 && t.ndim === 1) {
		let n = lr(e, t);
		if (n !== null) {
			let r = h(e.dtype, t.dtype), i = z.zeros([], r);
			return n instanceof g ? (i.data[0] = n.re, i.data[1] = n.im) : i.data[0] = n, i;
		}
	} else if (e.ndim >= 2 && t.ndim === 1) {
		if (e.ndim === 2) {
			let n = zr(e, t);
			if (n) return n;
		}
	} else if (e.ndim === 1 && t.ndim >= 2 && t.ndim === 2) {
		let n = hi(e, t);
		if (n) return n;
	}
	let n = Tt(e, t);
	if (n) return n;
	if (e.ndim === 0 || t.ndim === 0) throw Error("matmul: Input operand does not have enough dimensions (has 0, gufunc core with signature (n?,k),(k,m?)->(n?,m?) requires at least 1-D)");
	let r = e.ndim === 1, i = t.ndim === 1, a = r ? B(e, [1, e.shape[0]]) : e, o = i ? B(t, [t.shape[0], 1]) : t, s = a.ndim, c = o.ndim, l = a.shape[s - 2], u = a.shape[s - 1], d = o.shape[c - 2], f = o.shape[c - 1];
	if (u !== d) throw Error(`matmul: shape mismatch: (...,${l},${u}) @ (...,${d},${f}): inner dimensions must match`);
	if (s === 2 && c === 2) {
		let e = $a(a, o);
		return r && i ? B(e, []) : r ? B(e, [f]) : i ? B(e, [l]) : e;
	}
	let _ = Array.from(a.shape).slice(0, s - 2), v = Array.from(o.shape).slice(0, c - 2), y = eo(_, v), b = y.reduce((e, t) => e * t, 1), x = h(a.dtype, o.dtype), S = [];
	for (let e = 0; e < b; e++) {
		let t = to(e, y), n = no(t, _), r = no(t, v), i = ro(a, n, l, u), s = ro(o, r, u, f);
		S.push($a(i, s));
	}
	let C = l * f, w = m(x), T = p(x), E = w ? 2 : 1, D = [
		...y,
		l,
		f
	], O = z.empty(D, x), k = O.data;
	for (let e = 0; e < b; e++) {
		let t = S[e].data, n = e * C * E;
		if (T) {
			let e = t, r = k;
			for (let t = 0; t < C; t++) r[n + t] = e[t];
		} else {
			let e = t, r = k;
			for (let t = 0; t < C * E; t++) r[n + t] = e[t];
		}
	}
	return r && i ? B(O, [...y]) : r ? B(O, [...y, f]) : i ? B(O, [...y, l]) : O;
}
function io(e, t = 0, n = 0, r = 1) {
	if (e.ndim < 2) throw Error(`trace requires at least 2D array, got ${e.ndim}D`);
	if (e.ndim === 2) {
		let i = n < 0 ? e.ndim + n : n, a = r < 0 ? e.ndim + r : r, o = e.shape[i], c = e.shape[a], l = Math.min(o, c) - Math.max(0, t);
		if (l <= 0) return m(e.dtype) ? new g(0, 0) : 0;
		let u = e.strides[i] + e.strides[a], d = e.offset + Math.max(0, t) * e.strides[a] + Math.max(0, -t) * e.strides[i], f = e.data;
		if (m(e.dtype)) {
			let e = 0, t = 0, n = d;
			for (let r = 0; r < l; r++) e += Number(f[n * 2]), t += Number(f[n * 2 + 1]), n += u;
			return new g(e, t);
		}
		let p = d;
		if (e.dtype === "float16" && s) {
			let e = new Float16Array(1);
			e[0] = 0;
			for (let t = 0; t < l; t++) e[0] += Number(f[p]), p += u;
			return Number(e[0]);
		}
		if (e.dtype === "float32") {
			let e = new Float32Array(1);
			e[0] = 0;
			for (let t = 0; t < l; t++) e[0] += Number(f[p]), p += u;
			return e[0];
		}
		let h = 0;
		for (let e = 0; e < l; e++) {
			let e = f[p];
			h = typeof e == "bigint" ? (typeof h == "bigint" ? h : BigInt(h)) + e : (typeof h == "bigint" ? Number(h) : h) + e, p += u;
		}
		return h;
	}
	let i = e.ndim, a = (n % i + i) % i, o = (r % i + i) % i;
	if (a === o) throw Error("trace: axis1 and axis2 must be different");
	let c = e.shape[a], l = e.shape[o], u = Math.min(c, l) - Math.max(0, t), d = Array.from(e.shape).filter((e, t) => t !== a && t !== o), f = d.reduce((e, t) => e * t, 1), p = z.zeros(d.length > 0 ? d : [1], e.dtype);
	if (u <= 0) return p.shape.length === 0 ? 0 : p;
	for (let n = 0; n < f; n++) {
		let r = Array(d.length), s = n;
		for (let e = d.length - 1; e >= 0; e--) r[e] = s % d[e], s = Math.floor(s / d[e]);
		let c = 0, l = 0, f = 0, h = m(e.dtype);
		for (let n = 0; n < u; n++) {
			let s = t >= 0 ? n : n - t, u = t >= 0 ? n + t : n, d = Array(i), p = 0;
			for (let e = 0; e < i; e++) e === a ? d[e] = s : e === o ? d[e] = u : d[e] = r[p++];
			let m = e.get(...d);
			h ? (l += m.re, f += m.im) : c = typeof m == "bigint" ? (typeof c == "bigint" ? c : BigInt(c)) + m : (typeof c == "bigint" ? Number(c) : c) + m;
		}
		h ? p.iset(n, new g(l, f)) : p.iset(n, typeof c == "bigint" ? Number(c) : c);
	}
	return p;
}
function ao(e, t) {
	return _e(e, t);
}
function oo(e, t) {
	let n = e.ndim, r = t.ndim, i = m(e.dtype) || m(t.dtype);
	if (n === 0 || r === 0) return Qa(e, t);
	let a = e.shape[n - 1], o = t.shape[r - 1];
	if (a !== o) throw Error(`inner: incompatible shapes - last dimensions ${a} and ${o} don't match`);
	let s = Nn(e, t);
	if (s !== null) return s;
	if (n === 1 && r === 1) return Qa(e, t);
	let c = [...e.shape.slice(0, -1), ...t.shape.slice(0, -1)], l = h(e.dtype, t.dtype), u = z.zeros(c, l), d = n === 1 ? 1 : e.shape.slice(0, -1).reduce((e, t) => e * t, 1), f = r === 1 ? 1 : t.shape.slice(0, -1).reduce((e, t) => e * t, 1), _ = a;
	if (i) for (let i = 0; i < d; i++) for (let a = 0; a < f; a++) {
		let o = 0, s = 0;
		for (let c = 0; c < _; c++) {
			let l, u;
			if (n === 1) l = e.get(c);
			else {
				let t = [], n = i, r = e.shape.slice(0, -1);
				for (let e = r.length - 1; e >= 0; e--) t.unshift(n % r[e]), n = Math.floor(n / r[e]);
				t.push(c), l = e.get(...t);
			}
			if (r === 1) u = t.get(c);
			else {
				let e = [], n = a, r = t.shape.slice(0, -1);
				for (let t = r.length - 1; t >= 0; t--) e.unshift(n % r[t]), n = Math.floor(n / r[t]);
				e.push(c), u = t.get(...e);
			}
			let d = l instanceof g ? l : new g(Number(l), 0), f = u instanceof g ? u : new g(Number(u), 0);
			o += d.re * f.re - d.im * f.im, s += d.re * f.im + d.im * f.re;
		}
		if (c.length === 0) return new g(o, s);
		let l = d === 1 ? a : i * f + a, p = u.data;
		p[l * 2] = o, p[l * 2 + 1] = s;
	}
	else {
		let i = J(l);
		if (e.isCContiguous && t.isCContiguous && !p(e.dtype) && !p(t.dtype) && !i) {
			if (c.length === 0) {
				let n = e.data, r = t.data, i = e.offset, a = t.offset, o = 0;
				for (let e = 0; e < _; e++) o += n[i + e] * r[a + e];
				return o;
			}
			Xa(e.data, e.offset, d, n, t.data, t.offset, f, r, _, u.data);
		} else for (let a = 0; a < d; a++) for (let o = 0; o < f; o++) if (i) {
			i[0] = 0;
			for (let s = 0; s < _; s++) {
				let c = n === 1 ? s : a * _ + s, l = r === 1 ? s : o * _ + s;
				i[0] += Number(e.iget(c)) * Number(t.iget(l));
			}
			if (c.length === 0) return i[0];
			let s = d === 1 ? o : a * f + o;
			u.data[s] = i[0];
		} else if (p(l)) {
			let i = 0n;
			for (let s = 0; s < _; s++) {
				let c = n === 1 ? s : a * _ + s, l = r === 1 ? s : o * _ + s;
				i += BigInt(e.iget(c)) * BigInt(t.iget(l));
			}
			if (c.length === 0) return i;
			let s = d === 1 ? o : a * f + o;
			u.data[s] = i;
		} else {
			let i = 0;
			for (let s = 0; s < _; s++) {
				let c = n === 1 ? s : a * _ + s, l = r === 1 ? s : o * _ + s;
				i += Number(e.iget(c)) * Number(t.iget(l));
			}
			if (c.length === 0) return i;
			let s = d === 1 ? o : a * f + o;
			u.data[s] = i;
		}
	}
	return u;
}
function so(e, t) {
	let n = e.ndim === 1 ? e : ge(e), r = t.ndim === 1 ? t : ge(t), i = Hi(n, r);
	if (i) return i;
	let a = n.size, o = r.size, c = h(e.dtype, t.dtype), l = z.zeros([a, o], c);
	if (c === "float16" && s && n.isCContiguous && r.isCContiguous) {
		let e = new Float32Array(n.data.subarray(n.offset, n.offset + a)), t = new Float32Array(r.data.subarray(r.offset, r.offset + o)), i = new Float32Array(a * o);
		for (let n = 0; n < a; n++) {
			let r = e[n], a = n * o;
			for (let e = 0; e < o; e++) i[a + e] = r * t[e];
		}
		return l.data.set(i), l;
	}
	for (let e = 0; e < a; e++) for (let t = 0; t < o; t++) {
		let i = Z(n.get(e), r.get(t));
		l.set([e, t], i);
	}
	return l;
}
function co(e, t, n) {
	let r, i;
	if (typeof n == "number") {
		let a = n;
		if (a < 0) throw Error("tensordot: axes must be non-negative");
		if (a > e.ndim || a > t.ndim) throw Error("tensordot: axes exceeds array dimensions");
		r = Array.from({ length: a }, (t, n) => e.ndim - a + n), i = Array.from({ length: a }, (e, t) => t);
	} else if ([r, i] = n, r.length !== i.length) throw Error("tensordot: axes lists must have same length");
	for (let n = 0; n < r.length; n++) {
		let a = r[n], o = i[n];
		if (a < 0 || a >= e.ndim || o < 0 || o >= t.ndim) throw Error("tensordot: axis out of bounds");
		if (e.shape[a] !== t.shape[o]) throw Error(`tensordot: shape mismatch on axes ${a} and ${o}: ${e.shape[a]} != ${t.shape[o]}`);
	}
	let a = [], o = [];
	for (let t = 0; t < e.ndim; t++) r.includes(t) || a.push(t);
	for (let e = 0; e < t.ndim; e++) i.includes(e) || o.push(e);
	let s = [...a.map((t) => e.shape[t]), ...o.map((e) => t.shape[e])], c = h(e.dtype, t.dtype), l = m(c), u = (e) => e instanceof g ? {
		re: e.re,
		im: e.im
	} : {
		re: Number(e),
		im: 0
	};
	if (s.length === 0) {
		let n = 0, a = 0, o = r.map((t) => e.shape[t]).reduce((e, t) => e * t, 1);
		for (let s = 0; s < o; s++) {
			let o = s, c = Array(r.length);
			for (let t = r.length - 1; t >= 0; t--) {
				let n = r[t];
				c[t] = o % e.shape[n], o = Math.floor(o / e.shape[n]);
			}
			let d = Array(e.ndim), f = Array(t.ndim);
			for (let e = 0; e < r.length; e++) d[r[e]] = c[e];
			for (let e = 0; e < i.length; e++) f[i[e]] = c[e];
			let p = e.get(...d), m = t.get(...f);
			if (l) {
				let e = u(p), t = u(m);
				n += e.re * t.re - e.im * t.im, a += e.re * t.im + e.im * t.re;
			} else typeof p == "bigint" && typeof m == "bigint" ? n += Number(p * m) : n += Number(p) * Number(m);
		}
		return l ? new g(n, a) : c === "bool" ? +!!n : n;
	}
	let d = z.zeros(s, c), f = s.reduce((e, t) => e * t, 1), p = r.map((t) => e.shape[t]).reduce((e, t) => e * t, 1);
	for (let n = 0; n < f; n++) {
		let f = n, m = [];
		for (let e = s.length - 1; e >= 0; e--) m[e] = f % s[e], f = Math.floor(f / s[e]);
		let h = m.slice(0, a.length), _ = m.slice(a.length), v = 0, y = 0;
		for (let n = 0; n < p; n++) {
			f = n;
			let s = [];
			for (let t = r.length - 1; t >= 0; t--) {
				let n = r[t];
				s[t] = f % e.shape[n], f = Math.floor(f / e.shape[n]);
			}
			let c = Array(e.ndim), d = Array(t.ndim);
			for (let e = 0; e < a.length; e++) c[a[e]] = h[e];
			for (let e = 0; e < o.length; e++) d[o[e]] = _[e];
			for (let e = 0; e < r.length; e++) c[r[e]] = s[e], d[i[e]] = s[e];
			let p = e.get(...c), m = t.get(...d);
			if (l) {
				let e = u(p), t = u(m);
				v += e.re * t.re - e.im * t.im, y += e.re * t.im + e.im * t.re;
			} else typeof p == "bigint" && typeof m == "bigint" ? v += Number(p * m) : v += Number(p) * Number(m);
		}
		l ? d.set(m, new g(v, y)) : c === "bool" ? d.set(m, +!!v) : d.set(m, v);
	}
	return d;
}
function lo(e, t = 0, n = 0, r = 1) {
	let i = e.shape, a = i.length;
	if (a < 2) throw Error("diagonal requires an array of at least two dimensions");
	let o = n < 0 ? a + n : n, s = r < 0 ? a + r : r;
	if (o < 0 || o >= a || s < 0 || s >= a) throw Error("axis out of bounds");
	if (o === s) throw Error("axis1 and axis2 cannot be the same");
	let c = i[o], l = i[s], u;
	u = t >= 0 ? Math.max(0, Math.min(c, l - t)) : Math.max(0, Math.min(c + t, l));
	let d = [];
	for (let e = 0; e < a; e++) e !== o && e !== s && d.push(i[e]);
	if (d.push(u), a === 2 && o === 0 && s === 1) {
		let n = e.offset + (t >= 0 ? t * e.strides[1] : -t * e.strides[0]), r = e.strides[0] + e.strides[1];
		return z.fromDataShared(e.data, [u], e.dtype, [r], n, e.wasmRegion);
	}
	let f = z.zeros(d, e.dtype), p = i.filter((e, t) => t !== o && t !== s), m = p.reduce((e, t) => e * t, 1);
	for (let n = 0; n < m; n++) {
		let r = n, i = [];
		for (let e = p.length - 1; e >= 0; e--) i.unshift(r % p[e]), r = Math.floor(r / p[e]);
		for (let n = 0; n < u; n++) {
			let r = Array(a), c = 0;
			for (let e = 0; e < a; e++) e === o ? r[e] = t >= 0 ? n : n - t : e === s ? r[e] = t >= 0 ? n + t : n : r[e] = i[c++];
			let l = [...i, n], u = e.get(...r);
			f.set(l, u);
		}
	}
	return f;
}
function uo(e, t, n = -1, r = -1, i = -1, a) {
	if (e.dtype === "bool" || t.dtype === "bool") throw TypeError("ufunc 'subtract' not supported for boolean dtype. The '-' operator is not supported for booleans, use 'bitwise_xor' instead.");
	a !== void 0 && (n = a, r = a, i = a);
	let o = (e, t) => e < 0 ? t + e : e, s = o(n, e.ndim), c = o(r, t.ndim), l = h(e.dtype, t.dtype), u = m(l), d = (e, ...t) => {
		let n = e.get(...t);
		return n instanceof g || typeof n == "bigint" ? n : Number(n);
	}, f = (e, t) => {
		if (e instanceof g || t instanceof g) {
			let n = e instanceof g ? e : new g(Number(e), 0), r = t instanceof g ? t : new g(Number(t), 0);
			return n.mul(r);
		}
		return typeof e == "bigint" || typeof t == "bigint" ? BigInt(e) * BigInt(t) : e * t;
	}, _ = (e, t) => {
		if (e instanceof g || t instanceof g) {
			let n = e instanceof g ? e : new g(Number(e), 0), r = t instanceof g ? t : new g(Number(t), 0);
			return n.sub(r);
		}
		return typeof e == "bigint" || typeof t == "bigint" ? BigInt(e) - BigInt(t) : e - t;
	};
	if (e.ndim === 1 && t.ndim === 1) {
		let n = e.shape[0], r = t.shape[0];
		if (n === 3 && r === 3) {
			let n = d(e, 0), r = d(e, 1), i = d(e, 2), a = d(t, 0), o = d(t, 1), s = d(t, 2), c = z.zeros([3], l);
			return c.set([0], _(f(r, s), f(i, o))), c.set([1], _(f(i, a), f(n, s))), c.set([2], _(f(n, o), f(r, a))), c;
		} else if (n === 2 && r === 2) {
			let n = d(e, 0), r = d(e, 1), i = d(t, 0);
			return _(f(n, d(t, 1)), f(r, i));
		} else if (n === 2 && r === 3 || n === 3 && r === 2) {
			let i = d(e, 0), a = d(e, 1), o = n === 3 ? d(e, 2) : u ? new g(0, 0) : p(l) ? 0n : 0, s = d(t, 0), c = d(t, 1), m = r === 3 ? d(t, 2) : u ? new g(0, 0) : p(l) ? 0n : 0, h = z.zeros([3], l);
			return h.set([0], _(f(a, m), f(o, c))), h.set([1], _(f(o, s), f(i, m))), h.set([2], _(f(i, c), f(a, s))), h;
		} else throw Error(`cross: incompatible dimensions for cross product: ${n} and ${r}`);
	}
	let v = e.shape[s], y = t.shape[c];
	if (v !== 2 && v !== 3 || y !== 2 && y !== 3) throw Error(`cross: incompatible dimensions for cross product: ${v} and ${y}`);
	let b = v === 2 && y === 2 ? 0 : 3, x = [...e.shape.slice(0, s), ...e.shape.slice(s + 1)], S = [...t.shape.slice(0, c), ...t.shape.slice(c + 1)];
	if (x.length !== S.length) throw Error("cross: incompatible shapes for cross product");
	for (let e = 0; e < x.length; e++) if (x[e] !== S[e]) throw Error("cross: incompatible shapes for cross product");
	let C = x;
	if (v === 3 && y === 3 && s === e.ndim - 1 && c === t.ndim - 1) {
		let n = Na(e, t, C.reduce((e, t) => e * t, 1));
		if (n) return n;
	}
	let w = i < 0 ? C.length + 1 + i : i, T;
	if (T = b === 0 ? C : [
		...C.slice(0, w),
		b,
		...C.slice(w)
	], T.length === 0) throw Error("cross: unexpected scalar result from higher-dimensional input");
	let E = z.zeros(T, l), D = C.reduce((e, t) => e * t, 1);
	for (let n = 0; n < D; n++) {
		let r = n, i = [];
		for (let e = C.length - 1; e >= 0; e--) i[e] = r % C[e], r = Math.floor(r / C[e]);
		let a = [
			...i.slice(0, s),
			0,
			...i.slice(s)
		], o = [
			...i.slice(0, c),
			0,
			...i.slice(c)
		], m = (t) => (a[s] = t, d(e, ...a)), h = (e) => (o[c] = e, d(t, ...o)), x = m(0), S = m(1), T = v === 3 ? m(2) : u ? new g(0, 0) : p(l) ? 0n : 0, D = h(0), O = h(1), k = y === 3 ? h(2) : u ? new g(0, 0) : p(l) ? 0n : 0;
		if (b === 0) E.set(i, _(f(x, O), f(S, D)));
		else {
			let e = _(f(S, k), f(T, O)), t = _(f(T, D), f(x, k)), n = _(f(x, O), f(S, D)), r = (e, t) => {
				let n = [
					...i.slice(0, w),
					e,
					...i.slice(w)
				];
				E.set(n, t);
			};
			r(0, e), r(1, t), r(2, n);
		}
	}
	return E;
}
function fo(e, t = 2, n, r = !1) {
	if (typeof t != "number") throw Error("vector_norm: ord must be a number");
	if (n == null) {
		let n = e.ndim === 1 ? e : ge(e), i = n.size, a, o = m(n.dtype);
		if (t === Infinity) {
			a = 0;
			for (let e = 0; e < i; e++) a = Math.max(a, Y(n.get(e)));
		} else if (t === -Infinity) {
			a = Infinity;
			for (let e = 0; e < i; e++) a = Math.min(a, Y(n.get(e)));
		} else if (t === 0) {
			a = 0;
			for (let e = 0; e < i; e++) {
				let t = n.get(e);
				(t instanceof g ? t.re === 0 && t.im === 0 : Number(t) === 0) || a++;
			}
		} else if (t === 1) {
			a = 0;
			for (let e = 0; e < i; e++) a += Y(n.get(e));
		} else if (t === 2) {
			let t = o ? null : tn(n);
			if (t !== null) n !== e && n.dispose(), a = t;
			else {
				a = 0;
				for (let e = 0; e < i; e++) {
					let t = Y(n.get(e));
					a += t * t;
				}
				a = Math.sqrt(a);
			}
		} else {
			a = 0;
			for (let e = 0; e < i; e++) a += Y(n.get(e)) ** +t;
			a **= 1 / t;
		}
		if (r) {
			let t = Array(e.ndim).fill(1), n = z.zeros(t, "float64");
			return n.set(Array(e.ndim).fill(0), a), n;
		}
		return a;
	}
	let i = n < 0 ? e.ndim + n : n;
	if (i < 0 || i >= e.ndim) throw Error(`vector_norm: axis ${n} out of bounds for array with ${e.ndim} dimensions`);
	let a = r ? [
		...e.shape.slice(0, i),
		1,
		...e.shape.slice(i + 1)
	] : [...e.shape.slice(0, i), ...e.shape.slice(i + 1)];
	if (a.length === 0) return fo(e, t, null, !1);
	let o = z.zeros(a, "float64"), s = e.shape[i], c = a.reduce((e, t) => e * t, 1);
	for (let n = 0; n < c; n++) {
		let c = n, l = [];
		for (let e = a.length - 1; e >= 0; e--) l[e] = c % a[e], c = Math.floor(c / a[e]);
		let u = r ? [
			...l.slice(0, i),
			0,
			...l.slice(i + 1)
		] : [
			...l.slice(0, i),
			0,
			...l.slice(i)
		], d;
		if (t === Infinity) {
			d = 0;
			for (let t = 0; t < s; t++) u[i] = t, d = Math.max(d, Y(e.get(...u)));
		} else if (t === -Infinity) {
			d = Infinity;
			for (let t = 0; t < s; t++) u[i] = t, d = Math.min(d, Y(e.get(...u)));
		} else if (t === 0) {
			d = 0;
			for (let t = 0; t < s; t++) {
				u[i] = t;
				let n = e.get(...u);
				(n instanceof g ? n.re === 0 && n.im === 0 : Number(n) === 0) || d++;
			}
		} else if (t === 1) {
			d = 0;
			for (let t = 0; t < s; t++) u[i] = t, d += Y(e.get(...u));
		} else if (t === 2) {
			d = 0;
			for (let t = 0; t < s; t++) {
				u[i] = t;
				let n = Y(e.get(...u));
				d += n * n;
			}
			d = Math.sqrt(d);
		} else {
			d = 0;
			for (let n = 0; n < s; n++) u[i] = n, d += Math.abs(Number(e.get(...u))) ** +t;
			d **= 1 / t;
		}
		o.set(l, d);
	}
	return o;
}
function po(e, t = "fro", n = !1) {
	if (e.ndim < 2) throw Error(`matrix_norm: input must be at least 2D, got ${e.ndim}D`);
	if (e.ndim > 2) {
		let r = Array.from(e.shape).slice(0, -2), i = e.shape[e.ndim - 2], a = e.shape[e.ndim - 1], o = r.reduce((e, t) => e * t, 1), s = z.empty(r, "float64"), c = s.data, l = Q(e);
		for (let e = 0; e < o; e++) {
			let n = e * i * a;
			c[e] = po(z.fromData(l.slice(n, n + i * a), [i, a], "float64"), t, !1);
		}
		return n ? B(s, [
			...r,
			1,
			1
		]) : s;
	}
	let [r, i] = e.shape, a;
	if (t === "fro") {
		a = 0;
		for (let t = 0; t < r; t++) for (let n = 0; n < i; n++) {
			let r = Y(e.get(t, n));
			a += r * r;
		}
		a = Math.sqrt(a);
	} else if (t === "nuc") {
		let { s: t } = _o(e);
		a = 0;
		for (let e = 0; e < t.size; e++) a += Number(t.get(e));
	} else if (t === 1) {
		a = 0;
		for (let t = 0; t < i; t++) {
			let n = 0;
			for (let i = 0; i < r; i++) n += Y(e.get(i, t));
			a = Math.max(a, n);
		}
	} else if (t === -1) {
		a = Infinity;
		for (let t = 0; t < i; t++) {
			let n = 0;
			for (let i = 0; i < r; i++) n += Y(e.get(i, t));
			a = Math.min(a, n);
		}
	} else if (t === Infinity) {
		a = 0;
		for (let t = 0; t < r; t++) {
			let n = 0;
			for (let r = 0; r < i; r++) n += Y(e.get(t, r));
			a = Math.max(a, n);
		}
	} else if (t === -Infinity) {
		a = Infinity;
		for (let t = 0; t < r; t++) {
			let n = 0;
			for (let r = 0; r < i; r++) n += Y(e.get(t, r));
			a = Math.min(a, n);
		}
	} else if (t === 2) {
		let { s: t } = _o(e);
		a = Number(t.get(0));
	} else if (t === -2) {
		let { s: t } = _o(e);
		a = Number(t.get(t.size - 1));
	} else throw Error(`matrix_norm: invalid ord value: ${t}`);
	if (n) {
		let e = z.zeros([1, 1], "float64");
		return e.set([0, 0], a), e;
	}
	return a;
}
function mo(e, t = null, n = null, r = !1) {
	if (t === null) {
		if (n === null) return fo(e, 2, null, r);
		if (typeof n == "number") return fo(e, 2, n, r);
		t = "fro";
	}
	if (Array.isArray(n)) {
		if (n.length !== 2) throw Error("norm: axis must be a 2-tuple for matrix norms");
		let i = n[0] < 0 ? e.ndim + n[0] : n[0], a = n[1] < 0 ? e.ndim + n[1] : n[1], o = t ?? "fro";
		if (e.ndim === 2) return po(e, o, r);
		let s = e.ndim, c = Array.from({ length: s }, (e, t) => t).filter((e) => e !== i && e !== a), l = c.map((t) => e.shape[t]), u = l.reduce((e, t) => e * t, 1) || 1, d = e.shape[i], f = e.shape[a], p = ao(e, [
			...c,
			i,
			a
		]), m = new Float64Array(u);
		for (let e = 0; e < u; e++) {
			let t = Array(l.length), n = e;
			for (let e = l.length - 1; e >= 0; e--) t[e] = n % l[e], n = Math.floor(n / l[e]);
			let r = z.zeros([d, f], "float64");
			for (let e = 0; e < d; e++) for (let n = 0; n < f; n++) r.set([e, n], Number(p.get(...t, e, n)));
			let i = po(r, o, !1);
			m[e] = typeof i == "number" ? i : Number(i);
		}
		if (r) {
			let t = Array.from(e.shape);
			return t[i] = 1, t[a] = 1, z.fromData(m, t, "float64");
		}
		return l.length === 0 ? m[0] : z.fromData(m, l, "float64");
	}
	if (e.ndim === 2 && n === null && (t === "fro" || t === "nuc")) return po(e, t, r);
	if (typeof t != "number" && t !== null) throw Error(`norm: ord '${t}' not valid for vector norm`);
	return fo(e, t ?? 2, n, r);
}
function ho(e, t = "reduced") {
	if (q(e.dtype), e.ndim > 2) {
		let n = e.shape.slice(0, -2), [r, i] = [e.shape[e.ndim - 2], e.shape[e.ndim - 1]], a = Math.min(r, i), o = n.reduce((e, t) => e * t, 1), s = t === "complete" ? r : a, c = z.zeros([
			...n,
			r,
			s
		], "float64"), l = z.zeros([
			...n,
			s,
			i
		], "float64");
		for (let a = 0; a < o; a++) {
			let o = to(a, n), u = z.zeros([r, i], "float64");
			for (let t = 0; t < r; t++) for (let n = 0; n < i; n++) u.set([t, n], X(e.get(...o, t, n)));
			let d = ho(u, t);
			for (let e = 0; e < r; e++) for (let t = 0; t < s; t++) c.set([
				...o,
				e,
				t
			], Number(d.q.get(e, t)));
			for (let e = 0; e < s; e++) for (let t = 0; t < i; t++) l.set([
				...o,
				e,
				t
			], Number(d.r.get(e, t)));
			u.dispose(), d.q.dispose(), d.r.dispose();
		}
		return {
			q: c,
			r: l
		};
	}
	if (e.ndim !== 2) throw Error(`qr: input must be 2D, got ${e.ndim}D`);
	if (t === "reduced") {
		let t = za(e);
		if (t) return t;
	}
	let [n, r] = e.shape, i = Math.min(n, r), a = z.zeros([n, r], "float64");
	for (let t = 0; t < n; t++) for (let n = 0; n < r; n++) a.set([t, n], X(e.get(t, n)));
	let o = [], s = [];
	for (let e = 0; e < i; e++) {
		let t = n - e, i = [];
		for (let t = e; t < n; t++) i.push(Number(a.get(t, e)));
		let c = 0;
		for (let e = 0; e < t; e++) c += i[e] * i[e];
		if (c = Math.sqrt(c), c < 1e-15) {
			o.push(i), s.push(0);
			continue;
		}
		let l = i[0] >= 0 ? 1 : -1, u = i[0] + l * c, d = [1];
		for (let e = 1; e < t; e++) d.push(i[e] / u);
		let f = l * u / c;
		s.push(f), o.push(d);
		for (let n = e; n < r; n++) {
			let r = 0;
			for (let i = 0; i < t; i++) r += d[i] * Number(a.get(e + i, n));
			for (let i = 0; i < t; i++) a.set([e + i, n], Number(a.get(e + i, n)) - f * d[i] * r);
		}
	}
	if (t === "raw") {
		let e = z.zeros([n, r], "float64");
		for (let t = 0; t < n; t++) for (let n = 0; n < r; n++) e.set([t, n], Number(a.get(t, n)));
		a.dispose();
		let t = z.zeros([i], "float64");
		for (let e = 0; e < i; e++) t.set([e], s[e]);
		return {
			h: e,
			tau: t
		};
	}
	if (t === "r") {
		let e = z.zeros([i, r], "float64");
		for (let t = 0; t < i; t++) for (let n = t; n < r; n++) e.set([t, n], Number(a.get(t, n)));
		return a.dispose(), e;
	}
	let c = t === "complete" ? n : i, l = z.zeros([n, c], "float64");
	for (let e = 0; e < Math.min(n, c); e++) l.set([e, e], 1);
	for (let e = i - 1; e >= 0; e--) {
		let t = o[e], r = s[e], i = n - e;
		for (let n = e; n < c; n++) {
			let a = 0;
			for (let r = 0; r < i; r++) a += t[r] * Number(l.get(e + r, n));
			for (let o = 0; o < i; o++) l.set([e + o, n], Number(l.get(e + o, n)) - r * t[o] * a);
		}
	}
	let u = z.zeros([n, c], "float64");
	for (let e = 0; e < n; e++) for (let t = 0; t < c; t++) u.set([e, t], Number(l.get(e, t)));
	l.dispose();
	let d = t === "complete" ? n : i, f = z.zeros([d, r], "float64");
	for (let e = 0; e < d; e++) for (let t = 0; t < r; t++) t >= e && f.set([e, t], Number(a.get(e, t)));
	return a.dispose(), {
		q: u,
		r: f
	};
}
function go(e, t = !1) {
	if (q(e.dtype), e.ndim < 2) throw Error(`cholesky: input must be at least 2D, got ${e.ndim}D`);
	if (e.ndim > 2) {
		let n = Array.from(e.shape).slice(0, -2), r = e.shape[e.ndim - 1], i = e.shape[e.ndim - 2];
		if (i !== r) throw Error(`cholesky: last 2 dimensions must be square, got ${i}x${r}`);
		let a = n.reduce((e, t) => e * t, 1), o = z.empty([
			...n,
			r,
			r
		], "float64"), s = o.data;
		for (let i = 0; i < a; i++) {
			let a = to(i, n), o = z.zeros([r, r], "float64");
			for (let t = 0; t < r; t++) for (let n = 0; n < r; n++) o.set([t, n], X(e.get(...a, t, n)));
			let c = go(o, t);
			s.set(Q(c), i * r * r), o.dispose(), c.dispose();
		}
		return o;
	}
	let [n, r] = e.shape;
	if (n !== r) throw Error(`cholesky: matrix must be square, got ${n}x${r}`);
	let i = e.dtype === "float32" ? qa(e) : Ka(e);
	if (i) {
		if (t) {
			let e = n, t = z.zeros([e, e], i.dtype);
			for (let n = 0; n < e; n++) for (let r = n; r < e; r++) t.set([n, r], Number(i.get(r, n)));
			return i.dispose(), t;
		}
		return i;
	}
	let a = n, o = z.zeros([a, a], "float64");
	for (let t = 0; t < a; t++) for (let n = 0; n <= t; n++) {
		let r = 0;
		if (t === n) {
			for (let e = 0; e < n; e++) r += Number(o.get(n, e)) ** 2;
			let t = X(e.get(n, n)) - r;
			if (t < 0) throw Error("cholesky: matrix is not positive definite");
			o.set([n, n], Math.sqrt(t));
		} else {
			for (let e = 0; e < n; e++) r += Number(o.get(t, e)) * Number(o.get(n, e));
			let i = Number(o.get(n, n));
			if (Math.abs(i) < 1e-15) throw Error("cholesky: matrix is not positive definite");
			o.set([t, n], (X(e.get(t, n)) - r) / i);
		}
	}
	if (t) {
		let e = z.zeros([a, a], "float64");
		for (let t = 0; t < a; t++) for (let n = t; n < a; n++) e.set([t, n], Number(o.get(n, t)));
		return e;
	}
	return o;
}
function _o(e) {
	if (e.ndim !== 2) throw Error(`svd: input must be 2D, got ${e.ndim}D`);
	let t = Lt(e);
	if (t) return t;
	let [n, r] = e.shape, i = Math.min(n, r), a = m(e.dtype), o = z.zeros([r, r], "float64");
	for (let t = 0; t < r; t++) for (let i = 0; i < r; i++) {
		let r = 0;
		for (let o = 0; o < n; o++) {
			let n = e.get(o, t), s = e.get(o, i);
			if (a) {
				let e = n instanceof g ? n : new g(Number(n), 0), t = s instanceof g ? s : new g(Number(s), 0);
				r += e.re * t.re + e.im * t.im;
			} else r += Number(n) * Number(s);
		}
		o.set([t, i], r);
	}
	let { values: s, vectors: c } = vo(o);
	o.dispose();
	let l = Array.from({ length: r }, (e, t) => t);
	l.sort((e, t) => s[t] - s[e]);
	let u = z.zeros([i], "float64");
	for (let e = 0; e < i; e++) {
		let t = s[l[e]];
		u.set([e], Math.sqrt(Math.max(0, t)));
	}
	let d = z.zeros([r, r], "float64");
	for (let e = 0; e < r; e++) for (let t = 0; t < r; t++) d.set([e, t], c[t][l[e]]);
	let f = z.zeros([n, n], "float64");
	for (let t = 0; t < n; t++) for (let n = 0; n < i; n++) {
		let i = Number(u.get(n));
		if (i > 1e-10) {
			let o = 0;
			for (let i = 0; i < r; i++) {
				let r = e.get(t, i), s = Number(d.get(n, i));
				if (a) {
					let e = r instanceof g ? r : new g(Number(r), 0);
					o += e.re * s;
				} else o += Number(r) * s;
			}
			f.set([t, n], o / i);
		}
	}
	if (n > i) for (let e = i; e < n; e++) {
		let t = Array(n).fill(0);
		t[e] = 1;
		for (let r = 0; r < e; r++) {
			let e = 0;
			for (let i = 0; i < n; i++) e += t[i] * Number(f.get(i, r));
			for (let i = 0; i < n; i++) t[i] = t[i] - e * Number(f.get(i, r));
		}
		let r = 0;
		for (let e = 0; e < n; e++) r += t[e] * t[e];
		if (r = Math.sqrt(r), r > 1e-10) for (let i = 0; i < n; i++) f.set([i, e], t[i] / r);
	}
	return {
		u: f,
		s: u,
		vt: d
	};
}
function vo(e) {
	let t = e.shape[0], n = 100 * t * t, r = [];
	for (let n = 0; n < t; n++) {
		r.push([]);
		for (let i = 0; i < t; i++) r[n].push(X(e.get(n, i)));
	}
	let i = [];
	for (let e = 0; e < t; e++) {
		i.push([]);
		for (let n = 0; n < t; n++) i[e].push(+(e === n));
	}
	for (let e = 0; e < n; e++) {
		let e = 0, n = 0, a = 1;
		for (let i = 0; i < t; i++) for (let o = i + 1; o < t; o++) Math.abs(r[i][o]) > e && (e = Math.abs(r[i][o]), n = i, a = o);
		if (e < 1e-10) break;
		let o = r[n][n], s = r[a][a], c = r[n][a], l;
		l = Math.abs(o - s) < 1e-15 ? Math.PI / 4 : .5 * Math.atan2(2 * c, s - o);
		let u = Math.cos(l), d = Math.sin(l), f = u * u * o + d * d * s - 2 * d * u * c, p = d * d * o + u * u * s + 2 * d * u * c;
		r[n][n] = f, r[a][a] = p, r[n][a] = 0, r[a][n] = 0;
		for (let e = 0; e < t; e++) if (e !== n && e !== a) {
			let t = r[e][n], i = r[e][a];
			r[e][n] = u * t - d * i, r[n][e] = r[e][n], r[e][a] = d * t + u * i, r[a][e] = r[e][a];
		}
		for (let e = 0; e < t; e++) {
			let t = i[e][n], r = i[e][a];
			i[e][n] = u * t - d * r, i[e][a] = d * t + u * r;
		}
	}
	let a = [];
	for (let e = 0; e < t; e++) a.push(r[e][e]);
	return {
		values: a,
		vectors: i
	};
}
function yo(e, t = !0, n = !0) {
	if (q(e.dtype), e.ndim > 2) {
		let r = e.shape.slice(0, -2), [i, a] = [e.shape[e.ndim - 2], e.shape[e.ndim - 1]], o = Math.min(i, a), s = r.reduce((e, t) => e * t, 1);
		if (!n) {
			let t = z.zeros([...r, o], "float64");
			for (let n = 0; n < s; n++) {
				let s = to(n, r), c = z.zeros([i, a], e.dtype);
				for (let t = 0; t < i; t++) for (let n = 0; n < a; n++) c.set([t, n], e.get(...s, t, n));
				let { u: l, s: u, vt: d } = _o(c);
				for (let e = 0; e < o; e++) t.set([...s, e], Number(u.get(e)));
				c.dispose(), l.dispose(), u.dispose(), d.dispose();
			}
			return t;
		}
		let c = t ? i : o, l = t ? a : o, u = z.zeros([
			...r,
			i,
			c
		], "float64"), d = z.zeros([...r, o], "float64"), f = z.zeros([
			...r,
			l,
			a
		], "float64");
		for (let n = 0; n < s; n++) {
			let s = to(n, r), p = z.zeros([i, a], e.dtype);
			for (let t = 0; t < i; t++) for (let n = 0; n < a; n++) p.set([t, n], e.get(...s, t, n));
			let m = yo(p, t, !0);
			for (let e = 0; e < i; e++) for (let t = 0; t < c; t++) u.set([
				...s,
				e,
				t
			], Number(m.u.get(e, t)));
			for (let e = 0; e < o; e++) d.set([...s, e], Number(m.s.get(e)));
			for (let e = 0; e < l; e++) for (let t = 0; t < a; t++) f.set([
				...s,
				e,
				t
			], Number(m.vt.get(e, t)));
			p.dispose(), m.u.dispose(), m.s.dispose(), m.vt.dispose();
		}
		return {
			u,
			s: d,
			vt: f
		};
	}
	let r = _o(e);
	if (!n) return r.u.dispose(), r.vt.dispose(), r.s;
	if (!t) {
		let [t, n] = e.shape, i = Math.min(t, n), a = z.zeros([t, i], "float64");
		for (let e = 0; e < t; e++) for (let t = 0; t < i; t++) a.set([e, t], Number(r.u.get(e, t)));
		r.u.dispose();
		let o = z.zeros([i, n], "float64");
		for (let e = 0; e < i; e++) for (let t = 0; t < n; t++) o.set([e, t], Number(r.vt.get(e, t)));
		return r.vt.dispose(), {
			u: a,
			s: r.s,
			vt: o
		};
	}
	return r;
}
function bo(e) {
	if (q(e.dtype), e.ndim < 2) throw Error(`det: input must be at least 2D, got ${e.ndim}D`);
	let t = m(e.dtype);
	if (e.ndim > 2) {
		let n = Array.from(e.shape).slice(0, -2), r = e.shape[e.ndim - 1], i = e.shape[e.ndim - 2];
		if (i !== r) throw Error(`det: last 2 dimensions must be square, got ${i}x${r}`);
		let a = n.reduce((e, t) => e * t, 1);
		if (t) {
			let t = e.dtype, i = z.zeros(n, t);
			for (let o = 0; o < a; o++) {
				let a = [], s = o;
				for (let e = n.length - 1; e >= 0; e--) a[e] = s % n[e], s = Math.floor(s / n[e]);
				let c = z.zeros([r, r], t);
				for (let t = 0; t < r; t++) for (let n = 0; n < r; n++) c.set([t, n], e.get(...a, t, n));
				let l = bo(c);
				i.iset(o, l), c.dispose();
			}
			return i;
		}
		let o = z.empty(n, "float64"), s = o.data, c = Q(e);
		for (let e = 0; e < a; e++) {
			let t = e * r * r, n = z.fromData(c.slice(t, t + r * r), [r, r], "float64");
			try {
				s[e] = bo(n);
			} finally {
				n.dispose();
			}
		}
		return o;
	}
	let [n, r] = e.shape;
	if (n !== r) throw Error(`det: matrix must be square, got ${n}x${r}`);
	let i = n;
	if (i === 0) return t ? new g(1, 0) : 1;
	if (t) {
		if (i === 1) return e.get(0, 0);
		if (i === 2) {
			let t = e.get(0, 0), n = e.get(0, 1), r = e.get(1, 0), i = e.get(1, 1);
			return t.mul(i).sub(n.mul(r));
		}
		let { lu: t, sign: n } = xo(e);
		try {
			let e = t.data, r = n, a = 0;
			for (let t = 0; t < i; t++) {
				let n = (t * i + t) * 2, o = e[n], s = e[n + 1], c = r * o - a * s, l = r * s + a * o;
				r = c, a = l;
			}
			return new g(r, a);
		} finally {
			t.dispose();
		}
	}
	let a = e.data;
	if (i === 1) return Number(a[0]);
	if (i === 2) return Number(a[0]) * Number(a[3]) - Number(a[1]) * Number(a[2]);
	if (e.dtype === "float64" || e.dtype === "float32") {
		let t = Ti(e);
		if (t) {
			let e = t.lu.data, n = t.sign;
			for (let t = 0; t < i; t++) n *= e[t * i + t];
			return t.lu.dispose(), n;
		}
	}
	let { lu: o, sign: s } = xo(e);
	try {
		let e = o.data, t = s;
		for (let n = 0; n < i; n++) t *= e[n * i + n];
		return t;
	} finally {
		o.dispose();
	}
}
function xo(e) {
	let [t, n] = e.shape, r = t, i = n;
	if (m(e.dtype)) return So(e, r, i);
	let a = z.zeros([r, i], "float64"), o = a.data, s = e.data;
	for (let e = 0; e < r * i; e++) o[e] = Number(s[e]);
	let c = Array.from({ length: r }, (e, t) => t), l = 1;
	for (let e = 0; e < Math.min(r, i); e++) {
		let t = Math.abs(o[e * i + e]), n = e;
		for (let a = e + 1; a < r; a++) {
			let r = Math.abs(o[a * i + e]);
			r > t && (t = r, n = a);
		}
		if (n !== e) {
			for (let t = 0; t < i; t++) {
				let r = o[e * i + t];
				o[e * i + t] = o[n * i + t], o[n * i + t] = r;
			}
			let t = c[e];
			c[e] = c[n], c[n] = t, l = -l;
		}
		let a = o[e * i + e];
		if (Math.abs(a) > 1e-15) for (let t = e + 1; t < r; t++) {
			let n = o[t * i + e] / a;
			o[t * i + e] = n;
			for (let r = e + 1; r < i; r++) o[t * i + r] = o[t * i + r] - n * o[e * i + r];
		}
	}
	return {
		lu: a,
		piv: c,
		sign: l
	};
}
function So(e, t, n) {
	let r = z.zeros([t, n], "complex128"), i = r.data;
	for (let r = 0; r < t; r++) for (let t = 0; t < n; t++) {
		let a = e.get(r, t), o = (r * n + t) * 2;
		a instanceof g ? (i[o] = a.re, i[o + 1] = a.im) : (i[o] = Number(a), i[o + 1] = 0);
	}
	let a = Array.from({ length: t }, (e, t) => t), o = 1;
	for (let e = 0; e < Math.min(t, n); e++) {
		let r = (e * n + e) * 2, s = Math.sqrt(i[r] * i[r] + i[r + 1] * i[r + 1]), c = e;
		for (let r = e + 1; r < t; r++) {
			let t = (r * n + e) * 2, a = Math.sqrt(i[t] * i[t] + i[t + 1] * i[t + 1]);
			a > s && (s = a, c = r);
		}
		if (c !== e) {
			for (let t = 0; t < n; t++) {
				let r = (e * n + t) * 2, a = (c * n + t) * 2, o = i[r], s = i[r + 1];
				i[r] = i[a], i[r + 1] = i[a + 1], i[a] = o, i[a + 1] = s;
			}
			let t = a[e];
			a[e] = a[c], a[c] = t, o = -o;
		}
		let l = (e * n + e) * 2, u = i[l], d = i[l + 1], f = u * u + d * d;
		if (f > 1e-30) for (let r = e + 1; r < t; r++) {
			let t = (r * n + e) * 2, a = i[t], o = i[t + 1], s = (a * u + o * d) / f, c = (o * u - a * d) / f;
			i[t] = s, i[t + 1] = c;
			for (let t = e + 1; t < n; t++) {
				let a = (r * n + t) * 2, o = (e * n + t) * 2, l = i[o], u = i[o + 1];
				i[a] = i[a] - (s * l - c * u), i[a + 1] = i[a + 1] - (s * u + c * l);
			}
		}
	}
	return {
		lu: r,
		piv: a,
		sign: o
	};
}
function Co(e) {
	if (q(e.dtype), e.ndim < 2) throw Error(`inv: input must be at least 2D, got ${e.ndim}D`);
	let t = m(e.dtype);
	if (e.ndim > 2) {
		let n = Array.from(e.shape).slice(0, -2), r = e.shape[e.ndim - 1], i = e.shape[e.ndim - 2];
		if (i !== r) throw Error(`inv: last 2 dimensions must be square, got ${i}x${r}`);
		let a = n.reduce((e, t) => e * t, 1);
		if (t) {
			let t = e.dtype, i = z.zeros(Array.from(e.shape), t);
			for (let o = 0; o < a; o++) {
				let a = [], s = o;
				for (let e = n.length - 1; e >= 0; e--) a[e] = s % n[e], s = Math.floor(s / n[e]);
				let c = z.zeros([r, r], t);
				for (let t = 0; t < r; t++) for (let n = 0; n < r; n++) c.set([t, n], e.get(...a, t, n));
				let l = Co(c);
				for (let e = 0; e < r; e++) for (let t = 0; t < r; t++) i.set([
					...a,
					e,
					t
				], l.get(e, t));
				c.dispose(), l.dispose();
			}
			return i;
		}
		let o = Q(e), s = z.empty(Array.from(e.shape), "float64"), c = s.data;
		for (let e = 0; e < a; e++) {
			let t = e * r * r, n = z.fromData(o.slice(t, t + r * r), [r, r], "float64"), i = Co(n), a = i.data;
			for (let e = 0; e < r * r; e++) c[t + e] = a[e];
			n.dispose(), i.dispose();
		}
		return s;
	}
	let [n, r] = e.shape;
	if (n !== r) throw Error(`inv: matrix must be square, got ${n}x${r}`);
	let i = n;
	if (t) return wo(e, i);
	if (e.dtype === "float64" || e.dtype === "float32") {
		let t = Ti(e);
		if (t) {
			let { lu: n, piv: r } = t, a = n.data;
			for (let e = 0; e < i; e++) if (Math.abs(a[e * i + e]) < 1e-15) throw n.dispose(), /* @__PURE__ */ Error("inv: singular matrix");
			let o = Ei(n, r, e.dtype);
			if (n.dispose(), o) return o;
		}
	}
	let { lu: a, piv: o } = xo(e), s = a.data, c = z.zeros([i, i], "float64"), l = c.data;
	for (let e = 0; e < i; e++) {
		let t = new Float64Array(i);
		for (let n = 0; n < i; n++) {
			let r = +(o[n] === e);
			for (let e = 0; e < n; e++) r -= s[n * i + e] * t[e];
			t[n] = r;
		}
		for (let n = i - 1; n >= 0; n--) {
			let r = t[n];
			for (let t = n + 1; t < i; t++) r -= s[n * i + t] * l[t * i + e];
			let a = s[n * i + n];
			if (Math.abs(a) < 1e-15) throw Error("inv: singular matrix");
			l[n * i + e] = r / a;
		}
	}
	return a.dispose(), c;
}
function wo(e, t) {
	let { lu: n, piv: r } = xo(e), i = n.data;
	for (let e = 0; e < t; e++) {
		let r = (e * t + e) * 2;
		if (i[r] * i[r] + i[r + 1] * i[r + 1] < 1e-30) throw n.dispose(), /* @__PURE__ */ Error("inv: singular matrix");
	}
	let a = e.dtype === "complex64" ? "complex64" : "complex128", o = z.zeros([t, t], a), s = o.data;
	for (let e = 0; e < t; e++) {
		let n = new Float64Array(t), a = new Float64Array(t);
		for (let o = 0; o < t; o++) {
			let s = +(r[o] === e), c = 0;
			for (let e = 0; e < o; e++) {
				let r = (o * t + e) * 2, l = i[r], u = i[r + 1];
				s -= l * n[e] - u * a[e], c -= l * a[e] + u * n[e];
			}
			n[o] = s, a[o] = c;
		}
		for (let r = t - 1; r >= 0; r--) {
			let o = n[r], c = a[r];
			for (let n = r + 1; n < t; n++) {
				let a = (r * t + n) * 2, l = i[a], u = i[a + 1], d = (n * t + e) * 2, f = s[d], p = s[d + 1];
				o -= l * f - u * p, c -= l * p + u * f;
			}
			let l = (r * t + r) * 2, u = i[l], d = i[l + 1], f = u * u + d * d, p = (r * t + e) * 2;
			s[p] = (o * u + c * d) / f, s[p + 1] = (c * u - o * d) / f;
		}
	}
	return n.dispose(), o;
}
function To(e, t) {
	let [n] = e.shape, r = n;
	if (m(e.dtype) || m(t.dtype)) return Eo(e, t, r);
	let { lu: i, piv: a } = xo(e);
	try {
		let e = i.data, n = t.data, o = new Float64Array(r);
		for (let e = 0; e < r; e++) o[e] = Number(n[a[e]]);
		let s = new Float64Array(r);
		for (let t = 0; t < r; t++) {
			let n = o[t];
			for (let i = 0; i < t; i++) n -= e[t * r + i] * s[i];
			s[t] = n;
		}
		let c = z.zeros([r], "float64"), l = c.data;
		for (let t = r - 1; t >= 0; t--) {
			let n = s[t];
			for (let i = t + 1; i < r; i++) n -= e[t * r + i] * l[i];
			let i = e[t * r + t];
			if (Math.abs(i) < 1e-15) throw Error("solve: singular matrix");
			l[t] = n / i;
		}
		return c;
	} finally {
		i.dispose();
	}
}
function Eo(e, t, n) {
	let { lu: r, piv: i } = xo(e);
	try {
		let a = r.data, o = new Float64Array(n), s = new Float64Array(n);
		for (let e = 0; e < n; e++) {
			let n = t.get(i[e]);
			n instanceof g ? (o[e] = n.re, s[e] = n.im) : (o[e] = Number(n), s[e] = 0);
		}
		let c = new Float64Array(n), l = new Float64Array(n);
		for (let e = 0; e < n; e++) {
			let t = o[e], r = s[e];
			for (let i = 0; i < e; i++) {
				let o = (e * n + i) * 2, s = a[o], u = a[o + 1];
				t -= s * c[i] - u * l[i], r -= s * l[i] + u * c[i];
			}
			c[e] = t, l[e] = r;
		}
		let u = m(e.dtype) ? e.dtype : m(t.dtype) ? t.dtype : "complex128", d = z.zeros([n], u), f = d.data;
		for (let e = n - 1; e >= 0; e--) {
			let t = c[e], r = l[e];
			for (let i = e + 1; i < n; i++) {
				let o = (e * n + i) * 2, s = a[o], c = a[o + 1], l = f[i * 2], u = f[i * 2 + 1];
				t -= s * l - c * u, r -= s * u + c * l;
			}
			let i = (e * n + e) * 2, o = a[i], s = a[i + 1], u = o * o + s * s;
			if (u < 1e-30) throw Error("solve: singular matrix");
			f[e * 2] = (t * o + r * s) / u, f[e * 2 + 1] = (r * o - t * s) / u;
		}
		return d;
	} finally {
		r.dispose();
	}
}
function Do(e, t) {
	if (q(e.dtype), e.ndim !== 2) throw Error(`solve: coefficient matrix must be 2D, got ${e.ndim}D`);
	let [n, r] = e.shape;
	if (n !== r) throw Error(`solve: coefficient matrix must be square, got ${n}x${r}`);
	let i = n;
	if ((e.dtype === "float64" || e.dtype === "float32") && t.isCContiguous) {
		let a = Ti(e);
		if (a) {
			let { lu: o, piv: s } = a, c = e.dtype;
			if (t.ndim === 1) {
				if (t.shape[0] !== i) throw o.dispose(), /* @__PURE__ */ Error(`solve: incompatible shapes (${n},${r}) and (${t.shape[0]},)`);
				let e = t.dtype === c ? t : z.fromData(new (c === "float32" ? Float32Array : Float64Array)(Array.from({ length: i }, (e, n) => Number(t.iget(n)))), [i], c), a = Di(o, s, e, c);
				if (o.dispose(), e !== t && e.dispose(), a) return a;
			}
			if (t.ndim === 2) {
				if (t.shape[0] !== i) throw o.dispose(), /* @__PURE__ */ Error(`solve: incompatible shapes (${n},${r}) and (${t.shape[0]},${t.shape[1]})`);
				let e = t.shape[1], a = c === "float32" ? Float32Array : Float64Array, l = z.empty([i, e], c), u = l.data, d = t.data;
				for (let n = 0; n < e; n++) {
					let r = new a(i);
					for (let a = 0; a < i; a++) r[a] = Number(d[t.offset + a * e + n]);
					let l = z.fromData(r, [i], c), f = Di(o, s, l, c);
					if (l.dispose(), f) {
						let t = f.data;
						for (let r = 0; r < i; r++) u[r * e + n] = t[r];
						f.dispose();
					}
				}
				return o.dispose(), l;
			}
			o.dispose();
		}
	}
	if (t.ndim === 1) {
		if (t.shape[0] !== i) throw Error(`solve: incompatible shapes (${n},${r}) and (${t.shape[0]},)`);
		return To(e, t);
	}
	if (t.ndim === 2) {
		if (t.shape[0] !== i) throw Error(`solve: incompatible shapes (${n},${r}) and (${t.shape[0]},${t.shape[1]})`);
		let a = m(e.dtype) || m(t.dtype), o = t.shape[1], s = a ? m(e.dtype) ? e.dtype : t.dtype : "float64", c = z.zeros([i, o], s);
		for (let n = 0; n < o; n++) {
			let r = m(t.dtype) ? t.dtype : a ? "complex128" : "float64", o = z.zeros([i], r);
			for (let e = 0; e < i; e++) o.set([e], t.get(e, n));
			let s = To(e, o);
			for (let e = 0; e < i; e++) c.set([e, n], s.get(e));
			o.dispose(), s.dispose();
		}
		return c;
	}
	throw Error(`solve: b must be 1D or 2D, got ${t.ndim}D`);
}
function Oo(e, t, n = null) {
	if (q(e.dtype), e.ndim !== 2) throw Error(`lstsq: coefficient matrix must be 2D, got ${e.ndim}D`);
	let [r, i] = e.shape, a = Math.min(r, i), o = t.ndim === 1 ? B(t, [t.size, 1]) : t, s = o.shape[1];
	if (o.shape[0] !== r) throw Error(`lstsq: incompatible shapes (${r},${i}) and (${t.shape.join(",")})`);
	let { u: c, s: l, vt: u } = _o(e);
	try {
		let d = l.data, f = c.data, p = u.data, m = n ?? Math.max(r, i) * 2 ** -52, h = d[0] * m, g = 0;
		for (let e = 0; e < a; e++) d[e] > h && g++;
		let _ = z.zeros([i, a], "float64"), v = _.data;
		for (let e = 0; e < a; e++) {
			let t = d[e];
			if (t > h) {
				let n = 1 / t;
				for (let t = 0; t < i; t++) v[t * a + e] = p[e * i + t] * n;
			}
		}
		let y = z.empty([a, r], "float64"), b = y.data;
		for (let e = 0; e < a; e++) for (let t = 0; t < r; t++) b[e * r + t] = f[t * r + e];
		let x = Tt(y, o) ?? $a(y, o), S = Tt(_, x) ?? $a(_, x);
		_.dispose(), y.dispose(), x.dispose();
		let C;
		if (r > i && g === i) {
			C = z.empty([s], "float64");
			let n = C.data, a = t.ndim === 1 ? B(S, [i, 1]) : S, c = Tt(e, a) ?? $a(e, a);
			a !== S && a.dispose();
			let l = c.data;
			for (let e = 0; e < s; e++) {
				let t = 0;
				for (let n = 0; n < r; n++) {
					let r = l[n * s + e] - Number(o.iget(n * s + e));
					t += r * r;
				}
				n[e] = t;
			}
			c.dispose();
		} else C = z.zeros([0], "float64");
		let w = t.ndim === 1 ? B(S, [i]) : S;
		return w !== S && S.dispose(), o !== t && o.dispose(), {
			x: w,
			residuals: C,
			rank: g,
			s: l
		};
	} finally {
		c.dispose(), u.dispose();
	}
}
function ko(e, t = 2) {
	if (q(e.dtype), e.ndim !== 2) throw Error(`cond: input must be 2D, got ${e.ndim}D`);
	let [n, r] = e.shape;
	if (t === 2 || t === -2) {
		let i = Ho(e);
		try {
			let e = Math.min(n, r), a = Number(i.get(0)), o = Number(i.get(e - 1));
			return t === 2 ? o > 0 ? a / o : Infinity : a > 0 ? o / a : 0;
		} finally {
			i.dispose();
		}
	}
	if (n !== r) throw Error(`cond: matrix must be square for p=${t}`);
	let i = po(e, t), a = Co(e);
	try {
		return i * po(a, t);
	} finally {
		a.dispose();
	}
}
function Ao(e, t) {
	if (q(e.dtype), e.ndim === 0) return Y(e.get()) === 0 ? 0 : 1;
	if (e.ndim === 1) {
		for (let t = 0; t < e.size; t++) if (Y(e.get(t)) !== 0) return 1;
		return 0;
	}
	if (e.ndim !== 2) throw Error(`matrix_rank: input must be at most 2D, got ${e.ndim}D`);
	let n = Ho(e);
	try {
		let r = Number(n.get(0)), i = t ?? r * Math.max(e.shape[0], e.shape[1]) * 2 ** -52, a = 0;
		for (let e = 0; e < n.size; e++) Number(n.get(e)) > i && a++;
		return a;
	} finally {
		n.dispose();
	}
}
function jo(e, t) {
	if (e.ndim !== 2) throw Error(`matrix_power: input must be 2D, got ${e.ndim}D`);
	let [n, r] = e.shape;
	if (n !== r) throw Error(`matrix_power: matrix must be square, got ${n}x${r}`);
	let i = n;
	if (!Number.isInteger(t)) throw Error("matrix_power: exponent must be an integer");
	let a = m(e.dtype), o = p(e.dtype), s = a ? e.dtype : e.dtype === "float32" ? "float32" : o ? e.dtype : "float64", c = a ? new g(1, 0) : o ? 1n : 1;
	if (t === 0) {
		let e = z.zeros([i, i], s);
		for (let t = 0; t < i; t++) e.set([t, t], c);
		return e;
	}
	let l = e, u = t;
	t < 0 && (l = Co(e), u = -t);
	let d = z.zeros([i, i], s);
	for (let e = 0; e < i; e++) d.set([e, e], c);
	let f;
	if (l.isCContiguous && l.dtype === s) f = l.copy();
	else {
		f = z.zeros([i, i], s);
		for (let e = 0; e < i; e++) for (let t = 0; t < i; t++) f.set([e, t], l.get(e, t));
	}
	try {
		for (; u > 0;) {
			if (u & 1) {
				let e = d;
				d = $(d, f), e.dispose();
			}
			if (u >>= 1, u) {
				let e = f;
				f = $(f, f), e.dispose();
			}
		}
		return d;
	} finally {
		f.dispose(), t < 0 && l.dispose();
	}
}
function Mo(e, t = 1e-15) {
	if (q(e.dtype), e.ndim < 2) throw Error(`pinv: input must be at least 2D, got ${e.ndim}D`);
	if (e.ndim > 2) {
		let n = Array.from(e.shape).slice(0, -2), r = e.shape[e.ndim - 2], i = e.shape[e.ndim - 1], a = n.reduce((e, t) => e * t, 1), o = z.empty([
			...n,
			i,
			r
		], "float64"), s = o.data, c = Q(e);
		for (let e = 0; e < a; e++) {
			let n = e * r * i, a = z.fromData(c.slice(n, n + r * i), [r, i], "float64"), o = Mo(a, t);
			try {
				s.set(Q(o), e * i * r);
			} finally {
				a.dispose(), o.dispose();
			}
		}
		return o;
	}
	let [n, r] = e.shape, { u: i, s: a, vt: o } = _o(e);
	try {
		let e = Math.min(n, r), s = a.data, c = s[0] * t, l = z.zeros([r, e], "float64"), u = l.data;
		for (let t = 0; t < e; t++) {
			let n = s[t];
			if (n > c) {
				let i = 1 / n;
				for (let n = 0; n < r; n++) u[n * e + t] = o.data[t * r + n] * i;
			}
		}
		let d = z.empty([e, n], "float64"), f = d.data, p = i.data;
		for (let t = 0; t < e; t++) for (let e = 0; e < n; e++) f[t * n + e] = p[e * n + t];
		let m = Tt(l, d) ?? $a(l, d);
		return l.dispose(), d.dispose(), m;
	} finally {
		i.dispose(), a.dispose(), o.dispose();
	}
}
function No(e) {
	if (q(e.dtype), e.ndim < 2) throw Error(`eig: input must be at least 2D, got ${e.ndim}D`);
	if (e.ndim > 2) {
		let t = Array.from(e.shape).slice(0, -2), n = e.shape[e.ndim - 1], r = e.shape[e.ndim - 2];
		if (r !== n) throw Error(`eig: last 2 dimensions must be square, got ${r}x${n}`);
		let i = t.reduce((e, t) => e * t, 1), a = z.empty([...t, n], "float64"), o = z.empty([
			...t,
			n,
			n
		], "float64"), s = a.data, c = o.data;
		for (let r = 0; r < i; r++) {
			let i = to(r, t), a = z.zeros([n, n], "float64");
			for (let t = 0; t < n; t++) for (let r = 0; r < n; r++) a.set([t, r], X(e.get(...i, t, r)));
			let { w: o, v: l } = No(a);
			s.set(Q(o), r * n), c.set(Q(l), r * n * n), a.dispose(), o.dispose(), l.dispose();
		}
		return {
			w: a,
			v: o
		};
	}
	let [t, n] = e.shape;
	if (t !== n) throw Error(`eig: matrix must be square, got ${t}x${n}`);
	let r = t, i = !0;
	t: for (let t = 0; t < r; t++) for (let n = t + 1; n < r; n++) if (Math.abs(X(e.get(t, n)) - X(e.get(n, t))) > 1e-10) {
		i = !1;
		break t;
	}
	if (i) {
		let { values: t, vectors: n } = vo(e), i = z.zeros([r], "float64"), a = z.zeros([r, r], "float64");
		for (let e = 0; e < r; e++) {
			i.set([e], t[e]);
			for (let t = 0; t < r; t++) a.set([t, e], n[t][e]);
		}
		return {
			w: i,
			v: a
		};
	}
	let { values: a, vectors: o, hasComplexEigenvalues: s } = Po(e);
	s && console.warn("numpy-ts: eig() detected complex eigenvalues which cannot be represented. Results are real approximations and may be inaccurate. For symmetric matrices, use eigh() instead.");
	let c = z.zeros([r], "float64"), l = z.zeros([r, r], "float64");
	for (let e = 0; e < r; e++) {
		c.set([e], a[e]);
		for (let t = 0; t < r; t++) l.set([t, e], o[t][e]);
	}
	return {
		w: c,
		v: l
	};
}
function Po(e) {
	let t = e.shape[0], n = z.zeros([t, t], "float64");
	for (let r = 0; r < t; r++) for (let i = 0; i < t; i++) n.set([r, i], X(e.get(r, i)));
	let r = z.zeros([t, t], "float64");
	for (let e = 0; e < t; e++) r.set([e, e], 1);
	for (let e = 0; e < 1e3; e++) {
		let e = 0;
		for (let r = 0; r < t; r++) for (let i = 0; i < t; i++) r !== i && (e += Number(n.get(r, i)) ** 2);
		if (Math.sqrt(e) < 1e-10 * t) break;
		let i = ho(n, "reduced"), a = i.q, o = i.r;
		n = $(o, a), r = $(r, a);
	}
	let i = !1;
	for (let e = 0; e < t - 1; e++) {
		let t = Math.abs(Number(n.get(e + 1, e))), r = Math.abs(Number(n.get(e, e))), a = Math.abs(Number(n.get(e + 1, e + 1)));
		if (t / Math.max(r, a, 1e-10) > 1e-6) {
			i = !0;
			break;
		}
	}
	let a = [];
	for (let e = 0; e < t; e++) a.push(Number(n.get(e, e)));
	let o = [];
	for (let e = 0; e < t; e++) {
		o.push([]);
		for (let n = 0; n < t; n++) o[e].push(Number(r.get(e, n)));
	}
	return {
		values: a,
		vectors: o,
		hasComplexEigenvalues: i
	};
}
function Fo(e, t = "L") {
	if (q(e.dtype), e.ndim < 2) throw Error(`eigh: input must be at least 2D, got ${e.ndim}D`);
	if (e.ndim > 2) {
		let n = Array.from(e.shape).slice(0, -2), r = e.shape[e.ndim - 1], i = e.shape[e.ndim - 2];
		if (i !== r) throw Error(`eigh: last 2 dimensions must be square, got ${i}x${r}`);
		let a = n.reduce((e, t) => e * t, 1), o = z.empty([...n, r], "float64"), s = z.empty([
			...n,
			r,
			r
		], "float64"), c = o.data, l = s.data;
		for (let i = 0; i < a; i++) {
			let a = to(i, n), o = z.zeros([r, r], "float64");
			for (let t = 0; t < r; t++) for (let n = 0; n < r; n++) o.set([t, n], X(e.get(...a, t, n)));
			let { w: s, v: u } = Fo(o, t);
			c.set(Q(s), i * r), l.set(Q(u), i * r * r), o.dispose(), s.dispose(), u.dispose();
		}
		return {
			w: o,
			v: s
		};
	}
	let [n, r] = e.shape;
	if (n !== r) throw Error(`eigh: matrix must be square, got ${n}x${r}`);
	let i = n, a = z.zeros([i, i], "float64");
	for (let n = 0; n < i; n++) for (let r = 0; r < i; r++) if (t === "L") {
		if (n >= r) {
			let t = X(e.get(n, r));
			a.set([n, r], t), a.set([r, n], t);
		}
	} else if (r >= n) {
		let t = X(e.get(n, r));
		a.set([n, r], t), a.set([r, n], t);
	}
	let { values: o, vectors: s } = vo(a);
	a.dispose();
	let c = Array.from({ length: i }, (e, t) => t);
	c.sort((e, t) => o[e] - o[t]);
	let l = z.zeros([i], "float64"), u = z.zeros([i, i], "float64");
	for (let e = 0; e < i; e++) {
		l.set([e], o[c[e]]);
		for (let t = 0; t < i; t++) u.set([t, e], s[t][c[e]]);
	}
	return {
		w: l,
		v: u
	};
}
function Io(e) {
	q(e.dtype);
	let { w: t } = No(e);
	return t;
}
function Lo(e, t = "L") {
	q(e.dtype);
	let { w: n } = Fo(e, t);
	return n;
}
function Ro(e, t, n = -1) {
	let r = e.ndim, i = t.ndim, a = n < 0 ? r + n : n, o = n < 0 ? i + n : n;
	if (a < 0 || a >= r) throw Error(`vecdot: axis ${n} out of bounds for array with ${r} dimensions`);
	if (o < 0 || o >= i) throw Error(`vecdot: axis ${n} out of bounds for array with ${i} dimensions`);
	let s = e.shape[a], c = t.shape[o];
	if (s !== c) throw Error(`vecdot: axis dimensions must match, got ${s} and ${c}`);
	if (r === 1 && i === 1) {
		if (!(m(e.dtype) || m(t.dtype))) return Qa(e, t);
		let n = e.shape[0], r = 0, i = 0;
		for (let a = 0; a < n; a++) {
			let n = e.get(a), o = t.get(a), s = Z(n instanceof g ? new g(n.re, -n.im) : n, o);
			s instanceof g ? (r += s.re, i += s.im) : r += Number(s);
		}
		return new g(r, i);
	}
	if (r === 2 && i === 2 && n === -1) {
		let n = va(e, t);
		if (n) return n;
	}
	let l = [...e.shape.slice(0, a), ...e.shape.slice(a + 1)], u = [...t.shape.slice(0, o), ...t.shape.slice(o + 1)], d = s, f = m(e.dtype) || m(t.dtype), _ = h(e.dtype, t.dtype), v = l.length > u.length ? l : u, y = J(_);
	if (v.length === 0) {
		if (y) {
			y[0] = 0;
			for (let n = 0; n < d; n++) y[0] += Number(e.get(n)) * Number(t.get(n));
			return y[0];
		}
		let n = f ? new g(0, 0) : p(_) ? 0n : 0;
		for (let r = 0; r < d; r++) {
			let i = e.get(r), a = t.get(r), o = Z(i instanceof g ? new g(i.re, -i.im) : i, a);
			if (n instanceof g || o instanceof g) {
				let e = n instanceof g ? n : new g(Number(n), 0), t = o instanceof g ? o : new g(Number(o), 0);
				n = e.add(t);
			} else typeof n == "bigint" || typeof o == "bigint" ? n = BigInt(n) + BigInt(o) : n += o;
		}
		return n;
	}
	let b = z.zeros(v, _), x = v.reduce((e, t) => e * t, 1);
	for (let n = 0; n < x; n++) {
		let r = [], i = n;
		for (let e = v.length - 1; e >= 0; e--) r.unshift(i % v[e]), i = Math.floor(i / v[e]);
		let s = [
			...r.slice(0, a),
			0,
			...r.slice(a)
		], c = [
			...r.slice(0, o),
			0,
			...r.slice(o)
		];
		if (y) {
			y[0] = 0;
			for (let n = 0; n < d; n++) s[a] = n, c[o] = n, y[0] += Number(e.get(...s)) * Number(t.get(...c));
			b.set(r, y[0]);
		} else {
			let n = f ? new g(0, 0) : p(_) ? 0n : 0;
			for (let r = 0; r < d; r++) {
				s[a] = r, c[o] = r;
				let i = e.get(...s), l = t.get(...c), u = Z(i instanceof g ? new g(i.re, -i.im) : i, l);
				if (n instanceof g || u instanceof g) {
					let e = n instanceof g ? n : new g(Number(n), 0), t = u instanceof g ? u : new g(Number(u), 0);
					n = e.add(t);
				} else typeof n == "bigint" || typeof u == "bigint" ? n = BigInt(n) + BigInt(u) : n += u;
			}
			b.set(r, n);
		}
	}
	return b;
}
function zo(e) {
	if (e.ndim < 2) throw Error(`matrix_transpose: input must have at least 2 dimensions, got ${e.ndim}D`);
	let t = Array.from({ length: e.ndim }, (e, t) => t), n = t.length - 1;
	return t[n] = n - 1, t[n - 1] = n, ao(e, t);
}
function Bo(e, t) {
	return ao(e, t);
}
function Vo(e) {
	if (q(e.dtype), e.ndim < 2) throw Error(`slogdet: input must be at least 2D, got ${e.ndim}D`);
	if (e.ndim > 2) {
		let t = Array.from(e.shape).slice(0, -2), n = e.shape[e.ndim - 1], r = e.shape[e.ndim - 2];
		if (r !== n) throw Error(`slogdet: last 2 dimensions must be square, got ${r}x${n}`);
		let i = t.reduce((e, t) => e * t, 1), a = z.empty(t, "float64"), o = z.empty(t, "float64"), s = a.data, c = o.data, l = Q(e);
		for (let e = 0; e < i; e++) {
			let t = e * n * n, r = z.fromData(l.slice(t, t + n * n), [n, n], "float64");
			try {
				let { sign: t, logabsdet: n } = Vo(r);
				s[e] = t, c[e] = n;
			} finally {
				r.dispose();
			}
		}
		return {
			sign: a,
			logabsdet: o
		};
	}
	let [t, n] = e.shape;
	if (t !== n) throw Error(`slogdet: matrix must be square, got ${t}x${n}`);
	let r = t;
	if (r === 0) return {
		sign: 1,
		logabsdet: 0
	};
	if (e.dtype === "float64" || e.dtype === "float32") {
		let t = Ti(e);
		if (t) {
			let e = t.lu.data, n = 0, i = t.sign;
			for (let a = 0; a < r; a++) {
				let o = e[a * r + a];
				if (o === 0) return t.lu.dispose(), {
					sign: 0,
					logabsdet: -Infinity
				};
				o < 0 && (i = -i), n += Math.log(Math.abs(o));
			}
			return t.lu.dispose(), {
				sign: i,
				logabsdet: n
			};
		}
	}
	let { lu: i, sign: a } = xo(e);
	try {
		let e = i.data, t = m(i.dtype), n = 0, o = a;
		if (t) {
			let t = a, i = 0;
			for (let a = 0; a < r; a++) {
				let o = (a * r + a) * 2, s = e[o], c = e[o + 1], l = Math.sqrt(s * s + c * c);
				if (l === 0) return {
					sign: 0,
					logabsdet: -Infinity
				};
				n += Math.log(l);
				let u = s / l, d = c / l, f = t * u - i * d, p = t * d + i * u;
				t = f, i = p;
			}
			o = Math.abs(i) < 1e-10 ? Math.round(t) : t;
		} else for (let t = 0; t < r; t++) {
			let i = e[t * r + t];
			if (i === 0) return {
				sign: 0,
				logabsdet: -Infinity
			};
			i < 0 && (o = -o), n += Math.log(Math.abs(i));
		}
		return {
			sign: o,
			logabsdet: n
		};
	} finally {
		i.dispose();
	}
}
function Ho(e) {
	q(e.dtype);
	let t = e.dtype, n = Rt(e);
	if (n) {
		if (t === "float32" && n.dtype === "float64") {
			let e = z.empty(Array.from(n.shape), "float32"), t = n.data, r = e.data;
			for (let e = 0; e < n.size; e++) r[e] = t[e];
			return n.dispose(), e;
		}
		return n;
	}
	return yo(e, !0, !1);
}
function Uo(e) {
	if (e.length < 2) throw Error("multi_dot: need at least 2 arrays");
	if (e.length === 2) return $(e[0], e[1]);
	let t = $(e[0], e[1]);
	for (let n = 2; n < e.length; n++) {
		let r = t;
		t = $(t, e[n]), r.dispose();
	}
	return t;
}
function Wo(e, t = 2) {
	if (q(e.dtype), t <= 0) throw Error(`tensorinv: ind must be positive, got ${t}`);
	let n = e.shape, r = e.ndim;
	if (r < t) throw Error(`tensorinv: array has ${r} dimensions, ind=${t} is too large`);
	let i = 1;
	for (let e = 0; e < t; e++) i *= n[e];
	let a = 1;
	for (let e = t; e < r; e++) a *= n[e];
	if (i !== a) throw Error(`tensorinv: product of first ${t} dimensions (${i}) must equal product of remaining dimensions (${a})`);
	return B(Co(B(e, [i, a])), [...n.slice(t), ...n.slice(0, t)]);
}
function Go(e, t, n) {
	q(e.dtype);
	let r = e.shape, i = t.shape, a = e.ndim, o = t.ndim, s;
	s = n == null ? Array.from({ length: o }, (e, t) => a - o + t) : n.map((e) => e < 0 ? a + e : e);
	let c = [];
	for (let e = 0; e < a; e++) s.includes(e) || c.push(e);
	let l = ao(e, [...c, ...s]), u = s.map((e) => r[e]).reduce((e, t) => e * t, 1), d = c.map((e) => r[e]).reduce((e, t) => e * t, 1), f = i.reduce((e, t) => e * t, 1);
	if (u !== f) throw Error(`tensorsolve: dimensions don't match - sum dimensions product (${u}) != b total elements (${f})`);
	if (d !== u) throw Error(`tensorsolve: non-square problem - other dimensions product (${d}) != sum dimensions product (${u})`);
	return B(Do(B(l, [d, u]), B(t, [u])), [...i]);
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/core/linalg.js
function Ko(e, t) {
	let n = Qa(H(e), H(t));
	return typeof n == "number" || typeof n == "bigint" || n instanceof g ? n : U(n);
}
function qo(e, t = 0, n = 0, r = 1) {
	let i = io(H(e), t, n, r);
	return i instanceof z ? U(i) : i;
}
function Jo(e, t = 0, n = 0, r = 1) {
	return U(lo(H(e), t, n, r));
}
function Yo(e, t) {
	return Ie(ao(H(e), t), e);
}
function Xo(e, t) {
	let n = oo(H(e), H(t));
	return typeof n == "number" || typeof n == "bigint" || n instanceof g ? n : U(n);
}
function Zo(e, t) {
	return U(so(H(e), H(t)));
}
function Qo(e, t, n = 2) {
	let r = co(H(e), H(t), n);
	return typeof r == "number" || typeof r == "bigint" || r instanceof g ? r : U(r);
}
function $o(e, t, n = -1) {
	let r = Ro(H(e), H(t), n);
	return typeof r == "number" || typeof r == "bigint" || r instanceof g ? r : U(r);
}
function es(e) {
	return Ie(zo(H(e)), e);
}
function ts(e, t) {
	return Ie(Bo(H(e), t), e);
}
function ns(e, t, n = -1, r = -1, i = -1, a) {
	let o = uo(H(e), H(t), n, r, i, a);
	return typeof o == "number" || typeof o == "bigint" || o instanceof g ? o : U(o);
}
var rs = {
	matmul: (e, t) => U($(H(e), H(t))),
	dot: (e, t) => Ko(e, t),
	det: (e) => {
		let t = bo(H(e));
		return typeof t == "number" || t instanceof g ? t : U(t);
	},
	inv: (e) => U(Co(H(e))),
	solve: (e, t) => U(Do(H(e), H(t))),
	lstsq: (e, t, n) => {
		let r = Oo(H(e), H(t), n);
		return {
			x: U(r.x),
			residuals: U(r.residuals),
			rank: r.rank,
			s: U(r.s)
		};
	},
	norm: (e, t, n, r) => {
		let i = mo(H(e), t, n, r);
		return typeof i == "number" ? i : U(i);
	},
	cond: (e, t) => ko(H(e), t),
	matrix_rank: (e, t) => Ao(H(e), t),
	matrix_power: (e, t) => U(jo(H(e), t)),
	pinv: (e, t) => U(Mo(H(e), t)),
	qr: (e, t) => {
		let n = ho(H(e), t);
		return "h" in n && "tau" in n ? {
			h: U(n.h),
			tau: U(n.tau)
		} : "q" in n && "r" in n ? {
			q: U(n.q),
			r: U(n.r)
		} : U(n);
	},
	cholesky: (e, t) => U(go(H(e), t)),
	svd: (e, t, n) => {
		let r = yo(H(e), t, n);
		return "u" in r && "s" in r && "vt" in r ? {
			u: U(r.u),
			s: U(r.s),
			vt: U(r.vt)
		} : U(r);
	},
	eig: (e) => {
		let t = No(H(e));
		return {
			w: U(t.w),
			v: U(t.v)
		};
	},
	eigh: (e, t) => {
		let n = Fo(H(e), t);
		return {
			w: U(n.w),
			v: U(n.v)
		};
	},
	eigvals: (e) => U(Io(H(e))),
	eigvalsh: (e, t) => U(Lo(H(e), t)),
	slogdet: (e) => {
		let t = Vo(H(e));
		return {
			sign: t.sign instanceof z ? U(t.sign) : t.sign,
			logabsdet: t.logabsdet instanceof z ? U(t.logabsdet) : t.logabsdet
		};
	},
	svdvals: (e) => U(Ho(H(e))),
	multi_dot: (e) => U(Uo(e.map((e) => H(e)))),
	tensorinv: (e, t) => U(Wo(H(e), t)),
	tensorsolve: (e, t, n) => U(Go(H(e), H(t), n)),
	vector_norm: (e, t, n, r) => {
		let i = fo(H(e), t, n, r);
		return typeof i == "number" ? i : U(i);
	},
	matrix_norm: (e, t, n) => {
		let r = po(H(e), t, n);
		return typeof r == "number" ? r : U(r);
	},
	cross: (e, t, n, r, i, a) => ns(e, t, n, r, i, a),
	matrix_transpose: (e) => es(e),
	permute_dims: (e, t) => ts(e, t),
	trace: (e, t, n, r) => qo(e, t, n, r),
	diagonal: (e, t, n, r) => Jo(e, t, n, r),
	outer: (e, t) => Zo(e, t),
	inner: (e, t) => Xo(e, t),
	tensordot: (e, t, n) => Qo(e, t, n),
	vecdot: (e, t, n) => $o(e, t, n),
	transpose: (e, t) => Yo(e, t)
};
//#endregion
//#region node_modules/numpy-ts/dist/esm/common/ops/advanced.js
function is(e, t, n = !1) {
	if (e.ndim !== t.ndim) return !1;
	for (let n = 0; n < e.ndim; n++) if (e.shape[n] !== t.shape[n]) return !1;
	let r = e.size;
	for (let i = 0; i < r; i++) {
		let r = e.iget(i), a = t.iget(i), o = typeof r == "object" && !!r && "re" in r, s = typeof a == "object" && !!a && "re" in a;
		if (o || s) {
			let e = o ? r.re : Number(r), t = o ? r.im : 0, i = s ? a.re : Number(a), c = s ? a.im : 0;
			if (n && isNaN(e) && isNaN(i) && isNaN(t) && isNaN(c) || n && e === i && isNaN(t) && isNaN(c) || n && isNaN(e) && isNaN(i) && t === c) continue;
			if (e !== i || t !== c) return !1;
			continue;
		}
		if (!(n && typeof r == "number" && Number.isNaN(r) && typeof a == "number" && Number.isNaN(a)) && r !== a) return !1;
	}
	return !0;
}
//#endregion
//#region node_modules/numpy-ts/dist/esm/core/advanced.js
function as(e, t, n = !1) {
	return is(H(e), H(t), n);
}
//#endregion
//#region src/feature-vector.ts
function os(e) {
	return n.HAND_CONNECTIONS.map((t) => He([
		e[t.end].x - e[t.start].x,
		e[t.end].y - e[t.start].y,
		e[t.end].z - e[t.start].z
	]));
}
function ss(e, t) {
	if (as(e, t)) return 0;
	let n = Ko(e, t), r = rs.norm(e) * rs.norm(t);
	return Math.acos(n / r);
}
function cs(e) {
	let t = e.length, n = e.reduce((e, t) => ({
		x: e.x + t.x,
		y: e.y + t.y,
		z: e.z + t.z
	}), {
		x: 0,
		y: 0,
		z: 0
	});
	return {
		x: n.x / t,
		y: n.y / t,
		z: n.z / t
	};
}
var ls = (e) => e * Math.abs(e);
function us(e, t) {
	return [
		ls(e.x - t.x),
		ls(e.y - t.y),
		ls(e.z - t.z)
	];
}
function ds(e) {
	let t = {};
	for (let n = 0; n < e.handLandmarks.length; n++) {
		let r = e.handLandmarks[n], i = e.handedness[n][0].categoryName.toLowerCase(), a = os(r), o = [];
		for (let e of a) for (let t of a) {
			let n = ss(e, t);
			o.push(isNaN(n) ? 0 : n);
		}
		let s = e.poseLandmarks[11], c = e.poseLandmarks[12];
		if (s && c) {
			let e = cs(r);
			o.push(...us(e, s)), o.push(...us(e, c));
		} else o.push(0, 0, 0, 0, 0, 0);
		t[i] = o;
	}
	return t;
}
//#endregion
//#region src/util.ts
function fs(e) {
	throw Error(e);
}
function ps(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "object" && !!e && "embedding" in e && "word" in e);
}
//#endregion
//#region src/landmark-detection.ts
async function ms(i) {
	let a = await t.forVisionTasks(i.wasmPath), o = await n.createFromOptions(a, {
		baseOptions: { modelAssetPath: i.handTaskPath },
		numHands: 2,
		runningMode: "VIDEO"
	}), s = await r.createFromOptions(a, {
		baseOptions: { modelAssetPath: i.poseTaskPath },
		numPoses: 1,
		runningMode: "VIDEO"
	});
	return { watchWebcam(t, i, a) {
		console.debug("watching webcam"), i.style.width = `${t.videoWidth} px`, i.style.height = `${t.videoHeight} px`, i.width = t.videoWidth, i.height = t.videoHeight;
		let c = i.getContext("2d") ?? fs("Canvas context is null"), l = -1, u = new e(c), d = [], f = null;
		function p(e, t) {
			e.vectors.push(ds(t));
		}
		function m(e) {
			a(e), d.push(e);
		}
		function h() {
			if (t.currentTime !== l) {
				let e = performance.now(), a = o.detectForVideo(t, e), h = s.detectForVideo(t, e).landmarks[0] ?? [];
				if (l = t.currentTime, c.save(), c.clearRect(0, 0, i.width, i.height), h.length > 0 && (u.drawConnectors(h, r.POSE_CONNECTIONS, {
					color: "#0088FF",
					lineWidth: 2
				}), u.drawLandmarks(h, {
					color: "#0044FF",
					lineWidth: 1
				})), a.landmarks.length > 0) {
					f === null && (console.log("starting new sign"), f = {
						vectors: [],
						word: null
					}), p(f, {
						handLandmarks: a.landmarks,
						handedness: a.handedness,
						poseLandmarks: h
					});
					for (let e of a.landmarks) u.drawConnectors(e, n.HAND_CONNECTIONS, {
						color: "#00FF00",
						lineWidth: 5
					}), u.drawLandmarks(e, {
						color: "#FF0000",
						lineWidth: 2
					});
				} else f && (console.log("no hands detected, flushing sign", f), m(f), f = null, console.log("flushed sign, signs:", structuredClone(d)));
				c.restore();
			}
			requestAnimationFrame(() => {
				h();
			});
		}
		return h(), d;
	} };
}
//#endregion
//#region src/classification.ts
function hs(e, t) {
	e.postMessage({
		type: "updateDb",
		database: t
	});
}
function gs(e, t) {
	let n = new Worker(e, { type: "module" });
	return hs(n, t), n;
}
function _s(e) {
	return (t) => {
		e.postMessage({
			type: "recognize",
			sign: t
		});
	};
}
function vs(e, t) {
	e.onmessage = (e) => {
		e.data.type === "result" && t({
			word: e.data.word,
			distance: e.data.distance
		});
	};
}
//#endregion
//#region src/distance.ts
var ys = 1e3;
function bs(e, t) {
	let n = 0;
	for (let r of ["left", "right"]) {
		let i = e[r], a = t[r];
		if (!i && !a) continue;
		if (!i || !a) {
			n += ys;
			continue;
		}
		let o = Math.min(i.length, a.length);
		for (let e = 0; e < o; e++) n += Math.abs(i[e] - a[e]);
	}
	return n;
}
function xs(e, t) {
	let n = e.vectors.length, r = t.vectors.length;
	return n === 0 || r === 0 ? Infinity : new i(e.vectors, t.vectors, bs).getDistance() / (n + r);
}
//#endregion
//#region src/sign-map.ts
var Ss = "{???}", Cs = class {
	#e = [];
	constructor(e) {
		this.#e = e ?? [];
	}
	recognizeSign(e) {
		let t = Ss, n = Infinity;
		for (let r of this.map) {
			let i = xs(e, r.embedding);
			i < n && (n = i, t = r.word);
		}
		e.word = t, console.log("sign:", e, "distance:", n);
	}
	get map() {
		return this.#e;
	}
	addSignToMap(e) {
		if (e.word === null) throw Error("Cannot add sign to database without word");
		this.#e.push({
			embedding: { vectors: e.vectors },
			word: e.word
		});
	}
};
//#endregion
export { Cs as SignMap, gs as createClassificationWorker, ms as createLandmarker, _s as createRecognizeHandler, xs as dtwDistance, ps as isValidMapData, vs as onClassificationResult, hs as updateDb };
