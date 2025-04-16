import { InitializablePattern } from "../Pattern.js"

export abstract class DelegateIterable<Type = any>
	extends InitializablePattern<Iterable<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		yield* this.value!
	}
}
