import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IDepthMark,
	IInitializer,
	IParseState
} from "../../../interfaces.ts"
import type { Initializable } from "../../../objects/Initializer.ts"
import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream
} from "../interfaces/OwnedStream.ts"
import type { IProxyStream } from "../interfaces/ProxyStream.ts"

// ! PRE-DOC NOTE: the `ProxyStream`s are intended to be NON-REUSABLE (i.e. throwaways)
// * HOWEVER, the *underlying* stream MAY be reusable, i.e. that is why the `free` is implemented at all...
// * Note also that they're intended to allow DEEP PROXYING (i.e. the Decorator Pattern)
export declare abstract class ProxyStream<T = any, Args extends any[] = []>
	extends Initializable<[IOwnedStream<T>, ...Args]>
	implements IProxyStream<T>
{
	protected readonly delegate: ILinkedStream<T>
	protected get initializer(): IInitializer<[IOwnedStream<T>]>
	setOwner(newOwner: IOwningStream<any, any[]>): void
	setResource(resource: IOwnedStream): void
	setState(state: Summat): this
	free(): void
	isCurrEnd(): boolean
	next(): void
	get depthMarks(): readonly IDepthMark[] | undefined
	get state(): IParseState
	get curr(): T
	get isEnd(): boolean
	get owner(): IOwningStream | undefined
	get resource(): IOwnedStream | undefined
	[Symbol.iterator]: () => Generator<T>
	constructor(delegate: ILinkedStream<T>)
}
