import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { LocatorState } from "./interfaces.js"

export function streamLocatorFinished<KeyType = any>(this: LocatorState<KeyType>) {
	return (this.streams as BasicStream[])[0].isEnd || this.result[0]
}

export function streamLocatorChange<KeyType = any>(
	this: LocatorState<KeyType>,
	currRes: boolean
) {
	this.result[0] = currRes
	this.result[1] = (this.streams as BasicStream[])[0].pos
	if (!currRes) (this.streams as BasicStream[])[0].next()
}
