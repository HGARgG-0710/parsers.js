import type { ICellNode, IStream } from "../../../../../interfaces.js"

export const currUnicodeHex = (stream: IStream<ICellNode<string>>) =>
	stream.curr.value
