export class ErrorPrinter {
	execute<T = any>(f: () => T) {
		try {
			return f()
		} catch (err) {
			this.errHandler(err)
		}
	}

	protected errHandler(error: Error) {
		this.errorPrinter(this.errorFormatter(error))
		this.shutDown()
	}

	constructor(
		private readonly errorFormatter: (error: Error) => string,
		private readonly errorPrinter: (errStr: string) => void,
		private readonly shutDown: () => void = () => {}
	) {}
}

export class PlainErrorPrinter extends ErrorPrinter {
	static readonly formatter = (error: Error) =>
		`${error.name}: ${error.message}`

	constructor(shutDown?: () => void) {
		super(PlainErrorPrinter.formatter, console.error, shutDown)
	}
}
