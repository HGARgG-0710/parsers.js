import type { IErrorData } from "../interfaces.js"

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
 * This is the error thrown by `LineIndexErrorPosition` upon
 * failing to successfully complete the `.locate()` method.
 */
export class MissingObjectError extends ConstructorError {
	constructor(type: string) {
		super(`Failure obtaining the object of type \`${type}\``)
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
