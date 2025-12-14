import type { IOwnedStream, IStream } from "./Stream.js"

export interface ISourceGenerator<NodeLike> {
	fromStream(stream: IOwnedStream<NodeLike>): IStream<string>
	fromNode(node: NodeLike): string
}
