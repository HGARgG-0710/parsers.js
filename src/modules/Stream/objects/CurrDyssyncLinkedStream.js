import { mixin } from "../../../mixin.js"
import { CurrDyssyncStream } from "./CurrDyssyncStream"
import { CustomLinkedStream } from "./CustomLinkedStream"

export const CurrDyssyncLinkedStream = new mixin(
	{
		name: "CurrDyssyncLinkedStream",
		properties: {},
		constructor(resource) {
			this.super.CustomLinkedStream.constructor.call(this, resource)
		}
	},
	[CustomLinkedStream, CurrDyssyncStream]
)
