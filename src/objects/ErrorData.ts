import type {
	IErrorData,
	IErrorPosition,
	IErrorPositionLocator,
	IIndexCarrying,
	IInputStream,
	IPosed,
	IStream
} from "../interfaces.js"
import { negate } from "../modules/Stream/utils/StreamPosition.js"
import { MissingImplementationError, MissingObjectError } from "./Error.js"
import { ownerDigger, PropDigger, resourceDigger } from "./PropDigger.js"

/**
 * This is the abstract class implementing `IErrorData` serving as
 * the base, by providing methods and state implementation of the
 * `readonly .hasError: boolean` property. It still requires the
 * child class to provide the `abstract readonly pos: IErrorPosition`.
 */
export abstract class BaseErrorData implements IErrorData {
	private readonly infoMap = new Map<string, any>()
	abstract readonly pos: IErrorPosition
	private _hasError: boolean = false

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
	export class LineIndexCarrying implements IErrorPosition {
		private refStream: IStream & IIndexCarrying

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
			const indexStream = this.indexCarryingLocator.locate(
				this.inputStream
			)
			if (!indexStream)
				throw new MissingObjectError("IStream & IIndexCarrying")
			this.refStream = indexStream
			return this
		}

		constructor(
			private readonly inputStream: IInputStream,
			private readonly indexCarryingLocator: IErrorPositionLocator<
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
	export class PosCarrying implements IErrorPosition {
		private refStream: IStream & IPosed<number>

		toNumber(): number {
			return this.refStream.pos
		}

		locate() {
			const posStream = this.posCarryingLocator.locate(this.inputStream)
			if (!posStream)
				throw new MissingObjectError("IPosed<number> & IStream")
			this.refStream = posStream
			return this
		}

		constructor(
			private readonly inputStream: IInputStream,
			private readonly posCarryingLocator: IErrorPositionLocator<
				IStream & IPosed<number>
			>
		) {}
	}

	export namespace Locator {
		/**
		 * An abstract implementation of `IErrorPositionLocator` to represent
		 * a locator based off an abstract `PropDigger` instance provided by
		 * the child classes. The `locate()` algorithm implementation calls
		 * the `dig` method on `inputStream`, with a negation of the search
		 * predicate supplied via the constructor,
		 */
		export abstract class WithPropDigger<T = any>
			implements IErrorPositionLocator<T & IStream>
		{
			protected abstract get digger(): PropDigger

			locate(inputStream: IInputStream): (T & IStream<any>) | null {
				return (
					this.digger.dig(inputStream, negate(this.predicate)) || null
				)
			}

			constructor(private readonly predicate: (x: IStream) => boolean) {}
		}

		/**
		 * A `WithPropDigger` case with `ownerDigger` as the `digger`. 
		 */
		export class Upwards<T = any> extends WithPropDigger<T> {
			protected get digger(): PropDigger {
				return ownerDigger
			}
		}

		/**
		 * A `WithPropDigger` case with `resourceDigger` as the `digger`. 
		*/
		export class Downwards<T = any> extends WithPropDigger<T> {
			protected get digger(): PropDigger {
				return resourceDigger
			}
		}
	}
}
