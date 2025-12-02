import type { ObjectPool } from "../../../../objects.ts"
import type { ICommonStream } from "../../interfaces/CommonStream.ts"
import type { IOwnedStream } from "../../interfaces/OwnedStream.ts"
import { CustomLinkedStream } from "../templates.js"

export class FlattenerStream<T = any>
	extends CustomLinkedStream<T>
	implements ICommonStream<T>
{
	static readonly pool: ObjectPool<FlattenerStream, [IOwnedStream<any[]>?]>
	protected get pool(): ObjectPool<FlattenerStream, [IOwnedStream<T[]>?]>
	free(): void
	isCurrEnd(): boolean
	next(): void
	get curr(): T
	get isEnd(): boolean
	constructor(stream?: IOwnedStream<T[]>)
}
