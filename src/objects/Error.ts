import { array } from "@hgargg-0710/one"
import { Config } from "../global.js"
import type {
	IDebugNamed,
	IErrorData,
	IErrorDataGetter,
	IErrorType,
	IOwnedStream,
	IPrintablePosition,
	IRenewerStream,
	ISimpleErrorData,
	IStream,
	ITypeCheckable
} from "../interfaces.js"
import { isDecimal } from "../samples/alphabet.js"
import { getNewline } from "../samples/space.js"
import { tryDebugPrinting } from "../utils/Debug.js"
import { locateState } from "../utils/Stream.js"
import { ResourceFollower } from "./PropertyPath.js"

function tabbed(...lines: string[]) {
	return lines.map((x) => `${Config.errors.tab}${x}`)
}

/**
 * This is an abstract class for representing
 * an `Error` object, whose `.name` property is the same
 * as that of its `.constructor`.
 */
export abstract class ConstructorError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options)
		this.name = this.constructor.name
	}
}

/**
 * This is an abstract class for representing a generic parsing error,
 * which takes in the `source: string` [intended as a string
 * indicative of the filepath or other parsing source, where
 * error took place] and `at: StringLineIndex` [index at which
 * error took place inside of the specified source].
 *
 * Expects a `makeMessage` method, which creates a message
 * based off `atIndex: StringLineIndex` and `.atPath: string`,
 * and returns a `string`. The `makeMessage` method is
 * used inside the constructor to produce the `.message: string`
 * property of the error object in question.
 *
 * Can be easily used with `ErrorStream` descendant.
 */
export abstract class ParseError extends ConstructorError {
	protected static populate(errData: ISimpleErrorData, ...args: any[]) {}

	// NOTE: this is *only* supposed to be called by CONCRETE child-classes!
	static prepare<T extends ISimpleErrorData = ISimpleErrorData>(
		errData: T,
		...items: any[]
	) {
		errData.refresh()
		this.populate(errData, ...items)
		errData.setErrType(this as unknown as IErrorType)
		return errData
	}

	protected abstract makeMessage(errorData: IErrorData): string
	constructor(errorData: IErrorData) {
		super()
		this.message = this.makeMessage(errorData)
	}
}

/**
 * This is an error thrown in the case of an invalid
 * read potision inside a given file. Expects a position
 * `pos` (in bytes), `size` of a file (in bytes), and its
 * name.
 */
export class InvalidFileReadPositionError extends ConstructorError {
	constructor(fileName: string, pos: number, size: number) {
		super(
			`Error reading a file ${fileName} at pos ${pos}, with size in bytes - ${size}`
		)
	}
}

/**
 * This is an error for representing missing method implementations
 * on a class that requires it.
 */
export class MissingImplementationError extends ConstructorError {
	constructor(methodName: string, className: string) {
		super(
			`Missing implementation of method \`${methodName}\`` +
				` on class \`${className}\``
		)
	}
}

export function findErrorDataUpstream<T = any>(stream: IOwnedStream<T>) {
	const state = locateState(stream)
	if (!state) throw new NoStatefulLocatableError()
	return state.errData
}

export function expect<T = any>(item: T) {
	return function (
		stream: IStream<T>,
		errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
	) {
		if (stream.curr !== item)
			throw ParseError.ExpectedItemMissingError.prepare(
				errDataGetter(stream),
				stream.curr,
				item
			)
	}
}

export function expectKind<T = any>(kind: ITypeCheckable & IDebugNamed) {
	return function (
		stream: IStream<T>,
		errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
	) {
		if (!kind.is(stream.curr))
			throw ParseError.ExpectedKindMissingError.prepare(
				errDataGetter(stream),
				stream.curr,
				kind
			)
	}
}

export function allow<T = any>(...items: T[]) {
	const itemSet = new Set(items)
	return function (
		stream: IStream<T>,
		errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
	) {
		if (!itemSet.has(stream.curr))
			throw ParseError.ExpectedInItemListMissingError.prepare(
				errDataGetter(stream),
				stream.curr,
				items
			)
	}
}

export function skip<T = any>(...items: T[]) {
	const allowItems = allow(...items)
	return function (
		stream: IStream<T>,
		errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
	) {
		allowItems(stream, errDataGetter)
		stream.next()
		return 0
	}
}

export function unexpected<T = any>(
	stream: IStream<T>,
	errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
): never {
	throw ParseError.UnexpectedItemError.prepare(
		errDataGetter(stream),
		stream.curr
	)
}

