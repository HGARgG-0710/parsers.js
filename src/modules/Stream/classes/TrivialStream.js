import { mixin } from "../../../mixin.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export const TrivialStream = new mixin(
	{
		name: "TrivialStream",
		properties: {
			isCurrEnd() {
				return true
			},

			next() {
				this.endStream()
			}
		},
		constructor() {
			this.super.DyssyncStream.constructor.call(this)
		}
	},
	[OwnableStream, IterableStream, DyssyncStream]
).toClass()
