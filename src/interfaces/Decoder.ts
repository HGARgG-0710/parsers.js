/**
 * This is the interface for representing the objects
 * capable of a decoding operation, performed over a
 * sequence of characters provided by the `ISourceDescriptor`,
 * with the (non-negative) size of `ISize`. Likewise, it
 * allows operations of rewinding the decoding (`.rewind()`),
 * checking if there are any more characters to be decoded
 * (`.hasChars()`), and obtaining a new character (if possible)
 * that is `i` positions ahead (.nextChar(i?: number)),
 * defaulting to some pre-decided step.
 *
 * The `readonly .pos: number` property represents the
 * number of characters that has been passed since the beginning of
 * the input [always lesser-than-or-equal to the provided
 * `ISize` of the source file].
 */
export interface IDecoder {
	nextChar(i?: number): void
	hasChars(): boolean
	readonly currChar: string
}
