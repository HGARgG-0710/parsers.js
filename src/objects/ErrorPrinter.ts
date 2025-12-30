import assert from "assert"
import { Config } from "../global.js"
import type {
	IFormatterHandler,
	ILogger,
	ILoggerHandler,
	IShutdownHandler
} from "../interfaces.js"
import { toNewline } from "../samples/space.js"

function newlines(error: string, offset: number = 0) {
	return `${error}${getNewline().repeat(
		Config.errors.loggedNewlinesBetween - offset
	)}`
}

function getNewline(): string {
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

	logError(error: Error) {
		this.errorLogger(this.errorFormatter(error))
	}

	// ! pre-doc: a convinience method for logging out all the errors; 
	logErrors(errors: Error[]) {
		for (const error of errors) this.logError(error)
	}

	protected errHandler(error: Error) {
		this.logError(error)
		this.shutDown(error)
	}

	protected constructor(
		private readonly errorFormatter: IFormatterHandler,
		private readonly errorLogger: ILoggerHandler,
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

	export class Plain extends ErrorPrinter {
		static readonly instance = new Plain()

		static readonly formatter = (error: Error) =>
			newlines(`${error.name}: ${error.message}`, 1)

		protected constructor(shutDown?: (err: Error) => void) {
			super(Plain.formatter, console.error, shutDown)
		}
	}

	export class WithLogger extends ErrorPrinter {
		static readonly formatter = (error: Error) =>
			newlines(`${error.name}: ${error.message}`)

		constructor(
			private readonly logger: ILogger,
			shutDown?: (err: Error) => void
		) {
			super(
				WithLogger.formatter,
				(errStr: string) => this.logger.log(errStr),
				shutDown
			)
		}
	}
}
