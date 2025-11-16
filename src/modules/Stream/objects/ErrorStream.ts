import type { Summat } from "@hgargg-0710/summat.ts"
import { isStateful } from "../../../utils/Stream.js"
import type { ICommonStream } from "../interfaces/CommonStream.js"
import type {
	IControlStream,
	ILinkedStream,
	IOwnedStream
} from "../interfaces/OwnedStream.js"
import { CustomLinkedStream } from "./CustomLinkedStream.js"

// ! LATER FOR DOCS - *THIS* is how one is supposed to use ErrorHandling-Streams:
// * function SomeChooser() {
// * 	return [
// * 		HighHarmlessStream(),
// * 		ErrorHandlingStream(ErrorThrowingStreamUninit()),
// * 		LowHarmlessStream()
// * 	]
// * }
// ! they are BOUND to have THE SAME lifetime, and `ErrorStream`s serve as PROXIES for other streams...
// !!! LIKEWISE, `ErrorHandlingStream`s CANNOT wrap around choosers - they must accept an UNINITIALIZED STREAM!
export abstract class ErrorStream<T = any>
	extends CustomLinkedStream<T>
	implements IControlStream<T>, Iterable<T>
{
	protected abstract errHandler(err: any): void

	// * Explanation:
	// Since the `.init` method DELEGATES the initialization to `.delegate`,
	// one CANNOT treat the `.init` as a mean of stream-creation: one simply
	// MAY NOT reuse the `ErrorStream`, since it is *bound* to the underlying
	// `.delegate: IOwnedStream`.
	free() {}

	get resource() {
		return this.delegate.resource
	}

	isCurrEnd(): boolean {
		return this.delegate.isCurrEnd()
	}

	get isEnd() {
		return this.delegate.isEnd
	}

	get curr() {
		return this.delegate.curr
	}

	setState(state: Summat) {
		if (isStateful(this.delegate)) this.delegate.setState(state)
		return this
	}

	// ! pre-doc [important]: this returns `.undefined` [as is supposed to...]
	get state() {
		return (this.delegate as IControlStream).state
	}

	next() {
		try {
			this.delegate.next()
		} catch (err) {
			this.errHandler(err)
		}
	}

	setResource(resource: IOwnedStream): void {
		try {
			this.delegate.init(resource)
		} catch (err) {
			this.errHandler(err)
		}
	}

	*[Symbol.iterator]() {
		yield* this.delegate as ICommonStream<T>
	}

	constructor(private readonly delegate: ILinkedStream<T>) {
		super()
	}
}
