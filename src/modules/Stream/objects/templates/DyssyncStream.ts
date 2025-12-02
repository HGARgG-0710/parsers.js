import type { IStream } from "../../../../interfaces.js"
import { CurrDyssyncStream } from "./CurrDyssyncStream.js"

/**
 * This is an abstract class implementing `IStream<T>` and `IInitializable<Args>`.
 * It defines a set of separate variables of `.curr`, `.isEnd`.
 * It is to be used whenever an `IStream` needs to have its own state,
 * independent of that of its resource (if it has one). It also defines
 * `protected` methods `.endStream()` [sets `.isEnd = true`],
 * and `.startStream` [sets `.isEnd = false`]
 */
export abstract class DyssyncStream<T = any>
	extends CurrDyssyncStream<T>
	implements IStream<T>
{
	private _isEnd: boolean = false

	protected endStream() {
		this.isEnd = true
	}

	protected startStream() {
		this.isEnd = false
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	get isEnd() {
		return this._isEnd
	}
}
