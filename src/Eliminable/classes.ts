import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"
import type { Resulting } from "../Pattern/interfaces.js"

import { FlushablePattern } from "../Pattern/abstract.js"

import { string } from "@hgargg-0710/one"
const { extract } = string

abstract class FlushableEliminable<Type = any>
	extends FlushablePattern<Type>
	implements Resulting<Type>
{
	result: Type
	flush() {
		this.result = this.value!
	}
}

export class EliminableString
	extends FlushableEliminable<string>
	implements EliminableStringPatternType
{
	eliminate(eliminated: string | RegExp, withStr?: string) {
		return (this.result = extract(this.result, eliminated, withStr))
	}
}
