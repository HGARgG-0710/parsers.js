import { DepthMarkStream } from "../../objects/Stream.js"

export enum RegexMarks {
	Group = 0
}

export const EnableClbrackStream = DepthMarkStream([RegexMarks.Group])
