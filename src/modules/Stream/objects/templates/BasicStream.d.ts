import type { IInitializer } from "../../../../interfaces.ts"
import type {
	IOwnedStream,
	IOwningStream
} from "../../interfaces/OwnedStream.ts"
import type { DyssyncStream } from "./DyssyncStream.ts"

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
export declare abstract class BasicStream<T = any, Args extends any[] = any[]>
	extends DyssyncStream<T>
	implements IOwnedStream<T>, Iterable<T>
{
	protected abstract readonly initializer: IInitializer<Args>
	protected abstract baseNextIter(curr?: T): T

	get owner(): IOwningStream | undefined

	protected postEnd?(): void
	protected initGetter?(...args: Partial<Args>): T
	protected update(newCurr: T): void
	protected postInit(...args: Partial<Args>): void

	next(): void
	setOwner(newOwner: IOwningStream): void
	init(...args: Partial<Args>): this

	[Symbol.iterator](): Generator<T>

	constructor(...args: Partial<Args> | [])
}
