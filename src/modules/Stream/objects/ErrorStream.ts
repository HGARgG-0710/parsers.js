import { resourceInitializer } from "../../Initializer/objects/ResourceInitializer.js"
import type { ILinkedStream, IOwnedStream } from "../interfaces/OwnedStream.js"
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
	implements ILinkedStream<T>
{
	protected abstract errHandler(err: any): void

	get initializer() {
		return resourceInitializer
	}

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

	constructor(private readonly delegate: ILinkedStream<T>) {
		super()
		delegate.setOwner(this)
	}
}
