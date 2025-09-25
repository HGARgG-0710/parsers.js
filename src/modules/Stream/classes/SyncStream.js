import { mixin } from "../../../mixin.js"

export const SyncStream = new mixin({
	name: "SyncStream",
	properties: {
		get curr() {
			return this.resource.curr
		},

		get isEnd() {
			return this.resource.isEnd
		}
	}
}).toClass()
