import assert from "assert"
import type { IRawStreamArray } from "../interfaces/CompositeStream.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"

export abstract class StatefulStreamChooser<T = any> {
	abstract choose(input: IOwnedStream): IRawStreamArray<T>	
	protected constructor() {}
}

export abstract class IteratorStreamChooser<
	T = any
> extends StatefulStreamChooser<T> {
	protected abstract getStreams(): IRawStreamArray<T>
	private readonly streams: IRawStreamArray<T>
	private i = 0

	private advance() {
		assert(this.i < this.streams.length - 1)
		++this.i
	}

	reset() {
		this.i = 0
		return this
	}

	choose(input: IOwnedStream): IRawStreamArray<T> {
		this.advance()
		return [this.streams[this.i]]
	}

	protected constructor() {
		super()
		this.streams = this.getStreams()
	}
}
