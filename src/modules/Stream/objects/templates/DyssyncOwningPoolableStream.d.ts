import type { ICommonStream } from "../../../../interfaces.ts"
import type { ObjectPool } from "../../../../objects.ts"
import type { DyssyncOwningStream } from "./DyssyncOwningStream.js"

export declare abstract class DyssyncOwningPoolableStream<
	T = any,
	Args extends any[] = []
>
	extends DyssyncOwningStream<T, Args>
	implements ICommonStream<T>
{
	protected abstract readonly pool: ObjectPool<ICommonStream<T>>

	free(): void
	get poolId(): number
	get isUsed(): boolean
	markFree(): void
	markUsed(): void
}
