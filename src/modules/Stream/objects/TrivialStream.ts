import { DyssyncStream } from "./DyssyncStream.js"

/**
 * This is a mixin that combines:
 *
 * It is, in effect, the simplest possible `IOwnedStream` class.
 * Note that it is incomplete (there is no code for initializing `.curr`).
 * It has only one element, and ends the moment the user calls `.next()`.
 * It also always has `.isCurrEnd() === true`.
 */
export abstract class TrivialStream<T = any> extends DyssyncStream<T> {
	isCurrEnd() {
		return true
	}

	next() {
		this.endStream()
	}
}
