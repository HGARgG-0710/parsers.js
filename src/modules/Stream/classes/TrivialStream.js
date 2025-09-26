import { mixin } from "../../../mixin.js"
import { CommonStream } from "./CommonStream.js"
import { DyssyncStream } from "./DyssyncStream.js"

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
	[CommonStream, DyssyncStream]
).toClass()
