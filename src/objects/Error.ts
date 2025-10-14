import type {
	IDebugNamed,
	IErrorData,
	IErrorDataGetter,
	IOwnedStream,
	IPrintablePosition,
	ITypeCheckable
} from "../interfaces.js"
import { locateState } from "../utils/Stream.js"

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

export function prepareExpectError<T = any>(
	errData: IErrorData,
	received: T,
	expected: any
) {
	errData.refresh()
	errData.setInfo("received", received)
	errData.setInfo("expected", expected)
	return errData
}

export function expect<T = any>(item: T) {
	return function (
		stream: IOwnedStream<T>,
		errDataGetter: IErrorDataGetter<T>
	) {
		if (stream.curr !== item)
			throw new ExpectedItemMissingError(
				prepareExpectError(errDataGetter(stream), stream.curr, item)
			)
	}
}

export function expectKind<T = any>(kind: ITypeCheckable & IDebugNamed) {
	return function (
		stream: IOwnedStream<T>,
		errDataGetter: IErrorDataGetter<T>
	) {
		if (!kind.is(stream.curr))
			throw new ExpectedKindMissingError(
				prepareExpectError(errDataGetter(stream), stream.curr, kind)
			)
	}
}

export function allow<T = any>(..._items: T[]) {
	const items = new Set(_items)
	return function (
		stream: IOwnedStream<T>,
		errDataGetter: IErrorDataGetter<T>
	) {
		if (!items.has(stream.curr))
			throw new ExpectedInItemListMissingError(
				prepareExpectError(errDataGetter(stream), stream.curr, _items)
			)
	}
}

export function skip<T = any>(...items: T[]) {
	const allowItems = allow(...items)
	return function (
		stream: IOwnedStream<T>,
		errDataGetter: IErrorDataGetter<T>
	) {
		allowItems(stream, errDataGetter)
		stream.next()
	}
}

export function prepareUnexpectedItemError<T = any>(
	errData: IErrorData,
	received: T
) {
	errData.refresh()
	errData.setInfo("received", received)
	return errData
}

export function unexpected<T = any>(
	stream: IOwnedStream<T>,
	errDataGetter: IErrorDataGetter<T>
) {
	throw new UnexpectedItemError(
		prepareUnexpectedItemError(errDataGetter(stream), stream.curr)
	)
}

export function allowKind<T = any>(...kinds: (IDebugNamed & ITypeCheckable)[]) {
	return function (
		stream: IOwnedStream<T>,
		errDataGetter: IErrorDataGetter<T>
	) {
		const currItem = stream.curr
		for (const kind of kinds) if (kind.is(currItem)) return
		throw new ExpectedInKindListMissingError(
			prepareExpectError(errDataGetter(stream), stream.curr, kinds)
		)
	}
}

export abstract class MessageBuilderParseError extends ParseError {
	private _errData: IErrorData

	protected get separator() {
		return ", "
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
		return this.optionalFields().join("")
	}

	protected getFullMessage() {
		return this.printMandatory() + this.printOptional()
	}

	protected makeMessage(errorData: IErrorData): string {
		this._errData = errorData
		const message = this.getFullMessage()
		errorData.markHandled()
		return message
	}
}

export abstract class ExpectedMissingError extends MessageBuilderParseError {
	protected abstract printExpected(expected: any): string

	protected printReceived(received: any) {
		return `received item: ${received}`
	}

	protected printPosition(position: IPrintablePosition) {
		return position.toString
			? `${this.separator}at source position: ${position.toString()}`
			: position.toNumber
			? `${this.separator}at source position: ${position.toNumber()}`
			: ``
	}

	protected printFilename(filename: string) {
		return filename ? `${this.separator}in file: ${filename}` : ``
	}

	private expected() {
		return this.printExpected(this.errData.getInfo("expected"))
	}

	private received() {
		return this.printReceived(this.errData.getInfo("received"))
	}

	protected mandatoryFields() {
		return [this.expected(), this.received()]
	}

	private position() {
		return this.printPosition(this.errData.pos)
	}

	private filename() {
		return this.printFilename(this.errData.getInfo("filename"))
	}

	protected optionalFields() {
		return [this.position(), this.filename()]
	}
}

export class ExpectedItemMissingError extends ExpectedMissingError {
	protected printExpected(item: any) {
		return `expected item: ${item}`
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

export class UnexpectedItemError extends MessageBuilderParseError {
	private printReceived(received: any) {
		return `received unexpected input item: ${received}`
	}

	private received() {
		return this.printReceived(this.errData.getInfo("received"))
	}

	protected mandatoryFields(): string[] {
		return [this.received()]
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
