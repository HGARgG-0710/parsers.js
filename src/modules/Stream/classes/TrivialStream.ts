import { SolidStream } from "./IterableStream.js"

export abstract class TrivialStream<
	Type = any,
	Args extends any[] = any
> extends SolidStream<Type, Args> {
	isCurrEnd(): boolean {
		return true
	}

	next() {
		this.isStart = false
		this.isEnd = true
	}
}
