import { mixin } from "../../../mixin.js"

export const SyncStream = new mixin.sealed({
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
