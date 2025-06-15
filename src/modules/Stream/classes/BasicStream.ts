import { Initializable } from "../../../classes/Initializer.js"
import type { IInitializer } from "../../../interfaces.js"
import type { IOwnedStream, IOwningStream } from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export abstract class BasicStreamAnnotation<T = any, Args extends any[] = any[]>
	extends DyssyncStream<T, Args>
	implements IOwnedStream<T>
{
	protected abstract readonly initializer: IInitializer<Args>
	protected abstract baseNextIter(curr?: T): T

	readonly owner?: IOwningStream

	protected postEnd?(): void
	protected basePrevIter?(curr?: T): T
	protected postStart?(): void
	protected initGetter?(...args: Partial<Args>): T

	protected update(newCurr: T) {}
	protected postInit(...args: Partial<Args>) {}

	next(): void {}
	prev(): void {}

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
				this.isStart = false
			},

			startStream() {
				this.isStart = true
				this.isEnd = false
			},

			next() {
				const curr = this.curr
				this.isStart = false
				if (this.isCurrEnd()) {
					this.endStream()
					this.postEnd?.()
				} else this.update(this.baseNextIter(curr))
			},

			prev() {
				const curr = this.curr
				this.isEnd = false
				if (this.isCurrStart!()) {
					this.startStream()
					this.postStart?.()
				} else this.update(this.basePrevIter!(curr))
			},

			init(...args: any[]) {
				this.startStream()
				this.super.Initializable.init.call(this, ...args)
				this.postInit(...args)
				return this
			}
		},
		constructor: function (...args: any[]) {
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
 * It is also in possession of common patterns for `.next()`,
 * `.prev()` and `.init()` methods, which are implemented in
 * the extending code of the user through methods and properties:
 *
 * 1. protected .baseNextIter(curr?: T): T [mandatory]
 * 2. protected .basePrevIter(curr?: T): T [optional]
 * 3. protected .initGetter(...args: Partial<InitArgs>): T [optional]
 * 4. protected .posStart(): void [optional]
 * 5. protected .postEnd(): void [optional]
 * 6. protected readonly abstract initializer: IInitializer<Args> [mandatory]
 *
 * It also possesses a set of other methods that encapsulate
 * (default) behaviour and can be overriden. They are:
 *
 * 1. [from `DyssyncStream`] `protected .startStream()` - code called upon `.isCurrStart()` inside `.prev`
 * 	* (By default, sets `.isStart = true` and `.isEnd = false`)
 * 	* (Called as first action inside of initialization code)
 *
 * 2. [from `DyssyncStream`] `protected .endStream()` - code called upon `.isCurrEnd()` inside `.next`
 * 	* (By default, sets `.isEnd = true` and `.isStart = false`)
 *
 * 3. `.update(newCurr: T)` - code called inside `.next` and `.prev`
 * with results of `.baseNextIter()` and `.basePrevIter()` (respectively)
 * as the argument, whenver `!this.isCurrEnd/isCurrStart()`.
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
