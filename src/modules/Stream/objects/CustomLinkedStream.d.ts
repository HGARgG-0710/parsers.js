import type { ObjectPool } from "../../../objects.ts"
import type { ILinkedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { OwningStream } from "./OwningStream.ts"

export declare abstract class CustomLinkedStream<
		T = any,
		Args extends any[] = []
	>
	extends OwningStream<T, Args>
	implements ILinkedStream<T>
{
	setOwner(newOwner: IOwningStream): void
	readonly owner?: IOwningStream
	free(): void
	protected abstract readonly pool: ObjectPool<ILinkedStream<T>>
}
