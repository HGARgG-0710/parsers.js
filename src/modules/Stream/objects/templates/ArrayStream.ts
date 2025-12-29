import { BasicStream } from "./BasicStream.js"

const arrayStreamInitializer = {
	init(target: ArrayStream, ...items: any[]) {
		if (items.length > 0) target.setItems(items)
	}
}

/**
 * This is an abstract class implementing the `IOwnedStream<T>` interface.
 * It extends `BasicStream`, and so all methods of it are also available.
 * Its purpose is to represent `IStream`s built from some finite collection
 * of elements of type `ElemType`. It boasts a public `.setItems(newItems: ElemType[])`
 * setter method, which assigns the `protected items: ElemType[]` property
 * to `newItems`, as well as an initializer, which calls the method upon a
 * variadic argument of `.init(...items: ElemType[]): this`, provided that
 * its length is non-zero. It also has a (`protected`) constructor with
 * signature `new (...items: ElemType[]) => this`, and a `.copy()` method that
 * utilizes it.
 */
export abstract class ArrayStream<T = any, ElemType = any> extends BasicStream<
	T,
	ElemType[]
> {
	protected override ["constructor"]: new (...items: ElemType[]) => this

	protected items: ElemType[]

	protected get initializer() {
		return arrayStreamInitializer
	}

	setItems(items: ElemType[]) {
		this.items = items
	}

	constructor(...items: ElemType[]) {
		super(...items)
	}
}
