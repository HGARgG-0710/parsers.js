import type { IByteSource } from "../../../interfaces.js"
import { SourceStream } from "./SourceStream.js"

/**
 * This is an `SourceStream<number, IByteSource>`, which serves to
 * provide its user with byte-by-byte access to the contents of an
 * `IByteSource` given. It is perfect as an entry-point for parsing
 * of binary formats.
 */
export class ByteStream extends SourceStream<number, IByteSource> {
	protected currGetter(): number {
		return this.source!.currByte
	}

	protected baseNextIter(curr?: number | undefined): number {
		this.source!.nextByte()
		return this.currGetter()
	}

	isCurrEnd(): boolean {
		return this.source!.hasBytes()
	}
}
