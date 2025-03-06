export interface ISignatureIndexSet extends Iterable<number> {
	readonly arity: number
	subtract(x: ISignatureIndexSet): ISignatureIndexSet
	complement(): ISignatureIndexSet
	keepOut(x: number): ISignatureIndexSet
	has(x: number): boolean
}
