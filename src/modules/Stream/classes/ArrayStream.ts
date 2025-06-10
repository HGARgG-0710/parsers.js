import { BasicStream, BasicStreamAnnotation } from "./BasicStream.js"

const arrayStreamInitializer = {
	init(target: ArrayStreamAnnotation, ...items: any[]) {
		if (items.length > 0) target.setItems(items)
	}
}

export abstract class ArrayStreamAnnotation<
	T = any,
	ElemType = any
> extends BasicStreamAnnotation<T, ElemType[]> {
	protected ["constructor"]: new (...items: ElemType[]) => this

	protected items: ElemType[]

	protected get initializer() {
		return null as any
	}

	setItems(items: ElemType[]) {}

	copy() {
		return this
	}

	constructor(...items: ElemType[]) {
		super()
	}
}

function BuildArrayStream<T = any, ElemType = any>() {
	abstract class _ArrayStream extends BasicStream.generic!<T, ElemType[]>() {
		protected ["constructor"]: new (...items: ElemType[]) => this

		protected items: ElemType[]

		get initializer() {
			return arrayStreamInitializer
		}

		setItems(items: any[]) {
			this.items = items
		}

		copy() {
			return new this.constructor(...this.items)
		}

		constructor(...items: ElemType[]) {
			super(...items)
		}
	}

	return _ArrayStream as unknown as typeof ArrayStreamAnnotation<T, ElemType>
}

let arrayStream: typeof ArrayStreamAnnotation | null = null

function PreArrayStream<
	T = any,
	ElemType = any
>(): typeof ArrayStreamAnnotation<T, ElemType> {
	return arrayStream
		? arrayStream
		: (arrayStream = BuildArrayStream<
				T,
				ElemType
		  >() as typeof ArrayStreamAnnotation)
}

export const ArrayStream: ReturnType<typeof PreArrayStream> & {
	generic?: typeof PreArrayStream
} = PreArrayStream()

ArrayStream.generic = PreArrayStream
