import type { BackupIndex } from "./Position.js"

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
 * error took place] and `at: BackupIndex` [index at which
 * error took place inside of the specified source].
 *
 * Expects a `makeMessage` method, which creates a message
 * based off `atIndex: BackupIndex` and `.atPath: string`,
 * and returns a `string`. The `makeMessage` method is
 * used inside the constructor to produce the `.message: string`
 * property of the error object in question.
 *
 * Can be easily used with `ErrorStream` descendant.
 */
export abstract class ParseError extends ConstructorError {
	protected abstract makeMessage(
		atIndex: BackupIndex,
		atPath: string,
		options?: ErrorOptions
	): string

	constructor(at: BackupIndex, source: string = "", options?: ErrorOptions) {
		super()
		this.message = this.makeMessage(at, source, options)
	}
}
