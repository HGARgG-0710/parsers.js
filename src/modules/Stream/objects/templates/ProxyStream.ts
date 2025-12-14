import type { IParseState, IProxyStream } from "../../../../interfaces.js"
import { isStateful } from "../../../../utils/Stream.js"
import type { IOwnedStream } from "../../interfaces/OwnedStream.js"
import { CustomLinkedStream } from "./CustomLinkedStream.js"

// ! PRE-DOC NOTE: the `ProxyStream`s are intended to be NON-REUSABLE (i.e. throwaways)
// * HOWEVER, the *underlying* stream MAY be reusable, i.e. that is why the `free` is implemented at all...
// * Note also that they're intended to allow DEEP PROXYING (i.e. the Decorator Pattern)
export abstract class ProxyStream<T = any>
	extends CustomLinkedStream<T>
	implements IProxyStream<T>
{
	protected readonly delegate: IProxyStream<T>

	// * Explanation:
	// Since the `.init` method DELEGATES the initialization to `.delegate`,
	// one CANNOT treat the `.init` as a mean of stream-creation: one simply
	// MAY NOT reuse the `ErrorStream`, since it is *bound* to the underlying
	// `.delegate: IOwnedStream`.
	// * HOWEVER, one still *might* be able to reuse the `delegate`,
	// since the `ErrorProxyStream` is going in the garbage...
	free() {
		this.delegate.free()
	}

	next() {
		this.delegate.next()
	}

	isCurrEnd() {
		return this.delegate.isCurrEnd()
	}

	get isEnd() {
		return this.delegate.isEnd
	}

	get curr() {
		return this.delegate.curr
	}

	get state() {
		return this.delegate.state
	}

	setState(state: IParseState) {
		if (isStateful(this.delegate)) this.delegate.setState(state)
		return this
	}

	get depthMarks() {
		return this.delegate.depthMarks
	}

	connectResource(resource: IOwnedStream) {
		super.connectResource(resource)
		this.delegate.connectResource(resource)
	}

	baseInit() {
		this.delegate.baseInit()
	}

	constructor(delegate: IProxyStream<T>) {
		super()
		this.delegate = delegate
		this.delegate.connectOwner(this)
	}
}
