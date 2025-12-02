import { mixin } from "../../../../mixin.js"
import { BasicStream } from "./BasicStream.js"
import { OwningStream } from "./OwningStream.js"
import { SyncCurrStream } from "./SyncCurrStream.js"

export const BasicResourceStream = new mixin(
	{
		name: "BasicResourceStream",
		properties: {},
		constructor(...items) {
			this.super.BasicStream.constructor.call(this, ...items)
		}
	},
	[BasicStream, OwningStream, SyncCurrStream]
).toClass()
