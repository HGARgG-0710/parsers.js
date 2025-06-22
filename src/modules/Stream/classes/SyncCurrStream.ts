import type { IResourcefulStream } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"

/**
 * This is a (sealed) mixin providing the `syncCurr(): void` method,
 * which sets `this.curr` to `this.resource.curr`.
 */
export const SyncCurrStream = new mixin.sealed<IResourcefulStream>({
	name: "SyncCurrStream",
	properties: {
		syncCurr() {
			this.curr = this.resource.curr
		}
	}
})
