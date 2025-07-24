import type { IStream } from "../../../interfaces.js"
import { ArrayStream } from "./ArrayStream.js"

/**
 * This is a class extending `ArrayStream<any, IStream>`.
 *
 * It operates by means of combining the output from multiple
 * streams inside of `.items: IStream`, and returning them in
 * a the fashion of: `(n11)(n21)(n31)...(nm1)(n12)(22)...`,
 * where `1-m` are the indexes of values in `.items: IStream`.
 * It stops after the shortest of present streams runs out.
 */
export class InterleaveStream extends ArrayStream.generic!<any, IStream>() {
	private streamIndex: number = 0

	private get currStream() {
		return this.items[this.streamIndex]
	}

	private get size() {
		return this.items.length
	}

	private nextStream() {
		this.streamIndex = (this.streamIndex + 1) % this.size
	}

	protected baseNextIter() {
		this.nextStream()
		this.currStream.next()
		return this.currStream.curr
	}

	isCurrEnd(): boolean {
		return this.items.some((x) => x.isCurrEnd())
	}
}
