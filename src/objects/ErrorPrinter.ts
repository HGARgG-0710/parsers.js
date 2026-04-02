import assert from "assert"
import { Config } from "../global.js"
import type {
	IErrorConvertible,
	IFormatterHandler,
	ILogger,
	ILoggerHandler,
	IShutdownHandler
} from "../interfaces.js"
import { DynamicSpaceInserter } from "../modules/Logger/DynamicSpaceInserter.js"
import { toNewline } from "../samples/space.js"
import { isError } from "../utils.js"

export class ErrorPrinter {
	private getError(errorLike: Error | IErrorConvertible) {
		return isError(errorLike) ? errorLike : errorLike.toError()
	}

	protected errHandler(errorLike: Error | IErrorConvertible) {
		const error = this.getError(errorLike)
		this.logError(error)
		this.shutDown(error)
	}

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

	protected constructor(
		private readonly errorFormatter: IFormatterHandler,
		private readonly errorLogger: ILoggerHandler,
		private readonly shutDown: IShutdownHandler = () => {}
	) {}
}

export namespace ErrorPrinter {
	const spaceInserter = new DynamicSpaceInserter(getNewline)

	function newlines(error: string, offset: number = 0) {
		return spaceInserter.insertNewlineAfter(
			error,
			Config.errorPrinter.loggedNewlinesBetween - offset
		)
	}

	export function getNewline(): string {
		return toNewline(Config.errorPrinter.lf)
	}

	export const shutDownCounter = (
		exitCount: number,
		finalAction = () => {}
	) => {
		assert(exitCount > 0)
		let timesThrown = 0
		return () => {
			if (++timesThrown == exitCount) {
				finalAction()
				process.exit(1)
			}
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
