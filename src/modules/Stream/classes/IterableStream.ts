import type { IStream } from "../../../interfaces.js"
import { annotation } from "src/classes/Stream.js"
import { mixin } from "../../../mixin.js"

abstract class IterableStreamAnnotation<
	Type = any,
	Args extends any[] = any[]
> extends annotation<Type, Args> {
	[Symbol.iterator]: () => Generator<Type>
}

const IterableStreamMixin = new mixin<IStream>({
	name: "IterableStream",
	properties: {
		*[Symbol.iterator]() {
			while (!this.isEnd) {
				yield this.curr
				this.next()
			}
		}
	}
})

function PreIterableStream<T = any, Args extends any[] = any[]>() {
	return IterableStreamMixin.toClass() as typeof IterableStreamAnnotation<
		T,
		Args
	>
}

export const IterableStream: ReturnType<typeof PreIterableStream> & {
	generics?: typeof PreIterableStream
} = PreIterableStream()

IterableStream.generics = PreIterableStream
