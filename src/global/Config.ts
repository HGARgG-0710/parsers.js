import { ErrorPrinter } from "../objects.js"

class XMLConfig {
	lf = true
	attrQuoteDouble = true
	tab = "\t"
}

class RegexConfig {
	errorPrinter: ErrorPrinter = ErrorPrinter.PlainErrorPrinter.instance
}

class UnicodeConfig {
	// ! pre-doc: this is a valid BCP-47 languages tag!
	// ! BCP 47 tag lookup: https://r12a.github.io/app-subtags/#note2
	locales: string[] = ["en-US"]
}

class LibConfig {
	readonly xml = new XMLConfig()
	readonly regex = new RegexConfig()
	readonly unicode = new UnicodeConfig()
}

export const Config = new LibConfig()
