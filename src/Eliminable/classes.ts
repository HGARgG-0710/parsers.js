import type { EliminablePattern } from "./interfaces.js"
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
	implements EliminablePattern<string, string | RegExp>
{
	eliminate(eliminated: string | RegExp, withStr?: string) {
		return (this.result = extract(this.result, eliminated, withStr))
	}
}

export class EliminableCounter
	extends FlushableEliminable<number>
	implements EliminablePattern<number, number>
{
	eliminate(eliminated: number) {
		return (this.result -= eliminated)
	}
}
