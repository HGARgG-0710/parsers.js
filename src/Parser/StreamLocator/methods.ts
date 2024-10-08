import type { BasicStream } from "../../Stream/interfaces.js"
import type { LocatorState } from "./interfaces.js"

export function streamLocatorFinished(this: LocatorState) {
	return (this.streams as BasicStream[])[0].isEnd || this.result[0]
}

export function streamLocatorChange(this: LocatorState, currRes: boolean) {
	this.result[0] = currRes
	this.result[1] = (this.streams as BasicStream[])[0].pos
	if (!currRes) (this.streams as BasicStream[])[0].next()
}
