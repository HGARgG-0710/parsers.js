import type { EliminableStringPattern } from "./interfaces.js"
import { FlushablEliminable } from "./classes.js"
import { string } from "@hgargg-0710/one"
const { extract } = string

export const { flush } = FlushablEliminable.prototype

export function eliminate(
	this: EliminableStringPattern,
	eliminated: string | RegExp
): string {
	return (this.result = extract(this.result, eliminated))
}
