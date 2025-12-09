import assert from "assert"
import { createWriteStream, WriteStream } from "fs"
import { Config } from "../global.js"
import type { IErrorLogger, IShutdownHandler } from "../interfaces.js"
import { toNewline } from "../samples/space.js"

function newlines(error: string, offset: number = 0) {
	return `${error}${getNewline().repeat(
		Config.errors.loggedNewlinesBetween - offset
	)}`
}

function getNewline (): string {
	return toNewline(Config.errors.lf)
}

export class ErrorPrinter {
	execute<T = any>(f: () => T) {
		try {
			return f()
		} catch (err) {
			this.errHandler(err)
		}
	}

	protected errHandler(error: Error) {
		this.errorLogger(this.errorFormatter(error))
		this.shutDown(error)
	}

	protected constructor(
		private readonly errorFormatter: (error: Error) => string,
		private readonly errorLogger: (errStr: string) => void,
		private readonly shutDown: IShutdownHandler = () => {}
	) {}
}

export namespace ErrorPrinter {
	export const shutDownCounter = (errCount: number) => {
		assert(errCount > 0)
		let timesThrown = 0
		return () => {
			if (++timesThrown == errCount) process.exit(1)
		}
	}

	export class PlainErrorPrinter extends ErrorPrinter {
		static readonly instance = new PlainErrorPrinter()

		static readonly formatter = (error: Error) =>
			newlines(`${error.name}: ${error.message}`, 1)

		protected constructor(shutDown?: (err: Error) => void) {
			super(PlainErrorPrinter.formatter, console.error, shutDown)
		}
	}

	export class FileErrorPrinter extends ErrorPrinter {
		static readonly formatter = (error: Error) =>
			newlines(`${error.name}: ${error.message}`)

		constructor(
			private readonly logger: IErrorLogger,
			shutDown?: (err: Error) => void
		) {
			super(
				FileErrorPrinter.formatter,
				(errStr: string) => this.logger.log(errStr),
				shutDown
			)
		}
	}

	interface IFileErrorLoggerState {
		close(): IFileErrorLoggerState
		log(err: string): IFileErrorLoggerState
	}

	export class FileErrorLogger implements IErrorLogger {
		static readonly DefaultMaxWrites = 10000

		private readonly open: FileErrorLoggerOpen
		private state: IFileErrorLoggerState

		close(): void {
			this.state = this.state.close()
		}

		log(err: string) {
			this.state = this.state.log(err)
		}

		constructor(
			filePath: string,
			maxWrites = FileErrorLogger.DefaultMaxWrites
		) {
			const writeStream = createWriteStream(filePath, { flags: "a" })
			this.open = new FileErrorLoggerOpen(writeStream, maxWrites)
			this.state = this.open
		}
	}

	class FileErrorLoggerOpen implements IFileErrorLoggerState {
		private readonly closed: FileErrorLoggerClosed
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
			this.closed = new FileErrorLoggerClosed(writeStream)
		}
	}

	class FileErrorLoggerClosed implements IFileErrorLoggerState {
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
}
