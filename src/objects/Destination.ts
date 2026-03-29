import { closeSync, openSync, writeSync } from "fs"
import type { IEncoder, IInitializable } from "../interfaces.js"
import type { IDestination } from "../interfaces/Destination.js"

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

	private getWriteFlag(shouldTruncate: boolean) {
		return shouldTruncate ? "w" : "a"
	}

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
		handler: (err: NodeJS.ErrnoException) => void,
		private readonly truncate: boolean = false
	) {
		try {
			const descriptor = openSync(filename, this.getWriteFlag(truncate))
			this.state = this.open = new FileDestinationOpen(descriptor)
		} catch (err) {
			handler(err)
		}
	}
}

interface IFileDestinationState {
	cleanup(): IFileDestinationState
	write(input: string): void
	init(encoder: IEncoder): void
}

class FileDestinationOpen implements IFileDestinationState {
	private readonly closed = new FileDestinationClosed()
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

	constructor(private readonly descriptor: number) {}
}

class FileDestinationClosed implements IFileDestinationState {
	init(encoder: IEncoder): void {}

	write(input: string): void {}

	cleanup(): IFileDestinationState {
		return this
	}
}
