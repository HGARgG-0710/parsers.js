import type {
	IControlStream,
	IOwnedStream
} from "../../interfaces/OwnedStream.js"
import { ProxyStream } from "../templates.js"

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
	extends ProxyStream<T>
	implements IControlStream<T>, Iterable<T>
{
	protected abstract errHandler(err: any): void

	next() {
		try {
			super.next()
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
}
