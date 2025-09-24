import { Initializable } from "../../../classes/Initializer.js"
import type { IInitializer } from "../../../interfaces.js"
import type { IOwnedStream, IOwningStream } from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export abstract class BasicStreamAnnotation<T = any, Args extends any[] = any[]>
	extends DyssyncStream<T>
	implements IOwnedStream<T>, Iterable<T>
{
	protected abstract readonly initializer: IInitializer<Args>
	protected abstract baseNextIter(curr?: T): T

	readonly owner?: IOwningStream

	protected postEnd?(): void
	protected postStart?(): void
	protected initGetter?(...args: Partial<Args>): T

	protected update(newCurr: T) {}
	protected postInit(...args: Partial<Args>) {}

	next(): void {}

	setOwner(newOwner?: unknown): void {}

	init(...args: Partial<Args>) {
		return this
	}

	*[Symbol.iterator]() {
		yield null as T
	}

	constructor(...args: Partial<Args>) {
		super()
	}
}

const BasicStreamMixin = new mixin<IOwnedStream>(
	{
		name: "BasicStream",
		properties: {
			update(newCurr: any) {
				this.curr = newCurr
			},

			postInit(...args: any[]) {
				if (this.initGetter) this.curr = this.initGetter(...args)
			},

			endStream() {
				this.isEnd = true
			},

			startStream() {
				this.isEnd = false
			},

			next() {
				const curr = this.curr
				if (this.isCurrEnd()) {
					this.endStream()
					this.postEnd?.()
				} else this.update(this.baseNextIter(curr))
			},

			init(...args: any[]) {
				this.startStream()
				this.super.Initializable.init.call(this, ...args)
				this.postInit(...args)
				return this
			}
		},
		constructor(...args: any[]) {
			this.super.Initializable.constructor.call(this, ...args)
		}
	},
	[],
	[Initializable, DyssyncStream, OwnableStream, IterableStream]
)

function PreBasicStream<T = any, Args extends any[] = any[]>() {
	return BasicStreamMixin.toClass() as typeof BasicStreamAnnotation<T, Args>
}

/**
 * This is an abstract class implementing `IOwnedStream<T>`.
 * It is a mixin of:
 *
 * 1. Initializable
 * 2. DyssyncStream
 * 3. OwnableStream
 * 4. IterableStream
 *
 * It is also in possession of common patterns for `.next()`
 * and `.init()` methods, which are implemented in the extending c
 * ode of the user through methods and properties:
 *
 * 1. protected .baseNextIter(curr?: T): T [mandatory]
 * 3. protected .initGetter(...args: Partial<InitArgs>): T [optional]
 * 4. protected .posStart(): void [optional]
 * 5. protected .postEnd(): void [optional]
 * 6. protected readonly abstract initializer: IInitializer<Args> [mandatory]
 *
 * It also possesses a set of other methods that encapsulate
 * (default) behaviour and can be overriden. They are:
 *
 * 1. [from `DyssyncStream`] `protected .startStream()` - code called inside
 * `init` before all else.
 * 	* (By default, sets `.isEnd = false`)
 *
 * 2. [from `DyssyncStream`] `protected .endStream()` - code called upon `.isCurrEnd()` inside `.next`
 * 	* (By default, sets `.isEnd = true`)
 *
 * 3. `.update(newCurr: T)` - code called inside `.next`
 * with the result of `.baseNextIter()` as the argument, whenever
 * `!this.isCurrEnd()`.
 * 	* (By default, just assigns `this.curr = newCurr`
 *
 * 4. `protected postInit(...args: Partial<Args>): void` - gets called after
 * the initializer's `.init` method.
 * 	* (By default, assigns `this.curr` to the result of `this.initGetter(...args)`, if `this.initGetter` is present)
 */
export const BasicStream: ReturnType<typeof PreBasicStream> & {
	generic?: typeof PreBasicStream
} = PreBasicStream()

BasicStream.generic = PreBasicStream
