import { ErrorPrinter } from "../objects.js"

class XMLConfig {
	lf = true
	attrQuoteDouble = true
	tab = "\t"
}

class RegexConfig {
	errorPrinter: ErrorPrinter = ErrorPrinter.PlainErrorPrinter.instance
}

class LibConfig {
	readonly xml = new XMLConfig()
	readonly regex = new RegexConfig()
}

export const Config = new LibConfig()
