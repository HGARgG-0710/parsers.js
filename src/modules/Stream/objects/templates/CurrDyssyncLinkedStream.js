import { mixin } from "../../../../mixin.js"
import { CurrDyssyncStream } from "./CurrDyssyncStream.js"
import { CustomLinkedStream } from "./CustomLinkedStream.js"

export const CurrDyssyncLinkedStream = new mixin(
	{
		name: "CurrDyssyncLinkedStream",
		properties: {
			postFree() {
				this.super.CustomLinkedStream.postFree.call(this)
				this.resetCurr()
			}
		},
		constructor(resource) {
			this.super.CustomLinkedStream.constructor.call(this, resource)
		}
	},
	[CustomLinkedStream, CurrDyssyncStream]
)
