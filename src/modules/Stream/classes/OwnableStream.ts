import { annotation } from "src/classes/Stream.js"
import { mixin } from "../../../mixin.js"
import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.js"

export abstract class OwnableStreamAnnotation<T = any, Args extends any[] = any[]>
	extends annotation<T, Args>
	implements IOwnedStream<T>
{
	readonly owner: IOwningStream
	setOwner: (newOwner?: unknown) => void
}

const OwnableStreamMixin = new mixin<IOwnedStream>({
	name: "OwnableStream",
	properties: {
		_owner: null,

		set owner(newOwner: IOwningStream | undefined) {
			this._owner = newOwner
		},

		get owner() {
			return this._owner
		},

		setOwner(newOwner: IOwningStream): void {
			this.owner = newOwner
		}
	}
})

function PreOwnableStream<T = any, Args extends any[] = any[]>() {
	return OwnableStreamMixin.toClass() as typeof OwnableStreamAnnotation<
		T,
		Args
	>
}

export const OwnableStream: ReturnType<typeof PreOwnableStream> & {
	generics?: typeof PreOwnableStream
} = PreOwnableStream()

OwnableStream.generics = PreOwnableStream
