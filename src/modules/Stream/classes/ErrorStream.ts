import { resourceDigger } from "../../../classes.js"
import type {
	IIndexStream,
	ILineIndex,
	ILinkedStream,
	IOwnedStream
} from "../../../interfaces.js"
import { isIndexCarrying } from "../../../is/Stream.js"
import { negate } from "../utils/StreamPosition.js"
import { WrapperStream, WrapperStreamAnnotation } from "./WrapperStream.js"

abstract class ErrorStreamAnnotation<
	T = any
> extends WrapperStreamAnnotation<T> {
	protected abstract errHandler(err: any): void
}

let errorStream: typeof ErrorStreamAnnotation | null = null

function BuildErrorStream<T = any>() {
	abstract class ErrorStream extends WrapperStream.generic!<T>() {
		protected abstract errHandler(err: any): void

		next() {
			try {
				super.next()
			} catch (e) {
				this.errHandler(e)
			}
		}
	}

	return ErrorStream as unknown as typeof ErrorStreamAnnotation<T>
}

function PreErrorStream<T = any>(): typeof ErrorStreamAnnotation<T> {
	return errorStream
		? errorStream
		: (errorStream = BuildErrorStream<T>() as typeof ErrorStreamAnnotation)
}

abstract class BasicErrorStreamAnnotation<T = any, I = string>
	extends ErrorStreamAnnotation<T>
	implements IIndexStream<T>
{
	protected readonly inputStream: IIndexStream<I>
	readonly lineIndex: ILineIndex
}

let basicErrorStream: typeof BasicErrorStreamAnnotation | null = null

function BuildBasicErrorStream<T = any, I = string>() {
	abstract class BasicErrorStream extends PreErrorStream<T>() {
		protected inputStream: IIndexStream<I>
		private _lineIndex: ILineIndex

		private set lineIndex(newIndex: ILineIndex) {
			this._lineIndex = newIndex
		}

		get lineIndex() {
			return this._lineIndex
		}

		private inputGetter() {
			return resourceDigger.dig<this, IIndexStream<I>>(
				this,
				negate(isIndexCarrying)
			)
		}

		private posGetter(): ILineIndex {
			return this.inputStream!.lineIndex
		}

		private cacheInput() {
			this.inputStream = this.inputGetter()
			this.lineIndex = this.posGetter()
		}

		setResource(newResource: IOwnedStream): void {
			super.setResource(newResource)
			this.cacheInput()
		}
	}

	return BasicErrorStream as unknown as typeof BasicErrorStreamAnnotation<
		T,
		I
	>
}

function PreBasicErrorStream<
	T = any,
	I = string
>(): typeof BasicErrorStreamAnnotation<T, I> {
	return basicErrorStream
		? basicErrorStream
		: (basicErrorStream = BuildBasicErrorStream<
				T,
				I
		  >() as typeof BasicErrorStreamAnnotation)
}

/**
 * This is an abstract stream class, extending `WrapperStream`,
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
export const ErrorStream: ReturnType<typeof PreErrorStream> & {
	generic?: typeof PreErrorStream
} = PreErrorStream()

ErrorStream.generic = PreErrorStream

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
export const BasicErrorStream: ReturnType<typeof PreBasicErrorStream> & {
	generic?: typeof PreBasicErrorStream
} = PreBasicErrorStream()

BasicErrorStream.generic = PreBasicErrorStream

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
	ErrorBase extends abstract new (...args: any[]) => ErrorStreamAnnotation
>(BaseErrorStream: ErrorBase): new (resource?: IOwnedStream) => ILinkedStream {
	abstract class M extends BaseErrorStream {}

	return class extends M {
		protected errHandler(err: any): void {
			throw err
		}
	}
}
