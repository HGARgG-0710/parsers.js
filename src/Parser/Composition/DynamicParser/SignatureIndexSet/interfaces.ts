export interface SignatureIndexSet extends Iterable<number> {
	readonly arity: number
	subtract(x: SignatureIndexSet): SignatureIndexSet
	complement(): SignatureIndexSet
	keepOut(x: number): SignatureIndexSet
	has(x: number): boolean
}