export function allowKind<T = any>(...kinds: (IDebugNamed & ITypeCheckable)[]) {
	return function (
		stream: IStream<T>,
		errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
	) {
		const currItem = stream.curr
		for (const kind of kinds) if (kind.is(currItem)) return
		throw ParseError.ExpectedInKindListMissingError.prepare(
			errDataGetter(stream),
			stream.curr,
			kinds
		)
	}
}

export function tryReviveChild<T = any>(
	stream: IRenewerStream<T>,
	errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
) {
	if (stream.reviveChild() === false)
		throw ParseError.CannotReviveChildError.prepare(
			errDataGetter(stream),
			stream
		)
}

export function ensureChildUnrevivable<T = any>(
	stream: IRenewerStream<T>,
	errDataGetter: IErrorDataGetter<T> = findErrorDataUpstream
) {
	if (stream.reviveChild() === true)
		throw ParseError.ChildIsNotUnrevivableError.prepare(
			errDataGetter(stream),
			stream
		)
}

export function ensureCurrDecimal(
	input: IStream<string>,
	errDataGetter: IErrorDataGetter<string> = findErrorDataUpstream
) {
	const maybeDecimal = input.curr
	if (!isDecimal(maybeDecimal))
		throw ParseError.ExpectedDecimalError.prepare(
			errDataGetter(input),
			maybeDecimal
		)
}

export function validateId(validator: (id: string) => boolean) {
	return function (
		stream: IStream<string>,
		errDataGetter: IErrorDataGetter<string> = findErrorDataUpstream
	) {
		const id = stream.curr
		if (!validator(id))
			throw ParseError.InvalidIdError.prepare(errDataGetter(stream), id)
	}
}

export namespace ParseError {
	export abstract class MessageBuilderParseError extends ParseError {
		private _errData: IErrorData

		private setErrData(errorData: IErrorData) {
			this._errData = errorData
		}

		protected get separator() {
			return `,${getNewline()}`
		}

		protected get errData() {
			return this._errData
		}

		protected abstract mandatoryFields(): string[]

		protected optionalFields(): string[] {
			return []
		}

		private printMandatory() {
			return this.mandatoryFields().join(this.separator)
		}

		private printOptional() {
			return this.optionalFields().join(this.separator)
		}

		protected getFullMessage() {
			const optional = this.printOptional()
			const mandatory = this.printMandatory()
			return (
				optional + (optional.length ? this.separator : "") + mandatory
			)
		}

		protected makeMessage(errorData: IErrorData): string {
			this.setErrData(errorData)
			const message = this.getFullMessage()
			errorData.markHandled()
			return message
		}
	}

	export abstract class GenericParseError extends MessageBuilderParseError {
		protected printPosition(position: IPrintablePosition) {
			return position.toString
				? `at source position: ${position.toString()}`
				: position.toNumber
					? `at source position: ${position.toNumber()}`
					: ``
		}

		protected printFilename(filename: string) {
			return filename ? `in file: ${filename}` : ``
		}

		private position() {
			return this.printPosition(this.errData.pos)
		}

		private filename() {
			return this.printFilename(this.errData.getInfo("filename"))
		}

		protected override optionalFields() {
			return [this.filename(), this.position()]
		}
	}

	export abstract class ExpectedMissingError extends GenericParseError {
		protected static override populate<T = any>(
			errData: ISimpleErrorData,
			received: T,
			expected: any
		): void {
			errData.setInfo("received", received)
			errData.setInfo("expected", expected)
		}

		static override prepare<
			T = any,
			K extends ISimpleErrorData = ISimpleErrorData
		>(errData: K, received: T, expected: any) {
			return super.prepare(errData, received, expected)
		}

		protected abstract printExpected(expected: any): string

		protected printReceived(received: any) {
			return `received item: ${tryDebugPrinting(received)}`
		}

		private expected() {
			return this.printExpected(this.errData.getInfo("expected"))
		}

		private received() {
			return this.printReceived(this.errData.getInfo("received"))
		}

		protected mandatoryFields() {
			return tabbed(this.expected(), this.received())
		}
	}

	export class ExpectedItemMissingError extends ExpectedMissingError {
		protected printExpected(item: any) {
			return `expected item: ${tryDebugPrinting(item)}`
		}
	}

	export class ExpectedKindMissingError extends ExpectedMissingError {
		protected printExpected(kind: IDebugNamed): string {
			return `expected item of kind: ${kind.debugName}`
		}
	}

	export class ExpectedInItemListMissingError extends ExpectedMissingError {
		protected printExpected(allowed: any[]): string {
			return `expected one of the items in: [${allowed.join(", ")}]`
		}
	}

	export class ExpectedInKindListMissingError extends ExpectedMissingError {
		protected printExpected(kinds: IDebugNamed[]): string {
			return (
				`expected an item of one of the kinds:` +
				`[${kinds.map((x) => x.debugName).join(", ")}]`
			)
		}
	}

