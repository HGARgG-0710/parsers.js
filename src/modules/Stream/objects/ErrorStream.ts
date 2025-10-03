import { resourceDigger } from "../../../objects.js"
import type {
	IIndexStream,
	ILineIndex,
	ILinkedStream,
	IOwnedStream,
	IResourcefulStream
} from "../../../interfaces.js"
import { isIndexCarrying } from "../../../is/Stream.js"
import { negate } from "../utils/StreamPosition.js"
import { IdentityStream } from "./IdentityStream.js"

/**
 * This is an abstract stream class, extending `IdentityStream`,
 * and intended for creation of Error-handling Stream-s.
 *
 * It enables configuration of elementary error-handling
 * operations via user-provided abstract method,
 * `protected abstract errHandler(err: any)`, where `err` is the item
 * within the closest `throw err` expression, which caused the
 * `ErrorStream` in question to take control.
 *
 * The `ErrorStream` (the user-provided handler-method,
 * specifically) takes over the control in event that a
 * `throw` statement, or a natural `Error` occurs during the
 * traversal of one of the underlying `IStream`s.
 */
export abstract class ErrorStream<T = any> extends IdentityStream<T> {
	protected abstract errHandler(err: any): void

	next() {
		try {
			super.next()
		} catch (e) {
			this.errHandler(e)
		}
	}
}

/**
 * This is an abstract descendant of the `ErrorStream`,
 * implementing `IIndexStream<T>`.
 * It contains properties:
 *
 * 1. `protected readonly inputStream: IIndexStream<I>`
 * 2. `readonly lineIndex: ILineIndex`
 *
 * These are defined upon the Stream's initialization.
 * It, thus, allows tracking a given `ILineIndex` object,
 * and the underlying `IIndexStream`
 */
export abstract class BasicErrorStream<
	T = any,
	I = string
> extends ErrorStream<T> {
	protected inputStream: IIndexStream<I>
	private _lineIndex: ILineIndex

	private set lineIndex(newIndex: ILineIndex) {
		this._lineIndex = newIndex
	}

	get lineIndex() {
		return this._lineIndex
	}

	private inputGetter() {
		return resourceDigger.dig<IResourcefulStream<T>, IIndexStream<I>>(
			this.resource! as IOwnedStream & IResourcefulStream,
			negate(isIndexCarrying)
		)
	}

	private posGetter(): ILineIndex {
		return this.inputStream!.lineIndex
	}

	private getInput() {
		this.inputStream = this.inputGetter()
		this.lineIndex = this.posGetter()
	}

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this.getInput()
	}
}

/**
 * This is a mixin-function (as in `TypeScript` mixins) for creation of
 * classes-descendants of `ErrorStream` [or, `BasicErrorStream`, or any other
 * `abstract` descendant], which implement the `errHandler` by `throw`-ing
 * the given `err`. It, thus, does one of:
 *
 * 1. abandons the handling of the raised exception altogether [no other `try-catch` blocks]
 * 2. passes the `err`-something to the next `ErrorStream` "above" in the parser-chain (if there is one)
 *
 * Typically, this is not the desired error-handling technique.
 * Instead, unless there's a good reason not to, prefer one of:
 *
 * 1. __error-resistant-parsing__ (when possible) - manipulates the underlying `Stream`s
 * to skip any input deemed invalid, and/or performing partial parsing.
 *
 * 2. __case-specific error-messages__ (when not) - useful for providing essential
 * information as to the cause of the error during parsing.
 */
export function DefaultErrorStream<
	ErrorBase extends abstract new (...args: any[]) => ErrorStream
>(BaseErrorStream: ErrorBase): new (resource?: IOwnedStream) => ILinkedStream {
	abstract class M extends BaseErrorStream {}

	// Vital note: we don't implement the `free()` on this thing
	// because of the prescribed `errHandler` behaviour - it is
	// expected that AFTER the thing is called, we no longer need
	// to free the allocated `IStream`s.
	//
	// Note, however, that in case this assumption fails and there
	// is a `try-catch` block wrapped around the parser-function
	// inside of which this `DefaultErrorStream` is employed
	// (one inside of which it throws), one leaks only a very
	// insubstantial amount of memory. In order for this leak to
	// become even remotely significant, the user must create an
	// ungodly number of `DefaultErrorStream`s, far beyond any
	// amount requested by any reasonable practical application
	// of the library.
	return class extends M {
		free() {}
		protected errHandler(err: any): void {
			throw err
		}
	}
}
