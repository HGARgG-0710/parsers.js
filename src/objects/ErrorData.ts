import type {
	IErrorData,
	IErrorType,
	IIndexCarrying,
	IInputStream,
	ILineIndex,
	IPosed,
	IPrintablePosition,
	ISimpleErrorData,
	IStream,
	IStreamLocator
} from "../interfaces.js"
import {
	MissingErrorDataContentError,
	MissingImplementationError,
	NoIndexCarryingLocatableError,
	NoPosedLocatableError
} from "./Error.js"

class InfoMap {
	private readonly transient = new Map<string, any>()
	private readonly permanent = new Map<string, any>()

	private isTransient(key: string) {
		return this.transient.has(key)
	}

	private isPermanent(key: string) {
		return this.permanent.has(key)
	}

	setTransient(key: string, value: any) {
		if (this.isPermanent(key)) {
			this.setPermanent(key, value)
			return
		}
		this.transient.set(key, value)
	}

	setPermanent(key: string, value: any) {
		if (this.isTransient(key)) {
			this.setTransient(key, value)
			return
		}
		this.permanent.set(key, value)
	}

	get(key: string) {
		if (this.isPermanent(key)) return this.permanent.get(key)
		return this.transient.get(key)
	}

	clearTransient() {
		this.transient.clear()
	}
}

export abstract class BaseSimpleErrorData implements ISimpleErrorData {
	abstract copy(): this

	private readonly infoMap = new InfoMap()

	private _errType: IErrorType | null
	private _hasError: boolean = false

	private set hasError(has: boolean) {
		this._hasError = has
	}

	private set errType(newErrType: IErrorType | null) {
		this.errType = newErrType
	}

	private resetErrType() {
		this.errType = null
	}

	protected markActive(): void {
		this.hasError = true
	}

	protected baseRefresh(): void {}

	get errType() {
		return this._errType
	}

	get hasError() {
		return this._hasError
	}

	setErrType(errType: IErrorType): void {
		this.errType = errType
	}

	toError(): Error {
		if (!this.hasError || !this.errType)
			throw new MissingErrorDataContentError()
		return new this.errType(this)
	}

	markHandled(): void {
		this.hasError = false
	}

	getInfo(keyName: string) {
		return this.infoMap.get(keyName)
	}

	setInfo(
		keyName: string,
		value: NonNullable<any>,
		isTransient = true
	): void {
		if (isTransient) this.infoMap.setTransient(keyName, value)
		else this.infoMap.setPermanent(keyName, value)
	}

	refresh() {
		this.resetErrType()
		this.infoMap.clearTransient()
		this.baseRefresh()
		this.markActive()
	}
}

export class SimpleErrorData extends BaseSimpleErrorData {
	private override ["constructor"]: new () => this

	override copy(): this {
		return new this.constructor()
	}
}

/**
 * This is the abstract class implementing `IErrorData` serving as
 * the base, by providing methods and state implementation of the
 * `readonly .hasError: boolean` property. It still requires the
 * child class to provide the `abstract readonly pos: IErrorPosition`.
 */
export abstract class BasePositionalErrorData
	extends BaseSimpleErrorData
	implements IErrorData
{
	abstract readonly pos: IPrintablePosition
}

/**
 * This abstract class implementing `IErrorData` serves as a
 * base, by delegating all `IErrorData` methods and properties
 * onto the `IErrorData` given to it in the constructor. This
 * is useful for composing different types of `IErrorData` into
 * more complex objects. In particular, utilizing this technique
 * can open path to addition of new vital context-sensetive
 * information.
 */
export abstract class DelegateErrorData implements IErrorData {
	private ["constructor"]: new (parentErrorData: IErrorData) => this

	setErrType(errType: IErrorType): void {
		this.delegate.setErrType(errType)
	}

	get errType() {
		return this.delegate.errType
	}

	toError(): Error {
		return this.delegate.toError()
	}

	refresh(): void {
		this.delegate.refresh()
	}

	get pos() {
		return this.delegate.pos
	}

	get hasError() {
		return this.delegate.hasError
	}

	markHandled(): void {
		this.delegate.markHandled()
	}

	setInfo(
		keyName: string,
		value: NonNullable<any>,
		isTransient?: boolean
	): void {
		return this.delegate.setInfo(keyName, value, isTransient)
	}

	getInfo(keyName: string) {
		return this.delegate.getInfo(keyName)
	}

	copy(): this {
		return new this.constructor(this.delegate.copy())
	}

	constructor(protected readonly delegate: IErrorData) {}
}

