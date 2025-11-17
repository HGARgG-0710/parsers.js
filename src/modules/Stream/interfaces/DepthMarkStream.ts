import type { IDepthMark, IStream } from "../../../interfaces.js"

export interface IDepthMarked {
	readonly depthMarks: readonly IDepthMark[]
}

export interface IDepthMarkStream<T = any> extends IStream<T>, IDepthMarked {}
