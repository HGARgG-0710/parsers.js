import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"

import { FlushablEliminable } from "./abstract.js"

import { string } from "@hgargg-0710/one"
const { extract } = string

export class EliminableString
	extends FlushablEliminable<string>
	implements EliminableStringPatternType
{
	eliminate(eliminated: string | RegExp, withStr?: string) {
		return (this.result = extract(this.result, eliminated, withStr))
	}
}
