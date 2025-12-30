import { createWriteStream, WriteStream } from "fs"
import type { ILogger } from "../../interfaces.js"

interface IFileErrorLoggerState {
	close(): IFileErrorLoggerState
	log(err: string): IFileErrorLoggerState
}

export class FileLogger implements ILogger {
	static readonly DefaultMaxWrites = 10000

	private readonly open: FileLoggerOpen
	private state: IFileErrorLoggerState

	close(): void {
		this.state = this.state.close()
	}

	log(item: string) {
		this.state = this.state.log(item)
	}

	constructor(filePath: string, maxWrites = FileLogger.DefaultMaxWrites) {
		const writeStream = createWriteStream(filePath, { flags: "a" })
		this.open = new FileLoggerOpen(writeStream, maxWrites)
		this.state = this.open
	}
}

class FileLoggerOpen implements IFileErrorLoggerState {
	private readonly closed: FileLoggerClosed
	private writeCount = 0

	private nextState() {
		return this.writeCount === this.maxWrites ? this.close() : this
	}

	close() {
		this.closed.activate()
		return this.closed
	}

	log(err: string) {
		this.writeStream.write(err)
		++this.writeCount
		return this.nextState()
	}

	constructor(
		private readonly writeStream: WriteStream,
		private readonly maxWrites: number
	) {
		this.closed = new FileLoggerClosed(writeStream)
	}
}

class FileLoggerClosed implements IFileErrorLoggerState {
	log(err: string) {
		return this
	}

	close() {
		return this
	}

	activate() {
		this.writeStream.end()
	}

	constructor(private readonly writeStream: WriteStream) {}
}
