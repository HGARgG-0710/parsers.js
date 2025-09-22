/**
 * This is an interface for representing an
 * encoder for an unspecified format, that
 * reads the string from teh `.toBuffer(input: string)`,
 * and writes the encoded bytes into the `.buffer: Uint8Array`.
 *
 * The `.encodedSize: number` is purposed to specify the
 * maximum possible size of a character encoded using
 * the format employed by the `IEncoder`.
 */
export interface IEncoder {
	readonly buffer: Uint8Array
	readonly encodedSize: number
	toBuffer(input: string): void
}
