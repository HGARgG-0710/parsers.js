import type { Pointer, Resulting } from "../Pattern/interfaces.js"
import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"

import { FlushablePattern } from "../Pattern/classes.js"
import { extendClass } from "../utils.js"
import { eliminate } from "./methods.js"

export abstract class FlushablEliminable<Type = any>
	extends FlushablePattern<Type>
	implements Pointer<Type>, Resulting<Type>
{
	value: Type
	result: Type

	flush(): void {
		this.result = this.value
	}

	constructor(value: Type) {
		super(value)
	}
}

export class EliminableString
	extends FlushablEliminable<string>
	implements EliminableStringPatternType
{
	eliminate: (eliminated: string | RegExp) => string
}

extendClass(EliminableString, {
	eliminate: { value: eliminate }
})
