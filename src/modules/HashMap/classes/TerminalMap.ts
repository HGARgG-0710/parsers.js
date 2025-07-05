import type { IPlainMap, IPreMap } from "../../../interfaces/HashMap.js"
import { Size } from "../../../internal/Size.js"

function isMissing(x: any): x is undefined {
	return x === undefined
}

/**
 * This is a class implementing the `IPreMap<K, V, Default>`, 
 * and wrapping around the `IPlainMap<K, V>`. 
 */
export class TerminalMap<K = any, V = any, Default = any>
	implements IPreMap<K, V, Default>
{
	private ["constructor"]: new (
		plainMap?: IPlainMap<K, V>,
		_default?: Default
	) => this

	readonly default: Default
	private readonly sizeObj: Size

	private isMissingKey(key: K) {
		return isMissing(this.plainMap.read(key))
	}

	private ensureDefault(read: undefined | V) {
		return isMissing(read) ? this.default : read
	}

	private deleteExisting(key: K) {
		this.plainMap.annul(key)
		this.sizeObj.dec()
	}

	private setExisting(key: K, value: V) {
		this.plainMap.write(key, value)
	}

	private setMissing(key: K, value: V) {
		this.sizeObj.inc()
		this.plainMap.write(key, value)
	}

	private countInitial() {
		return this.plainMap
			.values()
			.filter((x) => !isMissing(x))
			.toArray().length
	}

	get size() {
		return this.sizeObj.get()
	}

	set(key: K, value: V) {
		if (this.isMissingKey(key)) this.setMissing(key, value)
		else this.setExisting(key, value)
		return this
	}

	get(key: K) {
		return this.ensureDefault(this.plainMap.read(key))
	}

	delete(key: K) {
		if (!this.isMissingKey(key)) this.deleteExisting(key)
		return this
	}

	rekey(from: K, to: K) {
		const original = this.plainMap.read(from)
		if (!isMissing(original)) {
			this.deleteExisting(from)
			this.set(to, original)
		}
		return this
	}

	copy() {
		return new this.constructor(this.plainMap.copy(), this.default)
	}

	constructor(
		private readonly plainMap: IPlainMap<K, V>,
		_default?: Default
	) {
		this.default = _default!
		this.sizeObj = new Size(this.countInitial())
	}
}
