import { BasicStream } from "./BasicStream.js"

const arrayStreamInitializer = {
	init(target: ArrayStream, ...items: any[]) {
		if (items.length > 0) target.setItems(items)
	}
}

export abstract class ArrayStream<
	Type = any,
	ElemType = any
> extends BasicStream<Type, ElemType[]> {
	protected ["constructor"]: new (...items: ElemType[]) => this

	protected items: ElemType[]

	protected get initializer() {
		return arrayStreamInitializer
	}

	setItems(items: ElemType[]) {
		this.items = items
	}

	copy() {
		return new this.constructor(...this.items)
	}

	constructor(...items: ElemType[]) {
		super(...items)
	}
}
