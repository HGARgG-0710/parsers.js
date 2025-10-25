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

	protected constructor(
		private readonly errorFormatter: (error: Error) => string,
		private readonly errorPrinter: (errStr: string) => void,
		private readonly shutDown: () => void = () => {}
	) {}
}

export class PlainErrorPrinter extends ErrorPrinter {
	static readonly instance = new PlainErrorPrinter()

	static readonly formatter = (error: Error) =>
		`${error.name}: ${error.message}`

	protected constructor(shutDown?: () => void) {
		super(PlainErrorPrinter.formatter, console.error, shutDown)
	}
}
