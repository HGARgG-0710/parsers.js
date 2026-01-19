import type { ICommonStream } from "../../interfaces/CommonStream.ts"
import type { IOwningStream } from "../../interfaces/OwnedStream.ts"
import type { OwningStream } from "./OwningStream.ts"

// ! PRE-DOC: the 'poolId' here is the 'ObjectPool.BadPoolId'!
export declare abstract class CustomLinkedStream<
	T = any,
	Args extends any[] = []
>
	extends OwningStream<T, Args>
	implements ICommonStream<T>
{
	connectOwner(newOwner: IOwningStream): void
	get owner(): IOwningStream | undefined
	abstract free(): void
	[Symbol.iterator]: () => Generator<T>
	get poolId(): number
}
