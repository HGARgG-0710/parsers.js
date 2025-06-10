import { mixin } from "../../../mixin.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export abstract class TrivialStreamAnnotation<
	T = any,
	Args extends any[] = []
> extends OwnableStream<T, Args> {
	protected set isEnd(isEnd: boolean) {}
	protected set isStart(isEnd: boolean) {}
	protected set curr(curr: T) {}

	protected endStream(): void {}
	protected startStream(): void {}

	get isEnd() {
		return false
	}

	get isStart() {
		return true
	}

	get curr() {
		return null as any
	}

	*[Symbol.iterator]() {}
}

const TrivialStreamMixin = new mixin<IOwnedStream>(
	{
		name: "TrivialStream",
		properties: {
			isCurrEnd(): boolean {
				return true
			},

			next() {
				this.endStream()
			}
		}
	},
	[],
	[OwnableStream, IterableStream, DyssyncStream]
)

function PreTrivialStream<T = any, Args extends any[] = []>() {
	return TrivialStreamMixin.toClass() as typeof TrivialStreamAnnotation<
		T,
		Args
	>
}

export const TrivialStream: ReturnType<typeof PreTrivialStream> & {
	generic?: typeof PreTrivialStream
} = PreTrivialStream()

TrivialStream.generic = PreTrivialStream
