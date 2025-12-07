import { closeSync, openSync, writeSync } from "fs"
import type { IEncoder, IInitializable } from "../interfaces.js"
import type { IDestination } from "../interfaces/Destination.js"

const pickTruncationWriteFlag = (truncate: boolean) => (truncate ? "w" : "a")

/**
 * A class implementing `IDestination` and `IInitializable<[IEncoder]>`.
 * Purposed for safe managed writing access to files.
 */
export class FileDestination
	implements IDestination, IInitializable<[IEncoder]>
{
	["constructor"]: new (filename: string, truncate?: boolean) => this

	private state: IFileDestinationState
	private readonly open: IFileDestinationState

	get isOpen() {
		return this.state === this.open
	}

	init(encoder: IEncoder): this {
		this.state.init(encoder)
		return this
	}

	write(input: string): void {
		this.state.write(input)
	}

	cleanup() {
		this.state = this.state.cleanup()
	}

	copy() {
		return new this.constructor(this.filename, this.truncate)
	}

	constructor(
		private readonly filename: string,
		private readonly truncate: boolean = false
	) {
		const descriptor = openSync(filename, pickTruncationWriteFlag(truncate))
		this.state = this.open = new FileDestinationOpen(
			descriptor,
			new FileDestinationClosed()
		)
	}
}

interface IFileDestinationState {
	cleanup(): IFileDestinationState
	write(input: string): void
	init(encoder: IEncoder): void
}

class FileDestinationOpen implements IFileDestinationState {
	private encoder: IEncoder

	init(encoder: IEncoder) {
		this.encoder = encoder
	}

	write(input: string) {
		this.encoder.toBuffer(input)
		writeSync(
			this.descriptor,
			this.encoder.buffer,
			0,
			this.encoder.encodedSize
		)
	}

	cleanup(): IFileDestinationState {
		closeSync(this.descriptor)
		return this.closed
	}

	constructor(
		private readonly descriptor: number,
		private readonly closed: FileDestinationClosed
	) {}
}

class FileDestinationClosed implements IFileDestinationState {
	init(encoder: IEncoder): void {}

	write(input: string): void {}

	cleanup(): IFileDestinationState {
		return this
	}
}
