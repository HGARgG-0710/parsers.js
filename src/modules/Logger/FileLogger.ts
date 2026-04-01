import { createWriteStream, WriteStream } from "fs"
import { Config } from "../../global.js"
import type { ILogger } from "../../interfaces.js"

interface IFileErrorLoggerState {
	close(): IFileErrorLoggerState
	log(err: string): IFileErrorLoggerState
}

export class FileLogger implements ILogger {
	private readonly open: FileLoggerOpen
	private state: IFileErrorLoggerState

	close(): void {
		this.state = this.state.close()
	}

	log(item: string) {
		this.state = this.state.log(item)
	}

	constructor(
		filePath: string,
		errHandler: (err: Error) => void = () => {},
		maxRecordsWritten = Config.logger.defaultMaxWrites
	) {
		this.open = new FileLoggerOpen(filePath, errHandler, maxRecordsWritten)
		this.state = this.open
	}
}

class FileLoggerOpen implements IFileErrorLoggerState {
	private readonly writeStream: WriteStream
	private readonly closed: FileLoggerClosed
	private writeCount = 0

	private nextState() {
		return this.writeCount === this.maxWrites ? this.close() : this
	}

	private rawLog(err: string) {
		return this.writeStream.write(err)
	}

	private logOnceStreamDrained(err: string) {
		this.writeStream.once("drain", () => this.rawLog(err))
	}

	close() {
		this.closed.activate()
		return this.closed
	}

	log(err: string) {
		if (!this.rawLog(err)) this.logOnceStreamDrained(err)
		++this.writeCount
		return this.nextState()
	}

	constructor(
		filePath: string,
		errHandler: (err: Error) => void,
		private readonly maxWrites: number
	) {
		this.writeStream = createWriteStream(filePath, { flags: "a" })
		this.writeStream.on("error", errHandler)
		this.closed = new FileLoggerClosed(this.writeStream)
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
