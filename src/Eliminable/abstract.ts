import type { Resulting } from "../Pattern/interfaces.js"
import { FlushablePattern } from "src/Pattern/abstract.js"

export abstract class FlushablEliminable<Type = any>
	extends FlushablePattern<Type>
	implements Resulting<Type>
{
	result: Type

	flush(): void {
		this.result = this.value!
	}

	constructor(value?: Type) {
		super(value)
	}
}
