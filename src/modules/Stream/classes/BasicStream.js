import { Initializable } from "../../../classes/Initializer.js"
import { mixin } from "../../../mixin.js"
import { CommonStream } from "./CommonStream.js"
import { DyssyncStream } from "./DyssyncStream.js"

export const BasicStream = new mixin(
	{
		name: "BasicStream",
		properties: {
			update(newCurr) {
				this.curr = newCurr
			},

			postInit(...args) {
				if (this.initGetter) this.curr = this.initGetter(...args)
			},

			endStream() {
				this.isEnd = true
			},

			startStream() {
				this.isEnd = false
			},

			next() {
				const curr = this.curr
				if (this.isCurrEnd()) {
					this.endStream()
					this.postEnd?.()
				} else this.update(this.baseNextIter(curr))
			},

			init(...args) {
				this.startStream()
				this.super.Initializable.init.call(this, ...args)
				this.postInit(...args)
				return this
			}
		},
		constructor(...args) {
			this.super.Initializable.constructor.call(this, ...args)
		}
	},
	[Initializable, DyssyncStream, CommonStream]
).toClass()
