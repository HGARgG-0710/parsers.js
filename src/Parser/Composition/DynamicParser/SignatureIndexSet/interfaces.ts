import type { ICopiable } from "../../../../interfaces.js"

export interface ISignatureIndexSet extends Iterable<number>, ICopiable {
	readonly arity: number
	subtract(x: ISignatureIndexSet): ISignatureIndexSet
	complement(): ISignatureIndexSet
	keepOut(x: number): ISignatureIndexSet
	has(x: number): boolean
}
