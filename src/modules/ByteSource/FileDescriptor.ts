import { closeSync, fstatSync, openSync, readSync } from "fs"
import type { IFileSource } from "../../interfaces.js"
import { Chunk } from "../../internal/Chunk.js"
import { InvalidFileReadPositionError } from "../../objects/Error.js"

enum FileError {
	NoError = 0,
	InvalidPos = -1
}

interface ErrorData {
	filename: string
	pos: number
	size: number
}

function displayError(error: FileError, { filename, pos, size }: ErrorData) {
	switch (error) {
		case FileError.InvalidPos:
			throw new InvalidFileReadPositionError(filename, pos, size)
	}
}

/**
 * Contains logic for reading of a single byte,
 * including the buffering aspect (reading is done
 * on a 4KB-basis for increased performance).
 */
class BufferReader {
	private readonly readPos = new Chunk.BytePos(true)
	private readonly tempData = new Uint8Array(Chunk.size)

	private readNextPage() {
		readSync(
			this.descriptor,
			this.tempData,
			0,
			Chunk.chunkStartOf(this.nextPos),
			Chunk.size
		)
	}

	private updateBuffer(): number {
		this.readNextPage()
		const readByte = this.readBuffered()
		this.readPos.go(this.nextPos)
		return readByte
	}

	private readBuffered(): number {
		return this.tempData[this.nextPos.getOffset()]
	}

	private isEndPos(bytePos: Chunk.BytePos) {
		return bytePos.isAfter(this.endPos)
	}

	readNext(): number {
		if (!this.isEndPos(this.nextPos))
			return this.nextPos.isSameChunk(this.readPos)
				? this.readBuffered()
				: this.updateBuffer()
		return FileError.InvalidPos
	}

	hasAny() {
		return !this.readPos.isAfter(this.endPos)
	}

	constructor(
		private readonly descriptor: number,
		private readonly nextPos: Chunk.BytePos,
		private readonly endPos: Chunk.BytePos
	) {}
}

/**
 * Serves as a bridge for communication
 * between `BufferReader` and `FileDescriptor`,
 * registering invalid bytes (error codes),
 * and exposing the valid ones via the `.byte`
 * property (corresponds to the last byte read).
 */
class ByteProvider {
	private readonly reader: BufferReader
	private readonly pos = new Chunk.BytePos()

	private _byte: number

	private set byte(newByte: number) {
		this._byte = newByte
	}

	get byte() {
		return this._byte
	}

	private isValidByte(byte: number) {
		return byte >= 0
	}

	private registerError(error: FileError) {
		return this.errorStatus.set(error, this.pos.get())
	}

	moveForward() {
		this.pos.forward()
		const byteRead = this.reader.readNext()
		if (this.isValidByte(byteRead)) this.byte = byteRead
		else this.registerError(byteRead)
	}

	hasAny() {
		return this.reader.hasAny()
	}

	constructor(
		descriptor: number,
		endPos: Chunk.BytePos,
		private readonly errorStatus: ErrorStatus
	) {
		this.reader = new BufferReader(descriptor, this.pos, endPos)
	}
}

/**
 * Keeps data about the error status of the
 * byte-reading operation on `ByteProvider`.
 */
class ErrorStatus {
	private _status: FileError = FileError.NoError
	private _pos: number = -1

	private set pos(newPos: number) {
		this._pos = newPos
	}

	get pos() {
		return this._pos
	}

	private set status(newStatus: FileError) {
		this._status = newStatus
	}

	get status() {
		return this._status
	}

	isEmpty() {
		return this.status === FileError.NoError
	}

	set(status: FileError, pos: number) {
		this.status = status
		this.pos = pos
	}

	get() {
		return this.status
	}
}

/**
 * This is an `IByteSource` implementation based off a
 * file. It provides the using party with an ability to
 * sequentially request bytes from a given file. It is
 * initialized with a `filename: string` being the name
 * of the file to be opened, and `handler` that is run
 * in the event that an error is raised during file's
 * opening.
 */
export class FileDescriptor implements IFileSource {
	private readonly byteProvider: ByteProvider
	private readonly descriptor: number
	private readonly endPos: Chunk.BytePos
	private readonly errorStatus = new ErrorStatus()

	readonly size: number
	private _isOpen: boolean

	private set isOpen(newIsOpen: boolean) {
		this._isOpen = newIsOpen
	}

	private getSize() {
		return fstatSync(this.descriptor).size
	}

	private markOpen() {
		this.isOpen = true
	}

	private markClosed() {
		this.isOpen = false
	}

	private getEndPos() {
		return Chunk.BytePos.at(this.size)
	}

	private getByteProvider() {
		return new ByteProvider(this.descriptor, this.endPos, this.errorStatus)
	}

	private getErrorData(): ErrorData {
		return {
			filename: this.filename,
			pos: this.errorStatus.pos,
			size: this.size
		}
	}

	get isOpen() {
		return this._isOpen
	}

	hasBytes(): boolean {
		return this.byteProvider.hasAny()
	}

	nextByte(): void {
		this.byteProvider.moveForward()
		if (!this.errorStatus.isEmpty())
			displayError(this.errorStatus.get(), this.getErrorData())
	}

	get currByte() {
		return this.byteProvider.byte
	}

	cleanup(): void {
		if (this.isOpen) {
			closeSync(this.descriptor)
			this.markClosed()
		}
	}

	constructor(
		readonly filename: string,
		handler: (err: NodeJS.ErrnoException) => void
	) {
		try {
			this.descriptor = openSync(filename, "r")
			this.size = this.getSize()
			this.endPos = this.getEndPos()
			this.byteProvider = this.getByteProvider()
			this.markOpen()
		} catch (err) {
			handler(err)
		}
	}
}
