import type { ObjectPool } from "../../../objects.ts"
import type { Initializable } from "../../../objects/Initializer.ts"
import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream
} from "../interfaces/OwnedStream.ts"

export abstract class CustomLinkedStream<T = any, Args extends any[] = []>
	extends Initializable<[IOwnedStream, Args]>
	implements ILinkedStream<T>
{
	setOwner(newOwner: IOwningStream): void
	readonly owner?: IOwningStream
	free(): void

	protected abstract readonly pool: ObjectPool<ILinkedStream<T>>

	abstract setResource(resource: IOwnedStream): void
	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract readonly curr: T
	abstract readonly isEnd: boolean
}
