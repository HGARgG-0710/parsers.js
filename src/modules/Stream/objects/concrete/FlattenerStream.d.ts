import type { ObjectPool } from "../../../../objects.ts"
import type { ICommonStream } from "../../interfaces/CommonStream.ts"
import type { IOwnedStream } from "../../interfaces/OwnedStream.ts"
import { CurrDyssyncLinkedStream } from "../templates.js"

export declare class FlattenerStream<T = any>
	extends CurrDyssyncLinkedStream<T>
	implements ICommonStream<T>
{
	static readonly pool: ObjectPool<FlattenerStream, [IOwnedStream<any[]>?]>
	protected get pool(): ObjectPool<FlattenerStream, [IOwnedStream<T[]>?]>
	free(): void
	isCurrEnd(): boolean
	next(): void
	get isEnd(): boolean
	constructor(stream?: IOwnedStream<T[]>)
}
