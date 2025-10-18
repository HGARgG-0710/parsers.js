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
	abstract free(): void
}
