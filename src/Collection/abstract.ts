import type { Indexed } from "src/interfaces.js"
import { InitializablePattern } from "src/Pattern/abstract.js"

export abstract class IterableCollection<Type = any>
	extends InitializablePattern<Indexed<Type>>
	implements Iterable<Type>
{
	*[Symbol.iterator]() {
		let i = 0
		while (this.value!.length > i) {
			yield this.value![i] as Type
			++i
		}
	}
}
