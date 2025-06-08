import { mixin } from "../../../mixin.js"

export const SyncCurrStream = new mixin.sealed({
	name: "SyncCurrStream",
	properties: {
		syncCurr() {
			this.curr = this.resource.curr
		}
	}
})
