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
	Type = any,
	SourceType = unknown,
	MoreArgs extends any[] = []
>() {
	abstract class _SourceStream
		extends BasicStream.generic!<Type, [SourceType, ...(MoreArgs | [])]>()
		implements IResourceSettable
	{
		protected ["constructor"]: new (source?: SourceType) => this

		protected source?: SourceType

		protected abstract currGetter(): Type

		protected updateCurr() {
			this.update(this.currGetter())
		}

		protected get initializer() {
			return resourceInitializer
		}

		protected initGetter(): Type {
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

			protected baseNextIter(): Type {
				throw new TypeError(
					"abstract method `baseNextIter` of `SourceStream` not implemented"
				)
			}

			protected currGetter(): Type {
				throw new TypeError(
					"abstract method `currGetter` of `SourceStream` not implemented"
				)
			}
		} as unknown as typeof SourceStreamAnnotation<Type, SourceType>
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

export const SourceStream: ReturnType<typeof PreSourceStream> & {
	generic?: typeof PreSourceStream
} = PreSourceStream()

SourceStream.generic = PreSourceStream
