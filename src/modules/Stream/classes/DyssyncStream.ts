import { StreamAnnotation } from "src/internal/StreamAnnotation.js"
import type { IStream } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"

export abstract class DyssyncStreamAnnotation<
	T = any,
	Args extends any[] = any[]
> extends StreamAnnotation<T, Args> {
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
}

const DyssyncStreamMixin = new mixin<IStream>({
	name: "DyssyncStream",
	properties: {
		_curr: null,
		_isEnd: false,
		_isStart: true,

		endStream() {
			this.isEnd = true
			this.isStart = false
		},

		startStream() {
			this.isStart = true
			this.isEnd = false
		},

		set curr(newCurr) {
			this._curr = newCurr
		},

		get curr() {
			return this._curr
		},

		set isEnd(newIsEnd: boolean) {
			this._isEnd = newIsEnd
		},

		get isEnd() {
			return this._isEnd
		},

		set isStart(newIsStart: boolean) {
			this._isStart = newIsStart
		},

		get isStart() {
			return this._isStart
		}
	}
})

function PreDyssyncStream<T = any, Args extends any[] = any[]>() {
	return DyssyncStreamMixin.toClass() as typeof DyssyncStreamAnnotation<
		T,
		Args
	>
}

export const DyssyncStream: ReturnType<typeof PreDyssyncStream> & {
	generic?: typeof PreDyssyncStream
} = PreDyssyncStream()

DyssyncStream.generic = PreDyssyncStream
