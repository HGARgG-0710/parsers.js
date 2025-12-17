import type { IParseState } from "../../../../interfaces.ts"
import type { IControlStream } from "../../interfaces/OwnedStream.ts"
import type { ProxyStream } from "../templates.ts"

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
export declare abstract class ErrorStream<T = any>
	extends ProxyStream<T>
	implements IControlStream<T>, Iterable<T>
{
	protected abstract errHandler(err: any): void
	protected wrapInHandler<T = any>(callback: () => T): T | void
	next(): void
	baseInit(): void
	get state(): IParseState
}
