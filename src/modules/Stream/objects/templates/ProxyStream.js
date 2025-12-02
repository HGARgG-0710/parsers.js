import { mixin } from "../../../../mixin.js"
import {
	Initializable,
	ownerInitializer
} from "../../../objects/Initializer.js"
import { isStateful } from "../../../utils/Stream.js"
import { PreCommonStream } from "./PreCommonStream.js"

export const ProxyStream = new mixin(
	{
		name: "ProxyStream",
		properties: {
			// * Explanation:
			// Since the `.init` method DELEGATES the initialization to `.delegate`,
			// one CANNOT treat the `.init` as a mean of stream-creation: one simply
			// MAY NOT reuse the `ErrorStream`, since it is *bound* to the underlying
			// `.delegate: IOwnedStream`.
			// * HOWEVER, one still *might* be able to reuse the `delegate`,
			// since the `ErrorProxyStream` is going in the garbage...
			free() {
				this.delegate.free()
			},

			next() {
				this.delegate.next()
			},

			isCurrEnd() {
				return this.delegate.isCurrEnd()
			},

			get isEnd() {
				return this.delegate.isEnd
			},

			get curr() {
				return this.delegate.curr
			},

			get initializer() {
				return ownerInitializer
			},

			get state() {
				return this.delegate.state
			},

			setState(state) {
				if (isStateful(this.delegate)) this.delegate.setState(state)
				return this
			},

			get depthMarks() {
				return this.delegate.depthMarks
			},

			setResource(resource) {
				this.delegate.setResource(resource)
			}
		},
		constructor(delegate) {
			this.delegate = delegate
			this.delegate.setOnwer(this)
		}
	},
	[Initializable, PreCommonStream]
).toClass()
