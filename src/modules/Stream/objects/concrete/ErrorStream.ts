import type { IControlStream } from "../../interfaces/OwnedStream.js"
import { StatefulProxyStream } from "../templates.js"

// ! [testing] CRUCIAL REMINDER: here, the `Stateful` OVERRIDES the delegation of `get .state/setState(): void` to `this.delegate` on the `ProxyStream` parent
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
	extends StatefulProxyStream<T>
	implements IControlStream<T>
{
	protected abstract errHandler(err: any): void

	protected wrapInHandler<T = any>(callback: () => T): T | void {
		try {
			const retval = callback()
			this.onSuccess()
			return retval
		} catch (err) {
			this.errHandler(err)
		}
	}

	protected onSuccess(): void {}

	override next() {
		this.wrapInHandler(() => super.next())
	}

	override baseInit() {
		this.wrapInHandler(() => super.baseInit())
	}
}
