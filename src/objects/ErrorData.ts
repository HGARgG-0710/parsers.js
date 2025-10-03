import type {
	IErrorData,
	IErrorPosition,
	IIdErrorData,
	IIndexStream,
	IInputStream,
	IOwnedStream,
	IPosed
} from "../interfaces.js"
import {
	locateIndexCarryingUpwards,
	locatePosCarryingUpwards
} from "../utils/Stream.js"
import { MissingImplementationError, MissingObjectError } from "./Error.js"

/**
 * This is the abstract class implementing `IErrorData` serving as
 * the base, by providing methods and state implementation of the
 * `readonly .hasError: boolean` property. It still requires the
 * child class to provide the `abstract readonly pos: IErrorPosition`.
 */
export abstract class BaseErrorData implements IErrorData {
	private _hasError: boolean = false
	abstract readonly pos: IErrorPosition

	private set hasError(has: boolean) {
		this._hasError = has
	}

	get hasError() {
		return this._hasError
	}

	markActive(): void {
		this.hasError = true
	}

	markHandled(): void {
		this.hasError = false
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
	get pos() {
		return this.parentErrorData.pos
	}

	get hasError() {
		return this.parentErrorData.hasError
	}

	markActive(): void {
		this.parentErrorData.markActive()
	}

	markHandled(): void {
		this.parentErrorData.markHandled()
	}

	constructor(private readonly parentErrorData: IErrorData) {}
}

/**
 * This is a child class of `DelegateErrorData`, implementing
 * `IIdErrorData<string>`, and representing an `IErrorData`
 * that keeps the name of the source file inside the
 * `readonly .sourceId: string` property. It demands the
 * name of the file on creation.
 */
export class FileErrorData
	extends DelegateErrorData
	implements IIdErrorData<string>
{
	private filename: string

	setSourceId(name: string): void {
		this.filename = name
	}

	get sourceId() {
		return this.filename
	}

	constructor(filename: string, parentErrorData: IErrorData) {
		super(parentErrorData)
		this.setSourceId(filename)
	}
}

/**
 * This is a concrete `IErrorData` based off `BaseErrorData`,
 * which utilizes a custom `IErrorPosition` provided by the
 * `posMaker: (inputStream: IInputStream) => IErrorPosition`,
 * and initialized with the given `inputStream: IInputStream`.
 */
export class StreamListErrorData extends BaseErrorData {
	private _pos: IErrorPosition | null = null

	private locatePos() {
		return this.posMaker(this.inputStream).locate()
	}

	get pos() {
		if (!this._pos) this._pos = this.locatePos()
		return this._pos
	}

	constructor(
		private readonly inputStream: IInputStream,
		private readonly posMaker: (inputStream: IInputStream) => IErrorPosition
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
	export class LineIndexErrorPosition implements IErrorPosition {
		private refStream: IIndexStream

		private get lineIndex() {
			return this.refStream.lineIndex
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
			const indexStream = locateIndexCarryingUpwards(this.inputStream)
			if (!indexStream) throw new MissingObjectError("IIndexStream")
			this.refStream = indexStream
			return this
		}

		constructor(private readonly inputStream: IInputStream) {}
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
	export class BasicErrorPosition implements IErrorPosition {
		private refStream: IOwnedStream & IPosed<number>

		toNumber(): number {
			return this.refStream.pos
		}

		locate() {
			const posStream = locatePosCarryingUpwards(this.inputStream)
			if (!posStream)
				throw new MissingObjectError("IPosed<number> & IOwnedStream")
			this.refStream = posStream
			return this
		}

		constructor(private readonly inputStream: IInputStream) {}
	}
}
