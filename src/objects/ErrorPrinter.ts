import { createWriteStream, WriteStream } from "fs"
import type { IErrorLogger } from "../interfaces.js"
import { getNewline } from "../samples/space.js"

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
		this.shutDown()
	}

	protected constructor(
		private readonly errorFormatter: (error: Error) => string,
		private readonly errorLogger: (errStr: string) => void,
		private readonly shutDown: () => void = () => {}
	) {}
}

export namespace ErrorPrinter {
	export class PlainErrorPrinter extends ErrorPrinter {
		static readonly instance = new PlainErrorPrinter()

		static readonly formatter = (error: Error) =>
			`${error.name}: ${error.message}`

		protected constructor(shutDown?: () => void) {
			super(PlainErrorPrinter.formatter, console.error, shutDown)
		}
	}

	export class FileErrorPrinter extends ErrorPrinter {
		static readonly formatter = (error: Error) =>
			`${error.name}: ${error.message}${getNewline()}`

		constructor(
			private readonly logger: IErrorLogger,
			shutDown?: () => void
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
