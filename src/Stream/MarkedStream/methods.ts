import type { IFreezableBuffer } from "../../interfaces.js"
import type { ISupered } from "../../refactor.js"
import type {
	IEndableStream,
	IMarkedStream,
	IMarkedStreamInitSignature,
	IStreamClassInstance
} from "../interfaces.js"

export namespace methods {
	export function baseNextIter<Type = any, MarkerType = any>(
		this: IMarkedStreamImpl<Type, MarkerType>
	) {
		const curr = this.value!.next()
		this.currMarked = this.marker()
		return curr
	}

	export function basePrevIter<Type = any, MarkerType = any>(
		this: IMarkedStreamImpl<Type, MarkerType>
	) {
		const curr = this.value!.prev!()
		this.currMarked = this.marker(this.value)
		return curr
	}

	export function copy<Type = any, MarkerType = any>(
		this: IMarkedStreamImpl<Type, MarkerType>
	) {
		return new this.constructor(this.value?.copy())
	}

	export function init<Type = any, MarkerType = any>(
		this: IMarkedStreamImpl<Type, MarkerType>,
		value?: IEndableStream<Type>,
		buffer?: IFreezableBuffer<Type>
	) {
		if (value) {
			this.super.init(buffer, value)
			this.currMarked = this.marker()
		}
		return this
	}
}

export type IMarkedStreamImpl<
	Type = any,
	MarkerType = any
> = IStreamClassInstance<
	Type,
	IEndableStream<Type>,
	number,
	IMarkedStreamInitSignature<Type>
> &
	IMarkedStream<Type, MarkerType> &
	ISupered & {
		["constructor"]: new (
			value?: IEndableStream<Type>,
			buffer?: IFreezableBuffer<Type>
		) => IMarkedStreamImpl<Type>

		marker: (value?: IEndableStream<Type>) => MarkerType
	}
