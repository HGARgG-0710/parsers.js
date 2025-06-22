import type { IResourcefulStream } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"

/**
 * This is a (sealed) mixin that delegates the
 * `.curr`, `.isEnd` and `.isStart` to its
 * `.resource: IOwnedStream` [which is to be
 * provided by the using party].
 */
export const SyncStream = new mixin.sealed<IResourcefulStream>({
	name: "SyncStream",
	properties: {
		get curr() {
			return this.resource.curr
		},

		get isEnd() {
			return this.resource!.isEnd
		},

		get isStart() {
			return this.resource!.isStart
		}
	}
})