/**
 * This is a child class of `DelegateErrorData`,
 * providing (by default) the `.getInfo("filename")`
 * value, indicating the filename of the currently
 * parsed file.
 */
export class FileErrorData extends DelegateErrorData {
	constructor(filename: string, delegate: IErrorData) {
		super(delegate)
		this.setInfo("filename", filename, false)
	}
}

/**
 * This is a concrete `IErrorData` based off `BaseErrorData`,
 * which utilizes a custom `IErrorPosition` provided by the
 * `posMaker: (inputStream: IInputStream) => IErrorPosition`,
 * and initialized with the given `inputStream: IInputStream`.
 */
export class StreamListErrorData extends BasePositionalErrorData {
	override ["constructor"]: new (
		inputStream: IInputStream,
		posMaker: (inputStream: IInputStream) => IPrintablePosition
	) => this

	private _pos: IPrintablePosition | null = null

	private ensurePosNonNull() {
		if (!this._pos) this._pos = this.posMaker(this.inputStream)
	}

	private locatePos() {
		return this._pos!.locate()
	}

	protected override baseRefresh(): void {
		this.ensurePosNonNull()
		this.locatePos()
	}

	get pos() {
		this.ensurePosNonNull()
		return this._pos!
	}

	copy() {
		this.ensurePosNonNull()
		const newPos = this.pos.copy()
		return new this.constructor(this.inputStream, () => newPos)
	}

	constructor(
		private readonly inputStream: IInputStream,
		private readonly posMaker: (
			inputStream: IInputStream
		) => IPrintablePosition
	) {
		super()
	}
}

export namespace ErrorPosition {
	/**
	 * This is an implementation of `IErrorPosition`
	 * that expects to locate an `.refStream: IIndexStream` from an
	 * `IInputStream` (which must first be initialized),
	 * and then read the `.refStream.lineIndex` to provide the
	 * position of the parser.
	 *
	 * It guaranteedly implements `toString(): string` as
	 * `() => .lineIndex.line:.lineIndex.char`,
	 * and optionally implements the `isNumber`: the implementation
	 * is valid only in cases when one can delegate to `.lineIndex.toNumber()`.
	 */
	export class LineIndexCarrying implements IPrintablePosition {
		private ["constructor"]: new (
			inputStream: IInputStream,
			indexCarryingLocator: IStreamLocator<IStream & IIndexCarrying>
		) => this

		private lineIndex: ILineIndex

		toNumber(): number {
			if (this.lineIndex.toNumber) return this.lineIndex.toNumber()

			throw new MissingImplementationError(
				"toNumber",
				this.lineIndex.constructor.name
			)
		}

		toString(): string {
			return `${this.lineIndex.line}:${this.lineIndex.char}`
		}

		locate() {
			const indexStream = this.indexCarryingLocator.locate(
				this.inputStream
			)
			if (!indexStream) throw new NoIndexCarryingLocatableError()
			this.lineIndex = indexStream.lineIndex.copy()
			return this
		}

		copy(): this {
			const copy = new this.constructor(
				this.inputStream,
				this.indexCarryingLocator
			)
			copy.lineIndex = this.lineIndex.copy()
			return copy
		}

		constructor(
			private readonly inputStream: IInputStream,
			private readonly indexCarryingLocator: IStreamLocator<
				IStream & IIndexCarrying
			>
		) {}
	}

	/**
	 * This is an implementation of `IErrorPosition`
	 * that expects to locate an `.refStream: IOwnedStream & IPosed<number>` from an
	 * `IInputStream` (which must first be initialized),
	 * and then read the `.refStream.pos` to provide the
	 * position of the parser.
	 *
	 * It guaranteedly implements `.toNumber(): number` as
	 * `() => this.refStream.pos`.
	 */
	export class PosCarrying implements IPrintablePosition {
		["constructor"]: new (
			inputStream: IInputStream,
			posCarryingLocator: IStreamLocator<IStream & IPosed>
		) => this

		private pos: number

		toNumber(): number {
			return this.pos
		}

		locate() {
			const posStream = this.posCarryingLocator.locate(this.inputStream)
			if (!posStream) throw new NoPosedLocatableError()
			this.pos = posStream.pos
			return this
		}

		copy(): this {
			const copy = new this.constructor(
				this.inputStream,
				this.posCarryingLocator
			)
			copy.pos = this.pos
			return copy
		}

		constructor(
			private readonly inputStream: IInputStream,
			private readonly posCarryingLocator: IStreamLocator<
				IStream & IPosed
			>
		) {}
	}
}