	export class UnexpectedItemError extends GenericParseError {
		protected static override populate<T = any>(
			errData: IErrorData,
			received: T
		): void {
			errData.setInfo("received", received)
		}

		static override prepare<
			T = any,
			K extends ISimpleErrorData = ISimpleErrorData
		>(errData: K, received: T) {
			return super.prepare(errData, received)
		}

		private printReceived(received: any) {
			return `received unexpected input item: ${tryDebugPrinting(
				received
			)}`
		}

		private received() {
			return this.printReceived(this.errData.getInfo("received"))
		}

		protected mandatoryFields(): string[] {
			return tabbed(this.received())
		}
	}

	export abstract class StreamStackError<T = any> extends GenericParseError {
		private readonly resourceFollower = ResourceFollower.caching()

		private lastStackIndex: number | null = null
		private stackDepth: number | null = null

		private reverseStackIndex(i: number) {
			return this.lastStackIndex! - i
		}

		private printChildCurrItem(i: number, item: T) {
			return `current item in stream (${this.reverseStackIndex(
				i
			)}): ${tryDebugPrinting(item)}`
		}

		private followCurr(childDepth: number) {
			return this.resourceFollower.follow(this.originStream, childDepth)
		}

		private childCurrItem(i: number) {
			return this.printChildCurrItem(i, this.followCurr(i)!.curr)
		}

		private getStackDepth() {
			return this.stackDepth !== null
				? this.stackDepth
				: (this.lastStackIndex =
						(this.stackDepth = this.resourceFollower.length(
							this.originStream
						)) - 1)
		}

		private get originStream(): IRenewerStream<T> {
			return this.errData.getInfo("originStream")
		}

		protected mandatoryFields(): string[] {
			return tabbed(
				...array
					.numbers(this.getStackDepth())
					.map((i) => this.childCurrItem(i))
			)
		}
	}

	export abstract class StreamRevivalError<
		T = any
	> extends StreamStackError<T> {
		protected static override populate<T = any>(
			errData: ISimpleErrorData,
			stream: IStream<T>
		): void {
			errData.setInfo("originStream", stream)
		}

		static override prepare<
			T = any,
			K extends ISimpleErrorData = ISimpleErrorData
		>(errData: K, stream: T) {
			return super.prepare(errData, stream)
		}
	}

	export class CannotReviveChildError<
		T = any
	> extends StreamRevivalError<T> {}

	export class ChildIsNotUnrevivableError<
		T = any
	> extends StreamRevivalError<T> {}

	export class ExpectedDecimalError extends GenericParseError {
		protected static override populate(
			errData: IErrorData,
			nonDecimal: string
		): void {
			errData.setInfo("nonDecimal", nonDecimal)
		}

		static override prepare<T extends ISimpleErrorData = ISimpleErrorData>(
			errData: T,
			nonDecimal: string
		) {
			return super.prepare(errData, nonDecimal)
		}

		private printNonDecimal(nonDecimal: string) {
			return `expected a decimal value, received: ${nonDecimal}`
		}

		private nonDecimal() {
			return this.printNonDecimal(this.errData.getInfo("nonDecimal"))
		}

		protected mandatoryFields(): string[] {
			return tabbed(this.nonDecimal())
		}
	}

	export class InvalidIdError extends GenericParseError {
		protected static override populate(
			errData: ISimpleErrorData,
			id: string
		): void {
			errData.setInfo("badId", id)
		}

		static override prepare<T extends ISimpleErrorData = ISimpleErrorData>(
			errData: T,
			id: string
		) {
			return super.prepare(errData, id)
		}

		private printBadID(id: string) {
			return `expected a valid identifier, received: ${id}`
		}

		private badId() {
			return this.printBadID(this.errData.getInfo("badId"))
		}

		protected override mandatoryFields(): string[] {
			return tabbed(this.badId())
		}
	}
}

export abstract class NoPropertyHavingLocatableError extends ConstructorError {
	constructor(property: string) {
		super(`Failed to locate an object with \`.${property}\` property`)
	}
}

export class NoStatefulLocatableError extends NoPropertyHavingLocatableError {
	constructor() {
		super("state")
	}
}

export class NoIndexCarryingLocatableError extends NoPropertyHavingLocatableError {
	constructor() {
		super("lineIndex")
	}
}

export class NoPosedLocatableError extends NoPropertyHavingLocatableError {
	constructor() {
		super("pos")
	}
}

export class XMLGenerationError extends MissingImplementationError {
	constructor(node: IDebugNamed) {
		super("toXML", node.debugName)
	}
}
