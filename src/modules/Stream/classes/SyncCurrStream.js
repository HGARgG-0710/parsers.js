import { mixin } from "../../../mixin.js"

export const SyncCurrStream = new mixin({
	name: "SyncCurrStream",
	properties: {
		syncCurr() {
			this.curr = this.resource.curr
		}
	}
}).toClass()
