import type { IResourceSettable } from "../../../interfaces.js"
import { isCopiable } from "../../../is.js"
import { resourceInitializer } from "../../Initializer/classes/ResourceInitializer.js"
import { BasicStream, BasicStreamAnnotation } from "./BasicStream.js"

export abstract class SourceStreamAnnotation<
	T = any,
	SourceType = any
> extends BasicStreamAnnotation<T> {
	protected ["constructor"]: new (source?: SourceType) => this

	protected source?: SourceType

	protected abstract currGetter(): T

	protected updateCurr() {}

	protected get initializer() {
		return null as any
	}

	protected initGetter(): T {
		return null as T
	}

	setResource(source?: SourceType) {}

	copy(): this {
		return this
	}

	constructor(source?: SourceType) {
		super(source)
	}
}

function BuildSourceStream<
	T = any,
	SourceType = unknown,
	MoreArgs extends any[] = []
>() {
	abstract class _SourceStream
		extends BasicStream.generic!<T, [SourceType, ...(MoreArgs | [])]>()
		implements IResourceSettable
	{
		protected ["constructor"]: new (source?: SourceType) => this

		protected source?: SourceType

		protected abstract currGetter(): T

		protected updateCurr() {
			this.update(this.currGetter())
		}

		protected get initializer() {
			return resourceInitializer
		}

		protected initGetter(): T {
			return this.currGetter()
		}

		setResource(source?: SourceType) {
			this.source = source
		}

		copy(): this {
			return new this.constructor(
				isCopiable(this.source) ? this.source.copy() : this.source
			)
		}

		constructor(source?: SourceType) {
			super(source)
		}
	}

	return (function () {
		return class extends _SourceStream {
			isCurrEnd() {
				throw new TypeError(
					"abstract method `isCurrEnd` of `SourceStream` not implemented"
				)

				return false
			}

			protected baseNextIter(): T {
				throw new TypeError(
					"abstract method `baseNextIter` of `SourceStream` not implemented"
				)
			}

			protected currGetter(): T {
				throw new TypeError(
					"abstract method `currGetter` of `SourceStream` not implemented"
				)
			}
		} as unknown as typeof SourceStreamAnnotation<T, SourceType>
	})()
}

let sourceStream: typeof SourceStreamAnnotation | null = null

function PreSourceStream<
	Type = any,
	SourceType = unknown,
	MoreArgs extends any[] = []
>(): typeof SourceStreamAnnotation<Type, SourceType> {
	return sourceStream
		? sourceStream
		: (sourceStream = BuildSourceStream<
				Type,
				SourceType,
				MoreArgs
		  >() as typeof SourceStreamAnnotation)
}

/**
 * This is an abstract class extending `BasicStream<T, [SourceType, ...Args]>`.
 * It sets the underlying `protected source: SourceType`, as well as `.copy`
 * method that (if possible) calls the `.copy()` method on the `.source`, and
 * then calls the constructor with it. It uses `resourceInitializer` as its
 * initializer, and provides `protected .initGetter`, which calls the
 * `protected abstract .currGetter(): T`. 
 * 
 * It also provides a `protected .updateCurr(): T` method, 
 * which calls `this.update(this.currGetter())`. 
 */
export const SourceStream: ReturnType<typeof PreSourceStream> & {
	generic?: typeof PreSourceStream
} = PreSourceStream()

SourceStream.generic = PreSourceStream
