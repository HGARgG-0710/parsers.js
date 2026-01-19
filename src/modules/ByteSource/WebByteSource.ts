import type { IFileSource } from "../../interfaces.js"
import { FileChunk } from "../../internal/Utils/FileChunk.js"
import { InvalidFileReadPositionError } from "../../objects/Error.js"

/**
 * This is an `IByteSource` intended to work in web-contexts.
 * It accepts a `source: File` bytes from which are read,
 * and an (optional) `handler` to be called in event that
 * the `file` given is `null`.
 *
 * This serves as a web-sensetive replacement of the `FileDescriptor`
 * class, and implements largely the same file chunk sizes.
 * The reading operation is likewise lazy. The `source` can be
 * taken from an `<input type="file" />` element or suchlike.
 */
export class WebByteSource implements IFileSource {
	private readonly source: File

	private currChunk: Uint8Array
	private lastChunkCount: number = 0
	private readonly pos = new FileChunk.BytePos()

	get filename() {
		return this.source.name
	}

	private readTempData(chunk: Blob) {
		return new Promise<Uint8Array>((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.onerror = (e) => reject(e)
			fileReader.onload = (e) =>
				resolve(new Uint8Array(e.target!.result! as ArrayBuffer))
			fileReader.readAsArrayBuffer(chunk)
		})
	}

	private getNextChunk() {
		return this.source.slice(
			this.pos.get(),
			this.pos.get() + FileChunk.size
		)
	}

	private readNextChunk() {
		const nextChunk = this.getNextChunk()
		this.readTempData(nextChunk).then((result) => {
			this.currChunk = result
			++this.lastChunkCount
		})
	}

	nextByte(): void {
		if (!this.hasBytes())
			throw new InvalidFileReadPositionError(
				this.source.name,
				this.pos.get(),
				this.size
			)

		if (this.pos.getChunk() > this.lastChunkCount) this.readNextChunk()
		this.pos.forward()
	}

	get currByte() {
		return this.currChunk[this.pos.getOffset()]
	}

	hasBytes(): boolean {
		return this.pos.get() < this.size
	}

	get size() {
		return this.source.size
	}

	get isOpen() {
		return this.hasBytes()
	}

	cleanup(): void {}

	constructor(source: File | null, handler: () => void = () => {}) {
		if (source) this.source = source
		else handler()
	}
}
