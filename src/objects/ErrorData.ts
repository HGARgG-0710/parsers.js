import type {
	IErrorData,
	IIndexCarrying,
	IInputStream,
	ILineIndex,
	IPosed,
	IPrintablePosition,
	IStream,
	IStreamLocator
} from "../interfaces.js"
import { MissingImplementationError, MissingObjectError } from "./Error.js"

/**
 * This is the abstract class implementing `IErrorData` serving as
 * the base, by providing methods and state implementation of the
 * `readonly .hasError: boolean` property. It still requires the
 * child class to provide the `abstract readonly pos: IErrorPosition`.
 */
export abstract class BaseErrorData implements IErrorData {
	private readonly infoMap = new Map<string, any>()
	abstract readonly pos: IPrintablePosition
	abstract refresh(): void
	private _hasError: boolean = false

	private set hasError(has: boolean) {
		this._hasError = has
	}

	get hasError() {
		return this._hasError
	}

	protected markActive(): void {
		this.hasError = true
	}

	markHandled(): void {
		this.hasError = false
	}

	getInfo(keyName: string) {
		return this.infoMap.get(keyName)
	}

	setInfo(keyName: string, value: NonNullable<any>): void {
		this.infoMap.set(keyName, value)
	}
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
	refresh(): void {
		this.parentErrorData.refresh()
	}

	get pos() {
		return this.parentErrorData.pos
	}

	get hasError() {
		return this.parentErrorData.hasError
	}

	markHandled(): void {
		this.parentErrorData.markHandled()
	}

	setInfo(keyName: string, value: NonNullable<any>): void {
		return this.parentErrorData.setInfo(keyName, value)
	}

	getInfo(keyName: string) {
		return this.parentErrorData.getInfo(keyName)
	}

	constructor(protected readonly parentErrorData: IErrorData) {}
}

/**
 * This is a child class of `DelegateErrorData`,
 * providing (by default) the `.getInfo("filename")`
 * value, indicating the filename of the currently
 * parsed file.
 */
export class FileErrorData extends DelegateErrorData {
	constructor(filename: string, parentErrorData: IErrorData) {
		super(parentErrorData)
		this.setInfo("filename", filename)
	}
}

/**
 * This is a concrete `IErrorData` based off `BaseErrorData`,
 * which utilizes a custom `IErrorPosition` provided by the
 * `posMaker: (inputStream: IInputStream) => IErrorPosition`,
 * and initialized with the given `inputStream: IInputStream`.
 */
export class StreamListErrorData extends BaseErrorData {
	private _pos: IPrintablePosition | null = null

	private ensurePosNonNull() {
		if (!this._pos) this._pos = this.posMaker(this.inputStream)
	}

	private locatePos() {
		return this._pos!.locate()
	}

	refresh(): void {
		this.ensurePosNonNull()
		this.locatePos()
		this.markActive()
	}

	get pos() {
		this.ensurePosNonNull()
		return this._pos!
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
		private _lineIndex: ILineIndex

		private get lineIndex() {
			return this._lineIndex
		}

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
			if (!indexStream)
				throw new MissingObjectError("IStream & IIndexCarrying")
			this._lineIndex = indexStream.lineIndex.copy()
			return this
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
		private pos: number

		toNumber(): number {
			return this.pos
		}

		locate() {
			const posStream = this.posCarryingLocator.locate(this.inputStream)
			if (!posStream)
				throw new MissingObjectError("IPosed<number> & IStream")
			this.pos = posStream.pos
			return this
		}

		constructor(
			private readonly inputStream: IInputStream,
			private readonly posCarryingLocator: IStreamLocator<
				IStream & IPosed
			>
		) {}
	}
}
