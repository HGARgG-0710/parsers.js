import { mixin } from "../../../mixin.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
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

const ArrayStreamMixin = new mixin<IOwnedStream>(
	{
		name: "ArrayStream",
		properties: {
			items: [],

			get initializer() {
				return arrayStreamInitializer
			},

			setItems(items: any[]) {
				this.items = items
			},

			copy() {
				return new this.constructor(...this.items)
			}
		},
		constructor: function (...items: any[]) {
			this.super.BasicStream.constructor.call(this, ...items)
		}
	},
	[],
	[BasicStream]
)

function PreArrayStream<T = any, ElemType = any>() {
	return ArrayStreamMixin.toClass() as typeof ArrayStreamAnnotation<
		T,
		ElemType
	>
}

export const ArrayStream: ReturnType<typeof PreArrayStream> & {
	generic?: typeof PreArrayStream
} = PreArrayStream()

ArrayStream.generic = PreArrayStream
