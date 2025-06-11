import { mixin } from "../../../mixin.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
import { DelegateStream } from "./DelegateStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

/**
 * This is a (sealed) mixin that combines `IterableStream`,
 * `DelegateStream` and `OwnableStream` abstract classes.
 * It uses the constructor of `DelegateStream`.
 */
export const PipeStream = new mixin.sealed(
	{
		name: "PipeStream",
		properties: {},
		constructor: function (resource?: IOwnedStream) {
			this.super.DelegateStream.constructor.call(this, resource)
		}
	},
	[],
	[IterableStream, DelegateStream, OwnableStream]
)
